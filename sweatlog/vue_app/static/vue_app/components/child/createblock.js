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
  <div class="drop-zone" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
  <blockexercisestat v-if="selectedExerciseList" v-for="(exercise, index) in selectedExerciseList" :exercise=exercise :index=index :data-index="index" draggable="true" @dragstart="startDrag($event, exercise, index)">
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
      this.reorderBlockSelectedExerciseList({ from, to });
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
