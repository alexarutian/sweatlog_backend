import { ExerciseLine } from "./exerciseline.js";

let WorkoutList = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="workouts-list">
    <div v-if="!showDetail" v-for="workout in workouts" class="workout-summarized"> 
        <p>[[ workout.name]] </p> 
    </div>
    <div v-else v-for="workout in workoutsDetail" class="workout-detailed"> 
        <p class="workout-name">[[ workout.name]]</p>
        <div v-for="block in workout.blocks" class="workout-detailed-block">
            <div class="block-title-info">    
                <p class="block-name">[[ block.block.name ]] </p>
                <p class="block-rounds">[[ block.block.block_quantity ]] rounds</p>
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
    return {
      workouts: null,
      workoutsDetail: null,
    };
  },
  props: {
    showDetail: Boolean,
  },
  methods: {
    async getAllWorkoutsSummary() {
      const response = await getJSONFetch(
        "/webapp/get_all_workouts/summary/",
        {}
      );
      this.workouts = response.all_workouts_summary;
    },
    async getAllWorkoutsDetail() {
      const response = await getJSONFetch(
        "/webapp/get_all_workouts/detail/",
        {}
      );
      this.workoutsDetail = response.all_workouts_detail;
      console.log(response.all_workouts_detail);
    },
    toggleDetailView() {
      this.detailToggle = !this.detailToggle;
    },
  },
  computed: {
    // names the toggle button
    viewName() {
      return this.detailToggle ? "Summary" : "Detail";
    },
  },
  created() {
    this.getAllWorkoutsSummary();
    this.getAllWorkoutsDetail();
  },
};
export { WorkoutList };
