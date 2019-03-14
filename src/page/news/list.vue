<template>
    <div id="newsList">
        <head-top :go-back='true' head-title="精品头条"></head-top>
        <div class="p-a-all">
            <div class="item">
                <div class="ellipsis-2">为什么健身餐里要加西兰花？花菜不行吗？ 超详细健身餐食谱~</div>
                <div><img src="../../images/temp/7.png" alt=""></div>
                <div class="ellipsis-2 ">最近顿顿午餐吃健身餐，吃得都有点舌苔麻木。其实牛肉鸡胸生 菜沙拉什么的都还好，但是水煮西兰花真的受不了，那种没有...
                </div>
                <div class="flex-box">
                    <span>晶品汇</span>
                    <span>15:10</span>
                </div>
            </div>
            <div class="item">
                <div class="ellipsis-2">为什么健身餐里要加西兰花？花菜不行吗？ 超详细健身餐食谱~</div>
                <div><img src="../../images/temp/7.png" alt=""></div>
                <div class="ellipsis-2 ">最近顿顿午餐吃健身餐，吃得都有点舌苔麻木。其实牛肉鸡胸生 菜沙拉什么的都还好，但是水煮西兰花真的受不了，那种没有...
                </div>
                <div class="flex-box">
                    <span>晶品汇</span>
                    <span>15:10</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  methods: {}
};
</script>
<style lang="scss" scoped>
#newsList {
  .p-a-all {
    background: #eee;
    .item {
      background: #fafafa;
      padding: 0.4rem;
      font-size: 0.3rem;
      margin-bottom: 0.2rem;
      div:first-child {
        font-size: 0.36rem;
        margin-bottom: 0.3rem;
      }
      div:nth-child(2) {
        max-height: 4rem;
        overflow: hidden;
        margin-bottom: 0.3rem;
      }
      div:nth-child(3) {
        color: #666;
        font-size: 0.24rem;
        margin-bottom: 0.3rem;
      }
      div:nth-child(4) span{
        color: #999;
        font-size: 0.24rem;
      }
      img {
        width: 100%;
      }
    }
  }
}
</style>
