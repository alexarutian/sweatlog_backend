let { mapState, mapMutations, mapActions } = Vuex;

let EditExercise = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">EDIT [[exercise.name]]</div>
  
  <div class="form-cluster">
    <label>Name*</label>
    <input @click="selectAll" v-model="exerciseName" type="text" autocomplete="off" :placeholder="exercise.name"/>
  </div>

  <div class="form-cluster">
    <label>Description</label>
    <input @click="selectAll" v-model="exerciseDescription" type="text" autocomplete="off" :placeholder="exercise.description"/>
  </div>
    
  <div class="form-cluster">
    <label for="exercise-type-select">Exercise Type</label>
    <select id="exercise-type-select" @change="selectExerciseType" v-model="exerciseTypeId">
      <option>--- None ---</option>
      <option v-for="et in exerciseTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>

  <div class="form-cluster">
    <label for="equipment-type-select">Equipment Type</label>
    <select id="equipment-type-select" @change="selectEquipmentType" v-model="equipmentTypeId">
      <option>--- None ---</option>
      <option v-for="et in equipmentTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>

  <button id="edit-exercise-button" @click="submitEdit">EDIT EXERCISE</button>

  `,

  components: {},
  data() {
    // these somehow don't work when converted to mapState
    const extype = this.$store.state.exercise.selectedExercise.exercise_type;
    const exerciseTypeId = extype ? extype.id : undefined;

    const eqtype = this.$store.state.exercise.selectedExercise.equipment_type;
    const equipmentTypeId = eqtype ? eqtype.id : undefined;

    return {
      exerciseName: this.$store.state.exercise.selectedExercise.name,
      exerciseDescription: this.$store.state.exercise.selectedExercise.description,
      equipmentTypeId,
      exerciseTypeId,
    };
  },
  props: {
    exercise: Object,
  },
  methods: {
    selectExerciseType(e) {
      this.exerciseTypeId = e.target.value;
    },
    selectEquipmentType(e) {
      this.equipmentTypeId = e.target.value;
    },

    submitEdit() {
      const id = this.exercise.id;

      const body = {
        name: this.exerciseName,
        description: this.exerciseDescription,
        equipment_type_id: this.equipmentTypeId,
        exercise_type_id: this.exerciseTypeId,
        user_token: this.$store.state.userToken,
      };

      this.editExercise({ id, body });
    },
    selectAll(e) {
      e.srcElement.select();
    },
    ...mapActions(["editExercise"]),
  },
  computed: mapState({
    exerciseTypes: (state) => state.exercisetype.exerciseTypes,
    equipmentTypes: (state) => state.equipmenttype.equipmentTypes,
    // these don't work with the above!
    selectedExerciseExType: (state) => state.exercise.selectedExercise.exercise_type,
    selectedExerciseEqType: (state) => state.exercise.selectedExercise.equipment_type,
    selectedExerciseName: (state) => state.exercise.selectedExercise.name,
    selectedExerciseDescription: (state) => state.exercise.selectedExercise.description,
  }),
  created() {},
};
export { EditExercise };
