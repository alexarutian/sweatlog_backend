import { ExerciseTypes } from "./exercisetypes.js";

let Other = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>OTHER PAGE</div>
  <div id="other-page-options" v-if="!showOtherPageContent">
    <div @click="otherPageContent = 'exercisetypes'" @click="showOtherPageContent = true">Exercise Types</div>
    <div>Equipment Types</div>
  </div>
  <div id="other-page-content" v-if="showOtherPageContent">
    <div @click="showOtherPageContent = false">Back to Other Options</div>
    <exercisetypes v-if="otherPageContent == 'exercisetypes'"></exercisetypes>
  </div>
  `,

  components: { exercisetypes: ExerciseTypes },
  data() {
    return {
      showOtherPageContent: false,
      otherPageContent: "",
    };
  },
  methods: {},
  computed: {},
  created() {},
};
export { Other };
