<template>
    <div id="commision">
        <head-top head-title="我的推广" :go-back='true' :customRight="true" rightTitle="明细" :rightAction="rightAction"></head-top>
        <div class="p-a-all">
            <div class="top flex-box" v-if="info.nick_name">
                <div><img :src="info.url+info.user_headimg" :onerror="default_headimg" alt="">
                    <span>{{info.nick_name}}</span>
                </div>
                <div>{{info.info.name?info.info.name:info.level}}</div>
            </div>
            <p style="text-align:center;" class="bg-white price p-b-10">推广员{{info.isuse==1?'已激活':'未激活'}}</p>
            <div class="content-top-box">
                <p class="title">累计</p>
                <p class="money">{{info.commission}}</p>
                <div class="margin-horizontal line-1"></div>
                <div class="flex-box text-color-white " v-if="appConfig.commission&&appConfig.commission.value==0">
                    <div class="col-33">
                        <div>累计</div>
                        <div>{{info.commission}}</div>
                    </div>
                    <div class="col-33">
                        <div>待审核</div>
                        <div>{{info.commission_locked}}</div>
                    </div>
                    <div class="col-33">
                        <div>已提现</div>
                        <div>{{info.commission_withdraw}}</div>
                    </div>
                </div>
            </div>
            <div class="info">
                <div class="flex-box" @click="goto('/commisionlist?id=1&title=推广奖励')">
                    <span>推广奖励</span>
                    <span>{{info.commission_promoter}}
                        <i class="iconfont icon-right"></i>
                    </span>
                </div>
                <div class="flex-box" @click="goto('/commisionlist?id=3&title=代理商分成')">
                    <span>代理商分成</span>
                    <span>{{info.commission_region_agent}}
                        <i class="iconfont icon-right"></i>
                    </span>
                </div>
            </div>
            <div style="padding:0.3rem;" v-if="appConfig.commission&&appConfig.commission.value==0">
                <x-button link="/withdraw">申请提现</x-button>
            </div>
        </div>
    </div>
</template>
<script>
import { getCommission } from "src/service/getData";
import headTop from "src/components/header/head";
import { mapState } from "vuex";
export default {
  components: {
    headTop
  },
  data() {
    return {
      info: {},
      commission:1,
       default_headimg:
        'this.src="' + window.default_headimg + '";this.onerror = null'
    };
  },
   computed:{
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  beforeMount() {
    
    this.getInfo();
  },
  methods: {
    rightAction() {
      this.goto("/commisionlog");
    },
    goto(url) {
      this.$router.push(url);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getCommission();
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
.top {
  background: #fff;
  padding: 0.2rem 0.3rem;
  img {
    width: 1rem;
    height: 1rem;
    background: #eee;
    margin-right: 0.2rem;
    border-radius: 50%;
  }
  div:first-child {
    display: flex;
    align-items: center;
  }
}
.content-top-box {
  // min-height: 3.2rem;
  width: 100%;
  background: linear-gradient(#d5a312, #eec242);
  padding: 0.3rem;
  .title {
    font-size: 0.3rem;
    text-align: center;
  }
  .money {
    font-size: 0.7rem;
    text-align: center;
    border-bottom: 1px solid #fff;
    padding-bottom: 0.1rem;
  }
  div,
  p {
    color: #fff;
  }
  .flex-box {
    padding-top: 0.2rem;
    .col-33 {
      width: 33.3333%;
      text-align: center;
    }
  }
}
#commision button {
  background: #eec242;
  color: #fff;
  font-size: 0.3rem;
  margin-bottom: 0.3rem;
}
.info {
  p {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 2px;
  }
  .flex-box {
    background: #fff;
    padding: 0.2rem 0.3rem;
    margin-bottom: 2px;
    span:last-child {
      color: #ff0000;
      i {
        color: #999;
        font-size: 0.26rem;
      }
    }
  }
}
</style>
