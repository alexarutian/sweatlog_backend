let ExerciseInfo = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
  <div id="exerciseInfo">
  <div>Info about the exercise</div>
  <p>[[exercise.name]]</p>
  <p v-if="exercise.description">[[exercise.description]]</p>
  <p v-if="exercise.exercise_type">[[exercise.exercise_type.name]]</p>
  <p v-if="exercise.equipment_type">[[exercise.equipment_type.name]]</p>
  <button @click="this.$store.commit('toggleExerciseEditDisplay')">Edit</button>
  <button @click="deleteExercise(exercise.id)">Delete</button>
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
