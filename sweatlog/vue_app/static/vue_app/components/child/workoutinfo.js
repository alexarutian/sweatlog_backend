import { ExerciseLine } from "./exerciseline.js";

let WorkoutInfo = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="workout-detailed">  
  <p class="workout-name">[[ workout.name]]</p>
    <div v-for="block in workout.blocks" class="workout-detailed-block">
      <exerciseline :exercise="exercise" v-for="exercise in block.block.exercises"></exerciseline>
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
    workout: Object,
  },
  methods: {},
  computed: {},
};
export { WorkoutInfo };
