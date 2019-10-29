<template>
  <div>
    <input type="text" placeholder="username" v-model="username" />
    <input type="password" placeholder="password" v-model="password" />
    <button @click="login" :disabled="!isValid">LOGIN</button>
    <p>{{error}}</p>
  </div>
</template>

<script>
import useLogin from "../use-login";

export default {
  setup() {
    let state = useLogin();
    return {
        ...state
    }
  }
};
</script>

<style lang="scss" scoped>
</style>