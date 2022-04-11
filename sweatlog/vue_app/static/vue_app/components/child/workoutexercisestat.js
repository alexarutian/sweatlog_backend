let { mapState, mapMutations, mapActions } = Vuex;

let WorkoutExerciseStat = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>
    <div class="exercise-row">
      <div class="draggable-item">[[exercise.name]]</div>
      <div :class="{'draggable-item-icon': true, 'stat-populated': statPopulated}" @click="toggleStats" @touchstart="toggleStats"><i class="fa-solid fa-pencil" ></i></div>
      <div class="draggable-item-icon" @click="deleteItem" @touchstart="deleteItem"><i class="fa-regular fa-trash-can"></i></div>
    </div>
    <div v-if="expandStat==true" class="exercise-stats-row">
    <div class="exercise-stats-input">
      <input type="text" class="input-sets" placeholder="sets" v-model="edits.sets" data-field="sets" @input="stageData">
      <input type="text" class="input-reps" placeholder="reps" v-model="edits.reps" data-field="reps" @input="stageData">
      <input type="text" class="input-weight" placeholder="weight" v-model="edits.weight_lb" data-field="weight_lb" @input="stageData">
    <select @change="stageData" data-field="time_in_seconds">
    <option value="">MM:SS</option>
    <option v-for="time in timeOptions" :value="time.value" :selected="edits.time_in_seconds==time.value">[[time.display]]</option>
  </select>
    </div>
      <div @click="saveStats" @touchstart="saveStats"><i class="fa-solid fa-check"></i> </div>
      <div @click="flushStage"><i class="fa-solid fa-x stat-delete-icon"></i></div>
    </div>
  </div>
  `,

  components: {},
  data() {
    return {
      timeOptions: CONSTANTS.timeOptions,
    };
  },
  props: {
    exercise_key: String,
  },
  methods: {
    toggleStats() {
      this.toggleStatExpanded(this.keyPayload);
    },
    stageData(e) {
      let propName = e.target.dataset.field;
      let payload = this.keyPayload;
      payload[propName] = e.target.value;
      this.setStageData(payload);
    },

    deleteItem(e) {
      this.removeFromWorkoutSelectedItemList(this.keyPayload);
    },
    flushStage(e) {
      this.cancelStatEdits(this.keyPayload);
      this.toggleStatExpanded(this.keyPayload);
    },
    saveStats(e) {
      this.commitStatEditsToMain(this.keyPayload);
      this.toggleStatExpanded(this.keyPayload);
    },
    ...mapMutations([
      "swapWorkoutSelectedItem",
      "removeFromWorkoutSelectedItemList",
      "toggleStatExpanded",
      "setStageData",
      "commitStatEditsToMain",
      "cancelStatEdits",
    ]),
  },
  computed: {
    statPopulated() {
      // convert to computed property
      let exercise = this.$store.getters.getWorkoutSelectedExerciseByKey(this.exercise_key);
      if (exercise.sets || exercise.reps || exercise.weight_lb || exercise.time_in_seconds) {
        return true;
      } else {
        return false;
      }
    },
    expandStat() {
      return this.exerciseInWorkout.statExpanded;
    },
    exerciseInWorkout() {
      return this.$store.getters.getWorkoutSelectedExerciseByKey(this.exercise_key);
    },
    exercise() {
      return this.$store.getters.getExerciseById(this.exerciseInWorkout.id);
    },
    edits() {
      return this.exerciseInWorkout.edits;
    },
    keyPayload() {
      return { key: this.exercise_key };
    },
  },
  created() {},
};
export { WorkoutExerciseStat };
