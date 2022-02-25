let Lester = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
      <div id="blah"> [[ testText]] 
        <div @click="testText = doSomething()">This is a lest</div>
      </div>
      `,
  // each Tester object can maintain its own data state
  // this is why data is a fx not an object

  data() {
    return {
      testText: "More lester!",
    };
  },
  methods: {
    doSomething() {
      return "I did something else!";
    },
  },
};
export { Lester };
