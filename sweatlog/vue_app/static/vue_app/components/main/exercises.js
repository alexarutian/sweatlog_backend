import { CreateExercise } from "../child/createexercise.js";
import { ExerciseInfo } from "../child/exerciseinfo.js";
import { EditExercise } from "../child/editexercise.js";
import { ExerciseSearch } from "../child/exercisesearch.js";

let Exercises = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="exercises-page">
    <div id="page-top-options">
      <div @click="this.$store.commit('toggleAddingExerciseWindow')" class="page-top-option">ADD EXERCISE</div>
      <div @click="this.$store.commit('toggleExerciseSearchWindow')" class="page-top-option">SEARCH EXERCISES</div>
      <div class="page-top-option">Option 3</div>
    </div>
  
    <div id="exercise-list">
      <div v-for="exercise in exercises" class="exercise-list-line">
        <p @click="this.$store.commit('selectExercise',{exercise: exercise})" @click="this.$store.commit('toggleExerciseDetailWindow')">[[exercise.name]]</p>
      </div>
    </div>
    
    <div v-if="this.$store.state.exercise.addingExerciseWindow" id="create-exercise-modal" class="modal">
      <span class="close" @click="this.$store.commit('toggleAddingExerciseWindow')">&times;</span>  
      <createexercise v-if="this.$store.state.exercise.addingExerciseWindow"></createexercise>
    </div>
    <div v-if="this.$store.state.exercise.addingExerciseWindow" class="modal-overlay" @click="this.$store.commit('toggleAddingExerciseWindow')"></div>
    
    <div v-if="this.$store.state.exercise.exerciseSearchWindow" class="modal">
    <span class="close" @click="this.$store.commit('toggleExerciseSearchWindow')">&times;</span>  
    <exercisesearch v-if="this.$store.state.exercise.exerciseSearchWindow"></exercisesearch>
    </div>
    <div v-if="this.$store.state.exercise.exerciseSearchWindow" class="modal-overlay" @click="this.$store.commit('toggleExerciseSearchWindow')"></div>

    <div v-if="this.$store.state.exercise.exerciseDetailWindow" id="exercise-info-modal" class="modal">
      <span class="close"
      @click="this.$store.commit('toggleExerciseDetailWindow')" @click="this.$store.commit('turnoffExerciseEditDisplay')">&times;</span>  
      <exerciseinfo v-if="!this.$store.state.exercise.exerciseEditDisplay" :exercise="this.$store.state.exercise.selectedExercise"></exerciseinfo>
      <editexercise v-if="this.$store.state.exercise.exerciseEditDisplay" :exercise="this.$store.state.exercise.selectedExercise"></editexercise>
    </div>
    <div v-if="this.$store.state.exercise.exerciseDetailWindow" class="modal-overlay"
    @click="this.$store.commit('toggleExerciseDetailWindow')" @click="this.$store.commit('turnoffExerciseEditDisplay')"></div>
    </div>
  `,

  components: {
    createexercise: CreateExercise,
    exerciseinfo: ExerciseInfo,
    editexercise: EditExercise,
    exercisesearch: ExerciseSearch,
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
      return this.$store.state.exercise.exercises;
    },
  },
  created() {
    this.$store.dispatch("fetchExercises");
    // put these on the FIRST LANDING PAGE
    this.$store.dispatch("fetchExerciseTypes");
    this.$store.dispatch("fetchEquipmentTypes");
  },
};
export { Exercises };
