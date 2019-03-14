<template>
  <div class="list p-a-all" @scroll="handleScroll">
    <div v-if="list.length==0" style="text-align:center;padding-top:20%;">没有购买过商品</div>
    <div class="item" v-for="(items,index) in list" :key="index">
      <p @click="gotoDetail(items.order_id)" class="store flex-box">
        <span>{{items.order_no}}</span>
        <span class="text-color-999 font-size-13">{{items.create_time}}</span>
      </p>
      <div class="goods flex-box" v-for="(item,key) in items.order_item_list" :key="key">
        <img @click="gotoDetail(items.order_id)" :src="item.picture.pic_cover_small" alt="" :onerror="local_default_goods_img">
        <div class="good-info">
          <p @click="gotoDetail(items.order_id)" class="ellipsis">{{item.goods_name}}</p>
          <p @click="gotoDetail(items.order_id)" class="font-size-12 text-color-999">{{item.sku_name}}</p>
          <p @click="gotoDetail(items.order_id)" class="price font-size-12">￥{{item.price}}
            <span class="text-color-999 font-size-12"> x {{item.num}}</span>
          </p>
          <div class="buttons">
            <div v-if="(items.order_status==1||items.order_status==2)&&item.refund_status==0" @click="goto('/refound?id='+item.order_goods_id)">退款/退货</div>
            <div v-if="item.refund_status!=0" @click="goto('/refound?id='+item.order_goods_id)">{{item.status_name}}</div>
          </div>
        </div>
      </div>
      <div class="flex-box status" v-if="items.coupon_money>0">
        <span>优惠券</span>
        <span class="font-size-13 price">-￥{{items.coupon_money}}</span>
      </div>
      <div @click="gotoDetail(items.order_id)" class="flex-box status">
        <span v-if="items.tostatus==0">可转售</span>
        <span v-if="items.tostatus==1">转售中</span>
        <span v-if="items.tostatus==2">已转售</span>
        <span class="price font-size-13">{{parseFloat(items.toprice)>0?'转售价 : ￥'+items.toprice:'总价 : ￥'+items.price}}</span>
      </div>
      <div class="buttons">
        <div v-if="items.tostatus==0" @click="goto('/postsell?id='+items.order_id)">转售</div>
        <div v-if="items.tostatus==1" @click="cancle(items.order_id)">取消</div>
        <div v-if="items.tostatus==1" @click="goto('/confirmsell?id='+items.order_id)">确认转售</div>
      </div>
    </div>
  </div>
</template>
<script>
import { userResellerOrderList, getCancel } from "src/service/getData";
import { dateFormat } from "vux";
export default {
  data() {
    return {
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
  watch: {
    $route(val) {
      this.check = val.query.type;
      this.rush();
    }
  },
  computed: {
    orderStatus() {
      switch (parseInt(this.check)) {
        case 3:
          return "all";
        case 0:
          return "0";
        case 1:
          return "1";
        case 2:
          return "2";
      }
    }
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    async cancle(id) {
      this.$vux.loading.show({ text: "正在取消......" });
      let res = await getCancel(id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.rush();
      }
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

    async getList() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await userResellerOrderList(this.orderStatus, this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.page_count = res.data.page_count;
        let that = this;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
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
