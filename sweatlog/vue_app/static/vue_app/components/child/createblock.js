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
  <blockexercisestat class="block-exercise-item" 
    v-if="selectedExerciseList" v-for="(exercise, index) in selectedExerciseList" 
    :exercise="exercise" :index="index" :data-index="index" 
      draggable="true" 
      @dragstart="startMove" 
      @touchstart="startMove" 
      @dragover="moveOver" 
      @touchmove="moveOver" 
      @drop="drop" 
      @touchend="drop"
  >
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
    startMove(e) {
      let target = findDivUnderCursor(e, ".block-exercise-item");
      if (target) {
        const index = parseInt(target.dataset.index);
        this.draggingIndex = index;
        doStuffToClass("block-exercise-item", (i) => {
          if (i.dataset.index != this.draggingIndex) {
            i.classList.add("hint");
          }
        });
      }
    },

    moveOver(e) {
      e.preventDefault();
      let target = findDivUnderCursor(e, ".block-exercise-item");
      let entering = target !== null;
      doStuffToClass("block-exercise-item", (i) => {
        i.classList.remove("active");
      });
      if (entering && target.dataset.index != this.draggingIndex) {
        target.classList.add("active");
      }
    },

    drop(e) {
      doStuffToClass("block-exercise-item", (i) => {
        i.classList.remove("hint");
        i.classList.remove("active");
      });
      if (this.draggingIndex != null) {
        let target = findDivUnderCursor(e, ".block-exercise-item");
        if (target) {
          let to = parseInt(target.dataset.index);
          let from = this.draggingIndex;
          this.reorderBlockSelectedExerciseList({ from, to });
          this.draggingIndex = null;
        }
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
    exercises: (state) => state.exercise.items,
    message: (state) => state.statusMessage,
    selectedExerciseList: (state) => state.block.blockSelectedExerciseList,
    statusLevel: (state) => state.statusLevel,
    userToken: (state) => state.userToken,
  }),
  created() {},
};
export { CreateBlock };
