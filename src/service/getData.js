import fetch from '../config/fetch'
import { getStore, getTimeStamp } from '../config/mUtils'

// const device_type = getStore('device_type');

// //用户的优惠券列表
// export const GetShopCouponList = () => fetch('/api/Coupon/GetShopCouponList', {}, 'get')
// //取消订单
// export const PostCloseOrder = (orderid) => fetch('/api/MemberOrder/PostCloseOrder', { orderid }, 'post')

//获取商品分类
export const goodsCategoryList = () => fetch('goods/goodsCategoryList', {}, 'post')

//获取用户信息
export const userinfo = () => fetch('user/getUserInfo', {}, 'post')
//获取用户信息
export const getUser = () => fetch('user/user', {}, 'post')

//登陆
export const login = (username, password,device_type) => fetch('login/login', { username, password, device_type }, 'post')
//用户退出
export const logout = () => fetch('login/logout', {}, 'post')
//注册
export const register = (username, mobile, password, vertification, pid,device_type) => fetch('Register/register', { username, mobile, password, vertification, pid, device_type }, 'post')
//手机注册时发送手机验证码
export const sendSmsRegisterCode = (mobile) => fetch('Register/sendSmsRegisterCode', { mobile }, 'post')

//现金积分日志
export const getBalanceLog = (type, page = 1) => fetch('user/getBalanceLog', { type, page }, 'post')
//现金提现
export const toWithdraw = (type, bank_account_id, cash) => fetch('user/toWithdraw', { type, bank_account_id, cash }, 'post')
//提现账号
// export const UserAccount = (type, realname, mobile, account_type, account_type_name, account_number, branch_bank_name, id) => fetch('user/UserAccount', { type, realname, mobile, account_type, account_type_name, account_number, branch_bank_name, id }, 'post')
//余额提现记录
export const balancewithdraw = (page = 1) => fetch('user/balancewithdraw', { page }, 'post')

//创建充值订单
export const createRechargeOrder = (recharge_money) => fetch('user/createRechargeOrder', { recharge_money }, 'post')
//获取订单信息
export const getpayvalue = (out_trade_no) => fetch('Pay/getpayvalue', { out_trade_no }, 'post')

//搜索商品列表
export const goodsSearchList = (sear_name = '', page = 1, st = '', controlType = '', obyzd = '',no_point='') => fetch('goods/goodsSearchList', { page, sear_name, sear_type: 1, st, controlType, obyzd ,no_point}, 'post')
//商品详情
export const goodsdetail = (id) => fetch('goods/goodsdetail', { id }, 'post')
//生成订单信息
export const paymentOrder = (sku_id, num) => fetch('Order/paymentOrder', { sku_id, num }, 'post')
export const cartpaymentOrder = (tag, cart_id) => fetch('Order/paymentOrder', { tag, cart_id }, 'post')
//创建订单
export const orderCreate = (goods_sku_list, leavemessage, paypwd,shipping_company_id, integral, account_balance,use_coupon, address = 0) => fetch('Order/orderCreate', { goods_sku_list, leavemessage, paypwd, pay_type: 0, address,shipping_company_id, integral, account_balance,use_coupon,address }, 'post')


//提交线下凭证
export const AddTransaction = (out_trade_no, transaction_id, path,pay_type,type) => fetch('Order/AddTransaction', { out_trade_no, transaction_id, path ,pay_type,type}, 'post')

//订单详情
export const orderDetail = (orderId) => fetch('Order/orderDetail', { orderId }, 'post')
//订单列表
export const myOrderList = (status = 'all', page = 1) => fetch('Order/myOrderList', { status, page }, 'post')

//确认收货
export const orderTakeDelivery = (order_id) => fetch('Order/orderTakeDelivery', { order_id }, 'post')
//添加评价
export const addgoodsevaluate = (order_id, order_no, goodsEvaluate) => fetch('Order/addgoodsevaluate', { order_id, order_no, goodsEvaluate }, 'post')
//追加评价
export const addgoodsevaluateagain = (order_id, goodsEvaluate) => fetch('Order/addgoodsevaluateagain', { order_id, goodsEvaluate }, 'post')
//删除订单
export const deleteOrder = (order_id) => fetch('Order/deleteOrder', { order_id }, 'post')
//关闭订单
export const orderClose = (order_id) => fetch('Order/orderClose', { order_id }, 'post')
//物流信息
export const orderExpress = (orderid) => fetch('Order/orderExpress', { orderid }, 'post')

