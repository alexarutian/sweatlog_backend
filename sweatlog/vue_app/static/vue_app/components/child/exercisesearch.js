let { mapState, mapMutations, mapActions } = Vuex;

let ExerciseSearch = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">SEARCH EXERCISES</div>

  <div class="form-cluster">
    <label for="exercise-type-select">exercise type</label>
    <select id="exercise-type-select" @change="selectExerciseType($event)" @change="filterExercises">
      <option value="">all exercise types</option>
      <option v-for="et in exerciseTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>

  <div class="form-cluster">
    <label for="equipment-type-select">equipment type</label>
    <select id="equipment-type-select" @change="selectEquipmentType($event)" @change="filterExercises">
      <option value="">all equipment types</option>
      <option v-for="et in equipmentTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>

  <div class="form-cluster">
    <label></label>
    <input type="text" list="exercise_list" placeholder="search exercises" @change="selectExercise($event)" >
    <datalist v-if="!filteredList" id="exercise_list">
    <option v-for="exercise in exercises" :data-id="exercise.id" :value="exercise.name"></option>
    </datalist>
    <datalist v-if="filteredList" id="exercise_list">
    <option v-for="exercise in filteredExercises" :data-id="exercise.id" :value="exercise.name"></option>
    </datalist>
  </div>

  `,

  components: {},
  data() {
    return {
      equipmentTypeId: null,
      exerciseTypeId: null,
      exerciseName: null,
      exerciseId: null,
      filteredList: false,
    };
  },
  methods: {
    selectExercise(e) {
      let exerciseName = e.target.value;
      let id = document.querySelector(`#exercise_list option[value='${exerciseName}']`).dataset.id;
      // disable schedule button if workoutID not found
      this.exerciseId = id;
    },
    selectExerciseType(e) {
      this.exerciseTypeId = e.target.value;
    },
    selectEquipmentType(e) {
      this.equipmentTypeId = e.target.value;
    },
    filterExercises() {
      const params = {
        user_token: this.userToken,
      };
      if (this.equipmentTypeId) {
        params.equipment_type_id = this.equipmentTypeId;
      }
      if (this.exerciseTypeId) {
        params.exercise_type_id = this.exerciseTypeId;
      }
      this.filterExercises(params);
      if (this.equipmentTypeId || this.exerciseTypeId) {
        this.filteredList = true;
      }
    },
    ...mapActions(["filterExercises"]),
  },
  computed: mapState({
    exerciseTypes: (state) => state.exercisetype.exercisetypes,
    equipmentTypes: (state) => state.equipmenttype.equipmenttypes,
    exercises: (state) => state.exercise.exercises,
    filteredExercises: (state) => state.exercise.filteredExercises,
    userToken: (state) => state.userToken,
  }),
  created() {},
};
export { ExerciseSearch };
