let EditExercise = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>Edit [[exercise.name]]</div>
  <input @click="selectAll($event)" v-model="exerciseName" type="text" autocomplete="off" :placeholder="exercise.name"/>
  <input @click="selectAll($event)" v-model="exerciseDescription" type="text" autocomplete="off" :placeholder="exercise.description"/>
  
  <label for="exercise-type-select">Exercise Type:</label>
  <select id="exercise-type-select" @change="selectExerciseType($event)" v-model="exerciseTypeId">
    <option>--- None ---</option>
    <option v-for="et in exerciseTypes" :value="et.id">[[et.name]]</option>
  </select>

  <label for="equipment-type-select">Equipment Type:</label>
  <select id="equipment-type-select" @change="selectEquipmentType($event)" v-model="equipmentTypeId">
    <option>--- None ---</option>
    <option v-for="et in equipmentTypes" :value="et.id">[[et.name]]</option>
  </select>
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
    selectExerciseType(e) {
      this.exerciseTypeId = e.target.value;
    },
    selectEquipmentType(e) {
      this.equipmentTypeId = e.target.value;
    },

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
  created() {},
};
export { EditExercise };
