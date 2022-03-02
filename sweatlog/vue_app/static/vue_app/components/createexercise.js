let CreateExercise = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>Create a new exercise</div>
  <input id="create-exercise-name" v-model="exerciseName" type="text" autocomplete="off" placeholder="exercise name"/>
  <input id="create-exercise-description" v-model="exerciseDescription" type="text" autocomplete="off" placeholder="exercise description"/>
  <div id="create-exercise-exercise-types">Exercise Type:
    <p v-for="et in exerciseTypes" @click="exerciseTypeId = et.id" :class="{'selected-option': et.id == exerciseTypeId }">[[et.name]]</p>
  </div>
  <div id="create-exercise-equipment-types">Exercise Type:
  <p v-for="et in equipmentTypes" @click="equipmentTypeId = et.id" :class="{'selected-option': et.id == equipmentTypeId }">[[et.name]]</p>
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
  created() {
    this.$store.dispatch("fetchExerciseTypes");
    this.$store.dispatch("fetchEquipmentTypes");
  },
};
export { CreateExercise };
