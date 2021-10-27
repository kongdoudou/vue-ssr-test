import Vue from 'vue';
import createStore from './store/store.js';
import createRouter from './router';
import App from './App.vue';

// 入口改装成了函数，目的是服务端渲染的时候每次都可以通过这个工厂函数返回一个応的实例，保证每个人访问都可以拿到一个自己的实例
export function createApp() {
  const store = createStore();
  const router = createRouter();

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, store, router, App };
}
