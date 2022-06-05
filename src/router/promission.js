const _import = require('./_import_' + process.env.NODE_ENV)//引入组件方式

import router from "@/router/index"
import Layout from '@/pages/Layout'
import store from '@/store/index'

if (store.state.user.menus && Array.isArray(store.state.user.menus)) {
  const routes = store.state.user.menus
  let asyncRoutes = filterAsyncRouter(routes) //过滤路由
  let isAdd = false;
  if (!isAdd) {
    router.addRoutes(asyncRoutes)   //动态添加路由
  };

  isAdd = true
}


function filterAsyncRouter(asyncRoutes) {   //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRoutes.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {   //Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}