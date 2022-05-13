let { mapState, mapMutations } = Vuex;

let FooterToolbar = {
  delimiters: ["[[", "]]"],
  template: /*html*/ `
      <div class="footer-toolbar" >
      <div v-for="item in menuitems" v-bind:key="item.id"
         @click="navigate({page: item.page})"
         :class="{'menu-item': true, 'selected-menu-item': item.page == currentPage }">
         <i :class="item.icon"></i>
         <p class="footer-icon-label">[[item.name]]</p>
         </div>    
      </div>    
    `,

  components: {},
  data() {
    return {};
  },
  props: {
    menuitems: Object,
  },
  computed: mapState({
    currentPage: (state) => state.currentPage,
  }),
  methods: {
    ...mapMutations(["navigate"]),
  },
};
export { FooterToolbar };
