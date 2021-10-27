import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const fetchBar = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('bar 组件返回 ajax 数据');
    }, 1000);
  });
};

const fetchVideo = function(id) {
  console.log(id)
  return new Promise((resolve, reject) => {
    axios.get('http://lequ-qfe.iqiyi.com/api/nc/mixin/mixinResources/4315226312?pageNum=1&pageSize=8').then(res => {
      // console.log(res);
    });
    // setTimeout(() => {
    //   resolve('bar 组件返回 ajax 数据');
    // }, 1000);
  });
};

function createStore() {
  const store = new Vuex.Store({
    state: {
      bar: ''
    },

    mutations: {
      'SET_BAR'(state, data) {
        state.bar = data;
      },
      'SET_VIDEO'(state, data) {
        state.bar = data;
      }
    },
    actions: {
      fetchBar({ commit }) {
        return fetchBar().then((data) => {
          commit('SET_BAR', data);
        }).catch((err) => {
          console.error(err);
        })
      },
      fetchVideo({ commit }, id) {
        return fetchVideo(id).then((data) => {
          commit('SET_VIDEO', data);
        }).catch((err) => {
          console.error(err);
        })
      }
    }
  });

  if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    console.log('window.__INITIAL_STATE__', window.__INITIAL_STATE__);
    store.replaceState(window.__INITIAL_STATE__);
  } else {
    console.log('no browser');
  }

  return store;
}

export default createStore;
