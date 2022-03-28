import { DragHandle } from "./draghandle.js";
import { CheckMark } from "./checkmark.js";

let BlockExerciseStat = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>
    <div class="exercise-row">
      <div class="draggable-item">[[exercise.name]]</div>
      <div :class="{'draggable-extra-input-icon': true, 'stat-populated': statPopulated}" @click="toggleStatExpanded">S</div>
      <draghandle class="draggable-handle-icon"></draghandle>
      <div class="draggable-delete-icon" @click="deleteDraggable(exercise)">X</div>
    </div>
    <div v-if="statExpanded==true" class="exercise-stats-row">
      <input type="text" class="input-sets" placeholder="sets" v-model="sets">
      <input type="text" class="input-reps" placeholder="reps" v-model="reps">
      <input type="text" class="input-weight" placeholder="weight" v-model="weight_lb">
      <select @change="selectTime($event)">
        <option value="">MM:SS</option>
        <option v-for="time in timeOptions" :value="time.value">[[time.display]]</option>
      </select>
      <checkmark class="checkmark-icon" @click="saveStats"></checkmark>
      <div class="stat-delete-icon">X</div>
    </div>
  </div>
  `,

  components: {
    draghandle: DragHandle,
    checkmark: CheckMark,
  },
  data() {
    return {
      statExpanded: false,
      sets: null,
      reps: null,
      weight_lb: null,
      time_in_seconds: null,
      timeOptions: CONSTANTS.timeOptions,
    };
  },
  props: {
    exercise: Object,
    index: Number,
  },
  methods: {
    toggleStatExpanded() {
      this.statExpanded = !this.statExpanded;
    },
    deleteDraggable(item) {
      this.$store.commit("removeFromBlockSelectedExerciseList", { item });
    },
    selectTime(e) {
      this.time_in_seconds = e.target.value;
    },

    saveStats() {
      let exercise = this.$store.getters.getBlockSelectedExerciseByIndex(this.index);
      console.log(exercise);

      // CHECK TO MAKE SURE TIME WORKS!
      for (const key of ["reps", "sets", "weight_lb", "time_in_seconds"]) {
        if (this[key]) {
          exercise[key] = this[key];
        } else {
          delete exercise[key];
        }
      }

      console.log(exercise);
      this.$store.commit("swapBlockSelectedExerciseItem", {
        index: this.index,
        replacementItem: exercise,
      });

      this.statExpanded = false;
    },
  },
  computed: {
    statPopulated() {
      // convert to computed property
      let exercise = this.$store.getters.getBlockSelectedExerciseByIndex(this.index);
      if (exercise.sets || exercise.reps || exercise.weight_lb || exercise.time_in_seconds) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {},
};
export { BlockExerciseStat };
