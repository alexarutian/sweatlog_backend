let { mapState, mapMutations, mapActions } = Vuex;

let InlineEditor = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
    <p class="other-page-subtitle suboption-title">Exercise Types</p>
    <div id="exercise-type-list">
        <div v-for="et in exerciseTypes" class="exercise-type-list-line">
            <input type="text" :value="et.name" :placeholder="et.name" :disabled="shouldBeEditable(et)" :ref="et.name"/>
            <div class="et-inline-modify-buttons">
                <div v-if="shouldBeEditable(et)" @click="editClicked(et)"><i class="fa-solid fa-pencil"></i></div>
                <div v-if="!shouldBeEditable(et)" @click="submitEdit(et.id)" @click="editingExerciseType = false"><i class="fa-solid fa-check"></i></div>
                <div @click="submitDelete(et.id)"><i class="fa-regular fa-trash-can"></i></div>
            </div>
        </div>
    </div>
    <button  @click="addingExerciseType = true">ADD EXERCISE TYPE</button>
    <div class="add-exercise-type" v-if="addingExerciseType">
        <input type="text" v-model="exerciseTypeName" placeholder="name" autocomplete="false">
        <button @click="submitCreate" @click="addingExerciseType = false">ADD</button>
    </div>
    
    `,

  components: {},
  data() {
    return {
      addingExerciseType: false,
      editingExerciseType: false,
      exerciseTypeName: "",
      selectedExerciseType: "",
    };
  },
  methods: {
    // TURN INTO MODAL EVENTUALLY

    shouldBeEditable(et) {
      return !this.editingExerciseType || et != this.selectedExerciseType;
    },

    editClicked(et) {
      this.selectedExerciseType = et;
      this.editingExerciseType = true;
      this.$nextTick(() => {
        const elem = this.$refs[et.name];
        elem.focus();
      });
    },
    submitCreate() {
      const body = {
        name: this.exerciseTypeName,
        user_token: this.userToken,
      };
      this.createNewExerciseType({ body });
      this.exerciseTypeName = "";
    },
    submitEdit(id) {
      const elem = this.$refs[this.selectedExerciseType.name];
      const body = {
        name: elem.value,
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
export { InlineEditor };
