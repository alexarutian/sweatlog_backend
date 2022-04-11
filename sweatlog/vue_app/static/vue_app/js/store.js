let { createStore } = Vuex;

let KEY_INCREMENT = 0;

const exercise = {
  state() {
    return {
      exercises: null,
      exerciseMap: null,
      filteredExercises: null,
      addingExerciseWindow: false,
      exerciseSearchWindow: false,
      exerciseDetailWindow: false,
      exerciseInfoDisplay: true,
      exerciseEditDisplay: false,
      selectedExercise: "",
    };
  },
  getters: {
    getExerciseById: (state) => (id) => {
      return state.exerciseMap[id];
    },
  },
  mutations: {
    toggleAddingExerciseWindow(state) {
      state.addingExerciseWindow = !state.addingExerciseWindow;
    },
    toggleExerciseSearchWindow(state) {
      state.exerciseSearchWindow = !state.exerciseSearchWindow;
    },
    toggleExerciseDetailWindow(state) {
      state.exerciseDetailWindow = !state.exerciseDetailWindow;
    },
    toggleExerciseEditDisplay(state) {
      state.exerciseEditDisplay = !state.exerciseEditDisplay;
    },
    turnoffExerciseEditDisplay(state) {
      state.exerciseEditDisplay = false;
    },
    selectExercise(state, payload) {
      state.selectedExercise = payload.exercise;
    },
    updateExercises(state, payload) {
      state.exercises = payload.data;
      let obj = {};
      for (let e of state.exercises) {
        obj[e.id] = e;
      }
      state.exerciseMap = obj;
    },

    updateFilteredExercises(state, payload) {
      state.filteredExercises = payload.data;
      console.log(state.filteredExercises);
    },
  },
  actions: {
    async fetchExercises(context) {
      const response = await getJSONFetch("/webapp/exercises", {
        user_token: context.rootState.userToken,
      });
      let payload = { data: response.all_exercises };
      context.commit("updateExercises", payload);
    },
    async createNewExercise(context, payload) {
      context.commit("clearMessageData");
      const response = await postJSONFetch("/webapp/exercises/", payload.body, context.rootState.csrfToken);
      let message = "";
      if (response._status == 201) {
        message = "success";
      } else if (response._status == 409) {
        message = "there is already an exercise by this name";
      } else {
        message = "an error occurred - please try again";
      }
      context.commit("updateMessageData", {
        message,
        code: response._status,
      });
      if (response._status == 201) {
        context.commit("toggleAddingExerciseWindow");
        store.dispatch("fetchExercises");
      }
    },
    async deleteExercise(context, payload) {
      const response = await deleteJSONFetch(
        "/webapp/exercises/" + payload.id + "/",
        { user_token: context.rootState.userToken },
        context.state.rootState.csrfToken
      );
      context.commit("toggleExerciseDetailWindow");
      store.dispatch("fetchExercises");
    },
    async filterExercises(context, payload) {
      const response = await getJSONFetch("/webapp/exercises", payload);
      let r_payload = { data: response.all_exercises };
      context.commit("updateFilteredExercises", r_payload);
    },
    async editExercise(context, payload) {
      const response = await putJSONFetch(
        "/webapp/exercises/" + payload.id + "/",
        payload.body,
        context.rootState.csrfToken
      );
      if (response._status == 200) {
        // context.commit("toggleExerciseDetailWindow");
        context.commit("toggleExerciseEditDisplay");
        store.dispatch("fetchExercises");
      }
    },
  },
};

const exercisetype = {
  state() {
    return {
      exerciseTypes: null,
    };
  },
  getters: {},
  mutations: {
    updateExerciseTypes(state, payload) {
      state.exerciseTypes = payload.data;
    },
  },
  actions: {
    async fetchExerciseTypes(context) {
      const response = await getJSONFetch("/webapp/exercisetypes/", {
        user_token: context.rootState.userToken,
      });
      let payload = { data: response.all_exercise_types };
      context.commit("updateExerciseTypes", payload);
    },
    async createNewExerciseType(context, payload) {
      const response = await postJSONFetch("/webapp/exercisetypes/", payload.body, context.rootState.csrfToken);
      store.dispatch("fetchExerciseTypes");
    },
    async editExerciseType(context, payload) {
      const response = await putJSONFetch(
        "/webapp/exercisetypes/" + payload.id + "/",
        payload.body,
        context.rootState.csrfToken
      );
      store.dispatch("fetchExerciseTypes");
    },
    async deleteExerciseType(context, payload) {
      const response = await deleteJSONFetch(
        "/webapp/exercisetypes/" + payload.id + "/",
        { user_token: context.rootState.userToken },
        context.rootState.csrfToken
      );
      store.dispatch("fetchExerciseTypes");
    },
  },
};

