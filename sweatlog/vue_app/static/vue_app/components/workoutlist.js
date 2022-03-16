import { ExerciseLine } from "./exerciseline.js";

let WorkoutList = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="workouts-list">
    <div v-if="!showDetail" v-for="workout in workouts" class="workout-summarized"> 
        <p>[[ workout.name]] </p> 
    </div>
    <div v-else v-for="workout in workouts" class="workout-detailed"> 
        <p class="workout-name">[[ workout.name]]</p>
        <div v-for="block in workout.blocks" class="workout-detailed-block">
            <div class="block-title-info">    
                <p class="block-name">[[ block.block.name ]] </p>
                <p v-if="block.block.block_quantity > 1" class="block-rounds"> x [[ block.block.block_quantity ]]</p>
            </div>
            <exerciseline :exercise="exercise" v-for="exercise in block.block.exercises" class="workout-detailed-exercise"></exerciseline>
        </div>
    </div>
  </div>
  `,

  components: {
    exerciseline: ExerciseLine,
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
      return this.$store.state.workouts;
    },
  },
  created() {
    this.$store.dispatch("fetchWorkouts");
  },
};
export { WorkoutList };
