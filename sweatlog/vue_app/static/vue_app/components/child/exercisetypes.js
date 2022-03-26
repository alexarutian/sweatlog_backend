let { mapState, mapMutations, mapActions } = Vuex;

let ExerciseTypes = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
    <div>EXERCISE TYPES</div>
    <div id="exercise-type-list">
        <div v-for="et in exerciseTypes" class="exercise-type-list-line">
            <p>[[et.name]]</p>
            <div class="et-inline-modify-buttons">
                <p @click="selectedExerciseType = et" @click="editingExerciseType = true">Edit</p>
                <p @click="submitDelete(et.id)">Delete</p>
            </div>
        </div>
    </div>
    <div  @click="addingExerciseType = true">ADD EXERCISE TYPE</div>
    <div v-if="addingExerciseType">
        <input type="text" v-model="exerciseTypeName" placeholder="name" autocomplete="false">
        <button @click="submitCreate" @click="addingExerciseType = false">ADD</button>
    </div>
    <div v-if="editingExerciseType">EDIT EXERCISE TYPE
        <input type="text" v-model="selectedETName" :placeholder="this.selectedExerciseType.name">
        <button @click="submitEdit(this.selectedExerciseType.id)" @click="editingExerciseType = false">EDIT</button>
    </div>

    `,

  components: {},
  data() {
    const selectedETName = this.selectedExerciseType ? this.selectedExerciseType.name : undefined;
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
    submitCreate() {
      const body = {
        name: this.exerciseTypeName,
        user_token: this.userToken,
      };
      this.createNewExerciseType({ body });
      this.exerciseTypeName = "";
    },
    submitEdit(id) {
      const body = {
        name: this.selectedETName,
        user_token: this.userToken,
      };

      this.editExerciseType({ id, body });
    },
    submitDelete(id) {
      this.deleteExerciseType({ id });
    },
    ...mapActions(["deleteExerciseType", "editExerciseType", "createNewExerciseType"]),
  },
  computed: mapState({
    exerciseTypes: (state) => state.exercisetype.exerciseTypes,
    userToken: (state) => state.userToken,
  }),
  created() {},
};
export { ExerciseTypes };
