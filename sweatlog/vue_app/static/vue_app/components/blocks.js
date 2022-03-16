let Blocks = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>BLOCKS PAGE</div>
  <div id="block-list">
  <div v-for="block in blocks">
    <p>[[block.name]]</p>
  </div>
</div>  `,

  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    blocks() {
      return this.$store.state.blocks;
    },
  },
  created() {
    this.$store.dispatch("fetchBlocks");
  },
};
export { Blocks };
