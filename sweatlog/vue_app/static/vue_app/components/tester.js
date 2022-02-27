import { Lester } from "./lester.js";

let Tester = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="blah">
      [[ testText]]
      <div @click="testText = doSomething()">This is a test</div>
    </div>
    <lester></lester>
  `,
  // each Tester object can maintain its own data state
  // this is why data is a fx not an object
  components: {
    lester: Lester,
  },
  data() {
    return {
      testText: "More text!",
    };
  },
  methods: {
    doSomething() {
      return "I did something!";
    },
  },
};
export { Tester };
