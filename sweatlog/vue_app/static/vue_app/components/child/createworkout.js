import { WorkoutExerciseStat } from "./workoutexercisestat.js";

let { mapState, mapMutations, mapActions } = Vuex;

let CreateWorkout = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">NEW WORKOUT</div>
  <input v-model="workoutName" type="text" autocomplete="off" placeholder="name*" class="form-cluster"/>
  
  <div class="form-cluster">
  <label for="workout-exercise-select">add an exercise</label>
  <input id="workout-exercise-select" type="text" list="exercise_list" placeholder="search exercises" @change="selectExercise($event)" >
  <datalist id="exercise_list">
  <option v-for="exercise in exercises" :data-id="exercise.id" :value="exercise.name"></option>
  </datalist>
  </div>

  <div class="form-cluster">
  <label for="workout-select">bulk add from another workout</label>
  <input id="workout-select" type="text" list="workout_list" placeholder="search workouts" @change="selectWorkout($event)" >
  <datalist id="workout_list">
  <option v-for="workout in workouts" :data-id="workout.id" :value="workout.name"></option>
  </datalist>
</div>

<div>
  <div class="selected-block" v-if="selectedItemList.length > 0" v-for="(block, blockIndex) in selectedItemList" :data-index="blockIndex">[[index]]
  <workoutexercisestat class="selected-exercise" v-for="(exercise, exerciseIndex) in block.exercise_list" :key="exercise.key"
  :exercise_key="exercise.key" :data-index="exerciseIndex" 
        draggable="true" 
        @dragstart="startMove" 
        @touchstart="startMove" 
        @dragover="moveOver" 
        @touchmove="moveOver"
        @drop="drop" 
        @touchend="drop">
  </workoutexercisestat>
</div>
  
<button id="add-workout-button" @click="submitCreate">ADD WORKOUT</button>
<div v-if="statusLevel == 'error'">[[message]]</div>

  `,

  components: {
    workoutexercisestat: WorkoutExerciseStat,
  },
  data() {
    return {
      workoutName: "",
      draggingIndex: null,
    };
  },
  methods: {
    startMove(e) {
      // don't do anything if in the gray input area, also do not prevent default
      let statRow = findDivUnderCursor(e, ".exercise-stats-row", false);
      if (statRow) {
        // allow event to bubble up and input field to work
        return true;
      }
      let target = findDivUnderCursor(e, ".selected-exercise");
      if (target) {
        const index = parseInt(target.dataset.index);
        this.draggingIndex = index;
        doStuffToClass("selected-exercise", (i) => {
          if (i.dataset.index != this.draggingIndex) {
            i.classList.add("hint");
          }
        });
      }
    },

    moveOver(e) {
      e.preventDefault();
      let target = findDivUnderCursor(e, ".selected-exercise");
      let entering = target !== null;
      doStuffToClass("selected-exercise", (i) => {
        i.classList.remove("active");
      });
      if (entering && target.dataset.index != this.draggingIndex) {
        target.classList.add("active");
      }
    },

    drop(e) {
      doStuffToClass("selected-exercise", (i) => {
        i.classList.remove("hint");
        i.classList.remove("active");
      });
      if (this.draggingIndex != null) {
        let exerciseTarget = findDivUnderCursor(e, ".selected-exercise");
        // let blockTarget = findDivUnderCursor(e, ".selected-block");
        if (exerciseTarget) {
          let toExercise = parseInt(exerciseTarget.dataset.index);
          let fromExercise = this.draggingIndex;
          this.reorderWorkoutSelectedItemList({ fromBlock: 0, fromExercise, toBlock: 0, toExercise });
          this.draggingIndex = null;
        }
      }
    },

    // rework this - are you adding the block inside the workout?
    selectWorkout(e) {
      let name = e.target.value;
      let id = document.querySelector(`#workout_list option[value='${name}']`).dataset.id;
      // this.addToWorkoutSelectedBlockList({ id, name });
      // document.getElementById("workout-select").value = "";
    },
    selectExercise(e) {
      let name = e.target.value;
      let id = document.querySelector(`#exercise_list option[value='${name}']`).dataset.id;
      this.addToWorkoutSelectedItemList({ id, name });
      document.getElementById("workout-exercise-select").value = "";
    },
    submitCreate() {
      this.addBlockNameToWorkoutSelectedItemList({ workoutName: this.workoutName });

      const body = {
        name: this.workoutName,
        user_token: this.userToken,
        item_list: this.selectedItemList,
      };

      this.createNewWorkout({ body });
    },
    ...mapMutations([
      "reorderWorkoutSelectedItemList",
      "addToWorkoutSelectedItemList",
      "addBlockNameToWorkoutSelectedItemList",
    ]),
    ...mapActions(["createNewWorkout"]),
  },
  computed: mapState({
    blocks: (state) => state.block.blocks,
    exercises: (state) => state.exercise.exercises,
    selectedItemList: (state) => state.workout.workoutSelectedItemList,
    message: (state) => state.statusMessage,
    statusLevel: (state) => state.statusLevel,
    userToken: (state) => state.userToken,
  }),
  created() {},
};
export { CreateWorkout };
