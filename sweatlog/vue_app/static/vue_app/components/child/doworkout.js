let { mapState, mapMutations, mapActions } = Vuex;

let DoWorkout = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">[[selectedWorkout.name]]</div>
  <div v-for="block in selectedWorkout.blocks">
    <p>[[block.block.name]]</p>
    <div v-for="exercise in block.block.exercises" class="do-exercise-line">
      <div><i class="fa-regular fa-square"></i></div>
      <div class="do-exercise-words">
        <p>[[exercise.exercise.name]]</p>
        <div v-if="exercise.stats" class="do-exercise-stats">
          <div v-if="exercise.stats.sets  > 1" class="do-exercise-sets-reps">
            <i class="fa-solid fa-clipboard"></i>
            <p>[[exercise.stats.sets]]</p>
            <p v-if="exercise.stats.reps">x[[exercise.stats.reps]]</p>
          </div>
          <div v-else class="do-exercise-sets-reps" v-if="exercise.stats.reps">
            <i class="fa-solid fa-clipboard"></i>
            <p>1 x [[exercise.stats.reps]]</p>
          </div>
          <div v-if="exercise.stats.weight_lb" class="do-exercise-weight">
            <i class="fa-solid fa-weight-hanging"></i>
            <p>[[exercise.stats.weight_lb]]lb</p>
          </div>
          <div v-if="exercise.stats.time_in_seconds" @click="startTimer($event, 10)" class="do-exercise-time">
            <i class="fa-solid fa-stopwatch"></i>
            <p>[[exercise.stats.time_in_seconds]] seconds</p>
            <div id="exercise-timer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  `,

  components: {},
  data() {
    return {
      // set a timer!
      timerGuard: false,
    };
  },
  props: {},
  methods: {
    startTimer(e, seconds) {
      const startClock = Date.now();

      let exerciseTimer = setInterval(function () {
        const elapsed = Date.now() - startClock;
        const elapsedSeconds = parseInt(elapsed / 1000);
        if (elapsedSeconds >= seconds) {
          clearInterval(exerciseTimer);
        }
        console.log(seconds - elapsedSeconds);
        // document.getElementById("exercise-timer").value = startTime - timeLeft;
      }, 100);
    },
  },
  computed: {
    workout() {
      // how you get the workout
    },
    ...mapState({
      selectedWorkout: (state) => state.session.selectedSessionWorkout,
    }),
  },
  created() {},
};
export { DoWorkout };
