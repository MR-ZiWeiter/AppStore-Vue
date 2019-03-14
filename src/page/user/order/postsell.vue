<template>
  <div id="postsell">
    <head-top :go-back='true' head-title="二手转卖" :rightMenu="true"></head-top>
    <div class="p-a-all" v-if="info.order">
      <p @click="gotoDetail(info.order.order_id)" class="store flex-box">
        <span>{{info.order.order_no}}</span>
        <span class="text-color-999 font-size-13">{{info.order.create_time|date}}</span>
      </p>
      <div class="goods flex-box" v-for="(item,key) in info.good_list" :key="key">
        <img @click="gotoDetail(item.order_id)" :src="imgurl+item.picture_detail.pic_cover_small" alt="" :onerror="local_default_goods_img">
        <div class="good-info">
          <p @click="gotoDetail(item.order_id)" class="ellipsis">{{item.goods_name}}</p>
          <p @click="gotoDetail(item.order_id)" class="font-size-12 text-color-999">{{item.sku_name}}</p>
          <p @click="gotoDetail(item.order_id)" class="price font-size-12">￥{{item.price}}
            <span class="text-color-999 font-size-12"> x {{item.num}}</span>
          </p>
          <div class="buttons">
            <div v-if="(item.order_status==1||item.order_status==2)&&item.refund_status==0" @click="goto('/refound?id='+item.order_goods_id)">退款/退货</div>
            <div v-if="item.refund_status!=0" @click="goto('/refound?id='+item.order_goods_id)">{{item.status_name}}</div>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="flex-box" style="border-bottom:1px solid #eee">
          <span>转卖价:</span>
          <input v-model="price" type="text" :placeholder="'最小￥'+toprice.min+',最大￥'+toprice.max">
        </div>
        <div class="flex-box">
          <span>备注:</span>
          <input v-model="memo" type="text">
        </div>
      </div>
      <div class="btn" @click="save">确认转卖</div>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { getOrderGoods, postToMoney } from "src/service/getData";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      memo: "",
      price: "",
      info: {},
      imgurl:window.imgBaseUrl,
     local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  watch: {
    price(val) {
      let reg = /^\d+\.?\d{0,2}$/;
      if (!reg.test(val)) {
        this.price = "";
        return false;
      }
      if (val > this.toprice.max) {
        this.price = this.toprice.max;
        return false;
      }
      // if (val < this.toprice.min) {
      //   this.price =this.toprice.min;
      //   return false;
      // }
    }
  },
  computed: {
    toprice() {
      if (!this.info.good_list) {
        return { min: 0, max: 0 };
      }
      let min = 0;
      let max = 0;
      let that = this;
      for (let i in this.info.good_list) {
        min = min + parseFloat(this.info.good_list[i].tominprice)*this.info.good_list[i].num;
        max = max + parseFloat(this.info.good_list[i].tomaxprice)*this.info.good_list[i].num  ;
      }
      return { min: min, max: max };
    }
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
    async save() {
      if (!this.price||this.price < this.toprice.min) {
        this.$vux.toast.text("最低转卖价为:" + this.toprice.min);
        return false;
      }
      this.$vux.loading.show({ text: "正在提交中......" });
      let res = await postToMoney(
        this.info.order.order_id,
        this.price,
        this.memo
      );
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.go(-1);
        });
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await getOrderGoods(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
        // if (res.data.express_info == -1) {
        //   this.$vux.toast.text('物流信息错误', "middle");
        //   setTimeout(() => {
        //     this.$router.go(-1);
        //   });
        // }
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#postsell {
  .btn {
    width: calc(100% - 0.6rem);
    margin: 0.3rem;
    padding: 0.2rem;
    background: #eec242;
    text-align: center;
    color: #fff;
    border-radius: 0.1rem;
  }
  .p-a-all {
    background: #eee;
    .info {
      margin-top: 0.2rem;
      padding: 0 0.3rem;
      background: #fff;
      .flex-box {
        padding: 0.2rem 0;
      }
      input {
        width: calc(100% - 2rem);
        text-align: right;
      }
    }
    .item {
      padding: 0.3rem;
      margin-bottom: 1px;
      font-size: 0.3rem;
      background: #fafafa;
    }
    button {
      height: 0.8rem;
      font-size: 0.3rem;
      color: #666;
      margin-top: 1rem;
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
    .store {
      padding: 0.2rem 0.3rem;
      background: #fff;
      margin-bottom: 1px;
    }
  }
}
</style>
