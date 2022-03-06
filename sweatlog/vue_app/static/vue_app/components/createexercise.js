let CreateExercise = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">NEW EXERCISE</div>
  <input v-model="exerciseName" type="text" autocomplete="off" placeholder="name*" class="form-cluster"/>
  <input v-model="exerciseDescription" type="text" autocomplete="off" placeholder="description" class="form-cluster"/>
  
  <div class="form-cluster">
    <label for="exercise-type-select">exercise type</label>
    <select id="exercise-type-select" @change="selectExerciseType($event)">
      <option>none (default)</option>
      <option v-for="et in exerciseTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>

  <div class="form-cluster">
    <label for="equipment-type-select">equipment type</label>
    <select id="equipment-type-select" @change="selectEquipmentType($event)">
      <option>none (default)</option>
      <option v-for="et in equipmentTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>
  
<button id="add-exercise-button" @click="createNewExercise">ADD EXERCISE</button>

  `,

  components: {},
  data() {
    return {
      exerciseName: "",
      exerciseDescription: "",
      equipmentTypeId: null,
      exerciseTypeId: null,
    };
  },
  methods: {
    selectExerciseType(e) {
      this.exerciseTypeId = e.target.value;
    },
    selectEquipmentType(e) {
      this.equipmentTypeId = e.target.value;
    },
    createNewExercise() {
      const body = {
        name: this.exerciseName,
        description: this.exerciseDescription,
        equipment_type_id: this.equipmentTypeId,
        exercise_type_id: this.exerciseTypeId,
      };

      this.$store.dispatch("createNewExercise", { body });
    },
  },
  computed: {
    exerciseTypes() {
      return this.$store.state.exerciseTypes;
    },
    equipmentTypes() {
      return this.$store.state.equipmentTypes;
    },
  },
  created() {},
};
export { CreateExercise };
