import App from '../App'

// const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')

const msite = r => require.ensure([], () => r(require('../page/msite/msite')), 'msite')

//user
const user = r => require.ensure([], () => r(require('../page/user/user')), 'user')
const team = r => require.ensure([], () => r(require('../page/user/team/index')), 'team')
const userinfo = r => require.ensure([], () => r(require('../page/user/userinfo')), 'userinfo')
const order = r => require.ensure([], () => r(require('../page/user/order/index')), 'order')
const commision = r => require.ensure([], () => r(require('../page/user/commision/index')), 'commision')
const commisionlog = r => require.ensure([], () => r(require('../page/user/commision/log')), 'commisionlog')
const withdraw = r => require.ensure([], () => r(require('../page/user/commision/withdraw')), 'withdraw')
const withdrawpoint = r => require.ensure([], () => r(require('../page/user/commision/withdrawpoint')), 'withdrawpoint')
const withdraw_account = r => require.ensure([], () => r(require('../page/user/commision/account')), 'withdraw_account')
const withdraw_account_add = r => require.ensure([], () => r(require('../page/user/commision/account_add')), 'withdraw_account_add')
const address = r => require.ensure([], () => r(require('../page/user/address/index')), 'address')
const address_add = r => require.ensure([], () => r(require('../page/user/address/add')), 'address_add')
const coupon = r => require.ensure([], () => r(require('../page/user/coupon')), 'coupon')
const message = r => require.ensure([], () => r(require('../page/user/message')), 'message')
const set = r => require.ensure([], () => r(require('../page/user/set')), 'set')
const qrcode = r => require.ensure([], () => r(require('../page/user/qrcode')), 'qrcode')
const balance = r => require.ensure([], () => r(require('../page/user/balance')), 'balance')
const points = r => require.ensure([], () => r(require('../page/user/point')), 'point')
const balance_withdraw = r => require.ensure([], () => r(require('../page/user/withdraw/index')), 'balance_withdraw')
const withdraw_log = r => require.ensure([], () => r(require('../page/user/withdraw/log')), 'withdraw_log')
const recharge = r => require.ensure([], () => r(require('../page/user/recharge')), 'recharge')
const orderdetail = r => require.ensure([], () => r(require('../page/user/order/detail')), 'orderdetail')
const express = r => require.ensure([], () => r(require('../page/user/order/express')), 'express')
const ordercomment = r => require.ensure([], () => r(require('../page/user/order/comment')), 'ordercomment')
const commisionlist = r => require.ensure([], () => r(require('../page/user/commision/list')), 'commisionlist')
const get_coupon = r => require.ensure([], () => r(require('../page/user/get_coupon')), 'get_coupon')
const withdraw_detail = r => require.ensure([], () => r(require('../page/user/withdraw/detail')), 'withdraw_detail')
const commision_orderinfo = r => require.ensure([], () => r(require('../page/user/commision/orderinfo')), 'commision_orderinfo')
const user_money_log = r => require.ensure([], () => r(require('../page/user/user_money_log')), 'user_money_log')
const refound = r => require.ensure([], () => r(require('../page/user/order/refound')), 'refound')
const teaminfo = r => require.ensure([], () => r(require('../page/user/team/teaminfo')), 'teaminfo')
const transfer_point = r => require.ensure([], () => r(require('../page/user/transfer_point')), 'transfer_point')
const withdrawlog = r => require.ensure([], () => r(require('../page/user/commision/withdrawlog')), 'withdrawlog')
const outh = r => require.ensure([], () => r(require('../page/login/outh')), 'outh')
const outh_setpwd = r => require.ensure([], () => r(require('../page/login/setpwd')), 'outh_setpwd')
const collect = r => require.ensure([], () => r(require('../page/user/collect')), 'collect')
const path = r => require.ensure([], () => r(require('../page/user/path')), 'path')
const order_second = r => require.ensure([], () => r(require('../page/user/order/second')), 'order_second')
const postsell = r => require.ensure([], () => r(require('../page/user/order/postsell')), 'postsell')
const confirmsell = r => require.ensure([], () => r(require('../page/user/order/confirmsell')), 'confirmsell')
const secondlist = r => require.ensure([], () => r(require('../page/user/secondlist')), 'secondlist')
const bindmobile = r => require.ensure([], () => r(require('../page/user/bindmobile')), 'bindmobile')
const serviceorder = r => require.ensure([], () => r(require('../page/user/order/service')), 'serviceorder')
const serviceorderdetail = r => require.ensure([], () => r(require('../page/user/order/service_detail')), 'serviceorderdetail')
const transfer = r => require.ensure([], () => r(require('../page/user/balance_tran')), 'transfer')
const recharge_list = r => require.ensure([], () => r(require('../page/user/rechargeList')), 'recharge_list')
const hang_sale_order = r => require.ensure([], () => r(require('../page/user/order/hang_sale')), 'hang_sale_order')
const delivery = r => require.ensure([], () => r(require('../page/user/order/delivery')), 'delivery')
const balance_log = r => require.ensure([], () => r(require('../page/user/balance_log')), 'balance_log')
const point_log = r => require.ensure([], () => r(require('../page/user/point_log')), 'point_log')
const realname_auth = r => require.ensure([], () => r(require('../page/user/realname_auth')), 'realname_auth')

