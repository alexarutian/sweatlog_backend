let { mapState, mapMutations, mapActions } = Vuex;

let ExerciseTimer = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="do-exercise-timer">
    <div @click="stopTimer($event, true)"><i class="fa-solid fa-arrow-rotate-right"></i></div>
    <div class="exercise-timer" @click="clickTime($event, timerLeft || timeInSeconds)">[[timerLeft || timeInSeconds]]</div>
  </div>
  `,

  components: {},
  data() {
    return {
      timerLeft: null,
    };
  },
  activeTimer: null, //nonexistent timer that isn't bound to anything
  props: { timeInSeconds: Number },
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
  computed: {},
  created() {},
};
export { ExerciseTimer };
