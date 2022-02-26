let FooterToolbar = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
      <div class="footer-toolbar" >
      <p v-for="item in menuitems" v-bind:key="item.id"
         @click="this.$store.commit('navigate',{page: item.page})"
         :class="{'menu-item': true, 'selected-menu-item': item.page == currentPage }">
         [[item.name]]</p>    
      </div>    
    `,

  components: {},
  data() {
    return {};
  },
  props: {
    menuitems: Object,
  },
  computed: {
    currentPage() {
      return this.$store.state.currentPage;
    },
  },
  methods: {},
};
export { FooterToolbar };
