let { mapState, mapMutations, mapActions } = Vuex;

let CreateSession = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">SCHEDULE A WORKOUT</div>

  <div class="form-cluster">
    <label for="workout-select2">workout</label>
    <input type="text" list="workout_list" placeholder="search workouts" @change="selectWorkout($event)" >
    <datalist id="workout_list">
    <option v-for="workout in workouts" :data-id="workout.id" :value="workout.name"></option>
    </datalist>
  </div>

  <div class="form-cluster">
    <label for="date-select">date</label>
    <input id="date-select" type="date" @change="selectDate($event)">
  </div>
  
<button id="add-session-button" @click="submitCreate">SCHEDULE</button>
<div v-if="statusLevel == 'error'">[[message]]</div>

  `,

  components: {},
  data() {
    return {
      workoutId: null,
      date: null,
    };
  },
  methods: {
    selectWorkout(e) {
      let workoutName = e.target.value;
      let id = document.querySelector(`#workout_list option[value='${workoutName}']`).dataset.id;
      console.log(id);
      // disable schedule button if workoutID not found
      this.workoutId = id;
    },
    selectDate(e) {
      this.date = e.target.value;
    },
    submitCreate() {
      const body = {
        workout_id: this.workoutId,
        date: this.date,
        user_token: this.$store.state.userToken,
      };

      this.createNewSession({ body });
    },
    ...mapActions(["fetchWorkouts", "createNewSession"]),
  },
  computed: mapState({
    workouts: (state) => state.workout.workouts,
    statusLevel: (state) => state.statusLevel,
    message: (state) => state.statusMessage,
  }),
  created() {
    this.fetchWorkouts();
  },
};
export { CreateSession };
