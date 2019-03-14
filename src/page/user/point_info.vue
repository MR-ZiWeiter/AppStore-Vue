<template>
  <div id="pointInfo">
    <head-top :go-back='true' head-title="优惠券"></head-top>
    <div class="p-a-all">
      <div class="item flex-box">
          <span>支付积分</span>
          <span class="text-color-red">100</span>
      </div>
       <div class="item flex-box">
          <span>兑换购物券面额</span>
          <span>10元</span>
      </div>
       <div class="item flex-box">
          <span>兑换创建时间</span>
          <span>2018-10-23 11:15:19</span>
      </div>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
export default {
  components: { headTop }
};
</script>
<style lang="scss" scoped>
#pointInfo {
    .p-a-all{
        background: #eee;
        .item{
            background: #fff;
            padding:0.3rem;
            font-size:0.3rem;
            margin-bottom: 1px;
        }
    }
}
</style>

