let LoginOrCreateUser = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div>Please login or create a new user</div>
  <button @click="loginScreen = 'login'">LOGIN</button>
  <button @click="loginScreen = 'create'">CREATE USER</button>
    <div v-if="loginScreen == 'create'">
        <input type="text" v-model="email" placeholder="email address"/>
        <input type="password" v-model="password" placeholder="password"/>
        <button @click="createNewUser">CREATE USER</button>
    </div>
    <div v-if="loginScreen == 'login'">
      <input type="text" v-model="emailLogin" placeholder="email address"/>
      <input type="password" v-model="passwordLogin" placeholder="password"/>
      <button @click="loginUser">LOGIN</button>
  </div>

  `,

  data() {
    return {
      email: "",
      password: "",
      emailLogin: "",
      passwordLogin: "",
      loginScreen: "",
    };
  },
  methods: {
    createNewUser() {
      const body = {
        email: this.email,
        password: this.password,
      };

      this.$store.dispatch("createNewUser", { body });
    },
    loginUser() {
      const body = {
        email: this.emailLogin,
        password: this.passwordLogin,
      };

      this.$store.dispatch("loginUser", { body });
    },
  },
  computed: {},
  created() {},
};
export { LoginOrCreateUser };
