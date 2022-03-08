let LoginOrCreateUser = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="login-page">
    <div>Please login or create a new user</div>
    <div id="login-page-buttons" v-if="loginScreen == ''">
      <button @click="loginScreen = 'login'">LOGIN</button>
      <button @click="loginScreen = 'create'">CREATE USER</button>
    </div>
    <div @click="this.$store.commit('toggleLoginScreen')">Maybe later...</div>
      <div v-if="loginScreen == 'create'">
          <input type="text" v-model="email" placeholder="email address"/>
          <input type="password" v-model="password" placeholder="password"/>
          <button @click="createNewUser">CREATE USER</button>
      </div>
      <div v-if="loginScreen == 'login'">
        <input type="text" v-model="emailLogin" placeholder="email address"/>
        <input type="password" v-model="passwordLogin" placeholder="password"/>
        <button @click="loginUser">LOGIN</button>
        <div>[[message]]</div>
    </div>
  </div>

  `,

  data() {
    return {
      email: "",
      password: "",
      emailLogin: "",
      passwordLogin: "",
      loginScreen: "",
      errorMessage: "",
      successMessage: "",
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
  computed: {
    message() {
      return this.$store.state.statusMessage;
    },
  },
  created() {},
};
export { LoginOrCreateUser };
