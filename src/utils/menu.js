
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