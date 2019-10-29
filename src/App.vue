<template>
  <div id="app">
    <div v-if="loading">LOADING...</div>
    <div v-else-if="error">{{error}}</div>
    <div v-else-if="user">
      <h2>{{user.displayName}}&nbsp;&nbsp;{{user.email}}</h2>
      <h4>
        <button @click="logout()">LOGOUT</button>
      </h4>
      <hr />
      <br />
      <ThingList collectionName="things" />
    </div>
    <div v-else>
      <LoginForm></LoginForm>
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
  name: "app",
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
