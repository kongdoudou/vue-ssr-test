const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');
const backendApp = new Koa();
const frontendApp = new Koa();
const backendRouter = new Router();
const frontendRouter = new Router();

const serverBundle = require(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'));
const template = fs.readFileSync(path.resolve(__dirname, '../dist/index.ssr.html'), 'utf-8');

// 根据示例
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: template,
  clientManifest: clientManifest
});

// 后端Server
// 默认先查找静态目录，查找不到的时候再找路由
backendApp.use(serve(path.resolve(__dirname, '../dist')));

// 只要用户刷新就会访问服务器
// backendRouter.get('/(.*)', (ctx, next) => {
//   console.log('ctx', ctx.url);
//   const pageId = ctx.query.pageId;
//   let context = {
//     url: ctx.url,
//     pageId
//   };
//
//   // renderToString：如果想要让css生效，只能使用回调的方式
//   // 生成返回结果
//   const ssrStream = renderer.renderToStream(context);
//   ctx.status = 200;
//   ctx.type = 'html';
//   ctx.body = ssrStream;
// });
backendRouter.get('/bar/:id', async (ctx, next) => {
  console.log('ctx', ctx.url)
    const reg = /^\d+$/;
    let pageId = ctx.params && ctx.params.id;
    pageId = reg.test(pageId) ? pageId : null
    let context = {
      url: ctx.url,
      pageId: pageId
    };
    console.log('context', context);
  ctx.body = await new Promise((resolve, reject) => {
    renderer.renderToString(context,(err, html) => {
      if(err) reject(err)
      resolve(html)
    })
  })
  ctx.status = 200;
  ctx.type = 'html';
});

backendRouter.get('/Foo', async (ctx, next) => {
  let context = {
    url: ctx.url
  };
  ctx.status = 200;
  ctx.type = 'html';
  ctx.body = await new Promise((resolve, reject) => {
    renderer.renderToString(context,(err, html) => {
      if(err) reject(err)
      resolve(html)
    })
  })
  ctx.status = 200;
  ctx.type = 'html';
});



backendApp
  .use(backendRouter.routes())
  .use(backendRouter.allowedMethods());



backendApp.listen(3000, () => {
  console.log('服务器端渲染地址： http://localhost:3000');
});

// 前端Server
// 当客户端发送请求时，会先去dist目录下查找
frontendApp.use(serve(path.resolve(__dirname, '../dist')));

frontendRouter.get('/index', (ctx, next) => {
  let html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
  ctx.type = 'html';
  ctx.status = 200;
  ctx.body = html;
});

frontendApp
  .use(frontendRouter.routes())
  .use(frontendRouter.allowedMethods());

frontendApp.listen(3001, () => {
  console.log('浏览器端渲染地址： http://localhost:3001');
});
