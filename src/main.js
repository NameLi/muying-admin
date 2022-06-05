import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import './router/promission'//路由
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/index.css'
import './assets/styles/drag.scss'

import * as echarts from "echarts";

// json在线预览
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)

// 拖拽排序
import Sortable from 'sortablejs'
Vue.prototype.$sortable = Sortable

// element-ui
import ElementUI from 'element-ui'
Vue.use(ElementUI, { size: 'small', zIndex: 2000 })


// 图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)


/***** CUSTOM COMPONENTS START *******/
// 外层框架
import ContainerLayout from '@/components/Layout/ContainerLayout'
Vue.use(ContainerLayout)

// 主框架
import TabLayout from '@/components/Layout/TabLayout'
Vue.use(TabLayout)

// 子框架
import ChildLayout from '@/components/Layout/ChildLayout'
Vue.use(ChildLayout)

// 评论页面
import CommentPage from '@/components/Comment/CommentPage/index'
Vue.use(CommentPage)

// 相册页面
import PhotoPage from '@/components/Photo/Page/index'
Vue.use(PhotoPage)

// 影视信息预览
import MoviePopover from '@/components/Popover/MoviePopover'
Vue.use(MoviePopover)

// 演员信息预览
import ActorPopover from '@/components/Popover/ActorPopover'
Vue.use(ActorPopover)

// 用户信息预览
import RolePopover from '@/components/Popover/RolePopover'
Vue.use(RolePopover)


// 用户信息预览
import UserPopover from '@/components/Popover/UserPopover'
Vue.use(UserPopover)

// 标签组增删
import TagGroup from '@/components/MTagGroup'
Vue.use(TagGroup)

// el-Select 封装
import MSelect from '@/components/Select/MSelect'
Vue.use(MSelect)


// 远程搜索（movie/actor/role/country）
import RemoteSelect from '@/components/Select/RemoteSelect'
Vue.use(RemoteSelect)


// el-pagination 封装
import MPagination from '@/components/MPagination'
Vue.use(MPagination)

// 自定义业务按钮(el-button封装)
import MButton from '@/components/MButton'
Vue.use(MButton)

// 封装 el-input-number 设置一些默认值
import MInputNumber from '@/components/MInputNumber'
Vue.use(MInputNumber)


// 对el-table设置一些默认格式
import MTable from '@/components/MTable'
Vue.use(MTable)

// el-table-column 封装
import MTableColumn from '@/components/MTable/column'
Vue.use(MTableColumn)

// 表格中影视/演员海报图
import TablePoster from '@/components/MTable/poster'
Vue.use(TablePoster)

// 照片墙 modal
import PhotoWall from '@/components/PhotoWall'
Vue.use(PhotoWall)

// 删除 modal 
import DeleteModal from '@/components/DeleteModal'
Vue.use(DeleteModal)


// 状态 modal 
import StatusModal from '@/components/StatusModal'
Vue.use(StatusModal)

// 影评详情
import ReviewDrawer from '@/components/Review/ReviewDrawer'
Vue.use(ReviewDrawer)


// 表单
import CommonStatus from '@/components/CommonStatus'
Vue.use(CommonStatus)

// 视频播放器
import VideoPlayer from '@/components/Video/VideoPlayer'
Vue.use(VideoPlayer)

// 视频预览
import VideoPreview from '@/components/Video/VideoPreview'
Vue.use(VideoPreview)

// 封面图上传
import ImageUpload from '@/components/ImageUpload/index'
Vue.use(ImageUpload)

// 图片批量上传
import PhotoUploadModal from '@/components/PhotoUpload/index'
Vue.use(PhotoUploadModal)


// 操作历史记录
import HistoryModal from '@/components/HistoryModal/TableModal'
Vue.use(HistoryModal)

// 表单
import FormItemSwitch from '@/components/FormItemSwitch'
Vue.use(FormItemSwitch)

// 图表
import CardChart from '@/components/Card/Chart'
Vue.use(CardChart)

// 数量统计卡
import CardCount from '@/components/Card/Count'
Vue.use(CardCount)


/***** CUSTOM COMPONENTS END *******/

// 工具函数
import Util from '@/util/util'
Vue.prototype.$Util = Util


// 复制指令
import Clipboard from "./directive/Clipboard";
Vue.use(Clipboard)


// 全局方法
import globalFunc from '@/util/global';
Vue.use(globalFunc);


// 全局过滤器
import * as filters from './filters/index'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


// 路由加载动画
router.beforeEach((to, from, next) => {
  store.dispatch('app/setLoading', true)
  next();
})

router.afterEach(() => {
  store.dispatch('app/setLoading', false)
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')