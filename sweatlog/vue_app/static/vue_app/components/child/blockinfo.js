import { ExerciseLine } from "./exerciseline.js";

let BlockInfo = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
  <div>
  <div class="modal-title">[[block.name]]</div>
  </div>
  <exerciseline :exercise="exercise" v-for="exercise in block.exercises" class="block-detailed-exercise"></exerciseline>
  
  <div id="modal-bottom-buttons">
    <button id="open-edit-exercise-button" @click="this.$store.commit('toggleExerciseEditDisplay')">EDIT</button>
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
    // deleteExercise(id) {
    //   this.$store.dispatch("deleteExercise", { id });
    // },
  },
  computed: {},
  created() {},
};
export { BlockInfo };
