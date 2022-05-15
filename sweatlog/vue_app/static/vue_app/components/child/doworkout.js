import { ExerciseStats } from "../child/exercisestats.js";
import { ExerciseTimer } from "../child/exercisetimer.js";
import { SmallCheck } from "../child/smallcheck.js";

let { mapState, mapMutations, mapActions } = Vuex;

let DoWorkout = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">[[liveData.workout.name]]</div>
  <div v-for="(block, blockIndex) in liveData.workout.blocks">
    <p>[[block.block.name]]</p>
    <div v-for="(exercise, exerciseIndex) in block.block.exercises" class="do-exercise-line">
    <div class="do-exercise-line-header">
      <div class="do-exercise-line-left">
      <div @click="toggleCompleted(blockIndex, exerciseIndex)">
        <div v-if="!exercise.completed"><i class="fa-regular fa-square"></i></div>
        <div v-if="exercise.completed == true"><i class="fa-solid fa-square-check"></i></div>
      </div>
      <div class="do-exercise-words"><p>[[exercise.exercise.name]]</p></div>
      </div>
    <exercisetimer v-if="exercise.stats.time_in_seconds" :exercise="exercise" :blockIndex="blockIndex" :exerciseIndex="exerciseIndex">
    </exercisetimer>
    <div v-if="exercise.stats.sets > 1 && !exercise.expanded" @click="toggleExpanded(blockIndex, exerciseIndex)">
      <i class="fa-solid fa-angles-down"></i>
    </div>
    <div v-if="exercise.stats.sets > 1" @click="toggleExpanded(blockIndex, exerciseIndex)"  v-if="exercise.expanded == true">
    <i class="fa-solid fa-angles-up"></i>
  </div>
    </div>
    <div class="do-exercise-subline">
    <exercisestats v-if="exercise.stats && !exercise.expanded" :stats="exercise.stats" class="do-exercise-stats"></exercisestats>
    <div class="do-exercise-sets-rows" v-if="exercise.expanded == true">  
    <div class="do-exercise-sets-row" v-for="index in exercise.stats.sets">
      <smallcheck class="do-exercise-sets-row-check" :allChecked="exercise.completed == true"></smallcheck>
      <p>[[exercise.stats.reps]]&nbsp;</p>
      <p>[[exercise.exercise.name]]</p>
      <div v-if="exercise.stats.weight_lb" class="do-exercise-sets-row-weight">
      <i class="fa-solid fa-weight-hanging"></i>
        <p>[[exercise.stats.weight_lb]]lb</p>
      </div>
      </div>
    </div>
    </div>
    </div>
  </div>
  <button>COMPLETE WORKOUT</button>

  `,

  components: { exercisestats: ExerciseStats, exercisetimer: ExerciseTimer, smallcheck: SmallCheck },
  data() {
    return {};
  },
  props: {},
  methods: {
    toggleCompleted(blockIndex, exerciseIndex) {
      this.toggleCheckedOnLiveSessionData({ blockIndex, exerciseIndex });
    },
    toggleExpanded(blockIndex, exerciseIndex) {
      this.toggleExpandedOnLiveSessionData({ blockIndex, exerciseIndex });
    },
    ...mapMutations(["toggleCheckedOnLiveSessionData", "toggleExpandedOnLiveSessionData"]),
  },
  computed: {
    workout() {
      // how you get the workout
    },
    ...mapState({
      selectedWorkout: (state) => state.session.selectedSession,
      liveData: (state) => state.session.liveSessionData,
    }),
  },
  created() {},
};
export { DoWorkout };
