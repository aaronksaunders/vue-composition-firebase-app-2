<template>
  <div>
    <input
      v-model="username"
      type="text"
      placeholder="username"
    >
    <input
      v-model="password"
      type="password"
      placeholder="password"
    >
    <button
      :disabled="!isValid"
      @click="login"
    >
      LOGIN
    </button>
    <div
      v-if="error"
      style="background-color:red; color: white; padding : 10px; border-radius:8px"
      @click="error = null"
    >
      {{ error }}
      <div style="font-size:smaller; padding-top:12px">
        - click to clear message
      </div>
    </div>
  </div>
</template>

<script>
import useLogin from "../use-login";

export default {
  setup() {
    let state = useLogin();
    return {
      ...state
    };
  }
};
</script>

<style lang="scss" scoped>
</style>