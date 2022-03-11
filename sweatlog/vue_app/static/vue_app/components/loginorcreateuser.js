let LoginOrCreateUser = {
  delimiters: ["[[", "]]"], //default of brackets collides with Django syntax
  template: /*html*/ `
  <div id="login-page">
    <div id="login-header">Please login or create a new user below.</div>
    <div id="login-page-buttons">
      <button @click="loginScreen = 'login'" @click="preServerMessage = ''" @click="this.$store.commit('clearMessageData')">LOGIN</button>
      <button @click="loginScreen = 'create'" @click="preServerMessage = ''" @click="this.$store.commit('clearMessageData')">CREATE USER</button>
    </div>
      <div class="login-option" v-if="loginScreen == 'create'">
          <input type="text" v-model="email" v-on:keyup="checkEmail" @click="selectAll($event)" placeholder="email address"/>
          <input type="password" v-model="password" v-on:keyup="validatePasswords" @click="selectAll($event)" placeholder="password"/>
          <input type="password" v-model="passwordConfirm" v-on:keyup="validatePasswords" @click="selectAll($event)" placeholder="confirm password"/>
          <button @click="createNewUser">SUBMIT</button>
          <div class="alert-message">[[preServerMessage]]</div>
          <div class="alert-message">[[message]]</div>
          <div>[[debounceID]]</div>
      </div>
      <div class="login-option" v-if="loginScreen == 'login'">
        <input type="text" v-model="emailLogin" v-on:keyup="checkEmail" @click="selectAll($event)" placeholder="email address"/>
        <input type="password" v-model="passwordLogin" @click="selectAll($event)" placeholder="password"/>
        <button @click="loginUser">SUBMIT</button>
        <div class="alert-message">[[preServerMessage]]</div>
        <div class="alert-message">[[message]]</div>
  </div>
    </div>

  </div>

  `,

  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: "",
      emailLogin: "",
      passwordLogin: "",
      loginScreen: "",
      preServerMessage: "",
      debounceID: null,
    };
  },
  methods: {
    checkEmail(event) {
      // clear out the debounce ID and replace with a new one whenever there is a keyup
      if (this.debounceID) {
        clearTimeout(this.debounceID);
        this.debounceID = null;
      }
      let email = event.target.value;
      this.debounceID = setTimeout(() => {
        if (!validateEmail(email)) {
          this.setMessage("please enter a valid email", 3000);
        }
      }, 2000);
    },
    validatePasswords() {
      // clear out the debounce ID and replace with a new one whenever there is a keyup
      if (this.debounceID) {
        clearTimeout(this.debounceID);
        this.debounceID = null;
      }

      this.debounceID = setTimeout(() => {
        if (this.password != this.passwordConfirm) {
          this.setMessage("passwords don't match", 3000);
        }
      }, 3000);
    },
    setMessage(message, timeout) {
      this.preServerMessage = message;
      setTimeout(() => {
        this.preServerMessage = "";
      }, timeout);
    },
    createNewUser() {
      if (validateEmail(this.email) || this.password == this.passwordConfirm) {
        const body = {
          email: this.email,
          password: this.password,
        };

        this.$store.dispatch("createNewUser", { body });
      }
    },
    loginUser() {
      if (validateEmail(this.emailLogin)) {
        const body = {
          email: this.emailLogin,
          password: this.passwordLogin,
        };

        this.$store.dispatch("loginUser", { body });
      }
    },
    selectAll(e) {
      e.srcElement.select();
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
