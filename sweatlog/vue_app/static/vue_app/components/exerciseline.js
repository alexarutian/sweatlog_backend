let ExerciseLine = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
    <table class="exercise-line">
      <tr>  
        <td  class="exercise-name"><p>[[exercise.exercise.name]] </p></td>
        <td v-if="exercise.stats.reps" class="exercise-sets-reps"><p >[[exercise.stats.sets]] x [[exercise.stats.reps]] </p></td>
        <td v-if="exercise.stats.weight_lb" class="exercise-weight"><p>[[exercise.stats.weight_lb]] lb</p></td>
        <td v-if="exercise.stats.time_in_seconds" class="exercise-time"><p>[[timeAsString]]</p></td>
      <tr>
    </table>    
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
      return formatTime(this.exercise.stats.time_in_seconds);
    },
  },
};
export { ExerciseLine };
