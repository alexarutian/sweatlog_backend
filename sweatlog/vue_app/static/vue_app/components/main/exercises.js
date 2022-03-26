import { CreateExercise } from "../child/createexercise.js";
import { ExerciseInfo } from "../child/exerciseinfo.js";
import { EditExercise } from "../child/editexercise.js";
import { ExerciseSearch } from "../child/exercisesearch.js";

let { mapState, mapMutations } = Vuex;

let Exercises = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="exercises-page">
    <div id="page-top-options">
      <div @click="toggleAddingExerciseWindow" class="page-top-option">ADD EXERCISE</div>
      <div @click="toggleExerciseSearchWindow" class="page-top-option">SEARCH EXERCISES</div>
      <div class="page-top-option">Option 3</div>
    </div>
  
    <div id="exercise-list">
      <div v-for="exercise in exercises" class="exercise-list-line">
        <p @click="selectExercise({exercise})" @click="toggleExerciseDetailWindow" @click="console(exercise)">[[exercise.name]]</p>
      </div>
    </div>
    
    <div v-if="adding" id="create-exercise-modal" class="modal">
      <span class="close" @click="toggleAddingExerciseWindow">&times;</span>  
      <createexercise v-if="adding"></createexercise>
    </div>
    <div v-if="adding" class="modal-overlay" @click="toggleAddingExerciseWindow"></div>
    
    <div v-if="searching" class="modal">
    <span class="close" @click="toggleExerciseSearchWindow">&times;</span>  
    <exercisesearch v-if="searching"></exercisesearch>
    </div>
    <div v-if="searching" class="modal-overlay" @click="toggleExerciseSearchWindow"></div>

    <div v-if="detail" id="exercise-info-modal" class="modal">
      <span class="close"
      @click="toggleExerciseDetailWindow" @click="turnoffExerciseEditDisplay">&times;</span>  
      <exerciseinfo v-if="!editing" :exercise="selected"></exerciseinfo>
      <editexercise v-if="editing" :exercise="selected"></editexercise>
    </div>
    <div v-if="detail" class="modal-overlay"
    @click="toggleExerciseDetailWindow" @click="turnoffExerciseEditDisplay"></div>
    </div>
  `,

  components: {
    createexercise: CreateExercise,
    exerciseinfo: ExerciseInfo,
    editexercise: EditExercise,
    exercisesearch: ExerciseSearch,
  },
  data() {
    return {};
  },
  methods: {
    console(x) {
      console.log(x);
    },
    ...mapMutations([
      "toggleExerciseSearchWindow",
      "toggleAddingExerciseWindow",
      "turnoffExerciseEditDisplay",
      "toggleExerciseDetailWindow",
      "selectExercise",
    ]),
  },
  // now computed is the result of calling mapState
  computed: mapState({
    adding: (state) => state.exercise.addingExerciseWindow,
    exercises: (state) => state.exercise.exercises,
    searching: (state) => state.exercise.exerciseSearchWindow,
    detail: (state) => state.exercise.exerciseDetailWindow,
    editing: (state) => state.exercise.exerciseEditDisplay,
    selected: (state) => state.exercise.selectedExercise,
  }),
  created() {
    this.$store.dispatch("fetchExercises");
    // put these on the FIRST LANDING PAGE
    this.$store.dispatch("fetchExerciseTypes");
    this.$store.dispatch("fetchEquipmentTypes");
  },
};
export { Exercises };
