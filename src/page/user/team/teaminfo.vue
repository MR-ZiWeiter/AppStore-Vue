<template>
    <div id="teaminfo">
        <head-top :go-back='true' head-title="团队会员详情"></head-top>
        <div class="p-a-all" v-if="info.nick_name">
            <div class="top">
                <div class="textcenter">
                    <img :src="info.url+info.user_headimg" class="header" alt="">
                </div>
                <p class="textcenter">{{info.nick_name}}</p>
                <p class="textcenter text-color-666 font-size-13" v-if="info.promoter_no">推广码 : {{info.promoter_no}}</p>
            </div>
            <div class="center" >
                <div @click="goto('/withdrawlog?order_type=0&type=1&id='+id)" >待付款
                    <p class="price">{{info.unpaidOrder}}</p>
                </div>
                <div @click="goto('/withdrawlog?order_type=0&type=2&id='+id)">未完成
                    <p class="price">{{info.other}}</p>
                </div>
                <div @click="goto('/withdrawlog?order_type=0&type=3&id='+id)">已完成
                    <p class="price">{{info.finish}}</p>
                </div>
            </div>
            <div class="bottom">
                <div class="flex-box">
                    <span>本月预估佣金</span>
                    <span class="price">{{info.othernum}}</span>
                </div>
                <div class="flex-box">
                    <span>本月已结佣金</span>
                    <span class="price">{{info.finishnum}}</span>
                </div>
                <div class="flex-box">
                    <span>上月月预估佣金</span>
                    <span class="price">{{info.lastnum}}</span>
                </div>
                <div class="flex-box">
                    <span>全部预估佣金</span>
                    <span class="price">{{info.allnum}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getTeamOrderInfo } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  data() {
    return {
      info: {},
      id:this.$route.query.id
    };
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    goto(url){
      this.$router.push(url);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getTeamOrderInfo(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#teaminfo {
  .bottom {
    padding: 0 0.3rem;
    background: #fff;
    .flex-box {
      line-height: 0.8rem;
      border-bottom: 1px solid #ccc;
    }
    .flex-box:last-child{
        border-bottom: 0;
    }
  }
  .top {
    padding: 0.2rem 0.3rem;
    background: #fff;
    border-bottom: 1px solid #ccc;
    .header {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: #ccc;
      display: inline-block;
    }
    p {
      margin-top: 0.15rem;
    }
  }
  .center {
    display: flex;
    background: #fff;
    border-bottom: 1px solid #ccc;
    div {
      width: 33.3333%;
      text-align: center;
      border-right: 1px solid #ccc;
      padding: 0.2rem 0;
      p {
        width: 100%;
        text-align: center;
      }
    }
    div:last-child {
      border-right: 0;
    }
  }
  .textcenter {
    text-align: center;
  }
}
</style>
