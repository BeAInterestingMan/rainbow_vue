# rainbow_vue

## springboot+jwt+shiro+vue搭建的前端项目

### 项目技术
#### 应用了vue全家桶 vue-cli3.0 +vuex axios vue-router elementUi。

### 项目部署
 
#### 1.首先安装node和vue的基本环境，自行上网百度。
#### 2.cd 到 rainbow_vue 更目录执行命令 npm install  然后npm run serve 命令运行,下方会出现项目的地址。

### 项目预览
![Image text](https://github.com/makePromise/rainbow_vue/blob/master/src/assets/index.png)
### [更多图片](https://github.com/makePromise/rainbow_vue/tree/master/src/assets)

### 技术简单理解
#### 因为我是做后台的，所以前端学习的时候会配合后台理解一下，如果不对，请见谅。
#### 1.axios: 等同与后台的ajax 用于请求的发出。
#### 2.vuex: 你可以理解为你在系统内定义了一个唯一的变量，并且提供getset方法去更改，例如用户名之类的值，这就是vuex。
#### 3.vue-router: 前台的路由跳转，类似于后台的requestMapping.
#### 4.elementUi: 这个和舒服，不用自己写效果了，直接参考文档把需要的组件拉过来. 
#### 4.vue-cli3.0: 快速构建前台项目的脚手架. 


### 项目思路
#### 1.首先输入用户名与密码进行登入，如果成功返回一个加密的JWT密匙（同时后台把密匙存储在redis），失败的话直接返回401错误(帐号或密码不正确)。
#### 2.以后访问都要在请求头上带上这个JWT密匙，后台鉴权重写了Shiro的入口过滤器JWTFilter(BasicHttpAuthenticationFilter)，判断请求
#### Header里面是否包含Authorization字段，有就进行Shiro的Token登录认证授权(判断redis是否存在toekn密匙,不存在则失效，重新登陆)，没有就无访问
   
### 动态路由和路由卫士
#### 路由卫士：请求发出如果是白名单直接放行，否则判断token，有token则正常登陆，请求菜单放行，否则去登陆页面。
// 白名单
const whiteList = ['/login']

// 路由卫士 发出请求之前拦截
router.beforeEach((to, from, next)=> {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  }
  // 得到token密匙
 let token = db.get('token')
   // 得到用户
 let user = db.get('user')
 // 如果token和用户存在  则说明是正常登陆  放行  否则登陆
  if (token && token.length && user) {
          // 加载路由
          initMenu(router, store);
          // 放行
          next();
  } else {
    // 否则去到登陆页面;
    router.replace("/login")
  }
})
#### 动态加载菜单: 利用递归把路由格式化，利用addRouters注册路由


import db from '@/utils/localStorage'
import request from './request'
export const initMenu = (router,store) => {

   let user =db.get('user')
   //    得到菜单
   request.get(`menu/getUserMenu/${user.username}`).then(result =>{
      if(result && result.data.status == 200){
        // 格式化路由
        var fmtRoutes = formatRoutes(result.data.data);
        // 动态加载
        router.addRoutes(fmtRoutes);
        store.commit('initMenu', fmtRoutes);
      }   
   })
}
  // 路由格式转化
   export const formatRoutes = (routes)=> {
    let fmRoutes = [];
    routes.forEach(router=> {
      let {
        path,
        component,
        name,
        icon,
        children
      } = router;
     // 递归子路由
      if (children && children instanceof Array && children.length) {
        children = formatRoutes(children);
      }
      let fmRouter = {
        path: path,
        // 动态注册组件
        component(resolve){
            require(['../views' + component + '.vue'], resolve)
        },
        name: name,
        icon: icon,
        children: children
      };
      fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}
