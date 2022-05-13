let { mapState, mapMutations, mapActions } = Vuex;

let SmallCheck = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div class="small-check" @click="checked = !checked">
    <div v-if="checked == false && !allChecked"><i class="fa-regular fa-circle circle-small"></i></div>
    <div v-if="checked == true || allChecked == true"><i class="fa-solid fa-check check-small"></i></div>
  </div>
  `,

  components: {},
  data() {
    return {
      checked: false,
    };
  },
  props: { allChecked: Boolean },
  methods: {},
  computed: {},
  created() {},
};
export { SmallCheck };
