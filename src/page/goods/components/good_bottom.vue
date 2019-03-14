<template>
  <div class="rows">
    <div class="col-20" v-if="collect==0" @click="addFav">
      <i class="iconfont icon-shoucang1  "></i>收藏</div>
    <div class="col-20" v-else @click="delFav">
      <i class="iconfont icon-shoucang "></i>已收藏</div>
    <div class="col-20">
      <i class="iconfont icon-ERP_gouwuche" @click="goto('/cart')"></i> 购物车</div>
    <div class="col-30 card" :class="{not_2:info.is_wholesale&&(now<info.start_time||now>info.end_time)}" v-if="info.stock>0" @click="cart">加入购物车</div>
    <div class="col-30 buy" :class="{not_1:info.is_wholesale&&(now<info.start_time||now>info.end_time)}" v-if="info.stock>0" @click="toBuy">立即购买</div>
    <div class="col-60" v-if="info.stock==0">没有库存了</div>
  </div>
</template>
<script>
import { FavoritesGoodsorshop, cancelFavorites } from "src/service/getData";
export default {
  props: ["info", "collects"],
  data() {
    return {
      collect: 0
    };
  },
  computed: {
    now() {
      return new Date().getTime() / 1000;
    }
  },
  beforeMount() {
    this.collect = this.collects;
  },
  methods: {
    async addFav() {
      this.$vux.loading.show({ text: "提交中......" });
      let res = await FavoritesGoodsorshop(
        this.info.goods_id,
        "goods",
        this.info.goods_name
      );
      this.$vux.loading.hide();

      if (res.code == 1) {
        this.collect = 1;
      } else {
        this.$vux.toast.text("操作失败", "middle");
      }
    },
    async delFav() {
      this.$vux.loading.show({ text: "提交中......" });
      let res = await cancelFavorites(this.info.goods_id, "goods");
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.collect = 0;
      } else {
        this.$vux.toast.text("操作失败", "middle");
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    toBuy() {
      if (
        this.info.is_wholesale &&
        (this.now < this.info.start_time || this.now > this.end_time)
      ) {
        this.$vux.toast.text("未到开放时间", "middle");
        return false;
      }
      this.$emit("bottom", "good");
    },
    cart() {
      if (
        this.info.is_wholesale &&
        (this.now < this.info.start_time || this.now > this.end_time)
      ) {
        this.$vux.toast.text("未到开放时间", "middle");
        return false;
      }
      this.$emit("bottom", "cart");
    }
  }
};
</script>
<style lang="scss" scoped>
.not_1 {
  background: #c3c3c3 !important;
}
.not_2 {
  background: #888 !important;
  color:#fff;
}
div {
  border-top: 1px solid #aaa;
  color: #666;
  height: 1rem;
}
.col-20 {
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0.2rem 0;
  font-size: 0.24rem;
}
.col-30 {
  color: #fff;
  line-height: 1rem;
}
.col-60 {
  color: #fff;
  background: #b5a3a9;
  line-height: 1rem;
}

i {
  width: 100%;
  display: block;
}
.card {
  background: #ffb7b8;
  color: #ef525b;
}
.buy {
  background: #fd4445;
  color: #fff;
}
</style>
