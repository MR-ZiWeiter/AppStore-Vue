<template>
    <div class="store-item" @click="goto">
        <div class="img-box">
            <img src="../../images/ios/分类精选广告图@2x.png" alt="">
        </div>
        <div class="flex-box">
            <div>
                <p class="location">晶品汇深圳龙华厂区</p>
                <p class="address">晶品汇深圳龙华厂区D12门店</p>
            </div>
            <div class="text-color-999 font-size-13">
                <i class="iconfont icon-dingwei big"></i>>5Km</div>
        </div>
    </div>
</template>
<script>
export default {
  methods: {
    goto() {
      this.$router.push('/choose');
    }
  }
};
</script>
<style lang="scss" scoped>
.store-item {
  background: #fff;
  margin-bottom: 0.2rem;
  .flex-box {
    align-items: center;
    padding: 0.2rem;
  }
  .location {
    font-size: 0.26rem;
  }
  .address {
    font-size: 0.21rem;
  }
  .img-box {
    max-height: 2rem;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
</style>
