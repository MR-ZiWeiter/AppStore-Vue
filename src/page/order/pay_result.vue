<template>
    <div id="pay-result">
        <head-top :go-back='true' head-title="支付结果" :customRight="true" rightTitle="关闭" :rightAction="rightAction"></head-top>
        <div class="p-a-all" v-if="orderdetail">
            <div class="box" >
                <img src="../../images/ios/pay_success@2x.png" alt="">
                <p class="title">付款成功</p>
            </div> 
             <div class="item">订单编号
                <span>{{orderdetail.order.order_no}}</span>
            </div>
            <div class="item">订单消耗
                <span>{{ orderdetail.order.order_money}}</span>
            </div>

            <div style="padding:0.5rem;">
                <div class="btn" @click="goto('/orderdetail?id='+orderid);">查看订单</div>
                <div class="btn btn-outline" @click="goto('/')">返回首页</div>
            </div>
        </div>
    </div>
</template>
<script>
import headTop from 'src/components/header/head'
import { orderDetail ,changeSale} from 'src/service/getData'
export default {
  components: { headTop },
  data() {
    return {
      orderid: null,
      orderdetail: null,
    }
  },
  beforeMount() {
    this.orderid = this.$route.query.orderid;
    this.initData()
  },
  methods: {
    goto(url){
      this.$router.push(url);
    },
    rightAction() {
      this.$router.push('/user')
    },
    async hangSale() {
      this.$vux.loading.show({ text: "处理中......" });
      let res = await changeSale(this.orderid);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
    },
    async initData () {
      if (this.orderid) {
        this.$vux.loading.show({text:'加载中'});
        let res = await orderDetail(this.orderid);
        this.$vux.loading.hide();
        let that=this;
        if (res.code == 1) {
          this.orderdetail = res.data
          if(res.data.order.is_hang_sale==1){
            this.$vux.confirm.show({
              title: '提示',
              content: '是否挂售此商品',
              onConfirm () {
                that.hangSale();
              }
            })
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#pay-result {
  .p-a-all {
    background: #eee;
    font-size: 0.3rem;
    .btn{
      width: 100%;
      background: #23b105;
      margin-bottom: 0.3rem;
      text-align: center;
      padding:0.2rem 0;
      color:#fff;
      border-radius: 0.5rem;
    }
    .btn-outline{
      background:#FFF;
      border:0.01rem solid #ddd;
      color:#333;
    }
    .box {
      margin-bottom: 1px;
      background: #fff;
      padding: 1rem 0;
      text-align: center;
      .title {
        font-size: 0.42rem;
        font-weight: bold;
        text-align: center;
      }
    }
    .item {
      padding: 0.3rem;
      background: #fff;
      margin-bottom: 1px;
      color: #666;
      span {
        padding-left: 0.5rem;
        color: #333;
      }
    }
  }
}
</style>
