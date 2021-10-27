import Vue from 'vue';
import Router from 'vue-router';
import Bar from '../components/Bar.vue'
import Foo from '../components/Foo.vue'

// use完成之后内部会提供两个全局组件
Vue.use(Router);

const routerLazyLoad = filename => {
  return () => import(
    /* webpackChunkName: "[request]" */`../components/${filename}.vue`
    )
};
/*
  路由就是根据路径的不同渲染不同的组件，前端路由的两种方式，hash、history
  hash值变化的特点是hash值变化不会导致页面重新渲染，我们可以监控hash值的变化显示对应的组件（可以产生历史记录），服务端获取不到hash值所以不会404
  historyApi 问题是刷新的时候会产生404
 */

// 每个人访问服务器都需要产生一个路由系统
function createRouter() {
  const routes = [
    {
      path: '/',
      redirect: '/bar/1'
    },
    {
      path: '/bar/:id',
      component: Bar,
      name: 'bar'
    },
    {
      path: '/foo',
      component: Foo,   // 异步路由，根据路径动态加载对应的组件
      name: 'foo'
    }
  ];

  const router = new Router({
    mode: 'history',
    routes
  });

  return router;
}

export default createRouter;
