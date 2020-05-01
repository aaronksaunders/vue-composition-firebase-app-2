<template>
  <div id="app">
    <div v-if="loading">
      LOADING...
    </div>
    <div v-else-if="error">
      <div
        style="background-color:red; color: white; padding : 10px; border-radius:8px"
        @click="error = null"
      >
        {{ error }}
        <div style="font-size:smaller; padding-top:12px">
          - click to clear message
        </div>
      </div>
    </div>
    <div v-else-if="user">
      <h2>{{ user.displayName }}&nbsp;&nbsp;{{ user.email }}</h2>
      <h4>
        <button @click="logout()">
          LOGOUT
        </button>
      </h4>
      <hr>
      <br>
      <ThingList collection-name="things" />
    </div>
    <div v-else>
      <LoginForm />
    </div>
  </div>
</template>
<script>
import ThingList from "./components/ThingList.vue";
import LoginForm from "./components/LoginForm.vue";
import { computed } from "@vue/composition-api";
import useAuth from "./use-auth";
import useLogin from "./use-login";

export default {
  name: "App",
  components: {
    ThingList,
    LoginForm
  },
  setup() {
    let { user, loading, error } = useAuth();
    let loginState = useLogin();
    return {
      user,
      loading,
      error: computed(() => (loginState.error || error).value),
      logout: loginState.logout
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 60px;
}
</style>
