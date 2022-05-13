let { mapState, mapMutations } = Vuex;

let Home = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="home-page">HOME PAGE
  </div>
  `,

  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
  created() {},
};
export { Home };