const pay = r => require.ensure([], () => r(require('../page/order/pay')), 'pay')
const pay_result = r => require.ensure([], () => r(require('../page/order/pay_result')), 'pay_result')
const servicePay = r => require.ensure([], () => r(require('../page/order/pay')), 'servicePay')

const article = r => require.ensure([], () => r(require('../page/article/index')), 'article')
const notice = r => require.ensure([], () => r(require('../page/article/notice')), 'notice')
const news = r => require.ensure([], () => r(require('../page/article/news')), 'news')

const goods = r => require.ensure([], () => r(require('../page/goods/index')), 'goods')
const comment = r => require.ensure([], () => r(require('../page/goods/comment')), 'comment')
const confirmOrder = r => require.ensure([], () => r(require('../page/order/confirm_order_active')), 'confirmOrder')
const serviceDetails = r => require.ensure([], () => r(require('../page/goods/service')), 'serviceDetails')
const confirmServiceOrder = r => require.ensure([], () => r(require('../page/order/confirm_order')), 'confirmServiceOrder')
const confirm_order_wholesale = r => require.ensure([], () => r(require('../page/order/confirm_order_wholesale')), 'confirm_order_wholesale')

// search
const search = r => require.ensure([], () => r(require('../page/search/search')), 'search')
const search_goods = r => require.ensure([], () => r(require('../page/search/search_goods')), 'searchgoods')
const search_service_goods = r => require.ensure([], () => r(require('../page/search/search_goods')), 'search_service_goods')
const recommend = r => require.ensure([], () => r(require('../page/search/recommend')), 'recommend')

const category = r => require.ensure([], () => r(require('../page/category/index')), 'category')
const cart = r => require.ensure([], () => r(require('../page/cart/cart')), 'cart')
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const reg = r => require.ensure([], () => r(require('../page/reg/reg')), 'reg')
const setpwd = r => require.ensure([], () => r(require('../page/user/userinfo/set_pwd')), 'set_pwd')
const forgetpwd = r => require.ensure([], () => r(require('../page/user/forget/pwd')), 'forgetpwd')
const forgetpaypwd = r => require.ensure([], () => r(require('../page/user/forget/paypwd')), 'forgetpaypwd')

const wholesale = r => require.ensure([], () => r(require('../page/special/wholesale')), 'wholesale')
const download = r => require.ensure([], () => r(require('../page/home/download')), 'download')
const argu = r => require.ensure([], () => r(require('../page/home/argu')), 'argu')
/**
 * @time [2019-3-15]
 * 新增交易模块
 */
