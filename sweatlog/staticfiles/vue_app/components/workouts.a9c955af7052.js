import { WorkoutList } from "./workoutlist.js";

let Workouts = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="workout-page">
  <div id="page-top-options">
    <div @click="toggleDetailView()" class="page-top-option">Toggle to [[ viewName ]]</div>
    <div class="page-top-option">Option 2</div>
    <div class="page-top-option">Option 3</div>
  </div>
  <workoutlist :showDetail="detailToggle"></workoutlist>
  </div>
  `,

  components: {
    workoutlist: WorkoutList,
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
  },
  computed: {
    // names the toggle button
    viewName() {
      return this.detailToggle ? "Summary" : "Detail";
    },
  },
  created() {},
};
export { Workouts };
