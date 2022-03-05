import { CreateExercise } from "./createexercise.js";
import { ExerciseInfo } from "./exerciseinfo.js";
import { EditExercise } from "./editexercise.js";

let Exercises = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="exercise-page">
    <div id="exercises-top-options">
      <div @click="this.$store.commit('toggleAddingExerciseWindow')" class="exercises-top-option">ADD EXERCISE</div>
      <div class="exercises-top-option">Search</div>
      <div class="exercises-top-option">Option 3</div>
    </div>
    <div v-if="this.$store.state.addingExerciseWindow" id="create-exercise-modal" class="modal">
      <span class="close" @click="this.$store.commit('toggleAddingExerciseWindow')">&times;</span>  
      <createexercise v-if="this.$store.state.addingExerciseWindow"></createexercise>
    </div>
    <div v-if="this.$store.state.addingExerciseWindow" class="modal-overlay" @click="this.$store.commit('toggleAddingExerciseWindow')"></div>
    <div id="exercise-list">
      <div v-for="exercise in exercises" class="exercise-list-line">
        <p @click="this.$store.commit('selectExercise',{exercise: exercise})" @click="this.$store.commit('toggleExerciseDetailWindow')">[[exercise.name]]</p>
      </div>
    </div>
    <div v-if="this.$store.state.exerciseDetailWindow" id="exercise-info-modal" class="modal">
      <span class="close"
      @click="this.$store.commit('toggleExerciseDetailWindow')" @click="this.$store.commit('turnoffExerciseEditDisplay')">&times;</span>  
      <exerciseinfo v-if="!this.$store.state.exerciseEditDisplay" :exercise="this.$store.state.selectedExercise"></exerciseinfo>
      <editexercise v-if="this.$store.state.exerciseEditDisplay" :exercise="this.$store.state.selectedExercise"></editexercise>
    </div>
    <div v-if="this.$store.state.exerciseDetailWindow" class="modal-overlay"
    @click="this.$store.commit('toggleExerciseDetailWindow')" @click="this.$store.commit('turnoffExerciseEditDisplay')"></div>
  </div>
  `,

  components: {
    createexercise: CreateExercise,
    exerciseinfo: ExerciseInfo,
    editexercise: EditExercise,
  },
  data() {
    return {
      addingExercise: false,
      selectedExercise: "",
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
