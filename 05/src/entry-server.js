// 服务端入口
import { createApp } from './app.js';

// 服务端渲染可以返回一个函数
export default context => {
  return new Promise((resolve, reject) => {
    // 此方法是在服务端调用的
    // app就是对应的new Vue实例，并没有被路由所管理，期望等路由跳转完成之后再进行服务端渲染
    const { app, store, router, App } = createApp();

    //
    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      Promise.all(matchedComponents.map(component => {
        if (component.asyncData) {
          return component.asyncData({ store, pageId: context.pageId });
        }
      })).then(() => {
        // 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
        context.state = store.state;

        // 返回根组件，每次都能产生一个新的应用
        resolve(app);
      });
    }, reject);
  });
}


