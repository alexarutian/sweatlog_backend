import { ExerciseStats } from "../child/exercisestats.js";

let ExerciseLine = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
  <div class="workout-exercise-line">
      <p class="exercise-name-nostats">[[exercise.exercise.name]]</p>
      <exercisestats v-if="exercise.stats" :stats="exercise.stats"></exercisestats>
  </div>  
`,

  components: { exercisestats: ExerciseStats },
  data() {
    return {};
  },
  props: {
    exercise: Object,
  },
  methods: {
    convertSecondsToMinutes(seconds) {
      return formatTime(seconds);
    },
  },

  computed: {
    timeAsString() {
      return formatTime(this.exercise.stats.time_in_seconds);
    },
  },
};
export { ExerciseLine };
