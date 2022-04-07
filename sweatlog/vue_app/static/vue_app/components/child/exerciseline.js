let ExerciseLine = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
    <table v-if="exercise.stats" class="workout-exercise-line">
      <tr> 
        <tbody>
          <tr>
          <th class="exercise-name">[[exercise.exercise.name]]</th>
            <td v-if="exercise.stats.reps" class="exercise-sets-reps"><p >[[exercise.stats.sets]] x [[exercise.stats.reps]] </p></td>
            <td v-if="exercise.stats.weight_lb" class="exercise-weight"><p>[[exercise.stats.weight_lb]] lb</p></td>
            <td v-if="exercise.stats.time_in_seconds" class="exercise-time"><p>[[timeAsString]]</p></td>
          </tr>
        </tbody> 
       
      <tr>
    </table>

  <div v-else class="workout-exercise-line">
      <p class="exercise-name-nostats">[[exercise.exercise.name]]</p>
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

  computed: {
    timeAsString() {
      return formatTime(this.exercise.stats.time_in_seconds);
    },
  },
};
export { ExerciseLine };
