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
      <input type="text" class="input-time" required pattern="[0-9]{2}:[0-9]{2}" value="MM:SS" v-model="time">
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
    // const sets = this.exercise.sets ? this.exercise.sets : null;
    // const reps = this.exercise.reps ? this.exercise.reps : null;
    // const weight = this.exercise.weight ? this.exercise.weight : null;
    // const time = this.exercise.time ? this.exercise.time : null;

    return {
      statExpanded: false,
      sets: null,
      reps: null,
      weight_lb: null,
      time: null,
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
    convertTimeStringToSeconds() {
      // figure out how to do this!!!
    },
    saveStats() {
      let exercise = this.$store.getters.getBlockSelectedExerciseByIndex(
        this.index
      );
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
      let exercise = this.$store.getters.getBlockSelectedExerciseByIndex(
        this.index
      );
      if (
        exercise.sets ||
        exercise.reps ||
        exercise.weight_lb ||
        exercise.time_in_seconds
      ) {
        return true;
      } else {
        return false;
      }
    },
    time_in_seconds() {
      this.convertTimeStringToSeconds(this.time);
    },
  },
  created() {},
};
export { BlockExerciseStat };
