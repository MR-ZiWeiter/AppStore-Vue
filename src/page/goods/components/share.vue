<template>
    <div class="share p-a-all" @click="hide">
        <div style="text-align:right;margin-bottom:0.3rem;">
            <img src="../../../images/goods_share.png" alt="">
        </div>
        <p>点击右上角</p>
        <p>将此商品分享给好友</p>
    </div>
</template>
<script>
export default {
    methods:{
        hide(){
            this.$emit('hideShare');
        }
    }
};
</script>
<style lang="scss" scoped>
.share {
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  img {
    width: 1rem;
  }
  p{
      color:#fff;
      font-size:0.32rem;
      text-align: right;
      padding-right: 0.8rem;
      margin-bottom: 0.1rem;
  }
}
</style>