//搜索商品
export const goodsList = (category_id, page = 1, obyzd, st, mipe, mape, attr, brand_id, wholesale = 0) => fetch('goods/goodsList', { category_id, page, obyzd, st, mipe, mape, attr, brand_id, wholesale }, 'post')

//首页
export const indexpage = (id) => fetch('index/goodsData', { id }, 'post')
//添加到购物车
export const addCart = (cart_detail) => fetch('Cart/addCart', { cart_detail }, 'post')
//购物车列表
export const cartList = () => fetch('Cart/Cart', {}, 'post')
//删除购物车商品
export const cartDelete = (cart_id) => fetch('Cart/cartDelete', { cart_id }, 'post')
//修改购物车数量
export const cartAdjustNum = (cartid, num) => fetch('Cart/cartAdjustNum', { cartid, num }, 'post')

//获取省列表
export const getProvince = () => fetch('index/getProvince', {}, 'post')
//获取城市列表
export const getCity = (province_id) => fetch('index/getCity', { province_id }, 'post')
//获取区域地址
export const getDistrict = (city_id) => fetch('index/getDistrict', { city_id }, 'post')
//添加修改地址
export const addOrSetAddress = (consigner, mobile, province, city, district, address, zip_code, type, id) => fetch('user/addOrSetAddress', { consigner, mobile, province, city, district, address, zip_code, type, id }, 'post')
//获取用户地址
export const getUserAddress = (type = 2, id) => fetch('user/getUserAddress', { type, id }, 'post')
//删除地址
export const delAddress = (id) => fetch('user/delAddress', { id }, 'post')
//默认地址
export const defaultAddress = (type = 'get', id) => fetch('user/defaultAddress', { type, id }, 'post')

//提现账号添加获取
export const UserAccount = (type, id, realname, mobile, account_type, account_type_name, account_number, branch_bank_name) => fetch('user/UserAccount', { type, id, realname, mobile, account_type, account_type_name, account_number, branch_bank_name }, 'post')
//获取设置默认提现账号
export const defaultAccount = (type = 'get', id) => fetch('user/defaultAccount', { type, id }, 'post')
//删除提现账号
export const delAccount = (id) => fetch('user/delAccount', { id }, 'post')
//更新提现账号
export const updateAccount = (id, realname, mobile, account_type, account_type_name, account_number, branch_bank_name) => fetch('user/updateAccount', { id, realname, mobile, account_type, account_type_name, account_number, branch_bank_name }, 'post')

//我的团队
export const teamlist = () => fetch('user/teamlist', {}, 'post')
//佣金首页
export const getCommission = () => fetch('commission/getCommission', {}, 'post')
//佣金记录
export const getCommissionDetail = (type_id, page = 1) => fetch('commission/getCommissionDetail', { type_id, page }, 'post')
//个人中心优惠券列表
export const getUidCoupon = (page_index = 1) => fetch('promotion/getUidCoupon', { page_index }, 'post')
//佣金明细
export const commissionindex = (page = 1) => fetch('commission/index', { page }, 'post')
//提现记录
export const ajaxUserCommissionWithdraw = (page = 1) => fetch('commission/ajaxUserCommissionWithdraw', { page }, 'post')

