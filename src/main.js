import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import { routerMode } from './config/env'
import './config/rem'
import FastClick from 'fastclick'


import {
  XButton,
  CheckIcon,
  Checklist,
  Tab,
  TabItem,
  Checker,
  CheckerItem,
  XHeader,
  Confirm,
  Badge,
  Swiper,
  Selector,
  Actionsheet,
  XInput,
  Group,
  Flexbox, FlexboxItem,
  Popup,
  PopupHeader,
  TransferDom,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  Timeline,
  Flow, FlowState, FlowLine,
  Rater ,
  Clocker,
  Alert,
  Picker ,
} from 'vux'

Vue.component('x-button', XButton)
Vue.component('check-icon', CheckIcon)
Vue.component('check-list', Checklist)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('x-header', XHeader)
Vue.component('confirm', Confirm)
Vue.component('badge', Badge)
Vue.component('swiper', Swiper)
Vue.component('selector', Selector)
Vue.component('actionsheet', Actionsheet)
Vue.component('x-input', XInput)
Vue.component('group', Group)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('popup', Popup)
Vue.component('popup-header', PopupHeader)
Vue.directive('transfer-dom', TransferDom)
Vue.component('swipeout', Swipeout)
Vue.component('swipeout-item', SwipeoutItem)
Vue.component('swipeout-button', SwipeoutButton)
Vue.component('timeline', Timeline)
Vue.component('flow', Flow)
Vue.component('flow-state', FlowState)
Vue.component('flow-line', FlowLine)
Vue.component('rater', Rater)
Vue.component('clocker', Clocker)
Vue.component('alert', Alert)
Vue.component('picker', Picker)

import { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
import { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
import { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      FastClick.attach(document.body)
    },
    false
  )
}

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: routerMode,
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})

window.myvue = new Vue({
  router,
  store
}).$mount('#app')

String.prototype.PadLeft = function (len, charStr) {
  var s = this + ''
  return new Array(len - s.length + 1).join(charStr, '') + s
}
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  window.myvue.$root.$children[0].showlogin = false
  if (toIndex) {
    if (
      !fromIndex ||
      parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
      (toIndex === '0' && fromIndex === '0')
    ) {
      store.commit('UPDATE_DIRECTION', { direction: 'forward' })
    } else {
      store.commit('UPDATE_DIRECTION', { direction: 'reverse' })
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('UPDATE_DIRECTION', { direction: 'forward' })
  }
  next()
})
