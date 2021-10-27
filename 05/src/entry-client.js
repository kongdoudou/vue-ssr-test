// 客户端渲染
// 每个用户访问服务器都要产生一个新的实例，不能所有用户都使用同一个实例
import { createApp } from './app.js';

const { app } = createApp();

// 客户端渲染可以尽心挂载
app.$mount('#app');