const equipmenttype = {
  state() {
    return {
      equipmentTypes: null,
    };
  },
  getters: {},
  mutations: {
    updateEquipmentTypes(state, payload) {
      state.equipmentTypes = payload.data;
    },
  },
  actions: {
    async fetchEquipmentTypes(context) {
      const response = await getJSONFetch("/webapp/equipmenttypes", {
        user_token: context.rootState.userToken,
      });
      let payload = { data: response.all_equipment_types };
      context.commit("updateEquipmentTypes", payload);
    },
  },
};

const block = {
  state() {
    return {
      blocks: null,
      addingBlockWindow: false,
      blockDetailWindow: false,
      blockInfoDisplay: true,
      blockEditDisplay: false,
      blockSelectedExerciseList: [],
      selectedBlock: "",
    };
  },
  getters: {
    getBlockSelectedExerciseById: (state) => (id) => {
      return state.blockSelectedExerciseList.find((exercise) => exercise.id === id);
    },
    getBlockSelectedExerciseByIndex: (state) => (index) => {
      return state.blockSelectedExerciseList[index];
    },
  },
  mutations: {
    toggleAddingBlockWindow(state) {
      state.addingBlockWindow = !state.addingBlockWindow;
    },
    toggleBlockDetailWindow(state) {
      state.blockDetailWindow = !state.blockDetailWindow;
    },
    toggleBlockEditDisplay(state) {
      state.blockEditDisplay = !state.blockEditDisplay;
    },
    turnoffBlockEditDisplay(state) {
      state.blockEditDisplay = false;
    },
    removeFromBlockSelectedExerciseList(state, payload) {
      state.blockSelectedExerciseList = state.blockSelectedExerciseList.filter((li) => li != payload.item);
    },
    addToBlockSelectedExerciseList(state, payload) {
      state.blockSelectedExerciseList.push({
        id: payload.id,
        name: payload.name,
      });
    },
    reorderBlockSelectedExerciseList(state, payload) {
      moveInArray(state.blockSelectedExerciseList, payload.from, payload.to);
    },
    swapBlockSelectedExerciseItem(state, payload) {
      replaceInPlaceInArray(state.blockSelectedExerciseList, payload.index, payload.replacementItem);
    },
    clearBlockSelectedExerciseList(state) {
      state.blockSelectedExerciseList = [];
    },
    selectBlock(state, payload) {
      state.selectedBlock = payload.block;
    },
    updateBlocks(state, payload) {
      state.blocks = payload.data;
    },
  },
  actions: {
    async createNewBlock(context, payload) {
      const response = await postJSONFetch("/webapp/blocks/", payload.body, context.rootState.csrfToken);
      if (response._status == 201) {
        store.dispatch("fetchBlocks");
        context.commit("clearBlockSelectedExerciseList");
        context.commit("toggleAddingBlockWindow");
      }
    },
    async fetchBlocks(context) {
      const response = await getJSONFetch("/webapp/blocks", {
        user_token: context.rootState.userToken,
      });
      let payload = { data: response.all_blocks };
      context.commit("updateBlocks", payload);
    },
  },
};

const session = {
  state() {
    return {
      sessions: null,
      addingSessionWindow: false,
      selectedSessionWorkout: "",
      sessionWorkoutDetailWindow: false,
    };
  },
  getters: {},
  mutations: {
    toggleAddingSessionWindow(state) {
      state.addingSessionWindow = !state.addingSessionWindow;
    },
    selectSessionWorkout(state, payload) {
      state.selectedSessionWorkout = payload.workout;
    },
    toggleSessionWorkoutDetailWindow(state) {
      state.sessionWorkoutDetailWindow = !state.sessionWorkoutDetailWindow;
    },
    updateSessions(state, payload) {
      state.sessions = payload.data;
    },
  },
  actions: {
    async fetchSessions(context) {
      context.commit("clearMessageData");
      const response = await getJSONFetch("/webapp/sessions", {
        user_token: context.rootState.userToken,
      });
      let message = "";
      if (response._status == 200) {
        message = "success";
      } else if (response._status == 404) {
        message = "no sessions found";
      } else {
        message = "an error occurred - please try again";
      }
      context.commit("updateMessageData", {
        message,
        code: response._status,
      });
      let payload = { data: response.scheduled_sessions };
      context.commit("updateSessions", payload);
    },
    async createNewSession(context, payload) {
      const response = await postJSONFetch("/webapp/sessions/", payload.body, context.rootState.csrfToken);
      if (response._status == 201) {
        store.dispatch("fetchSessions");
        context.commit("toggleAddingSessionWindow");
      }
    },
  },
};

