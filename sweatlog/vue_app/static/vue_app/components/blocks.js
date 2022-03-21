import { CreateBlock } from "./createblock.js";
import { BlockInfo } from "./blockinfo.js";

let Blocks = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="blocks-page">
    <div id="page-top-options">
    <div @click="this.$store.commit('toggleAddingBlockWindow')" class="page-top-option">ADD BLOCK</div>
    <div class="page-top-option">Option 2</div>
      <div class="page-top-option">Option 3</div>
    </div>
    <div id="block-list">
      <div v-for="block in blocks" class="block-list-line">
        <p @click="this.$store.commit('selectBlock',{block: block})" @click="this.$store.commit('toggleBlockDetailWindow')">[[block.name]]</p>
      </div>
    </div>
    <div v-if="this.$store.state.addingBlockWindow" id="create-block-modal" class="modal">
    <span class="close" @click="this.$store.commit('toggleAddingBlockWindow')">&times;</span>  
    <createblock v-if="this.$store.state.addingBlockWindow"></createblock>
  </div>
  <div v-if="this.$store.state.addingBlockWindow" class="modal-overlay" @click="this.$store.commit('toggleAddingBlockWindow')"></div>
  </div>

  <div v-if="this.$store.state.blockDetailWindow" id="block-info-modal" class="modal">
  <span class="close"
  @click="this.$store.commit('toggleBlockDetailWindow')" @click="this.$store.commit('turnoffBlockEditDisplay')">&times;</span>  
  <blockinfo v-if="!this.$store.state.blockEditDisplay" :block="this.$store.state.selectedBlock"></blockinfo>
</div>
<div v-if="this.$store.state.blockDetailWindow" class="modal-overlay"
@click="this.$store.commit('toggleBlockDetailWindow')" @click="this.$store.commit('turnoffBlockEditDisplay')"></div>
</div>

`,

  components: {
    createblock: CreateBlock,
    blockinfo: BlockInfo,
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    blocks() {
      console.log(this.$store.state.blocks);
      return this.$store.state.blocks;
    },
  },
  created() {
    this.$store.dispatch("fetchBlocks");
  },
};
export { Blocks };
