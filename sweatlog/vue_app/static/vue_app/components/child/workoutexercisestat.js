import { DragHandle } from "./draghandle.js";
import { CheckMark } from "./checkmark.js";

let { mapState, mapMutations, mapActions } = Vuex;

let WorkoutExerciseStat = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>
    <div class="exercise-row">
      <div class="draggable-item">[[exercise.name]]</div>
      <div :class="{'draggable-extra-input-icon': true, 'stat-populated': statPopulated}" @click="toggleStats" @touchstart="toggleStats">S</div>
      <div class="delete-icon" @click="deleteItem(exercise)" @touchstart="deleteItem(exercise)">X</div>
    </div>
    <div v-if="expandStat==true" class="exercise-stats-row">
      <input type="text" class="input-sets" placeholder="sets" v-model="edits.sets" data-field="sets" @input="stageData">
      <input type="text" class="input-reps" placeholder="reps" v-model="edits.reps" data-field="reps" @input="stageData">
      <input type="text" class="input-weight" placeholder="weight" v-model="edits.weight_lb" data-field="weight_lb" @input="stageData">
      <select @change="stageData" data-field="time_in_seconds">
        <option value="">MM:SS</option>
        <option v-for="time in timeOptions" :value="time.value" :selected="edits.time_in_seconds==time.value">[[time.display]]</option>
      </select>
      <checkmark class="checkmark-icon" @click="saveStats" @touchstart="saveStats"></checkmark>
      <div class="stat-delete-icon" @click="flushStage">X</div>
    </div>
  </div>
  `,

  components: {
    draghandle: DragHandle,
    checkmark: CheckMark,
  },
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

    deleteItem(item) {
      this.removeFromWorkoutSelectedItemList({ item });
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
      return this.exercise.statExpanded;
    },
    exercise() {
      return this.$store.getters.getWorkoutSelectedExerciseByKey(this.exercise_key);
    },
    edits() {
      return this.exercise.edits;
    },
    keyPayload() {
      return { key: this.exercise_key };
    },
  },
  created() {},
};
export { WorkoutExerciseStat };
