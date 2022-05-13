import { CreateBlock } from "./createblock.js";
import { BlockInfo } from "./blockinfo.js";

let { mapState, mapMutations } = Vuex;

let Blocks = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <p class="other-page-subtitle suboption-title">Blocks</p>
    <div id="add-button" @click="toggleAddingBlockWindow">
    <i class="fa-solid fa-droplet"></i>
    <i class="fa-solid fa-plus"></i></div>
    <div id="block-list">
      <div v-for="block in blocks" class="block-list-line">
        <p @click="selectBlock({block})" @click="toggleBlockDetailWindow">[[block.name]]</p>
      </div>
    </div>
    <div v-if="adding" id="create-block-modal" class="full-page-box">
    <span class="close-full-page-box" @click="toggleAddingBlockWindow">&times;</span>  
    <createblock v-if="adding"></createblock>
  </div>

  <div v-if="detail" id="block-info-modal" class="modal">
  <span class="close"
  @click="toggleBlockDetailWindow" @click="turnoffBlockEditDisplay">&times;</span>  
  <blockinfo v-if="!editing" :block="selected"></blockinfo>
</div>
<div v-if="detail" class="modal-overlay"
@click="toggleBlockDetailWindow" @click="turnoffBlockEditDisplay"></div>
</div>

`,

  components: {
    createblock: CreateBlock,
    blockinfo: BlockInfo,
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["toggleAddingBlockWindow", "toggleBlockDetailWindow", "selectBlock", "turnoffBlockEditDisplay"]),
  },
  computed: mapState({
    blocks: (state) => state.block.blocks,
    adding: (state) => state.block.addingBlockWindow,
    detail: (state) => state.block.blockDetailWindow,
    editing: (state) => state.block.blockEditDisplay,
    selected: (state) => state.block.selectedBlock,
  }),
  created() {
    this.$store.dispatch("fetchBlocks");
  },
};
export { Blocks };
