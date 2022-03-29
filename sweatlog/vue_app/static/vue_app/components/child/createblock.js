import { BlockExerciseStat } from "./blockexercisestat.js";

let { mapState, mapMutations, mapActions } = Vuex;

let CreateBlock = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">NEW BLOCK</div>
  <input v-model="blockName" type="text" autocomplete="off" placeholder="name*" class="form-cluster"/>

  <div class="form-cluster">
  <label for="exercise-select2">add an exercise</label>
  <input id="exercise-select2" type="text" list="exercise_list" placeholder="search exercises" @change="selectExercise($event)" >
  <datalist id="exercise_list">
  <option v-for="exercise in exercises" :data-id="exercise.id" :value="exercise.name"></option>
  </datalist>
</div>
<div class="drop-zone">
  <blockexercisestat class="block-exercise-item" v-if="selectedExerciseList" v-for="(exercise, index) in selectedExerciseList" :exercise="exercise" :index="index" :data-index="index" 
  draggable="true" @dragstart="startDrag($event)" @drop="onDrop($event)" @dragover.prevent @dragenter="dragEnter($event)" @dragleave="dragLeave($event)"
  @touchstart="startTouch($event)" @touchmove="moveFinger($event)" @touchend="endTouch($event)">
  </blockexercisestat>
</div>
  <button id="add-block-button" @click="submitCreate">ADD BLOCK</button>
<div v-if="statusLevel == 'error'">[[message]]</div>
  `,

  components: {
    blockexercisestat: BlockExerciseStat,
  },
  data() {
    return {
      blockName: "",
      draggingIndex: null,
    };
  },
  methods: {
    startDrag(e) {
      const index = parseInt(e.target.dataset.index);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      this.draggingIndex = index;
      let allItems = document.getElementsByClassName("block-exercise-item");
      for (let i of allItems) {
        if (i.dataset.index != this.draggingIndex) {
          i.classList.add("hint");
        }
      }
    },
    startTouch(e) {
      e.preventDefault();
      let touchTarget = e.target.closest(".block-exercise-item");
      const index = parseInt(touchTarget.dataset.index);
      this.draggingIndex = index;
      let allItems = document.getElementsByClassName("block-exercise-item");
      for (let i of allItems) {
        if (i.dataset.index != this.draggingIndex) {
          i.classList.add("hint");
        }
      }
    },
    dragEnter(e) {
      e.preventDefault();
      let target = e.target.closest(".block-exercise-item");
      if (target.dataset.index != this.draggingIndex) {
        target.classList.add("active");
      }
    },
    dragLeave(e) {
      let target = e.target.closest(".block-exercise-item");
      target.classList.remove("active");
    },
    moveFinger(e) {
      e.preventDefault();
      let changedTouch = e.changedTouches[0];
      let elemUnderFinger = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
      let onChoice = elemUnderFinger.closest(".block-exercise-item");

      if (onChoice && onChoice.dataset.index != this.draggingIndex) {
        onChoice.classList.add("active");
      } else {
        let allItems = document.getElementsByClassName("block-exercise-item");
        for (let i of allItems) {
          i.classList.remove("active");
        }
      }
    },
    onDrop(e) {
      // remove formatting from all
      let allItems = document.getElementsByClassName("block-exercise-item");
      for (let i of allItems) {
        i.classList.remove("hint");
        i.classList.remove("active");
      }

      if (this.draggingIndex != null) {
        let dropTarget = e.target.closest(".block-exercise-item");
        let to = parseInt(dropTarget.dataset.index);
        let from = this.draggingIndex;
        this.reorderBlockSelectedExerciseList({ from, to });
        this.draggingIndex = null;
      }
    },
    endTouch(e) {
      e.preventDefault();

      // remove formatting from all
      let allItems = document.getElementsByClassName("block-exercise-item");
      for (let i of allItems) {
        i.classList.remove("hint");
        i.classList.remove("active");
      }

      if (this.draggingIndex != null) {
        let changedTouch = e.changedTouches[0];
        let elemUnderFinger = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
        let dropTarget = elemUnderFinger.closest(".block-exercise-item");
        let to = parseInt(dropTarget.dataset.index);
        let from = this.draggingIndex;
        this.reorderBlockSelectedExerciseList({ from, to });
        this.draggingIndex = null;
      }
    },
    selectExercise(e) {
      let name = e.target.value;
      let id = document.querySelector(`#exercise_list option[value='${name}']`).dataset.id;
      this.addToBlockSelectedExerciseList({ id, name });
      document.getElementById("exercise-select2").value = "";
    },
    toggleAddStat(id) {
      if (!this.addStatContains(id)) {
        this.addStat.push(id);
      } else {
        let index = this.addStat.indexOf(id);
        this.addStat.splice(index, 1);
      }
    },
    addStatContains(id) {
      return this.addStat.indexOf(id) >= 0;
    },
    submitCreate() {
      const body = {
        name: this.blockName,
        user_token: this.userToken,
        exercise_list: this.selectedExerciseList,
      };

      this.createNewBlock({ body });
    },
    ...mapMutations(["reorderBlockSelectedExerciseList", "addToBlockSelectedExerciseList"]),
    ...mapActions(["createNewBlock"]),
  },
  computed: mapState({
    exercises: (state) => state.exercise.exercises,
    message: (state) => state.statusMessage,
    selectedExerciseList: (state) => state.block.blockSelectedExerciseList,
    statusLevel: (state) => state.statusLevel,
    userToken: (state) => state.userToken,
  }),
  created() {},
};
export { CreateBlock };
