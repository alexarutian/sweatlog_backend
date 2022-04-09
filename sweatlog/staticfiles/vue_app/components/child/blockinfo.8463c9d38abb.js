import { ExerciseLine } from "./exerciseline.js";

let { mapState, mapMutations } = Vuex;

let BlockInfo = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
  <div>
  <div class="modal-title">[[block.name]]</div>
  </div>
  <exerciseline :exercise="exercise" v-for="exercise in block.exercises" class="block-detailed-exercise"></exerciseline>
  
  <div id="modal-bottom-buttons">
    <button id="open-edit-exercise-button" @click="toggleExerciseEditDisplay">EDIT</button>
    <button id="delete-exercise-button" @click="deleteExercise(exercise.id)">DELETE</button>
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
    block: Object,
  },
  methods: {
    ...mapMutations(["toggleExerciseEditDisplay"]),
  },
  computed: {},
  created() {},
};
export { BlockInfo };
