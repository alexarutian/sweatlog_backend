let ExerciseTypes = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
    <div>EXERCISE TYPES</div>
    <div id="exercise-type-list">
        <div v-for="et in exerciseTypes" class="exercise-type-list-line">
            <p>[[et.name]]</p>
            <div class="et-inline-modify-buttons">
                <p>Edit</p>
                <p>Delete</p>
            </div>
        </div>
    </div>
    <div>ADD EXERCISE TYPE</div>

    `,

  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    exerciseTypes() {
      return this.$store.state.exerciseTypes;
    },
  },
  created() {
    this.$store.dispatch("fetchExerciseTypes");
  },
};
export { ExerciseTypes };
