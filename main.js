import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'

//全局混入分享
import mixin from './utils/share.js'
Vue.mixin(mixin)

const app = new Vue({
  ...App
})
app.$mount()
  // app.use(uviewPlus)

// #endif

//引入uview
import uviewPlus from "@/uni_modules/uview-plus/index.js"
  uni.$u.config.unit = 'rpx'
// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  return {
    app
  }
}
// #endif