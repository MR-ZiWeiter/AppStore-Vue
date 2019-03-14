<template>
  <div class="list p-a-all" @scroll="handleScroll">
    <div v-if="list.length==0" style="text-align:center;padding-top:20%;">没有购买过商品</div>
    <div class="item" v-for="(items,index) in list" :key="index">
      <p @click="gotoDetail(items.order_id)" class="store flex-box">
        <span class="font-size-14 ">交易单号 : {{items.order_no}}</span>
        <span class="price font-size-13">{{items.status_name}}</span>
      </p>
      <div class="goods flex-box" v-for="(item,key) in items.order_item_list" :key="key">
        <img @click="gotoDetail(items.order_id)" :src="item.picture.pic_cover_small" :onerror="local_default_goods_img">
        <div class="good-info">
          <p @click="gotoDetail(items.order_id)" class="ellipsis-2">{{item.goods_name}}</p>
          <p @click="gotoDetail(items.order_id)" class="font-size-12 text-color-999">{{item.sku_name}}</p>
          <p @click="gotoDetail(items.order_id)" class="text-color-999 font-size-12 ">￥ <span class="font-bold font-size-13">{{item.price}}</span></p>
          <p @click="gotoDetail(items.order_id)" class="font-size-12 text-color-999">x{{item.num}}</p>
          <!-- <div class="buttons">
            <div v-if="(items.order_status==1||items.order_status==2)&&item.refund_status==0" @click="goto('/refound?id='+item.order_goods_id)">退款/退货</div>
            <div v-if="item.refund_status!=0" @click="goto('/refound?id='+item.order_goods_id)">{{item.status_name}}</div>
          </div> -->
        </div>
      </div>
      <div class="flex-box status" v-if="items.coupon_money>0">
        <span>优惠券</span>
        <span class="font-size-13 price">-{{items.coupon_money}}</span>
      </div>
      <div @click="gotoDetail(items.order_id)" class="flex-box status">
        <span></span>
        <div class="text-color-666 font-size-13">共{{items.count}}件,
           合计 <span class="font-size-15 font-bold price">￥{{items.order_money}}</span>
          <!-- <span class=" font-size-15 font-bold" v-if="items.point>0"> +  {{parseInt(items.point)}}配额</span> -->
        </div>
      </div>
      <div class="buttons">
        <div v-if="items.is_hang_sale==1" @click="hang_sale=true;hang_sale_id=items.order_id">我要挂售</div>
        <div v-if="items.order_status==2" @click="take_show=true;take_check_id=items.order_id">确认收货</div>
        <div v-if="(items.order_status==4||items.order_status==3)&&items.is_evaluate==0" @click="goto('/ordercomment?id='+items.order_id)">我要评价</div>
        <div v-if="(items.order_status==4||items.order_status==3)&&items.is_evaluate==1" @click="goto('/ordercomment?id='+items.order_id)">追加评价</div>
        <div v-if="items.order_status==0" @click="closeOrder(items.order_id)">关闭订单</div>
        <div v-if="items.order_status==5 " @click="delOrder(items.order_id)">删除订单</div>
        <div v-if="items.order_status==0" @click="pay(items.out_trade_no)">付款</div>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="take_show" @on-confirm="take" @on-hide="take_check_id=0" :title="'确定收到货了吗?'">
      </confirm>
      <confirm v-model="hang_sale" confirm-text="挂售" @on-confirm="hangSale" @on-hide="hang_sale_id=0" :title="'是否挂售?'">
      </confirm>
    </div>
  </div>
</template>
<script>
import {
  myOrderList,
  orderTakeDelivery,
  deleteOrder,
  orderClose,
  changeSale
} from "src/service/getData";
import { dateFormat } from "vux";
import { mapState } from "vuex";
export default {
  data() {
    return {
      hang_sale: false,
      hang_sale_id: 0,
      page: 1,
      page_count: 1,
      list: [],
      take_show: false,
      take_check_id: 0,
      check: this.$route.query.type ? this.$route.query.type : 0,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    }),
    orderStatus() {
      switch (parseInt(this.check)) {
        case 0:
          return "all";
        case 1:
          return "0";
        case 2:
          return "1";
        case 3:
          return "2";
        case 4:
          return "3";
        case 5:
          return "5";
      }
    }
  },
  watch: {
    $route(val) {
      this.check = val.query.type;
      this.rush();
    }
  },
  mounted() {
    console.log(window.default_goods_img);
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    async hangSale() {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await changeSale(this.hang_sale_id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.rush();
        }, 2000);
      }
    },
    upimg(e) {
      e.src = appConfig.img.default_goods_img;
    },
    goto(url) {
      this.$router.push(url);
    },
    rush() {
      this.page = 1;
      this.page_count = 1;
      this.list = [];
      this.getList();
    },
    pay(out_trade_no) {
      this.$router.push("/pay?id=" + out_trade_no);
    },
    async delOrder(id) {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await deleteOrder(id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.rush();
        }, 2000);
      }
    },
    async closeOrder(id) {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await orderClose(id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.rush();
        }, 2000);
      }
    },
    gotoDetail(id) {
      this.$router.push("/orderdetail?id=" + id);
    },
    handleScroll() {
      let dom = this.$el;
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        if (this.page < this.page_count) {
          this.page++;
          this.getList();
        }
      }
    },
    async take() {
      if (!this.take_check_id) {
        return false;
      }
      this.$vux.loading.show({ text: "正在处理" });
      let res = await orderTakeDelivery(this.take_check_id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.rush();
        }, 2000);
      }
    },
    async getList() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await myOrderList(this.orderStatus, this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.page_count = res.data.page_count;
        let that = this;
        for (let i in res.data.data) {
          let items=res.data.data[i];
          let count=0;
          for(let j in items.order_item_list){
            count+=parseInt(items.order_item_list[j].num);
          }
          items['count']=count;
          that.list.push(items);
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all {
  top: 1.71rem;
}
.item {
  width: 100%;
  margin-bottom: 0.2rem;
  .store {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 1px;
  }
  .status {
    padding: 0.2rem 0.3rem;
    background: #fff;
  }
  .good-info {
    .buttons {
      width: 100%;
      padding: 0;
      div {
        width: auto;
        font-size: 0.24rem;
      }
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
  .amount {
    background: #fff;
    padding: 0.2rem 0.3rem;
    text-align: right;
    font-size: 0.32rem;
    margin-bottom: 1px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    padding: 0.2rem 0.3rem;
    background: #fff;
    div {
      font-size: 0.26rem;
      padding: 0.1rem;
      color: #333;
      border: 1px solid #999;
      border-radius: 0.1rem;
      margin-left: 0.15rem;
      box-shadow: 3px 3px 0 0 #ded6d6;
    }
  }
}
</style>
<style>
.weui-dialog__btn_primary {
  color: #ff4444 !important;
}
</style>
