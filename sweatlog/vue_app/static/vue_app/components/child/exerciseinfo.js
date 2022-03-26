let { mapState, mapMutations, mapActions } = Vuex;

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
    <button id="open-edit-exercise-button" @click="toggleExerciseEditDisplay">EDIT</button>
    <button id="delete-exercise-button" @click="submitDelete(exercise.id)">DELETE</button>
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
    submitDelete(id) {
      this.deleteExercise({ id });
    },
    ...mapMutations(["toggleExerciseEditDisplay"]),
    ...mapActions(["deleteExercise"]),
  },
  computed: {},
  created() {},
};
export { ExerciseInfo };
