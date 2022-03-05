let CreateExercise = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>Create a new exercise</div>
  <input id="create-exercise-name" v-model="exerciseName" type="text" autocomplete="off" placeholder="exercise name"/>
  <input id="create-exercise-description" v-model="exerciseDescription" type="text" autocomplete="off" placeholder="exercise description"/>
  
  <label for="exercise-type-select">Exercise Type:</label>
  <select id="exercise-type-select" @change="selectExerciseType($event)">
    <option>--- None (default) ---</option>
    <option v-for="et in exerciseTypes" :value="et.id">[[et.name]]</option>
  </select>

  <label for="equipment-type-select">Exercise Type:</label>
  <select id="equipment-type-select" @change="selectEquipmentType($event)">
    <option>--- None (default) ---</option>
    <option v-for="et in equipmentTypes" :value="et.id">[[et.name]]</option>
  </select>
  
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
