let EditExercise = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>Edit [[exercise.name]]</div>
  <input @click="selectAll($event)" v-model="exerciseName" type="text" autocomplete="off" :placeholder="exercise.name"/>
  <input @click="selectAll($event)" v-model="exerciseDescription" type="text" autocomplete="off" :placeholder="exercise.description"/>
  <div>Exercise Type:
    <p v-for="et in exerciseTypes" @click="exerciseTypeId = et.id" :class="{'selected-option': exerciseTypeId == et.id}">[[et.name]]</p>
  </div>
  <div>Equipment Type:
    <p v-for="et in equipmentTypes" @click="equipmentTypeId = et.id" :class="{'selected-option': equipmentTypeId == et.id}">[[et.name]]</p>
  </div>
  <button @click="editExercise">EDIT EXERCISE</button>
  `,

  components: {},
  data() {
    const extype = this.$store.state.selectedExercise.exercise_type;
    const exerciseTypeId = extype ? extype.id : undefined;

    const eqtype = this.$store.state.selectedExercise.equipment_type;
    const equipmentTypeId = eqtype ? eqtype.id : undefined;

    return {
      exerciseName: this.$store.state.selectedExercise.name,
      exerciseDescription: this.$store.state.selectedExercise.description,
      equipmentTypeId,
      exerciseTypeId,
    };
  },
  props: {
    exercise: Object,
  },
  methods: {
    editExercise() {
      const id = this.exercise.id;

      const body = {
        name: this.exerciseName,
        description: this.exerciseDescription,
        equipment_type_id: this.equipmentTypeId,
        exercise_type_id: this.exerciseTypeId,
      };

      this.$store.dispatch("editExercise", { id, body });
    },
    selectAll(e) {
      e.srcElement.select();
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
export { EditExercise };
