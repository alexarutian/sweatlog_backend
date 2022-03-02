import { CreateExercise } from "./createexercise.js";

let Exercises = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="exercise-page">
    <div @click="this.$store.commit('toggleAddingExerciseWindow')" class="add-exercise-window-button">ADD EXERCISE</div>
    <div id="create-exercise-modal" :class="{'invisible': !this.$store.state.addingExerciseWindow}">
      <span id="create-exercise-modal-close" class="close"
            @click="this.$store.commit('toggleAddingExerciseWindow')">&times;</span>  
      <createexercise v-if="this.$store.state.addingExerciseWindow"></createexercise>
    </div>
    <div id="create-exercise-modal-overlay" 
        :class="{'invisible': !this.$store.state.addingExerciseWindow}"
        @click="this.$store.commit('toggleAddingExerciseWindow')"></div>
    <div id="exercise-list">
      <div v-for="exercise in exercises" class="exercise-list-line">
        <p>[[exercise.name]]</p>
      </div>
    </div>
  </div>
  `,

  components: {
    createexercise: CreateExercise,
  },
  data() {
    return {
      addingExercise: false,
    };
  },
  methods: {},
  computed: {
    exercises() {
      return this.$store.state.exercises;
    },
  },
  created() {
    this.$store.dispatch("fetchExercises");
  },
};
export { Exercises };
