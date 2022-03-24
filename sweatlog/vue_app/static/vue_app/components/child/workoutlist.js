import { ExerciseLine } from "./exerciseline.js";
import { WorkoutInfo } from "./workoutinfo.js";

let WorkoutList = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="workouts-list">
    <div v-if="!showDetail" v-for="workout in workouts" class="workout-summarized"> 
        <p>[[ workout.name]] </p> 
    </div>
    <workoutinfo v-else v-for="workout in workouts" :workout=workout class="workout-detailed"></workoutinfo>
  </div>
  `,

  components: {
    exerciseline: ExerciseLine,
    workoutinfo: WorkoutInfo,
  },
  data() {
    return {};
  },
  props: {
    showDetail: Boolean,
  },
  methods: {
    toggleDetailView() {
      this.detailToggle = !this.detailToggle;
    },
  },
  computed: {
    // names the toggle button
    viewName() {
      return this.detailToggle ? "Summary" : "Detail";
    },
    workouts() {
      return this.$store.state.workout.workouts;
    },
  },
  created() {
    this.$store.dispatch("fetchWorkouts");
  },
};
export { WorkoutList };
