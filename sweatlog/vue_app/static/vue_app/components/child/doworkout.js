import { ExerciseStats } from "../child/exercisestats.js";
import { ExerciseTimer } from "../child/exercisetimer.js";

let { mapState, mapMutations, mapActions } = Vuex;

let DoWorkout = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">[[selectedWorkout.name]]</div>
  <div v-for="block in selectedWorkout.blocks">
    <p>[[block.block.name]]</p>
    <div v-for="exercise in block.block.exercises" class="do-exercise-line">
      <div class="do-exercise-line-left">
      <div><i class="fa-regular fa-square"></i></div>
      <div class="do-exercise-words">
        <p>[[exercise.exercise.name]]</p>
        <exercisestats v-if="exercise.stats" :stats="exercise.stats"></exercisestats>
      </div>
    </div>
    <exercisetimer v-if="exercise.stats.time_in_seconds" :timeInSeconds="exercise.stats.time_in_seconds">
    </exercisetimer>
    </div>
  </div>

  `,

  components: { exercisestats: ExerciseStats, exercisetimer: ExerciseTimer },
  data() {
    return {};
  },
  props: {},
  methods: {},
  computed: {
    workout() {
      // how you get the workout
    },
    ...mapState({
      selectedWorkout: (state) => state.session.selectedSessionWorkout,
    }),
  },
  created() {},
};
export { DoWorkout };