import TransactionRouter from './transaction'
export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
            path: '',
            redirect: '/index'
        },
        //所有商铺列表页
        {
            path: '/index',
            component: msite,
            notLogin:true
        },
        {
            path: '/category',
            component: category,
            notLogin:true
        },
        {
            path: '/cart',
            component: cart,
        },
        {
            path: '/user',
            component: user,
        },
        {
            path: '/login',
            component: login,
        },
        {
            path: '/reg',
            component: reg,
            notLogin:true
        }, {
            path: '/userinfo',
            component: userinfo,
        }, {
            path: '/search',
            component: search,
            notLogin:true
        }, {
            path: '/searchgoods',
            component: search_goods,
            notLogin:true
        },{
            path: '/team',
            component: team,
        }, {
            path: '/order',
            component: order,
        }, {
            path: '/commision',
            component: commision,
        }, {
            path: '/commisionlog',
            component: commisionlog,
        }, {
            path: '/withdraw',
            component: withdraw,
        }, {
            path: '/withdrawpoint',
            component: withdrawpoint,
        },
        {
            path: '/address',
            component: address,
        },
        {
            path: '/address_add',
            component: address_add,
        },
        {
            path: '/withdraw_account',
            component: withdraw_account,
        }, {
            path: '/withdraw_account_add',
            component: withdraw_account_add,
        }, {
            path: '/coupon',
            component: coupon,
        }, {
            path: '/message',
            component: message,
        }, {
            path: '/set',
            component: set,
        }, {
            path: '/article',
            component: article,
        }, {
            path: '/qrcode',
            component: qrcode,
        } , {
            path: '/goods',
            component: goods,
            notLogin:true
        }, {
            path: '/balance',
            component: balance,
        }, {
            path: '/points',
            component: points,
        }, {
            path: '/balance_withdraw',
            component: balance_withdraw,
        }, {
            path: '/withdraw_log',
            component: withdraw_log,
        },{
            path: '/recharge',
            component: recharge,
        },{
            path: '/pay',
            component: pay,
        },{
            path: '/pay_result',
            component: pay_result,
        },{
            path: '/confirmOrder',
            component: confirmOrder,
        },{
            path: '/orderdetail',
            component: orderdetail,
        },{
            path:'/express',
            component: express,
        },{
            path:'/ordercomment',
            component: ordercomment,
        },{
            path:'/commisionlist',
            component: commisionlist,
        },{
            path:'/getCoupon',
            component: get_coupon,
        },{
            path:'/withdraw_detail',
            component: withdraw_detail,
        },{
            path:'/commision_orderinfo',
            component: commision_orderinfo,
        },{
            path:'/user_money_log',
            component: user_money_log,
        },{
            path:'/setpwd',
            component: setpwd,
        },{
            path:'/refound',
            component: refound,
        },{
            path:'/teaminfo',
            component: teaminfo,
        },{
            path:'/comment',
            component: comment,
        },{
            path:'/forgetpwd',
            component: forgetpwd,
            notLogin:true
        },{
            path:'/forgetpaypwd',
            component: forgetpaypwd,
        },{
            path:'/transfer_point',
            component: transfer_point,
        },{
            path:'/withdrawlog',
            component: withdrawlog,
        },{
            path:'/outh',
            component: outh,
            notLogin:true
        },{
            path:'/outh_setpwd',
            component: outh_setpwd,
            notLogin:true
        },{
            path:'/notice',
            component: notice,
        },{
            path:'/collect',
            component: collect,
        },{
            path:'/path',
            component: path,
        },{
            path:'/order_second',
            component: order_second,
        },{
            path:'/postsell',
            component: postsell,
        },{
            path:'/secondlist',
            component: secondlist,
        },{
            path:'/confirmsell',
            component: confirmsell,
        },{
            path:'/bindmobile',
            component: bindmobile,
        },{
            path:'/search_service_goods',
            component: search_service_goods,
        },{
            path:'/serviceDetails',
            component: serviceDetails,
        },{
            path:'/confirmServiceOrder',
            component: confirmServiceOrder,
        },{
            path:'/serviceorder',
            component: serviceorder,
        },{
            path:'/servicePay',
            component: servicePay,
        },{
            path:'/serviceorderdetail',
            component: serviceorderdetail,
        },{
            path:'/transfer',
            component: transfer,
        },{
            path:'/wholesale',
            component: wholesale,
            notLogin:true
        },{
            path:'/recharge_list',
            component: recharge_list,
        },{
            path:'/hang_sale_order',
            component: hang_sale_order,
        },{
            path:'/delivery',
            component: delivery,
        },{
            path:'/confirm_order_wholesale',
            component: confirm_order_wholesale,
        },{
            path:'/news',
            component: news,
            notLogin:true
        },{
            path:'/balance_log',
            component: balance_log,
        },{
            path:'/point_log',
            component: point_log,
        },{
            path:'/realname_auth',
            component: realname_auth,
        },{
            path:'/download',
            component: download,
            notLogin:true
        },{
            path:'/argu',
            component: argu,
            notLogin:true
        },{
            path:'/recommend',
            component: recommend,
            notLogin:true
        },
        // 新增的页面以及路由配置规则
        // @time [2019-3-15]
        ...TransactionRouter
    ]
}]
