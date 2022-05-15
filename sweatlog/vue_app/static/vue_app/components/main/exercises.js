import { CreateExercise } from "../child/createexercise.js";
import { ExerciseInfo } from "../child/exerciseinfo.js";
import { EditExercise } from "../child/editexercise.js";
import { ExerciseSearch } from "../child/exercisesearch.js";

let { mapState, mapMutations } = Vuex;

let Exercises = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="exercises-page">

    <div id="add-button" @click="toggleAddingExerciseWindow">
      <i class="fa-solid fa-droplet"></i>
      <i class="fa-solid fa-plus"></i>
    </div>

    <div id="exercise-list">
      <div v-for="exercise in exercises" class="exercise-list-line">
        <p @click="selectExercise({exercise})" @click="toggleExerciseDetailWindow">[[exercise.name]]</p>
      </div>
    </div>
    
    <div v-if="adding" id="create-exercise-box" class="full-page-box">
      <span class="close-full-page-box" @click="toggleAddingExerciseWindow">&times;</span>  
      <createexercise v-if="adding"></createexercise>
    </div>
    
    <div v-if="editing" class="full-page-box">
      <span class="close-full-page-box" @click="toggleExerciseEditDisplay">&times;</span>  
      <editexercise :exercise="selected"></editexercise>
    </div>

    <div v-if="searching" class="modal">
    <span class="close" @click="toggleExerciseSearchWindow">&times;</span>  
    <exercisesearch v-if="searching"></exercisesearch>
    </div>
    <div v-if="searching" class="modal-overlay" @click="toggleExerciseSearchWindow"></div>

    <div v-if="detail && !editing" id="exercise-info-modal" class="modal">
      <span class="close"
      @click="toggleExerciseDetailWindow" @click="turnoffExerciseEditDisplay">&times;</span>  
      <exerciseinfo v-if="!editing" :exercise="selected"></exerciseinfo>
    </div>
    <div v-if="detail && !editing" class="modal-overlay"
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
      "toggleExerciseEditDisplay",
      "toggleAddingExerciseWindow",
      "turnoffExerciseEditDisplay",
      "toggleExerciseDetailWindow",
      "selectExercise",
    ]),
  },
  // now computed is the result of calling mapState
  computed: mapState({
    adding: (state) => state.exercise.addingExerciseWindow,
    exercises: (state) => state.exercise.items,
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
