import { ExerciseLine } from "./exerciseline.js";
import { WorkoutInfo } from "./workoutinfo.js";

let { mapState, mapMutations, mapActions } = Vuex;

let WorkoutList = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="workout-list">
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
  methods: {},
  computed: {
    ...mapState({
      workouts: (state) => state.workout.workouts,
    }),
  },
  created() {
    this.$store.dispatch("fetchWorkouts");
  },
};
export { WorkoutList };
