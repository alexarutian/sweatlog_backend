import { WorkoutInfo } from "../child/workoutinfo.js";
import { CreateWorkout } from "../child/createworkout.js";

let { mapState, mapMutations } = Vuex;

let Workouts = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="workout-page">
  <div id="page-top-options">
    <div @click="toggleAddingWorkoutWindow" class="page-top-option">ADD WORKOUT</div>
    <div class="page-top-option">Option 2</div>
    <div class="page-top-option">Option 3</div>
  </div>
  <workoutinfo v-for="workout in workouts" :workout=workout></workoutinfo>

  <div v-if="adding" class="full-page-box">
  <span class="close-full-page-box" @click="toggleAddingWorkoutWindow">&times;</span>  
  <createworkout v-if="adding"></createworkout>
</div>

  </div>
  `,

  components: {
    workoutinfo: WorkoutInfo,
    createworkout: CreateWorkout,
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["toggleAddingWorkoutWindow"]),
  },
  computed: {
    // names the toggle button
    ...mapState({
      adding: (state) => state.workout.addingWorkoutWindow,
      workouts: (state) => state.workout.workouts,
    }),
  },
  created() {
    this.$store.dispatch("fetchBlocks");
    this.$store.dispatch("fetchWorkouts");
  },
};
export { Workouts };
