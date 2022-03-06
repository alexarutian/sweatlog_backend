let ExerciseTypes = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
    <div>EXERCISE TYPES</div>
    <div id="exercise-type-list">
        <div v-for="et in exerciseTypes" class="exercise-type-list-line">
            <p>[[et.name]]</p>
            <div class="et-inline-modify-buttons">
                <p @click="selectedExerciseType = et" @click="editingExerciseType = true">Edit</p>
                <p @click="deleteExerciseType(et.id)">Delete</p>
            </div>
        </div>
    </div>
    <div  @click="addingExerciseType = true">ADD EXERCISE TYPE</div>
    <div v-if="addingExerciseType">
        <input type="text" v-model="exerciseTypeName" placeholder="name" autocomplete="false">
        <button @click="createNewExerciseType" @click="addingExerciseType = false">ADD</button>
    </div>
    <div v-if="editingExerciseType">EDIT EXERCISE TYPE
        <input type="text" v-model="selectedETName" :placeholder="this.selectedExerciseType.name">
        <button @click="editExerciseType(this.selectedExerciseType.id)" @click="editingExerciseType = false">EDIT</button>
    </div>

    `,

  components: {},
  data() {
    const selectedETName = this.selectedExerciseType
      ? this.selectedExerciseType.name
      : undefined;
    return {
      addingExerciseType: false,
      editingExerciseType: false,
      exerciseTypeName: "",
      selectedExerciseType: "",
      selectedETName,
    };
  },
  methods: {
    // TURN INTO MODAL EVENTUALLY
    createNewExerciseType() {
      const body = {
        name: this.exerciseTypeName,
      };
      this.$store.dispatch("createNewExerciseType", { body });
      this.exerciseTypeName = "";
    },
    editExerciseType(id) {
      const body = {
        name: this.selectedETName,
      };

      this.$store.dispatch("editExerciseType", { id, body });
    },
    deleteExerciseType(id) {
      this.$store.dispatch("deleteExerciseType", { id });
    },
  },
  computed: {
    exerciseTypes() {
      return this.$store.state.exerciseTypes;
    },
  },
  created() {},
};
export { ExerciseTypes };
