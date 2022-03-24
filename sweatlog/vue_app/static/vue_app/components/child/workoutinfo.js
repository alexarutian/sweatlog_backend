import { ExerciseLine } from "./exerciseline.js";

let WorkoutInfo = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
    <p class="workout-name">[[ workout.name]]</p>
    <div v-for="block in workout.blocks" class="workout-detailed-block">
      <div class="block-title-info">    
        <p class="block-name">[[ block.block.name ]] </p>
        <p v-if="block.block.block_quantity > 1" class="block-rounds"> x [[ block.block.block_quantity ]]</p>
      </div>
      <exerciseline :exercise="exercise" v-for="exercise in block.block.exercises" class="workout-detailed-exercise"></exerciseline>
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
