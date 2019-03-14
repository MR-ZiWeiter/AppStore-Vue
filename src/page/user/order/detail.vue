<template>
  <div id="detail">
    <head-top :go-back='true' head-title="订单详情" :rightMenu="true"></head-top>
    <div class="p-a-all" v-if="info.buyer_id">
      <div class="flex-box title m-b">
        <p>交易状态</p>
        <p class="price">{{info.is_hang_sale?setStatusName(info.is_hang_sale):info.status_name}}</p>
      </div>

      <div class="packet " v-if="info.goods_packet_list.length>0 && is_show_express_code ">
        <p class="title">物流包裹</p>
        <div class="item flex-box" v-for="(item,index) in info.goods_packet_list" :key="index">
          <span>{{item.express_name}} : {{item.express_code}}</span>
          <span class="btn" @click="goto('/express?id='+item.express_id)">查看物流</span>
        </div>
      </div>
      <div class="info" v-if="info.is_hang_sale==0&&info.receiver_mobile">
        <div style="border-bottom:1px solid #ccc;">
          <p>收件人 : {{info.receiver_name}} {{info.receiver_mobile}}</p>
          <p class="text-color-666" v-html="info.address"></p>
        </div>
        <div>
          <p>买家留言 : {{info.buyer_message}}</p>
        </div>
      </div>
      <div class="goods flex-box" v-for="(item,key) in info.order_goods" :key="key" >
        <img :src="item.picture_info.pic_cover_small" alt="" :onerror="local_default_goods_img" @click="goto('/goods?id='+item.goods_id)">
        <div>
          <p @click="goto('/goods?id='+item.goods_id)" class="ellipsis">{{item.goods_name}}</p>
          <p @click="goto('/goods?id='+item.goods_id)" class="font-size-12 text-color-999">{{item.sku_name}}</p>
          <p @click="goto('/goods?id='+item.goods_id)" class="font-size-12">
            <span class="font-size-15 font-bold">￥{{item.price}}</span></p>
          <p @click="goto('/goods?id='+item.goods_id)" class="font-size-12 text-color-999">x{{item.num}}</p>
          <!-- <div class="refound_buttons">
            <div v-if="(info.order_status==1||info.order_status==2)&&item.refund_status==0" @click="goto('/refound?id='+item.order_goods_id)">退款/退货</div>
            <div v-if="item.refund_status!=0" @click="goto('/refound?id='+item.order_goods_id)">{{item.status_name}}</div>
          </div> -->
        </div>
      </div>
      <div class="flex-box title">
        <p>订单总额 (含运费)</p>
        <span>
          <span class="price">
            <span class="font-size-15 font-bold price">{{info.order_money}}</span>
          </span>
          <span class="price" v-if="info.is_wholesale">
            +
            <span class="font-size-13 font-bold price">{{info.point}}</span> {{appConfig.word?appConfig.word.point:'积分'}}</span>
        </span>

      </div>
      <div class="flex-box title" v-if="info.user_platform_money>0">
        <p>余额支付</p>
        <span>
          <span class="price">
            <span class="font-size-15 font-bold price">￥{{info.user_platform_money}}</span>
          </span>
        </span>
      </div>
      <div class="flex-box title" v-if="info.pay_money>0">
        <p>现金支付</p>
        <span>
          <span class="price">
            <span class="font-size-15 font-bold price">￥{{info.pay_money}}</span>
          </span>
        </span>
      </div>
      <div class="flex-box title" v-if="info.coupon_money>0">
        <p>优惠券</p>
        <span>-
          <span class="price">{{info.coupon_money}}</span>
        </span>
      </div>
      <!-- <div class="rows kf m-b">
        <div class="col-50" @click="kf">
          <i class="iconfont icon-kefu"></i> 联系客服</div>
        <a   :href="'tel:'+service.value.web_phone" style="text-align:center;width:100%;">
          <i class="iconfont icon-dianhuazhengzaibohao"></i> 拨打客服电话</a>
      </div> -->
      <div class="orderinfo">
        <p>订单编号 : {{info.order_no}}</p>
        <p>创建时间 : {{info.create_time|date}}</p>
        <clocker @on-finish="getNow" v-if="info.is_hang_sale==2" :time="info.hang_sale_time|date" class="clocker">
          <span>%D 天</span>
          <span>%H 小时</span>
          <span>%M 分</span>
          <span>%S 秒</span>
          <span>后进入挂售市场</span>
        </clocker>
        <div class="buttons" v-if="info.is_hang_sale==0">
          <div v-if="(info.order_status==4||info.order_status==3)&&info.is_evaluate==0" @click="goto('/ordercomment?id='+info.order_id)">我要评价</div>
          <div v-if="(info.order_status==4||info.order_status==3)&&info.is_evaluate==1" @click="goto('/ordercomment?id='+info.order_id)">追加评价</div>
          <div v-if="info.order_status==2" @click="take_show=true;">确认收货</div>
          <div v-if="info.order_status==0" @click="closeOrder()">关闭订单</div>
          <div v-if="info.order_status==5" @click="delOrder()">删除订单</div>
          <div v-if="info.order_status==0" @click="pay()">付款</div>
        </div>
        <div class="buttons" v-else>
          <div v-if="info.is_hang_sale==1" @click="hangSaleDialog(info.order_id)">我要挂售</div>

          <div v-if="info.is_hang_sale==2 || info.is_hang_sale==3" @click="withdraw(info.order_id)">撤回</div>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="take_show" @on-confirm="take" @on-hide="take_check_id=0" :title="'确定收到货了吗?'">
      </confirm>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import {
  orderDetail,
  orderTakeDelivery,
  deleteOrder,
  orderClose,
  undoSale,
  changeSale
} from "src/service/getData";
import { mapState } from "vuex";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      is_show_express_code: 0,
      take_show: false,
      express: {},
      info: {},
      service: {},
      now: new Date().getTime() / 1000,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    })
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
    async undosale(id) {
      this.$vux.loading.show({ text: "撤回中......" });
      let res = await undoSale(id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.getInfo();
        }, 2000);
      }
    },
    withdraw(id) {
      let that = this;
      this.$vux.confirm.show({
        title: "是否撤回",
        content: "撤回后不能继续挂售!",
        onConfirm() {
          that.undosale(id);
        }
      });
    },
    hangSaleDialog(id) {
      let that = this;
      this.$vux.confirm.show({
        title: "是否提交挂售订单",
        onConfirm() {
          that.hangSale(id);
        }
      });
    },
    async hangSale(id) {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await changeSale(id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.getInfo();
        }, 2000);
      }
    },
    getNow() {
      this.now = new Date().getTime() / 1000;
    },
    kf() {
      this.$vux.toast.text("暂未开放", "middle");
    },
    setStatusName(is_hang_sale) {
      switch (is_hang_sale) {
        case 1:
          return "待处理";
        case 2:
        case 3:
          return "挂售中";
        case 4:
          return "已完成";
        case 5:
          return "已撤回";
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    pay(out_trade_no) {
      this.$router.push("/pay?id=" + this.info.out_trade_no);
    },
    async delOrder() {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await deleteOrder(this.info.order_id);
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
      let res = await orderClose(this.info.order_id);
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
      let res = await orderDetail(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.is_show_express_code = res.data.is_show_express_code;
        this.express = {
          express_code: res.data.express_code,
          express_name: res.data.express_name
        };
        let sale_hour = res.data.order.sale_hour
          ? parseFloat(res.data.order.sale_hour) * 60 * 60
          : 0;
        res.data.order.hang_sale_time =
          res.data.order.hang_sale_time + sale_hour;
        this.info = res.data.order;
        this.service = res.data.list;
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        });
      }
    },
    async take() {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await orderTakeDelivery(this.info.order_id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.getInfo();
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#detail {
  .clocker {
    span {
      font-size: 0.26rem !important;
      color: #666;
    }
  }
  .orderinfo {
    padding: 0.2rem 0.3rem;
    background: #fff;
    p {
      color: #666;
      font-size: 0.26rem;
    }
  }
  .kf {
    border-top: 1px solid #eee;
    padding: 0.2rem 0.3rem;
    background: #fff;
    text-align: center;
    .col-50:first-child {
      border-right: 1px solid #eee;
    }
  }
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
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 0.2rem;
    margin-top: 0.2rem;
    border-top: 0.02rem solid #eee;
    div {
      font-size: 0.26rem;
      color: #333;
      border: 1px solid #999;
      border-radius: 0.1rem;
      margin-left: 0.15rem;
      padding: 0.1rem 0.3rem;
      box-shadow: 3px 3px 0 0 #ded6d6;
    }
  }
  .p-a-all {
    // top: 1rem;
    // bottom: 1rem;
    background: #eee;
    // border-bottom: 1px solid #ccc;
    .title {
      padding: 0.2rem 0.3rem;
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
.m-b {
  margin-bottom: 0.2rem;
}
.refound_buttons {
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem 0.3rem;
  background: #fff;
  width: 100%!important;
  padding-right: 0;
  div {
    width: auto!important;
    font-size: 0.26rem;
    padding: 0.1rem;
    color: #333;
    border: 1px solid #999;
    border-radius: 0.1rem;
    margin-left: 0.15rem;
    box-shadow: 3px 3px 0 0 #ded6d6;
  }
}
</style>


