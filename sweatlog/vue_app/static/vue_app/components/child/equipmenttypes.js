let { mapState, mapMutations, mapActions } = Vuex;

let EquipmentTypes = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
    <p class="other-page-subtitle suboption-title">Equipment Types</p>
    <div id="exercise-type-list">
        <div v-for="et in equipmentTypes" class="exercise-type-list-line">
            <input type="text" :value="et.name" :placeholder="et.name" :disabled="notEditable(et)" :ref="et.name"/>
            <div class="et-inline-modify-buttons">
                <div v-if="notEditable(et)" @click="editClicked(et)"><i class="fa-solid fa-pencil"></i></div>
                <div v-if="!notEditable(et)" @click="submitEdit(et.id)"><i class="fa-solid fa-check"></i></div>
                <div @click="submitDelete(et)"><i class="fa-regular fa-trash-can"></i></div>
            </div>
        </div>
        <div v-if="adding" class="exercise-type-list-line">
          <input type="text" :value="newPlaceholder" :placeholder="newPlaceholder" ref="newItem"/>
          <div class="et-inline-modify-buttons">
              <div @click="submitCreate"><i class="fa-solid fa-check"></i></div>
              <div @click="adding = false"><i class="fa-regular fa-trash-can"></i></div>
          </div>
        </div>
    </div>
    <button @click="addClicked">ADD EQUIPMENT TYPE</button>
    <div v-if="choppingBlock" class="delete-confirmation" class="modal">
      <span class="close" @click="clearChoppingBlock">&times;</span> 
      <div>Are you sure you want to delete [[choppingBlock.name]]?</div> 
      <button @click="deleteItem">DELETE</button>
    </div>
    <div v-if="choppingBlock" @click="clearChoppingBlock" class="modal-overlay" @click=""></div>

    
    `,

  components: {},
  data() {
    return {
      adding: false,
      editing: false,
      selectedItem: "",
      newPlaceholder: "my new equipment type",
    };
  },
  methods: {
    notEditable(et) {
      return !this.editing || et != this.selectedItem;
    },
    addClicked() {
      this.adding = true;
      this.$nextTick(() => {
        const elem = this.$refs["newItem"];
        elem.select();
      });
    },
    editClicked(et) {
      this.selectedItem = et;
      this.editing = true;
      this.$nextTick(() => {
        const elem = this.$refs[et.name];
        elem.focus();
      });
    },
    submitCreate() {
      const elem = this.$refs["newItem"];
      const body = {
        name: elem.value,
        user_token: this.userToken,
      };
      this.createNewEquipmentType({ body });
      this.adding = false;
    },
    submitEdit(id) {
      const elem = this.$refs[this.selectedItem.name];
      const body = {
        name: elem.value,
        user_token: this.userToken,
      };

      this.editEquipmentType({ id, body });
      this.editing = false;
    },
    submitDelete(et) {
      const obj = {
        resourceTypeStr: "equipmenttypes",
        id: et.id,
        name: et.name,
      };
      this.loadChoppingBlock(obj);
    },
    ...mapMutations(["loadChoppingBlock", "clearChoppingBlock"]),
    ...mapActions(["editEquipmentType", "createNewEquipmentType", "deleteItem"]),
  },
  computed: mapState({
    equipmentTypes: (state) => state.equipmenttype.items,
    userToken: (state) => state.userToken,
    choppingBlock: (state) => state.choppingBlock,
  }),
  created() {},
};
export { EquipmentTypes };