//提现详情
export const getWithdrawLog = (id, type) => fetch('user/getWithdrawLog', { id, type }, 'post')
//
export const userAccountRecordsOrderDetail = (type_alis_id, type) => fetch('user/userAccountRecordsOrderDetail', { type_alis_id, type }, 'post')
//余额变动详情
export const getBalanceDetail = (id) => fetch('user/getBalanceDetail', { id }, 'post')
//修改密码
export const editPassword = (oldpassword, newpassword, password) => fetch('user/editPassword', { oldpassword, newpassword, password }, 'post')
//修改支付密码
export const editPayPassword = (oldpaypassword, paypassword, newpaypassword) => fetch('user/editPayPassword', { oldpaypassword, paypassword, newpaypassword }, 'post')
//修改支付密码
export const addPayPassword = (paypassword, newpaypassword) => fetch('user/addPayPassword', { paypassword, newpaypassword }, 'post')
//查询包裹物流信息
export const getOrderGoodsExpressMessage = (express_id) => fetch('Order/getOrderGoodsExpressMessage', { express_id }, 'post')

//订单退款信息
export const refundDetail = (order_goods_id) => fetch('Order/refundDetail', { order_goods_id }, 'post')
//申请退款
export const orderGoodsRefundAskfor = (order_id, order_goods_id, refund_type, refund_reason, refund_require_money) => fetch('Order/orderGoodsRefundAskfor', { order_id, order_goods_id, refund_type, refund_reason, refund_require_money }, 'post')
//退货
export const orderGoodsRefundExpress = (order_id, order_goods_id, refund_express_company, refund_shipping_no, refund_reason) => fetch('Order/orderGoodsRefundExpress', { order_id, order_goods_id, refund_express_company, refund_shipping_no, refund_reason }, 'post')

//用户和领取的优惠券列表
export const getCouponList = (page = 1) => fetch('goods/getCouponList', { page }, 'post')
//用户和领取的优惠券列表
export const getCoupon = (coupon_type_id) => fetch('goods/getCoupon', { coupon_type_id }, 'post')

//获取文章
export const getAdminArticle = (title) => fetch('article/getAdminArticle', { title }, 'post')
//团队会员详情
export const getTeamOrderInfo = (id) => fetch('user/getTeamOrderInfo', { id }, 'post')
//评论列表
export const goodsEvaluateList = (goods_id, comments_type, page = 1, size = 10) => fetch('goods/goodsEvaluateList', { goods_id, comments_type, page, size }, 'post')

//找回登陆密码
export const forget_pwd = (mobile, verification, onepassword, twopassword) => fetch('forget/password', { mobile, verification, onepassword, twopassword }, 'post')
//找回登陆密码短信
export const forget_pwd_sms = (mobile) => fetch('forget/sendpwd', { mobile }, 'post')
//重置支付密码短信
export const forget_paypwd_sms = (mobile) => fetch('forget/sendpaypwd', { mobile }, 'post')
//重置支付密码
export const forgetpaypwd = (mobile, verification) => fetch('forget/forgetpaypwd', { mobile, verification }, 'post')

//获取佣金提现信息
export const getCointWithdrawInfo = () => fetch('user/getCointWithdrawInfo', {}, 'post')
//佣金提现提交
export const addCointowithdraw = (bank_account_id, cash) => fetch('user/addCointowithdraw', { bank_account_id, cash }, 'post')
//二维码
export const getQrcode = () => fetch('user/getQrcode', {}, 'post')
//转积分
export const UserAccountexchange = (type = 'get') => fetch('user/UserAccountexchange', { type }, 'post')
//转积分
export const addAccountexchange = (money) => fetch('user/addAccountexchange', { money }, 'post')
//获取转账信息
export const transferAccounts = (type = 'get', num, realname, account, password) => fetch('user/transferAccounts', { type, num, realname, account, password }, 'post')

