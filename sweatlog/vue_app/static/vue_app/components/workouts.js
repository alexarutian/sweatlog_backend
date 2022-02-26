import { WorkoutList } from "./workoutlist.js";

let Workouts = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>WORKOUTS PAGE</div>
  <div id="detail-toggle" @click="toggleDetailView()">[[ viewName ]]</div>
  <workoutlist :showDetail="detailToggle"></workoutlist>
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
      console.log(this.detailToggle);
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
