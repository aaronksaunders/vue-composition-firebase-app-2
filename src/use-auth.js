import { toRefs, reactive } from "@vue/composition-api";
import firebase from "firebase";
// Required for side-effects
import "firebase/firestore";

// initialize firebase, this is directly from the firebase documentation
// regarding getting started for the web
if (firebase.apps.length === 0) {
  const firebaseConfig = {
    /* YOUR CONFIGURATION GOES HERE */
  };
  firebase.initializeApp(firebaseConfig);
}

export default function() {
  let state = reactive({
    user: null,
    loading: true,
    error: null
  });

  firebase.auth().onAuthStateChanged(_user => {
    if (_user) {
      state.user = _user;
    } else {
      state.user = null;
    }
    state.loading = false;
  });

  return {
    ...toRefs(state)
  };
}
