let { mapState, mapMutations, mapActions } = Vuex;

let DoWorkout = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">[[selectedWorkout.name]]</div>
  <div v-for="block in selectedWorkout.blocks">
    <p>[[block.block.name]]</p>
    <div v-for="exercise in block.block.exercises" class="do-exercise-line">
      <div class="do-exercise-line-left">
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
          <div v-if="exercise.stats.time_in_seconds" class="do-exercise-time">
            <i class="fa-solid fa-stopwatch"></i>
            <p>[[exercise.stats.time_in_seconds]] seconds</p>
          </div>
        </div>
      </div>
    </div>
    <div class="do-exercise-timer" v-if="exercise.stats.time_in_seconds">
      <div class="exercise-timer" @click="clickTime($event, timerLeft || exercise.stats.time_in_seconds)">[[timerLeft || exercise.stats.time_in_seconds]]</div>
      <div @click="stopTimer($event, true)"><i class="fa-solid fa-arrow-rotate-right"></i></div>
    </div>
    </div>
  </div>

  `,

  components: {},
  data() {
    return {
      // set a timer!
      timerLeft: null,
      timerFinished: false,
    };
  },
  activeTimer: null, //nonexistent timer that isn't bound to anything
  props: {},
  methods: {
    startTimer(seconds) {
      const startClock = Date.now();

      if (this.$options.activeTimer == null) {
        this.$options.activeTimer = setInterval(() => {
          const elapsed = Date.now() - startClock;
          const elapsedSeconds = parseInt(elapsed / 1000);
          if (elapsedSeconds >= seconds) {
            this.stopTimer(true);
          }
          this.timerLeft = seconds - elapsedSeconds;
          if (this.timerLeft == 0) {
            this.stopTimer(true);
          }
        }, 100);
      }
    },
    stopTimer(e, kill) {
      clearInterval(this.$options.activeTimer);
      this.$options.activeTimer = null;
      if (kill) {
        this.timerLeft = null;
        doStuffToClass("active-timer", (i) => {
          i.classList.remove("active-timer");
        });
      }
    },
    clickTime(e, seconds) {
      let target = findDivUnderCursor(e, ".exercise-timer");
      if (this.$options.activeTimer) {
        this.stopTimer(false);
      } else {
        this.startTimer(seconds);
        target.classList.add("active-timer");
      }
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
