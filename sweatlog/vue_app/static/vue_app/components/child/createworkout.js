let { mapState, mapMutations, mapActions } = Vuex;

let CreateWorkout = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">NEW WORKOUT</div>
  <input v-model="workoutName" type="text" autocomplete="off" placeholder="name*" class="form-cluster"/>
  
  <div class="form-cluster">
  <label for="workout-select">add from another workout</label>
  <input id="workout-select" type="text" list="workout_list" placeholder="search workouts" @change="selectWorkout($event)" >
  <datalist id="workout_list">
  <option v-for="workout in workouts" :data-id="workout.id" :value="workout.name"></option>
  </datalist>
</div>

<div class="form-cluster">
<label for="workout-exercise-select">add an exercise</label>
<input id="workout-exercise-select" type="text" list="exercise_list" placeholder="search exercises" @change="selectExercise($event)" >
<datalist id="exercise_list">
<option v-for="exercise in exercises" :data-id="exercise.id" :value="exercise.name"></option>
</datalist>
</div>

<div class="drop-zone">
  <div v-if="selectedItemList" v-for="(item, index) in selectedItemList">[[item.name]]</div>
</div>
  
<button id="add-workout-button" @click="submitCreate">ADD WORKOUT</button>
<div v-if="statusLevel == 'error'">[[message]]</div>

  `,

  components: {},
  data() {
    return {
      workoutName: "",
    };
  },
  methods: {
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
      const body = {
        name: this.exerciseName,
        description: this.exerciseDescription,
        equipment_type_id: this.equipmentTypeId,
        exercise_type_id: this.exerciseTypeId,
        user_token: this.$store.state.userToken,
      };

      this.createNewWorkout({ body });
    },
    ...mapMutations(["reorderWorkoutSelectedItemList", "addToWorkoutSelectedItemList"]),
    ...mapActions(["createNewWorkout"]),
  },
  computed: mapState({
    blocks: (state) => state.block.blocks,
    exercises: (state) => state.exercise.exercises,
    selectedItemList: (state) => state.workout.workoutSelectedItemList,
    message: (state) => state.statusMessage,
    statusLevel: (state) => state.statusLevel,
  }),
  created() {},
};
export { CreateWorkout };
