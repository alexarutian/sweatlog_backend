import { WorkoutList } from "../child/workoutlist.js";
import { CreateWorkout } from "../child/createworkout.js";

let { mapState, mapMutations } = Vuex;

let Workouts = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="workout-page">
  <div id="page-top-options">
    <div @click="toggleAddingWorkoutWindow" class="page-top-option">ADD WORKOUT</div>
    <div @click="toggleDetailView()" class="page-top-option">Toggle to [[ viewName ]]</div>
    <div class="page-top-option">Option 3</div>
  </div>
  <workoutlist :showDetail="detailToggle"></workoutlist>

  <div v-if="adding" class="full-page-box">
  <span class="close-full-page-box" @click="toggleAddingWorkoutWindow">&times;</span>  
  <createworkout v-if="adding"></createworkout>
</div>

  </div>
  `,

  components: {
    workoutlist: WorkoutList,
    createworkout: CreateWorkout,
  },
  data() {
    return {
      detailToggle: true,
    };
  },
  methods: {
    toggleDetailView() {
      this.detailToggle = !this.detailToggle;
    },
    ...mapMutations(["toggleAddingWorkoutWindow"]),
  },
  computed: {
    // names the toggle button
    viewName() {
      return this.detailToggle ? "Summary" : "Detail";
    },
    ...mapState({
      adding: (state) => state.workout.addingWorkoutWindow,
    }),
  },
  created() {
    this.$store.dispatch("fetchBlocks");
  },
};
export { Workouts };
