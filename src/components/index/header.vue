<template>
    <div class="header display-box">
       <div class="col-2">
         <!-- <i class="iconfont icon-caidan"></i> -->
       </div>
       <div class="col-6">商城</div>
       <div class="col-2" @click="goto('/search')" style="text-align:right"><i class="iconfont icon-sousuo"></i></div>
    </div>
</template>
<script>
export default {
  data() {
      return {
          searchCode:'红烧肉',
      }
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.rows {
  @include fj();
  flex-wrap: wrap;
  align-items: center;
}
.padding {
  padding: 0.2rem;
}
.padding-h {
  padding-left: 0.2rem;
  padding-right: 0.2rem;
}
.padding-v {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}
.display-box {
  display: flex;
  align-items: center;
  padding: 0 0.2rem;
  .col-2{
    width: 20%;
  }
  .col-6{
    width: 60%;
    text-align:center;
    font-size: 0.4rem;
  }
}
.header {
  position: absolute;
  top: 0;
  @include wh(100%, 0.88rem);
  background: #f7f7f7;
  .material-icons,
  .iconfont {
    @include sc(0.5rem, #000);
  }
  .center {
    background: #fff;
    height: 0.6rem;
    border-radius: 0.06rem;
    padding: 0 0.3rem;
    @include sc(0.28rem, #999);
  }
  .big {
    color: #fff;
    @include wh(0.88rem, 0.88rem);
    line-height: 0.88rem;
    text-align: center;
  }
}
</style>
<style scoped>
.header .center {
  width: calc(100% - 2.64rem);
}
.headline-box {
  width: calc(100% - 2.48rem);
}
</style>
