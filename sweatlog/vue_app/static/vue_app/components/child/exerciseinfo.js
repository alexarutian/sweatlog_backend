let { mapState, mapMutations, mapActions } = Vuex;

let ExerciseInfo = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
  <div>
  <div class="modal-title">[[exercise.name]]</div>
  <div v-if="exercise.description" class="exercise-info-line">
  <p class="info-caption">Description</p>
  <p class="info-data">[[exercise.description]]</p>
  </div>
  <div v-if="exercise.exercise_type" class="exercise-info-line">
    <p class="info-caption">Exercise Type</p>
    <p class="info-data">[[exercise.exercise_type.name]]</p>
  </div>
  <div v-if="exercise.equipment_type" class="exercise-info-line">
    <p class="info-caption">Equipment Type</p>
    <p class="info-data">[[exercise.equipment_type.name]]</p>
  </div>
  <div id="modal-bottom-buttons">
    <button id="open-edit-exercise-button" @click="toggleExerciseEditDisplay" @click="toggleExerciseDetailWindow">EDIT</button>
    <button id="delete-exercise-button" @click="submitDelete(exercise)">DELETE</button>
  </div>
  </div>
  <div v-if="choppingBlock" class="delete-confirmation" class="modal">
  <span class="close" @click="clearChoppingBlock">&times;</span> 
  <div>Are you sure you want to delete [[choppingBlock.name]]?</div> 
  <button @click="deleteItem">DELETE</button>
</div>
<div v-if="choppingBlock" @click="clearChoppingBlock" class="modal-overlay"></div>

  `,

  components: {},
  data() {
    return {};
  },
  props: {
    exercise: Object,
  },
  methods: {
    submitDelete(e) {
      const obj = {
        resourceTypeStr: "exercises",
        id: e.id,
        name: e.name,
      };
      this.loadChoppingBlock(obj);
    },
    ...mapMutations([
      "toggleExerciseEditDisplay",
      "toggleExerciseDetailWindow",
      "loadChoppingBlock",
      "clearChoppingBlock",
    ]),
    ...mapActions(["deleteItem"]),
  },
  computed: mapState({
    choppingBlock: (state) => state.choppingBlock,
  }),
  created() {},
};
export { ExerciseInfo };
