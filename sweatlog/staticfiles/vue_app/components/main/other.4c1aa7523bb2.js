import { ExerciseTypes } from "../child/exercisetypes.js";

let { mapState, mapActions } = Vuex;

let Other = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="other-page">
    <div id="other-page-options" v-if="!showOtherPageContent">
      <div id="settings" v-if="!showOtherPageContent">
        <p class="other-page-subtitle">Settings:</p>
          <div class="settings-line" @click="otherPageContent='exercisetypes'" @click="showOtherPageContent=true">
          <p>Exercise Types</p>
          <i class="fa-solid fa-angle-right"></i>
          </div>
          <div class="settings-line">
          <p>Equipment Types</p>
          <i class="fa-solid fa-angle-right"></i>
          </div>
      </div>
      <div id="user-info">
      <p class="other-page-subtitle">User Information:</p>
        <div class="other-page-line">You are logged in as [[userEmail]]</div>
        <button v-if="userToken" @click="logoutUser">LOGOUT OF SWEATLOG</button>
      </div>
      <div id="about-sweatlog">
      <p class="other-page-subtitle">About Sweatlog:</p>
        <p>Sweatlog was created by Sound Engineering</p>
        <p>For inquiries, please contact us here</p>
        <p></p>
      </div>
    </div>
    <div id="other-page-content" v-if="showOtherPageContent">
        <div class="back-button" @click="showOtherPageContent = false">
          <i class="fa-solid fa-angle-left"></i>
          <p>Settings</p>
        </div>
        <exercisetypes v-if="otherPageContent=='exercisetypes'"></exercisetypes>
      </div>
  </div>

  `,

  components: { exercisetypes: ExerciseTypes },
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