const workout = {
  state() {
    return {
      workouts: null,
      addingWorkoutWindow: false,
      workoutSelectedItemList: [],
      workoutSelectedItemMap: null,
      doingWorkoutWindow: false,
    };
  },
  getters: {
    getWorkoutSelectedExerciseByIndexes: (state) => (blockIndex, exerciseIndex) => {
      return state.workoutSelectedItemList[blockIndex]["exercise_list"][exerciseIndex];
    },
    getWorkoutSelectedExerciseByKey: (state) => (key) => {
      for (const b of state.workoutSelectedItemList) {
        for (const e of b.exercise_list) {
          if (e.key == key) {
            return e;
          }
        }
      }
      return null;
    },
    getWorkoutSelectedExercisesBlockByKey: (state) => (key) => {
      for (const b of state.workoutSelectedItemList) {
        for (const e of b.exercise_list) {
          if (e.key == key) {
            return b;
          }
        }
      }
      return null;
    },
    getWorkoutById: (state) => (id) => {
      for (const w of state.workouts) {
        if (w.id == id) {
          return w;
        }
      }
    },
  },
  mutations: {
    updateWorkouts(state, payload) {
      state.workouts = payload.data;
    },
    toggleAddingWorkoutWindow(state) {
      state.addingWorkoutWindow = !state.addingWorkoutWindow;
    },
    toggleDoingWorkoutWindow(state) {
      state.doingWorkoutWindow = !state.doingWorkoutWindow;
    },
    removeFromWorkoutSelectedItemList(state, payload) {
      let block = store.getters.getWorkoutSelectedExercisesBlockByKey(payload.key);
      let exercise = store.getters.getWorkoutSelectedExerciseByKey(payload.key);
      block.exercise_list = block.exercise_list.filter((li) => li != exercise);
    },
    addBlockNameToWorkoutSelectedItemList(state, payload) {
      state.workoutSelectedItemList[0].name = payload.workoutName + " block";
    },
    addToWorkoutSelectedItemList(state, payload) {
      let obj = {
        id: payload.id,
        // name: payload.name,
        statExpanded: false,
        edits: {},
        key: "fake-" + KEY_INCREMENT++,
      };

      let mapObj = {};
      mapObj[obj.key] = obj;

      state.exerciseMap = obj;

      let blockList = state.workoutSelectedItemList;
      // if no objects in list yet, make this first item in first list
      if (blockList.length == 0) {
        let exercise_list = [];
        exercise_list.push(obj);
        let blockObj = { exercise_list };
        blockList.push(blockObj);
        // make this the last item in the only list
      } else if (blockList.length == 1) {
        blockList[0].exercise_list.push(obj);
        // make this the last item in the last list
      } else {
        blockList[blockList.length - 1].exercise_list.push(obj);
      }
    },
    // WORK ON THESE TWO!! NEED TO MOVE ITEMS THROUGH A NESTED ARRAY STRUCTURE
    reorderWorkoutSelectedItemList(state, payload) {
      propSwap(
        state.workoutSelectedItemList,
        payload.fromBlock,
        payload.toBlock,
        "exercise_list",
        payload.fromExercise,
        payload.toExercise
      );
    },
    swapWorkoutSelectedItem(state, payload) {
      propInsert(
        state.workoutSelectedItemList,
        payload.blockIndex,
        "exercise_list",
        payload.exerciseIndex,
        payload.replacementItem,
        true
      );
    },
    toggleStatExpanded(state, payload) {
      let exercise = store.getters.getWorkoutSelectedExerciseByKey(payload.key);
      exercise.statExpanded = !exercise.statExpanded;
    },
    setStageData(state, payload) {
      let exercise = store.getters.getWorkoutSelectedExerciseByKey(payload.key);
      console.log(payload);
      for (const k of ["reps", "sets", "weight_lb", "time_in_seconds"]) {
        if (payload.hasOwnProperty(k)) {
          exercise.edits[k] = payload[k];
          console.log(exercise.edits);
        }
      }
    },

    commitStatEditsToMain(state, payload) {
      let exercise = store.getters.getWorkoutSelectedExerciseByKey(payload.key);
      let edits = exercise.edits;
      console.log(edits);
      for (const [key, value] of Object.entries(edits)) {
        exercise[key] = value;
      }
      // clear out edits object
      // exercise.edits = {};
    },
    // setting edits back to original state
    cancelStatEdits(state, payload) {
      let exercise = store.getters.getWorkoutSelectedExerciseByKey(payload.key);
      for (const k of ["reps", "sets", "weight_lb", "time_in_seconds"]) {
        if (exercise.hasOwnProperty(k)) {
          exercise.edits[k] = exercise[k];
        } else {
          delete exercise.edits[k];
        }
      }
    },
    clearWorkoutSelectedItemList(state) {
      state.workoutSelectedItemList = [];
    },
  },
  actions: {
    async fetchWorkouts(context) {
      const response = await getJSONFetch("/webapp/workouts", {
        user_token: context.rootState.userToken,
      });
      let payload = { data: response.all_workouts };
      context.commit("updateWorkouts", payload);
    },
    async createNewWorkout(context, payload) {
      const response = await postJSONFetch("/webapp/workouts/", payload.body, context.rootState.csrfToken);

      if (response._status == 201) {
        store.dispatch("fetchWorkouts");
        context.commit("clearWorkoutSelectedItemList");
        context.commit("toggleAddingWorkoutWindow");
      }
    },
  },
};

