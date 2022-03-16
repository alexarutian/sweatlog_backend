let ExerciseInfo = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
  <div>
  <div class="modal-title">[[exercise.name]]</div>
  <div v-if="exercise.description" class="exercise-info-line">
  <p class="info-caption">Description</p>
  <p class="info-data">[[exercise.description]]</p>
  </div>
  <div v-if="exercise.exercise_type" class="exercise-info-line">
    <p class="info-caption">Exercise Type</p>
    <p class="info-data">[[exercise.exercise_type.name]]</p>
  </div>
  <div v-if="exercise.equipment_type" class="exercise-info-line">
    <p class="info-caption">Equipment Type</p>
    <p class="info-data">[[exercise.equipment_type.name]]</p>
  </div>
  <div id="modal-bottom-buttons">
    <button id="open-edit-exercise-button" @click="this.$store.commit('toggleExerciseEditDisplay')">EDIT</button>
    <button id="delete-exercise-button" @click="deleteExercise(exercise.id)">DELETE</button>
  </div>
  </div>
  `,

  components: {},
  data() {
    return {};
  },
  props: {
    exercise: Object,
  },
  methods: {
    deleteExercise(id) {
      this.$store.dispatch("deleteExercise", { id });
    },
  },
  computed: {},
  created() {},
};
export { ExerciseInfo };
