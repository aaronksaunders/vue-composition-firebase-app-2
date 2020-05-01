import Vue from 'vue'
import VueCompositionApi from "@vue/composition-api";
Vue.use(VueCompositionApi);
import { toRefs, reactive } from "@vue/composition-api";
import firebase from "firebase";
// Required for side-effects
import "firebase/firestore";

// import FIREBASE_CONFIG
import FIREBASE_CONFIG from '../src/firebase-config.js'

// initialize firebase, this is directly from the firebase documentation
// regarding getting started for the web
if (firebase.apps.length === 0) {
  const firebaseConfig = FIREBASE_CONFIG;
  firebase.initializeApp(firebaseConfig);
}

let state = reactive({
  user: null,
  loading: true,
  error: null
});

export default function() {


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
