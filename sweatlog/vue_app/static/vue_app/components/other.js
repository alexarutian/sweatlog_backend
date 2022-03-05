let Other = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>OTHER PAGE</div>
  <div @click="this.$store.commit('navigate',{page: 'exercisetypes'})">Exercise Types</div>
  <div>Equipment Types</div>

  `,

  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
  created() {},
};
export { Other };
