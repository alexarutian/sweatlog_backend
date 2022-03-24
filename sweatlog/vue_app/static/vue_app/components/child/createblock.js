import { BlockExerciseStat } from "./blockexercisestat.js";

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
  <div class="drop-zone" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
  <blockexercisestat v-if="this.$store.state.block.blockSelectedExerciseList" v-for="(exercise, index) in this.$store.state.block.blockSelectedExerciseList" :exercise=exercise :index=index :data-index="index" draggable="true" @dragstart="startDrag($event, exercise, index)">
  </blockexercisestat>
  </div>
  <button id="add-block-button" @click="createNewBlock">ADD BLOCK</button>
<div v-if="this.$store.state.statusLevel == 'error'">[[message]]</div>

  `,

  components: {
    blockexercisestat: BlockExerciseStat,
  },
  data() {
    return {
      blockName: "",
      selectedExerciseList: [],
    };
  },
  methods: {
    startDrag(e, item, index) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("item", item);
      e.dataTransfer.setData("index", index);
    },
    onDrop(e) {
      let to = e.target.dataset.index;
      let from = e.dataTransfer.getData("index");
      let item = e.dataTransfer.getData("item");
      this.$store.commit("reorderBlockSelectedExerciseList", { from, to });
    },
    selectExercise(e) {
      let name = e.target.value;
      let id = document.querySelector(`#exercise_list option[value='${name}']`)
        .dataset.id;
      this.$store.commit("addToBlockSelectedExerciseList", { id, name });
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
    createNewBlock() {
      const body = {
        name: this.blockName,
        user_token: this.$store.state.userToken,
        exercise_list: this.$store.state.block.blockSelectedExerciseList,
      };

      this.$store.dispatch("createNewBlock", { body });
    },
  },
  computed: {
    exercises() {
      return this.$store.state.exercise.exercises;
    },
    message() {
      return this.$store.state.statusMessage;
    },
  },
  created() {},
};
export { CreateBlock };
