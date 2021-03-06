/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let baseUrl = window.baseUrl
let routerMode = 'hash'
let imgBaseUrl = ''

if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://www.chshop.com'
} else if (process.env.NODE_ENV == 'production') {
  baseUrl = window.baseUrl
}
imgBaseUrl=baseUrl;
baseUrl=baseUrl+'/index.php?s=/appapi/'
export { baseUrl, routerMode, imgBaseUrl }