//h5微信支付
export const wchatPay = (no) => fetch('Pay/wchatPay', { no }, 'post')
//微信支付
export const companyPaymentpx = (out_trade_no) => fetch('Pay/companyPaymentpx', { out_trade_no }, 'post')
//支付宝
export const companyPaymenttail = (out_trade_no) => fetch('Pay/companyPaymenttail', { out_trade_no }, 'post')
//获取团队订单
export const getTeamOrderList = (id, status, page,type) => fetch('user/getTeamOrderList', { id, status, page,type }, 'post')
//第三方登陆
export const oauthLogin = (type, openid, unionid) => fetch('login/oauthLogin', { type, openid, unionid }, 'post')
//发送绑定短信
export const sendSmsBindMobile = (mobile) => fetch('register/sendSmsBindMobile', { mobile }, 'post')
//绑定
// export const oauthBindLogin = (mobile,code,device_type,qq_openid,qq_info) => fetch('Login/oauthBindLogin', {mobile,code,device_type,qq_openid,qq_info}, 'post')
export const qq_oauthBindLogin = (mobile, code, device_type, qq_openid, qq_info, password,pid) => fetch('Login/oauthBindLogin', { mobile, code, device_type, qq_openid, qq_info, password,pid }, 'post')
export const wx_oauthBindLogin = (mobile, code, device_type, wx_openid, wx_info, unionid, password,pid) => fetch('Login/oauthBindLogin', { mobile, code, device_type, wx_openid, wx_info, unionid, password,pid }, 'post')
//修改用户信息
export const editUserInfo = (type, value, code) => fetch('user/editUserInfo', { type, value, code }, 'post')
//获取公告
export const getNotice = (id = '') => fetch('index/getNotice', { id }, 'post')
//获取文章
export const getArticle = (article_id = '', class_id = '') => fetch('Article/getArticle', { article_id, class_id }, 'post')
export const getArticleList = (page = 1, size = '20') => fetch('Article/getArticle', { page, size }, 'post')
//添加收藏
export const FavoritesGoodsorshop = (fav_id, fav_type, log_msg) => fetch('Goods/FavoritesGoodsorshop', { fav_id, fav_type, log_msg }, 'post')
//删除收藏
export const cancelFavorites = (fav_id, fav_type) => fetch('Goods/cancelFavorites', { fav_id, fav_type }, 'post')
//我的收藏
export const myCollection = (page = 1, type = 0) => fetch('Goods/myCollection', { page, type }, 'post')
//我的足迹
export const newMyPath = (category_id, page_index, page_size = 10) => fetch('Goods/newMyPath', { category_id, page_index, page_size }, 'post')
//删除我的足迹
export const delMyPath = (type, value) => fetch('Goods/delMyPath', { type, value }, 'post')
//二次转售列表
export const userResellerOrderList = (tostatus, page) => fetch('Order/userResellerOrderList', { tostatus, page, page_size: 10 }, 'post')
//转卖商品需要的详细信息(用于设置出售价钱和备注信息)
export const getOrderGoods = (order_id) => fetch('Order/getSecondGoods', { order_id }, 'post')
//二手市场
export const ResellerOrderList = (page) => fetch('Index/ResellerOrderList', { page, tostatus: 1 }, 'post')
//app配置
export const getAppConfig = () => fetch('Index/getAppConfig', {}, 'get')
//设置转售
export const postToMoney = (order_id, price, memo) => fetch('Order/postToMoney', { order_id, price, memo }, 'post')
//取消转售
export const getCancel = (order_id) => fetch('Order/getCancel', { order_id }, 'post')
//转售给某人提交表单
export const addreseller = (mobile, real_name, order_id) => fetch('order/addreseller', { mobile, real_name, order_id }, 'post')
//发送手机验证码
export const sendPhoneSms = (mobile) => fetch('user/sendPhoneSms', { mobile }, 'post')
//服务商品列表
export const serviceList = (category_id, page = 1, obyzd, st, mipe, mape, attr, brand_id) => fetch('services/goodsList', { category_id, page, obyzd, st, mipe, mape, attr, brand_id }, 'post')
//服务商品详情
export const serviceDetail = (goods_id) => fetch('services/goodsdetail', { goods_id }, 'post')
//搜索服务商品列表
export const serviceSearchList = (sear_name = '', page = 1, st = '', controlType = '', obyzd = '') => fetch('services/goodsSearchList', { page, sear_name, sear_type: 1, st, controlType, obyzd }, 'post')
//立即购买进入待支付页面所需要的数据
export const servicePaymentOrder = (sku_id, num) => fetch('Servicesorder/paymentOrder', { sku_id, num, tag: 'buy_now' }, 'post')
//支付接口,创建订单
export const serviceOrderCreate = (goods_sku_list, address, leavemessage, integral, account_balance, use_coupon, shipping_company_id, paypwd) => fetch('Servicesorder/orderCreate', { goods_sku_list, address, leavemessage, integral, account_balance, use_coupon, shipping_company_id, paypwd, pay_type: 0, address: 0 }, 'post')
//提交线下凭证
export const serviceAddTransaction = (out_trade_no, transaction_id, path) => fetch('servicesOrder/AddTransaction', { out_trade_no, transaction_id, path }, 'post')
//订单列表
export const myServiceOrderList = (status = 'all', page = 1) => fetch('servicesorder/myOrderList', { status, page }, 'post')
//删除订单
export const deleteServiceOrder = (order_id) => fetch('servicesorder/deleteOrder', { order_id }, 'post')
//关闭订单
export const serviceOrderClose = (order_id) => fetch('servicesorder/orderClose', { order_id }, 'post')
//服务订单详情
export const serviceOrderDetail = (orderId) => fetch('servicesorder/orderDetail', { orderId }, 'post')
//确认收货
export const serviceOrderTakeDelivery = (order_id) => fetch('servicesorder/orderTakeDelivery', { order_id }, 'post')
//添加评价
export const addServiceGoodsEvaluate = (order_id, order_no, goodsEvaluate) => fetch('servicesorder/addgoodsevaluate', { order_id, order_no, goodsEvaluate }, 'post')
//追加评价
export const addServiceGoodsEvaluateAgain = (order_id, goodsEvaluate) => fetch('servicesorder/addGoodsEvaluateAgain', { order_id, goodsEvaluate }, 'post')
//评论列表
export const serviceEvaluateList = (goods_id, comments_type, page = 1, size = 10) => fetch('services/goodsEvaluateList', { goods_id, comments_type, page, size }, 'post')
//订单退款信息
export const serviceRefundDetail = (order_goods_id) => fetch('servicesorder/refundDetail', { order_goods_id }, 'post')
//申请退款
export const serviceGoodsRefundAskfor = (order_id, order_goods_id, refund_type, refund_reason, refund_require_money) => fetch('servicesorder/orderGoodsRefundAskfor', { order_id, order_goods_id, refund_type, refund_reason, refund_require_money }, 'post')
//退货
export const serviceGoodsRefundExpress = (order_id, order_goods_id, refund_express_company, refund_shipping_no, refund_reason) => fetch('servicesorder/orderGoodsRefundExpress', { order_id, order_goods_id, refund_express_company, refund_shipping_no, refund_reason }, 'post')

