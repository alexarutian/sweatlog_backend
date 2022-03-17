let CreateBlock = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">NEW BLOCK</div>
  <input v-model="blockName" type="text" autocomplete="off" placeholder="name*" class="form-cluster"/>
  
  <div class="form-cluster">
    <label for="exercise-select">add an exercise</label>
    <select id="exercise-select" @change="selectExercise($event)">
      <option>none (default)</option>
      <option v-for="exercise in exercises" :value="exercise.id">[[exercise.name]]</option>
    </select>
  </div>
  
<button id="add-block-button" @click="createNewBlock">ADD BLOCK</button>
<div v-if="this.$store.state.statusLevel == 'error'">[[message]]</div>

  `,

  components: {},
  data() {
    return {
      blockName: "",
      exerciseId: null,
    };
  },
  methods: {
    selectExercise(e) {
      this.exerciseId = e.target.value;
    },
    createNewBlock() {
      const body = {
        name: this.blockName,
        user_token: this.$store.state.userToken,
      };

      this.$store.dispatch("createNewBlock", { body });
    },
  },
  computed: {
    exercises() {
      return this.$store.state.exercises;
    },
    message() {
      return this.$store.state.statusMessage;
    },
  },
  created() {},
};
export { CreateBlock };
