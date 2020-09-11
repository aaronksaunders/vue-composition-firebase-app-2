import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    things: [],
    error: null
  },
  mutations: {
    addThing(state, payload) {
      state.things = [payload, ...state.things];
    },
    deleteThing(state, payload) {
      let newArray = state.things.filter(i => i.id !== payload);
      state.things = newArray;
    },
    loadThings: (state, payload) => {
      state.things = [...payload];
    },
    error: (state, payload) => {
      state.error = payload;
    },
    setCurrentThing: (state, payload) => {
      state.currentDocument = payload;
    }
  },
  actions: {
    loadThings: ({ commit }, payload) => {
      commit("loadThings", payload);
    },
    addThing: ({ commit }, payload) => {
      commit("addThing", payload);
    },
    deleteThing: ({ commit }, payload) => {
      commit("deleteThing", payload);
    },
    error: ({ commit }, payload) => {
      commit("error", payload);
    },
    setCurrentThing: ({ commit }, payload) => {
      commit("setCurrentThing", payload);
    }
  }
});

export default store;
