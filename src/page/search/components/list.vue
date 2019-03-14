<template>
    <div class="goods">
        <div class="item" v-if="item.stock>0" @click="gotoGood(item.goods_id)" v-for="(item,index) in list" :key="index">
            <div class="img-size-box">
                <div class="bg-img" :style="{'background-image':'url('+item.domain+item.pic_cover_mid+'),url('+local_default_goods_img+')'}"></div>
            </div>
            <p class="label-box">
              <span class="label" v-if="item.is_hot">热卖</span>
              <span class="label" v-if="item.is_recommend">精品</span>
              <span class="label" v-if="item.is_new">新品</span>
              <span class="label" v-for="(group_item,group_index) in item.gorup_list" :key="group_index">{{group_item.group_name}}</span>
            </p>
            <p class="ellipsis title">{{item.goods_name}}</p>
            <div class="price">
                <span class="font-size-10"></span>{{item.promotion_price?item.promotion_price:item.market_price}}
                <span class="express" v-if="item.shipping_fee=='0.00'">包邮</span>
            </div>
            <p class="comment">已卖出{{item.sales}}件</p>
        </div>
    </div>
</template>
<script>
import { imgBaseUrl } from "src/config/env";
export default {
  props: ["list"],
  data() {
    return {
        imgurl:imgBaseUrl,
      local_default_goods_img: window.default_goods_img
        ? window.default_goods_img
        : require("src/images/resource/good.gif")
    };
  },
  methods: {
    gotoGood(id) {
      if (this.$route.path == "/search_service_goods") {
        this.$router.push("/serviceDetails?id=" + id);
      } else {
        this.$router.push("/goods?id=" + id);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.goods {
  width: 100%;
  .label-box{
    padding:0 0.2rem ;
    .label{
      font-size: 0.24rem;
      color:#fff;
      background: #ff4444;
      padding:0.03rem 0.1rem;
    }
  }
  .item {
    display: inline-block;
    width: calc(50% - 0.1rem);
    margin: 0 0.05rem;
    background: #fff;
    margin-bottom: 0.1rem;
    .img-size-box {
      padding: 0;
    }
    .title {
      padding: 0.1rem 0.2rem;
      color: #333;
      font-size: 0.26rem;
    }
    .comment {
      padding: 0 0.2rem 0.1rem;
      font-size: 0.24rem;
      color: #666;
    }
    .price {
      display: flex;
      align-items: center;
      padding: 0 0.2rem 0.1rem;
      span {
        color: #ff4444;
      }
      .express {
        margin-left: 0.2rem;
        font-size: 0.2rem;
        border: 1px solid #ff4444;
        padding: 0.02rem 0.05rem;
      }
    }
  }
}
</style>
