<template>
  <div id="order">
    <head-top head-title="退款/退货" :go-back='true' :rightMenu="true"></head-top>
    <div class="p-a-all">
      <flow v-if="info.order_refund" style="width:100%">
        <flow-state state="1" is-done>
          <span slot="title">买家申请退款</span>
        </flow-state>
        <flow-line :is-done='info.order_refund.refund_status!=0?true:false'></flow-line>

        <flow-state state="2" :is-done='(info.order_refund.refund_status==1||info.order_refund.refund_status==3||info.order_refund.refund_status==4||info.order_refund.refund_status==5)?true:false'>
          <span slot="title">商家处理退款申请</span>
        </flow-state>
        <flow-line :is-done='(info.order_refund.refund_status==5)?true:false'></flow-line>

        <flow-state state="3" :is-done='info.order_refund.refund_status==5?true:false'>
          <span slot="title">退款完成</span>
        </flow-state>
      </flow>

      <div class="add-info" v-if="info.order_refund&&(info.order_refund.refund_status==0||info.order_refund.refund_status==-3)">
        <div class="box">
          <group>
            <selector label-width="1.5rem" placeholder="处理方式:" title="处理方式:" v-model="mode" :options="mode_list"></selector>
          </group>
          <group>
            <selector label-width="1.5rem" placeholder="退款原因:" title="退款原因:" v-model="reason" :options="reason_list"></selector>
          </group>
          <div class="weui-cells vux-no-group-title" v-if="info.refund_money>0">
            <div data-v-556bc01a="" class="vux-x-input weui-cell weui-cell_warn">
              <div class="weui-cell__hd">
                <label for="vux-x-input-7twv9" class="weui-label" style="width: 1.5rem;">退款积分:</label>
              </div>
              <input type="text" v-model="money" :placeholder="'最多可退款'+info.refund_money">
            </div>
          </div>
        </div>
        <div class="btn" @click="add">提交退款申请</div>
      </div>
      <div class="refound-info" v-if="info.order_refund&&(info.order_refund.refund_status==1||info.order_refund.refund_status==3||info.order_refund.refund_status==4)">
        <p class="price">退款积分:{{info.order_refund.refund_require_money}} </p>
        <p class="font-bold">您已成功申请退款，等待卖家处理退款申请。</p>
        <p class="text-color-666">退款类型:{{info.order_refund.refund_type==1?'仅退款':'退款退货'}}</p>
        <p class=" text-color-666">发起退款时间:{{info.order_refund.refund_time|date}}</p>
        <p class=" text-color-666">退款原因:{{info.order_refund.refund_reason}}</p>
        <p class="text-color-666">如果商家同意，退款申请将达成并退款至您的现金账户中或线下退款到账户中</p>
      </div>

      <div class="refound-info" v-if="info.order_refund&&info.order_refund.refund_status==5">
        <p class="font-bold">{{info.order_refund.status_name}}</p>
        <p class=" text-color-666">退款成功时间：{{info.order_refund.refund_record.refund_time|date}}</p>
        <p class=" text-color-666">退款方式：{{info.order_refund.refund_record.refund_way|refund_way}}</p>
        <p class=" price">退款积分：{{info.order_refund.refund_record.refund_money}}元</p>
        <p class=" text-color-666">卖家留言：{{info.order_refund.refund_record.remark}}</p>
      </div>

      <div class="express " v-if="info.shop_info&&info.order_refund.refund_status==2">
        <p>请退货并填写物流信息</p>
        <p class="font-bold">1、请退货</p>
        <p class="text-color-666">未经卖家同意，请不要使用到付或平邮。</p>
        <p class="price">退货地址：{{info.shop_info.shop_address}} {{info.shop_info.seller_zipcode}} {{info.shop_info.seller_mobile}} {{info.shop_info.seller_name}}</p>
        <p class="font-bold">2、请填写退货物流信息
          <span class="font-size-12 text-color-999">(逾期未填写，退货申请将关闭)</span>
        </p>
        <group style="width:100%;">
          <x-input label-width="1.5rem" title="物流公司:" required v-model="express_code" placeholder="物流公司"></x-input>
        </group>
        <group style="width:100%;">
          <x-input label-width="1.5rem" title="运单号码:" required v-model="express_num" placeholder="运单号码"></x-input>
        </group>
        <button class="btn " @click="express">提交</button>
      </div>

      <timeline v-if="info.order_refund&&info.order_refund.refund_info.length>0" style="width:100%">
        <timeline-item v-for="(item,index) in info.order_refund.refund_info" :key="index">
          <h4 :class="[index === 0 ? 'recent' : '']">{{item.action}}</h4>
          <p :class="[index === 0 ? 'recent' : '']">{{item.action_time|date}}</p>
        </timeline-item>
      </timeline>

    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import {
  refundDetail,
  orderGoodsRefundAskfor,
  orderGoodsRefundExpress,
  serviceRefundDetail,
  serviceGoodsRefundAskfor,
  serviceGoodsRefundExpress
} from "src/service/getData";
import { dateFormat } from "vux";
import { TimelineItem } from "vux";
export default {
  components: {
    headTop,
    TimelineItem
  },
  filters: {
    date(val) {
      return dateFormat(val * 1000, "YYYY-MM-DD HH:mm:ss");
    },
    refund_way(val) {
      let refund_way = "";
      switch (val) {
        case 1:
          refund_way = "微信";
          break;
        case 2:
          refund_way = "支付宝";
          break;
        case 10:
          refund_way = "线下";
          break;
        default:
          break;
      }
      return refund_way;
    }
  },
  data() {
    return {
      express_code: "",
      express_num: "",
      info: {},
      mode: 1,
      mode_list: [{ key: 1, value: "仅退款" }],
      reason: "买/卖双方协商一致",
      reason_list: [
        { key: "买/卖双方协商一致", value: "买/卖双方协商一致" },
        { key: "买错/多买/不想要", value: "买错/多买/不想要" },
        { key: "商品质量问题", value: "商品质量问题" },
        { key: "未收到货品", value: "未收到货品" },
        { key: "其他", value: "其他" }
      ],
      money: ""
    };
  },
  watch: {
    money(value) {
      if (!value) {
        this.money = "";
        return false;
      }
      let reg = /^\d+\.?\d{0,2}$/;
      if (!reg.test(value)) {
        this.money = parseFloat(value);
      }
      value = parseFloat(value);

      if (value < 0) {
        this.money = 0;
      }
      if (value > parseFloat(this.info.refund_money)) {
        this.money = parseInt(this.info.refund_money);
      }
    }
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    async express() {
      if (!this.express_code || !this.express_num) {
        this.$vux.toast.text("请填写物流信息", "middle");
        return false;
      }
      this.$vux.loading.show({ text: "正在获取中......" });
      let res;
      if (this.$route.query.type == "service") {
        res = await serviceGoodsRefundExpress(
          this.info.order_refund.order_id,
          this.info.order_refund.order_goods_id,
          this.express_code,
          this.express_num
        );
      } else {
        res = await orderGoodsRefundExpress(
          this.info.order_refund.order_id,
          this.info.order_refund.order_goods_id,
          this.express_code,
          this.express_num
        );
      }
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.getInfo();
        // this.info = res.data;
        // this.money = res.data.refund_money;
      }
    },
    async add() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res;
      if (this.$route.query.type == "service") {
        res = await serviceGoodsRefundAskfor(
          this.info.order_refund.order_id,
          this.info.order_refund.order_goods_id,
          this.mode,
          this.reason,
          this.money
        );
      } else {
        res = await orderGoodsRefundAskfor(
          this.info.order_refund.order_id,
          this.info.order_refund.order_goods_id,
          this.mode,
          this.reason,
          this.money
        );
      }
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.getInfo();
        // this.info = res.data;
        // this.money = res.data.refund_money;
      }
    },
    async getInfo() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res;
      if (this.$route.query.type == "service") {
        res = await serviceRefundDetail(this.$route.query.id);
      } else {
        res = await refundDetail(this.$route.query.id);
      }
      this.$vux.loading.hide();
      if (res.code == 1) {
        if (res.data.order_refund.refund_info.length > 0) {
          res.data.order_refund.refund_info.reverse();
        }

        if (res.data.order_refund.shipping_status) {
          this.mode_list.unshift({ key: 2, value: "退货退款" });
          this.mode = 2;
        }

        this.info = res.data;
        this.money = res.data.refund_money;
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        });
      }
    },
    onItemClick(index) {
      this.check = index;
    }
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
#order {
  background: #eee;

  .p-a-all {
    .express {
      background: #fff;
      padding: 0.2rem;
      p {
        display: flex;
        width: 100%;
        font-size: 0.28rem;
        word-break: break-all;
      }
    }
    .refound-info {
      background: #fff;
      padding: 0.2rem 0.3rem;
      p {
        display: flex;
        width: 100%;
        font-size: 0.28rem;
        word-break: break-all;
      }
    }
    .box {
      background: #fff;
    }
    .btn {
      width: calc(100% - 0.6rem);
      margin: 0.3rem;
      padding: 0.2rem;
      background: #eec242;
      text-align: center;
      color: #fff;
      border-radius: 0.1rem;
    }
  }
}
</style>
<style lang="scss">
#order {
  .vux-timeline {
    background: #fff;
    margin-top: 0.2rem;
    p {
      font-size: 0.24rem;
    }
  }
  .weui-cell_select-after .weui-select,
  .weui-input {
    font-size: 0.26rem;
    color: #666;
  }
  .weui-cell__hd {
    width: 1.5rem !important;
    .weui-label {
      font-size: 0.24rem;
    }
  }
  .weui-cells:after {
    height: 0;
    border: 0;
  }
  option {
    display: inline-block;
    font-size: 0.1rem;
  }
  .weui-wepay-flow {
    // background: #fff !important;
  }
  .weui-wepay-flow__li_done .weui-wepay-flow__title-bottom,
  .weui-wepay-flow__title-bottom {
    span {
      font-size: 0.24rem !important;
    }
  }
  .weui-wepay-flow__process {
    background: #ff4444 !important;
  }
  .weui-wepay-flow__line,
  .weui-wepay-flow__process {
    height: 5px !important;
  }
  .weui-wepay-flow__title-bottom {
    top: 0.35rem;
  }
  .weui-wepay-flow__li_done .weui-wepay-flow__state {
    background: #ff4444;
  }
  .weui-wepay-flow {
    padding: 0.8rem 1rem !important;
  }
  .weui-wepay-flow__li .weui-wepay-flow__state {
    width: 0.4rem;
    height: 0.4rem;
    font-size: 0.26rem;
    line-height: 0.4rem;
    top: -17px;
    border-radius: 50%;
  }
  .weui-wepay-flow__line_ing .weui-wepay-flow__info-top {
    display: none !important;
  }
}
</style>

