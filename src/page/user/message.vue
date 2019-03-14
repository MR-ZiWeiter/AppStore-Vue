<template>
    <div id="message">
        <head-top :go-back='true' head-title="消息中心"></head-top>
        <div class="content p-a-all">
            <div class="item">
                <div class="flex-box">
                    <span class="title"><i class="iconfont icon-lingdang"></i><span class="new"></span>系统消息</span>
                    <span class="small">2018-10-22 15:00</span>
                </div>
                <div class="small">您在【肯德基宅急送】下的订单已确认送达。</div>
            </div>
             <div class="item">
                <div class="flex-box">
                    <span class="title"><i class="iconfont icon-lingdang"></i>系统消息</span>
                    <span class="small">2018-10-22 15:00</span>
                </div>
                <div class="small">您在【肯德基宅急送】下的订单已确认送达。</div>
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
#message {
  .content {
    top: 0.9rem;
    background: #eee;
    padding: 0.2rem;
    .item {
      width: 100%;
      padding: 0.2rem;
      background: #fff;
      font-size: 0.3rem;
      margin-bottom: 0.2rem;
      .flex-box{
          padding-bottom: 0.4rem;
      }
      .title{
          font-size: 0.3rem;
          color:#333;
      }
      .new{
          width: 0.12rem;
          height: 0.12rem;
          border-radius: 50%;
          background: #EE0B0B;
          display: inline-block;
          position: absolute;
          margin-left: -0.35rem;
          margin-top:0.05rem;
      }
      .iconfont{
          font-size: 0.4rem;
          width: 0.4rem;
          height: 0.4rem;
          padding: 0.1rem;
          background: #FCC636;
          color:#fff;
          border-radius: 50%;
          margin-right: 0.2rem;
      }
      .small{
          font-size: 0.26rem;
          color:#999;
      }
    }
  }
}
</style>
