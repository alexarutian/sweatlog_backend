import { CreateBlock } from "./createblock.js";

let Blocks = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="blocks-page">
    <div id="page-top-options">
      <div class="page-top-option">Option 1</div>
      <div class="page-top-option">Option 2</div>
      <div class="page-top-option">Option 3</div>
    </div>
    <div id="block-list">
      <div v-for="block in blocks" class="block-list-line">
        <p>[[block.name]]</p>
      </div>
    </div>
  </div>
`,

  components: {
    createblock: CreateBlock,
  },
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
