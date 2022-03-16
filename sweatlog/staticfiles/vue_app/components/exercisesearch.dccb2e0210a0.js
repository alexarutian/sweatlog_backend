let ExerciseSearch = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="modal-title">SEARCH EXERCISES</div>

  <input v-model="searchString" type="text" placeholder="name/description search terms" autocomplete="off"/>

  <div class="form-cluster">
    <label for="exercise-type-select">exercise type</label>
    <select id="exercise-type-select" @change="selectExerciseType($event)">
      <option>all exercise types</option>
      <option v-for="et in exerciseTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>

  <div class="form-cluster">
    <label for="equipment-type-select">equipment type</label>
    <select id="equipment-type-select" @change="selectEquipmentType($event)">
      <option>all equipment types</option>
      <option v-for="et in equipmentTypes" :value="et.id">[[et.name]]</option>
    </select>
  </div>

<button>SEARCH</button>
  `,

  components: {},
  data() {
    return {
      equipmentTypeId: null,
      exerciseTypeId: null,
      nameDescriptionSearch: "",
    };
  },
  methods: {
    selectExerciseType(e) {
      this.exerciseTypeId = e.target.value;
    },
    selectEquipmentType(e) {
      this.equipmentTypeId = e.target.value;
    },
  },
  computed: {
    exerciseTypes() {
      return this.$store.state.exerciseTypes;
    },
    equipmentTypes() {
      return this.$store.state.equipmentTypes;
    },
  },
  created() {},
};
export { ExerciseSearch };