let store = createStore({
  modules: {
    exercise: exercise,
    exercisetype: exercisetype,
    equipmenttype: equipmenttype,
    block: block,
    session: session,
    workout: workout,
  },
  state() {
    return {
      currentPage: "exercises",
      priorPage: "",
      csrfToken: "",
      userToken: "",
      userEmail: "",
      showLoginScreen: false,
      statusMessage: "",
      statusLevel: "", // eg. success, info, error
    };
  },
  getters: {},
  mutations: {
    navigate(state, payload) {
      state.currentPage = payload.page;
    },
    toggleLoginScreen(state) {
      state.showLoginScreen = !state.showLoginScreen;
    },
    updateTokens(state, payload) {
      state.csrfToken = payload.csrfToken;
      state.userToken = payload.userToken;
    },
    updateUserData(state, payload) {
      state.userEmail = payload.email;
      state.userToken = payload.token;
    },
    updateMessageData(state, payload) {
      state.statusMessage = payload.message;
      let level = "";
      if (payload.code < 300) {
        level = "success";
      } else if (payload.code >= 400) {
        level = "error";
      } else {
        level = "info";
      }
      state.statusLevel = level;
    },
    clearMessageData(state) {
      state.statusMessage = "";
      state.statusLevel = "";
    },
  },
  // actions gets context that includes state and a commit object
  // could also pass a payload
  actions: {
    // create diff responses to handle success or failure!
    async createNewUser(context, payload) {
      context.commit("clearMessageData");
      const response = await postJSONFetch("/webapp/users/", payload.body, context.state.csrfToken);
      let message = "";
      if (response._status == 200) {
        message = "account creation success";
      } else if (response._status == 404 || response.status == 403) {
        message = "account creation unsuccessful";
      } else if (response._status == 409) {
        message = "an account with this email address already exists - please login";
      } else {
        message = "an error occurred - please try again";
      }
      context.commit("updateMessageData", {
        message,
        code: response._status,
      });

      if (response._status == 200) {
        context.commit("updateUserData", {
          email: response.email,
          token: response.token,
        });
      }
    },
    async loginUser(context, payload) {
      context.commit("clearMessageData");
      const response = await postJSONFetch("/webapp/users/login/", payload.body, context.state.csrfToken);

      // handling message right next to where we handle the data - immediately
      // INTERNAL ERROR - 500 - server could stick message in response - hybrid approach
      let message = "";
      if (response._status == 200) {
        message = "login success";
      } else if (response._status == 403) {
        message = "invalid password - please try again";
      } else if (response._status == 404) {
        message = "account with this email address does not exist - please create a new account";
      } else {
        message = "an error occurred - please try again";
      }
      context.commit("updateMessageData", {
        message,
        code: response._status,
      });

      if (response._status == 200) {
        context.commit("updateUserData", {
          email: response.email,
          token: response.token,
        });
      }
    },
    async logoutUser(context) {
      const response = await postJSONFetch("/webapp/users/logout/", {}, context.state.csrfToken);
      context.commit("updateUserData", {
        email: "",
        token: "",
      });
    },

    async getUserEmail(context, payload) {
      const response = await postJSONFetch("/webapp/users/get_user_email/", payload.body, context.state.csrfToken);
      context.commit("updateUserData", {
        email: response.email,
        token: context.state.userToken,
      });
    },
  },
});

export { store };
