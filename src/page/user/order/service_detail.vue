<template>
  <div id="set">
    <head-top :go-back='true' head-title="订单详情" :rightMenu="true"></head-top>
    <div class="buttons">
      <div v-if="info.order_status!=5&&service.value&&service.value.web_phone" ><a :href="'tel:'+service.value.web_phone">拨打电话</a> </div>
      <div v-if="(info.order_status==4||info.order_status==3)&&info.is_evaluate==0" @click="goto('/ordercomment?id='+info.order_id)">我要评价</div>
      <div v-if="(info.order_status==4||info.order_status==3)&&info.is_evaluate==1" @click="goto('/ordercomment?id='+info.order_id)">追加评价</div>
      <div v-if="info.order_status==2" @click="take_show=true;">确认收货</div>
      <div v-if="info.order_status==0" @click="closeOrder()">关闭订单</div>
      <div v-if="info.order_status==5" @click="delOrder()">删除订单</div>
      <div v-if="info.order_status==0" @click="pay()">付款</div>
    </div>
    <div class="p-a-all">
      <div class="top">
        <p class="price font-size-18 font-bold">{{info.status_name}}</p>
        <p>订单号 : {{info.order_no}}</p>
        <p>下单时间 : {{info.create_time|date}}</p>
        <p v-if="express.express_name">快递公司 : {{express.express_name}}</p>
        <p v-if="express.express_code">快递单号 : {{express.express_code}}</p>
      </div>
      <div class="packet " v-if="info.goods_packet_list&&info.is_show_express_code">
        <p class="title">物流包裹</p>
        <div class="item flex-box" v-for="(item,index) in info.goods_packet_list" :key="index">
          <span>{{item.express_name}} : {{item.express_code}}</span>
          <span class="btn" @click="goto('/express?id='+item.express_id)">查看物流</span>
        </div>
      </div>
      <div class="info">
        <div style="border-bottom:1px solid #ccc;">
          <p>收件人 : {{info.receiver_name}} {{info.receiver_mobile}}</p>
          <p class="text-color-666" v-html="info.address"></p>
        </div>
        <div>
          <p>买家留言 : {{info.buyer_message}}</p>
        </div>
      </div>
      <div class="goods flex-box" v-for="(item,key) in info.order_goods" :key="key" @click="goto('/serviceDetails?id='+item.goods_id)">
        <img :src="item.picture_info.pic_cover_small" alt="" :onerror="local_default_goods_img">
        <div>
          <p class="ellipsis">{{item.goods_name}}</p>
          <p class="font-size-12 text-color-999">{{item.sku_name}}</p>
          <p class="price">￥{{item.price}}</p>
          <p class="font-size-12 text-color-999">x{{item.num}}</p>
        </div>
      </div>
      <div class="flex-box title">
        <p>商品总价</p>
        <span>￥
          <span class="price">{{info.order_money}}</span>
        </span>
      </div>
      <div class="flex-box title" v-if="info.coupon_money>0">
        <p>优惠券</p>
        <span>-￥
          <span class="price">{{info.coupon_money}}</span>
        </span>
      </div>
      <div class="flex-box title">
        <p>实际需支付</p>
        <span>￥
          <span class="price">{{info.pay_money}}</span>
        </span>
      </div>
      
    </div>
    <div v-transfer-dom>
      <confirm v-model="take_show" @on-confirm="take" :title="'确定收到货了吗?'">
      </confirm>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import {
  serviceOrderDetail,
  serviceOrderTakeDelivery,
  deleteServiceOrder,
  serviceOrderClose
} from "src/service/getData";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      take_show: false,
      express: {},
      info: {},
      service:{},
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    tel(){

    },
    goto(url) {
      this.$router.push(url);
    },
    pay(out_trade_no) {
      this.$router.push("/pay?id=" + this.info.out_trade_no);
    },
    async delOrder() {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await deleteServiceOrder(this.info.order_id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    },
    async closeOrder() {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await serviceOrderClose(this.info.order_id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.getInfo();
        }, 2000);
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await serviceOrderDetail(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.express = {
          express_code: res.data.express_code,
          express_name: res.data.express_name
        };
        this.info = res.data.order;
        this.service=res.data.list;
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        });
      }
    },
    async take() {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await serviceOrderTakeDelivery(this.info.order_id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.getInfo();
        }, 2000);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
#set {
  .packet {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 0.2rem;
    .title {
      padding: 0 0 0.2rem 0 !important;
    }
    .item {
      padding: 0.2rem 0;
      border-bottom: 1px solid #ccc;
    }
    .btn {
      color: #333;
      border: 1px solid #999;
      border-radius: 0.1rem;
      margin-left: 0.15rem;
      padding: 0.1rem 0.2rem;
      font-size: 0.24rem;
      box-shadow: 3px 3px 0 0 #ded6d6;
    }
  }
  .buttons {
    position: absolute;
    width: 100%;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 1rem;
    padding: 0 0.3rem;
    div {
      font-size: 0.26rem;
      color: #333;
      border: 1px solid #999;
      border-radius: 0.1rem;
      margin-left: 0.15rem;
      padding: 0.2rem 0.3rem;
      box-shadow: 3px 3px 0 0 #ded6d6;
    }
  }
  .p-a-all {
    top: 1rem;
    bottom: 1rem;
    background: #eee;
    border-bottom: 1px solid #ccc;
    .title {
      padding: 0.1rem 0.3rem;
      background: #fff;
      > span {
        font-size: 0.24rem;
        color: #666;
      }
    }
    .top {
      padding: 0.2rem 0.3rem;
      background: #fff;
      margin-bottom: 0.2rem;
      display: flex;
      flex-wrap: wrap;
      p {
        width: 100%;
      }
    }
    .info {
      padding: 0.2rem 0.3rem;
      background: #fff;
      margin-bottom: 0.2rem;
      display: flex;
      flex-wrap: wrap;
      div {
        width: 100%;
      }
      p {
        padding: 0.05rem 0;
      }
    }

    .goods {
      background: #fff;
      padding: 0.2rem 0.3rem;
      margin-bottom: 1px;
      p {
        font-size: 0.28rem;
      }
      img {
        width: 1.5rem;
        height: 1.5rem;
        background: #eee;
      }
      div {
        width: calc(100% - 2rem);
        text-align: right;
      }
    }
  }
}
</style>


