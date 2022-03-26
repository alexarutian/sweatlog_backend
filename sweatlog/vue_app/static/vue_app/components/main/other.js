import { ExerciseTypes } from "../child/exercisetypes.js";

let { mapState, mapActions } = Vuex;

let Other = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="other-page">
  <div id="other-page-options" v-if="!showOtherPageContent">
    <div id="settings">Settings
      <div @click="otherPageContent='exercisetypes'" @click="showOtherPageContent=true">Exercise Types</div>
      <div>Equipment Types</div>
    </div>
    <div id="user-info">
      <div>You are logged in as [[userEmail]]</div>
      <div v-if="this.$store.state.userToken" @click="logoutUser">LOGOUT OF SWEATLOG</div>
    </div>
  </div>
  <div id="other-page-content" v-if="showOtherPageContent">
    <div @click="showOtherPageContent = false">Back to Other Options</div>
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
  }),
  created() {},
};
export { Other };
