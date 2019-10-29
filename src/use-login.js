import { toRefs, reactive, computed } from "@vue/composition-api";
import firebase from "firebase";
// Required for side-effects
import "firebase/firestore";

export default function() {
  let state = reactive({
    error: null,
    username: null,
    password: null,
    user: null
  });

  let isValid = computed(() => {
    let { username, password } = state;
    return (
      username !== null &&
      username.length !== 0 &&
      password !== null &&
      password.length !== 0
    );
  });

  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(state.username, state.password)
      .then(() => {}, error => (state.error = error))
      .catch(error => {
        // Handle Errors here.
        state.error = error;
      });
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {}, error => (state.error = error))
      .catch(error => {
        // Handle Errors here.
        state.error = error;
      });
  };

  return {
    ...toRefs(state),
    isValid,
    login,
    logout
  };
}
