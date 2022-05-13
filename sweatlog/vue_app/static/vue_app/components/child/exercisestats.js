let { mapState, mapMutations, mapActions } = Vuex;

let ExerciseStats = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="exercise-stats">
    <div v-if="stats.sets  > 1" class="do-exercise-sets-reps">
      <i class="fa-solid fa-clipboard"></i>
      <p>[[stats.sets]]</p>
      <p v-if="stats.reps">x [[stats.reps]]</p>
      <p v-if="!stats.reps"> sets</p>
    </div>
    <div v-else class="do-exercise-sets-reps" v-if="stats.reps">
      <i class="fa-solid fa-clipboard"></i>
      <p>1 x [[stats.reps]]</p>
    </div>
    <div v-if="stats.weight_lb" class="do-exercise-weight">
      <i class="fa-solid fa-weight-hanging"></i>
      <p>[[stats.weight_lb]]lb</p>
    </div>
    <div v-if="stats.time_in_seconds" class="do-exercise-time">
      <i class="fa-solid fa-stopwatch"></i>
      <p>[[stats.time_in_seconds]] s</p>
    </div>
  </div>

  `,

  components: {},
  data() {
    return {};
  },
  props: {
    stats: Object,
  },
  methods: {},
  computed: {},
  created() {},
};
export { ExerciseStats };
