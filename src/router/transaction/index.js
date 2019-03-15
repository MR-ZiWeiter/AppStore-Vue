const transaction = r => require.ensure([], () => r(require('../page/transaction/index')), 'transaction')
const oderSuccess = r => require.ensure([], () => r(require('../page/transaction/oderSuccess')), 'oderSuccess')
const vip = r => require.ensure([], () => r(require('../page/user/vip/index')), 'vip')
const TransactionRouter = [
  {
    path: '/transaction',
    component: transaction,
    notLogin: true
  },
  {
    path: '/oder-success',
    component: oderSuccess,
    notLogin: true
  },
  {
    path: '/vip',
    component: vip,
    notLogin: true
  }
]
export default TransactionRouter
