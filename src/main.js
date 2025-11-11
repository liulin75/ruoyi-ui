import Vue from 'vue'

import Cookies from 'js-cookie'

// import Element from 'element-ui'
// import Element from 'element-ui/lib/element-ui.common.js'
import Element from 'element-ui/lib/element-ui.common.js'  // 👈 不会自动引入CSS
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/arco-theme.scss'
import '@/assets/styles/arco-reset.scss'
import '@/assets/styles/arco-layout.scss'
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/styles/reset.scss'                         // 重置HTML样式
import '@/assets/styles/app.scss'                           // 全局样式
import '@/assets/styles/el-ui.scss'                         // 优化 Element 样式
import '@/assets/styles/mobile.scss'                        // 移动端样式优化
import '@/assets/styles/change.scss'                        // 主题切换过渡优化
import '@/assets/styles/theme-animation.scss'               // 主题切换动画
import '@/assets/styles/el-dark.scss'                       // Element 暗黑主题
import '@/assets/styles/dark.scss'                          // 系统主题
// import '@icons/system/iconfont.css'                 // 系统图标
// import '@utils/sys/console.ts'                      // 控制台输出内容
import "@/assets/styles/variables.scss"                     // 全局变量
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data"
import { getConfigKey } from "@/api/system/config"
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi"
// 分页组件
import Pagination from "@/components/Pagination"
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 字典数据组件
import DictData from '@/components/DictData'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