//转账
export const transferBalance = (to, num, pwd) => fetch('user/transferBalance', { to, num, pwd }, 'post')

//首页数据
export const indexData = () => fetch('index/indexData', {}, 'post')

//充值记录
export const rechargeList = (page) => fetch('user/rechargeList', { page }, 'post')

//获取批发区正在进行中的商品
export const WholesaleGoodsList = (page) => fetch('goods/WholesaleGoodsList', { page }, 'post')

//充值记录
export const WholesaleSoon = (page) => fetch('goods/WholesaleSoon', { page }, 'post')

//订单挂售
export const changeSale = (order_id) => fetch('goods/changeSale', { order_id }, 'post')

//订单挂售列表
export const getGuaShouList = (is_hang_sale = '', page) => fetch('order/getGuaShouList', { is_hang_sale, page }, 'post')

//获取运费
export const getGoodsExpress = (goods_id) => fetch('goods/getGoodsExpress', { goods_id }, 'post')

//订单撤回
export const undoSale = (order_id) => fetch('goods/undoSale', { order_id }, 'post')

//实名认证
export const addAuth = (realname,idcard,path_face,path_con) => fetch('user/addAuth', { realname,idcard,path_face,path_con }, 'post')
export const getAuth = () => fetch('user/getAuth', { }, 'post')

//推荐商品
export const getGoodsList = (page_index) => fetch('goods/getGoodsList', { page_index }, 'post')
//获取地址总列表
export const getAddressAll = () => fetch('index/getAddressAll', {}, 'get')