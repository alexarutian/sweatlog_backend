let CreateSession = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">SCHEDULE A WORKOUT</div>
  <div class="form-cluster">
    <label for="workout-template-select">workout</label>
    <select id="workout-template-select" @change="selectWorkoutTemplate($event)">
      <option>none (default)</option>
      <option v-for="wt in workoutTemplates" :value="wt.id">[[et.name]]</option>
    </select>
  </div>

  <div class="form-cluster">
    <label for="equipment-type-select">equipment type</label>
    <select id="equipment-type-select" @change="selectEquipmentType($event)">
      <option>none (default)</option>
      <option v-for="et in equipmentTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>
  
<button id="add-session-button" @click="createNewSession">SCHEDULE</button>
<div v-if="this.$store.state.statusLevel == 'error'">[[message]]</div>

  `,

  components: {},
  data() {
    return {
      workoutId: null,
      date: null,
    };
  },
  methods: {
    selectWorkoutTemplate(e) {
      this.exerciseTypeId = e.target.value;
    },
    createNewExercise() {
      const body = {
        name: this.exerciseName,
        description: this.exerciseDescription,
        equipment_type_id: this.equipmentTypeId,
        exercise_type_id: this.exerciseTypeId,
        user_token: this.$store.state.userToken,
      };

      this.$store.dispatch("createNewExercise", { body });
    },
  },
  computed: {
    workoutTemplates() {
      return this.$store.state.workoutTemplates;
    },
  },
  created() {},
};
export { CreateSession };
