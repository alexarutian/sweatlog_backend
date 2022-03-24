let { createStore } = Vuex;

const exercise = {
  state() {
    return {
      exercises: null,
      filteredExercises: null,
      addingExerciseWindow: false,
      exerciseSearchWindow: false,
      exerciseDetailWindow: false,
      exerciseInfoDisplay: true,
      exerciseEditDisplay: false,
      selectedExercise: "",
    };
  },
  getters: {},
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
      const response = await postJSONFetch(
        "/webapp/exercises/",
        payload.body,
        context.rootState.csrfToken
      );
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
      context.commit("toggleExerciseDetailWindow");
      context.commit("toggleExerciseEditDisplay");
      store.dispatch("fetchExercises");
    },
  },
};

let store = createStore({
  modules: {
    exercise: exercise,
  },
  state() {
    return {
      currentPage: "exercises",
      priorPage: "",
      sessions: null,
      workouts: null,
      blocks: null,
      exerciseTypes: null,
      equipmentTypes: null,
      csrfToken: "",
      addingSessionWindow: false,
      selectedSessionWorkout: "",
      sessionWorkoutDetailWindow: false,
      addingBlockWindow: false,
      blockDetailWindow: false,
      blockInfoDisplay: true,
      blockEditDisplay: false,
      blockSelectedExerciseList: [],
      selectedBlock: "",
      userToken: "",
      userEmail: "",
      showLoginScreen: false,
      statusMessage: "",
      statusLevel: "", // eg. success, info, error
    };
  },
  getters: {
    getBlockSelectedExerciseById: (state) => (id) => {
      return state.blockSelectedExerciseList.find(
        (exercise) => exercise.id === id
      );
    },
    getBlockSelectedExerciseByIndex: (state) => (index) => {
      return state.blockSelectedExerciseList[index];
    },
  },
  mutations: {
    navigate(state, payload) {
      state.currentPage = payload.page;
    },
    toggleLoginScreen(state) {
      state.showLoginScreen = !state.showLoginScreen;
    },
    toggleAddingSessionWindow(state) {
      state.addingSessionWindow = !state.addingSessionWindow;
    },
    selectSessionWorkout(state, payload) {
      state.selectedSessionWorkout = payload.workout;
    },
    toggleSessionWorkoutDetailWindow(state) {
      state.sessionWorkoutDetailWindow = !state.sessionWorkoutDetailWindow;
    },
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
      state.blockSelectedExerciseList = state.blockSelectedExerciseList.filter(
        (li) => li != payload.item
      );
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
      replaceInPlaceInArray(
        state.blockSelectedExerciseList,
        payload.index,
        payload.replacementItem
      );
    },
    selectBlock(state, payload) {
      state.selectedBlock = payload.block;
    },
    updateSessions(state, payload) {
      state.sessions = payload.data;
    },
    updateWorkouts(state, payload) {
      state.workouts = payload.data;
    },
    updateBlocks(state, payload) {
      state.blocks = payload.data;
    },
    updateExercises(state, payload) {
      state.exercises = payload.data;
    },
    updateFilteredExercises(state, payload) {
      state.filteredExercises = payload.data;
      console.log(state.filteredExercises);
    },
    updateExerciseTypes(state, payload) {
      state.exerciseTypes = payload.data;
    },
    updateEquipmentTypes(state, payload) {
      state.equipmentTypes = payload.data;
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
    async fetchSessions(context) {
      context.commit("clearMessageData");
      const response = await getJSONFetch("/webapp/sessions", {
        user_token: context.state.userToken,
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
      const response = await postJSONFetch(
        "/webapp/sessions/",
        payload.body,
        context.state.csrfToken
      );
      store.dispatch("fetchSessions");
    },
    async createNewBlock(context, payload) {
      const response = await postJSONFetch(
        "/webapp/blocks/",
        payload.body,
        context.state.csrfToken
      );
      store.dispatch("fetchBlocks");
    },
    async fetchWorkouts(context) {
      const response = await getJSONFetch("/webapp/workouts", {
        user_token: context.state.userToken,
      });
      let payload = { data: response.all_workouts };
      context.commit("updateWorkouts", payload);
    },
    async fetchBlocks(context) {
      const response = await getJSONFetch("/webapp/blocks", {
        user_token: context.state.userToken,
      });
      let payload = { data: response.all_blocks };
      context.commit("updateBlocks", payload);
    },
    async fetchExerciseTypes(context) {
      const response = await getJSONFetch("/webapp/exercisetypes/", {
        user_token: context.state.userToken,
      });
      let payload = { data: response.all_exercise_types };
      context.commit("updateExerciseTypes", payload);
    },
    async createNewExerciseType(context, payload) {
      const response = await postJSONFetch(
        "/webapp/exercisetypes/",
        payload.body,
        context.state.csrfToken
      );
      store.dispatch("fetchExerciseTypes");
    },
    async editExerciseType(context, payload) {
      const response = await putJSONFetch(
        "/webapp/exercisetypes/" + payload.id + "/",
        payload.body,
        context.state.csrfToken
      );
      store.dispatch("fetchExerciseTypes");
    },
    async deleteExerciseType(context, payload) {
      const response = await deleteJSONFetch(
        "/webapp/exercisetypes/" + payload.id + "/",
        { user_token: context.state.userToken },
        context.state.csrfToken
      );
      store.dispatch("fetchExerciseTypes");
    },
    async fetchEquipmentTypes(context) {
      const response = await getJSONFetch("/webapp/equipmenttypes", {
        user_token: context.state.userToken,
      });
      let payload = { data: response.all_equipment_types };
      context.commit("updateEquipmentTypes", payload);
    },
    // create diff responses to handle success or failure!
    async createNewUser(context, payload) {
      context.commit("clearMessageData");
      const response = await postJSONFetch(
        "/webapp/users/",
        payload.body,
        context.state.csrfToken
      );
      let message = "";
      if (response._status == 200) {
        message = "account creation success";
      } else if (response._status == 404 || response.status == 403) {
        message = "account creation unsuccessful";
      } else if (response._status == 409) {
        message = "an account with this email address already exists";
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
      const response = await postJSONFetch(
        "/webapp/users/login/",
        payload.body,
        context.state.csrfToken
      );

      // handling message right next to where we handle the data - immediately
      // INTERNAL ERROR - 500 - server could stick message in response - hybrid approach
      let message = "";
      if (response._status == 200) {
        message = "login success";
      } else if (response._status == 404 || response.status == 403) {
        message = "login unsuccessful";
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
      const response = await postJSONFetch(
        "/webapp/users/logout/",
        {},
        context.state.csrfToken
      );
      context.commit("updateUserData", {
        email: "",
        token: "",
      });
    },

    async getUserEmail(context, payload) {
      const response = await postJSONFetch(
        "/webapp/users/get_user_email/",
        payload.body,
        context.state.csrfToken
      );
      context.commit("updateUserData", {
        email: response.email,
        token: context.state.userToken,
      });
    },
  },
});

// const exercisetype = {
//   state() {
//     return {};
//   },
//   getters: {},
//   mutations: {},
//   actions: {},
// };

export { store };
