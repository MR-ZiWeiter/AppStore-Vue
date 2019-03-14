<template>
  <div id="footer">
    <div @click="gotoAddress({path: '/index'})" class="col-25" :class="{checkclass:check=='/index'}">
      <i v-if="check=='/index'" class="iconfont icon-home1"></i>
      <i v-else class="iconfont icon-home2"></i>
      首页
    </div>
    <div @click="gotoAddress('/category')" class="col-25" :class="{checkclass:check=='/category'}">
      <i v-if="check=='/category'" class="iconfont icon-leimupinleifenleileibie2"></i>
      <i v-else class="iconfont icon-leimupinleifenleileibie"></i>
      分类
    </div>
    <div @click="gotoAddress('/qrcode')" class="col-25 center" :class="{checkclass:check=='/category'}">
      <img src="../../../src/images/yx/推广@2x.png" alt="">
      <p style="width:auto">推广</p>
    </div>
    <div @click="gotoAddress('/cart')" class="col-25" :class="{checkclass:check=='/cart'}">
      <i v-if="check=='/cart'" class="iconfont icon-gouwuche"></i>
      <i v-else class="iconfont icon-ERP_gouwuche"></i>
      购物车
    </div>
    <div @click="gotoAddress('/user')" class="col-25" :class="{checkclass:check=='/user'}">
      <i v-if="check=='/user'" class="iconfont icon-tubiao-1"></i>
      <i v-else class="iconfont icon-tubiao-"></i>
      我的
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      check: this.$route.path
    };
  },
  methods: {
    gotoAddress(path) {
      this.$router.push(path);
    }
  },
  watch: {
    $route(data) {
      this.check = data.path;
    }
  }
  // mounted() {
  //   this.check=this.$route.path;
  // },
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
#footer {
  position: fixed;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  @include wh(100%, 1rem);
  background: #fff;
  box-shadow: 0 -0.026667rem 0.053333rem rgba(0, 0, 0, 0.1);
  font-size: 0.23rem;
  .checkclass {
    color: #ff4444;
    i {
      color: #ff4444;
    }
  }
  .col-25 {
    width: 25%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    i {
      display: block;
      font-size: 0.4rem;
      width: 100%;
      text-align: center;
    }
  }
  .center {
    img {
      width: 0.8rem;
      height: 0.8rem;
      position: absolute;
      top: -0.28rem;
      background: #fff;
      padding:0.05rem;
      border-radius: 50%;
    }
    p {
      text-align: center;
      position: absolute;
      bottom: 0.06rem;
    }
  }
}
</style>
