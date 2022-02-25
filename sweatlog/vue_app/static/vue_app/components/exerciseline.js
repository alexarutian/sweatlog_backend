let ExerciseLine = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
    <div class="exercise-line">
        <p class="exercise-name">[[exercise.exercise.name]] </p>
        <p v-if="exercise.suggested_reps" class="exercise-sets-reps">[[exercise.suggested_sets]] x [[exercise.suggested_reps]] </p>
        <p v-if="exercise.suggested_weight_lb" class="exercise-weight">[[exercise.suggested_weight_lb]] lb</p>
        <p v-if="exercise.suggested_time_in_seconds" class="exercise-time">[[timeAsString]]</p>
    </div>    
  `,

  components: {},
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
  // available directly as if it were in data
  // purpose is GIVEN data and props, we know exactly what the value will be
  // calculate it when it's asked for
  computed: {
    timeAsString() {
      return formatTime(this.exercise.suggested_time_in_seconds);
    },
  },
};
export { ExerciseLine };
