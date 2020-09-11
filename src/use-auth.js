import { toRefs, reactive } from "@vue/composition-api";
import firebase from "firebase";
// Required for side-effects
import "firebase/firestore";

// initialize firebase, this is directly from the firebase documentation
// regarding getting started for the web
if (firebase.apps.length === 0) {
  const firebaseConfig = {
    /* YOUR CONFIGURATION GOES HERE */
    apiKey: "AIzaSyAlTTdjRdmEt_UCHgqY7W4CiRNTht-Mv0M",
    authDomain: "vueclass-106b7.firebaseapp.com",
    databaseURL: "https://vueclass-106b7.firebaseio.com",
    projectId: "vueclass-106b7",
    storageBucket: "vueclass-106b7.appspot.com",
    messagingSenderId: "800099862302",
    appId: "1:800099862302:web:b184f740598a80c9"
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
