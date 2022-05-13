import { ExerciseTypes } from "../child/exercisetypes.js";
import { EquipmentTypes } from "../child/equipmenttypes.js";
import { Blocks } from "../child/blocks.js";

let { mapState, mapActions } = Vuex;

let Other = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="other-page">
    <div id="other-page-options" v-if="!showOtherPageContent">
      <div id="settings" v-if="!showOtherPageContent">
        <p class="other-page-subtitle">Settings</p>
          <div class="settings-line" @click="otherPageContent='exercisetypes'" @click="showOtherPageContent=true">
          <p>Exercise Types</p>
          <i class="fa-solid fa-angle-right"></i>
          </div>
          <div class="settings-line" @click="otherPageContent='equipmenttypes'" @click="showOtherPageContent=true">
          <p>Equipment Types</p>
          <i class="fa-solid fa-angle-right"></i>
          </div>
          <div class="settings-line" @click="otherPageContent='blocks'" @click="showOtherPageContent=true">
          <p>Blocks</p>
          <i class="fa-solid fa-angle-right"></i>
          </div>
      </div>
      <div id="user-info">
      <p class="other-page-subtitle">User Information</p>
        <div class="other-page-line">You are logged in as [[userEmail]]</div>
        <button v-if="userToken" @click="logoutUser">LOGOUT OF SWEATLOG</button>
      </div>
      <div id="about-sweatlog">
      <p class="other-page-subtitle">About Sweatlog</p>
        <p>Sweatlog was created with 💪 by AA</p>
        <p>For inquiries, please contact us here</p>
        <p></p>
      </div>
    </div>
    <div id="other-page-content" v-if="showOtherPageContent">
        <div class="back-button" @click="showOtherPageContent = false">
          <i class="fa-solid fa-angle-left"></i>
          <p>Settings</p>
        </div>
        <exercisetypes v-if="otherPageContent=='exercisetypes'" class="other-page-detail"></exercisetypes>
        <equipmenttypes v-if="otherPageContent=='equipmenttypes'" class="other-page-detail"></equipmenttypes>
        <blocks v-if="otherPageContent=='blocks'" class="other-page-detail"></blocks>
      </div>
  </div>

  `,

  components: { exercisetypes: ExerciseTypes, equipmenttypes: EquipmentTypes, blocks: Blocks },
  data() {
    return {
      showOtherPageContent: false,
      otherPageContent: "",
    };
  },
  methods: {
    ...mapActions(["logoutUser"]),
  },
  computed: mapState({
    userEmail: (state) => state.userEmail,
    userToken: (state) => state.userToken,
  }),
  created() {},
};
export { Other };
