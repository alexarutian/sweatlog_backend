let Delete = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <svg xmlns="http://www.w3.org/2000/svg" class="delete-svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>
    `,

  components: {},
  data() {
    return {};
  },

  methods: {},
  computed: {},
  created() {},
};
export { Delete };