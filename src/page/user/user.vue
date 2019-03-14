<template>
  <div id="user" class="p-a-all">
    <div class="head" :style="top_bg">
      <i @click="goto('set')" class="iconfont icon-shezhi"></i>
    </div>
    <div class="top">
      <div class="userinfo-box"  v-if="userInfo.user_name">
        <div class="flex-box info" @click="goto('userinfo')">
          <div class="rows">
            <img class="headimg" :src="userInfo.url+userInfo.user_headimg" alt="" :onerror="default_headimg">
            <div style="display:flex;flex-direction: column;">
            <span>{{userInfo.nick_name}}</span>
            <span class="font-size-15"  v-if="userInfo.level">等级:<span class="price">{{userInfo.level.level_name}}</span></span>
            </div>
            <i class="material-icons">
              chevron_right
            </i>
          </div>
        </div>
        <div class="flex-box text-align-center" style="padding:0 0.52rem;">
          <div @click="goto('/balance')">
            <p>{{userInfo.balance}}</p>
            <p class="font-size-12 text-color-666">{{appConfig.word?appConfig.word.balance:'余额'}}</p>
          </div>
          <div @click="goto('/points')">
            <p>{{userInfo.point}}</p>
            <p class="font-size-12 text-color-666">{{appConfig.word?appConfig.word.point:'积分'}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="flex-box menu-title" v-if="userInfo.level">
      
      <span class="font-size-15" v-if="userInfo.level.goods_discount!=1">享受商品折扣:<span class="price">{{userInfo.level.goods_discount*10}}折</span></span>
    </div> -->
    <div class="flex-box menu-title">
      <span class="font-size-15">推广中心</span>
    </div>
    <div class="flex-box spread">
      <div @click="goto('/team')">
        <p>
          <span class="text-color-red">{{userInfo.team_num}}</span>人</p>
        <p>我的团队</p>
      </div>
      <div @click="goto('/commision')">
        <p>
          <span class="text-color-red">{{userInfo.commission}}</span>
        </p>
        <p>我的推广</p>
      </div>
    </div>
    <div class="flex-box menu-title">
      <span class="font-size-15">我的订单</span>
      <span @click="goto('/order')" class="rows font-size-12 text-color-999">查看更多订单
        <i class="material-icons font-size-15 text-color-999">
          keyboard_arrow_right
        </i>
      </span>
    </div>
    <div class="flex-box menu">
      <div @click="goto('/order')" class="badge-container text-align-center">
        <img src="../../images/ios/待付款@2x.png" alt="">
        <p>全部</p>
      </div>
      <div @click="goto('/order',{type:1})" class="badge-container text-align-center">
        <badge v-if="userInfo.unpaidOrder>0" class="order-badge" :text="userInfo.unpaidOrder"></badge>
        <img src="../../images/ios/待付款@2x.png" alt="">
        <p>待付款</p>
      </div>
      <div @click="goto('/order',{type:2})" class="badge-container text-align-center">
        <badge v-if="userInfo.shipmentPendingOrder>0" class="order-badge" :text="userInfo.shipmentPendingOrder"></badge>
        <img src="../../images/ios/待配送@2x.png" alt="">
        <p>待发货</p>
      </div>
      <div @click="goto('/order',{type:3})" class="badge-container text-align-center">
        <badge v-if="userInfo.goodsNotReceivedOrder>0" class="order-badge" :text="userInfo.goodsNotReceivedOrder"></badge>
        <img src="../../images/ios/待收货@2x.png" alt="">
        <p>待收货</p>
      </div>

    </div>
    <!-- <div class="menu-title">
            常用工具
        </div>
        <div class=" menu ">
            <div @click="goto('/order_second')" class="text-align-center">
                <img src="../../images/ios/second_shop.png" alt="">
                <p>二次转售</p>
            </div>
            <div @click="goto('/secondlist')" class="text-align-center">
                <img src="../../images/ios/second.png" alt="">
                <p>二手市场</p>
            </div>
            <div @click="goto('/serviceorder')" class="text-align-center">
                <img src="../../images/ios/service_order.png" alt="">
                <p>服务订单</p>
            </div>
        </div> -->
    <div class="menu-title">
      常用工具
    </div>
    <div class=" menu no-margin" style="justify-content: flex-start;">
      <div class="text-align-center col-25" @click="goto('/balance')">
        <img src="../../images/ios/balance.png" alt="">
        <p>{{appConfig.word?appConfig.word.balance:'余额'}}明细</p>
      </div>
      <div class="text-align-center col-25" @click="goto('/points')">
        <img src="../../images/ios/peie.png" alt="">
        <p>{{appConfig.word?appConfig.word.point:'积分'}}明细</p>
      </div>
      <div class="text-align-center col-25" @click="goto('/recharge')">
        <img src="../../images/ios/recharge.png" alt="">
        <p>充值</p>
      </div>
      <div class="text-align-center col-25" @click="goto('/commision')">
        <img src="../../images/ios/commission.png" alt="">
        <p>推广中心</p>
      </div>
      <div class="text-align-center col-25" @click="goto('/withdraw_account')">
        <img src="../../images/account.png" alt="">
        <p>提现账号</p>
      </div>
      <!-- <div class="text-align-center" @click="goto('/qrcode')">
        <img src="../../images/qrcode.png" alt="">
        <p>推广二维码</p>
      </div> -->
      <div @click="goto('address')" class="text-align-center  col-25">
        <img src="../../images/ios/地址@2x.png" alt="">
        <p>收货地址</p>
      </div>
      <div @click="goto('/collect')" class="text-align-center col-25">
        <img src="../../images/college.png" alt="">
        <p>我的收藏</p>
      </div>
      <!-- <div class="text-align-center  col-25" @click="goto('/cart')">
        <img src="../../images/ios/cart.png" alt="">
        <p>购物车</p>
      </div>  -->
      <div @click="goto('/path')" class="text-align-center col-25">
        <img src="../../images/path.png" alt="">
        <p>我的足迹</p>
      </div>
      <div class="text-align-center col-25" @click="goto('/hang_sale_order')">
        <img src="../../images/ios/门店@2x.png" alt="">
        <p>挂售专区</p>
      </div>
      <div class="text-align-center col-25" @click="goto('login')">
        <img src="../../images/ios/消息@2x.png" alt="">
        <p>切换账号</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getUser } from "src/service/getData";
import { Badge } from "vux";
import { mapState } from "vuex";
export default {
  components: {
    Badge
  },
  data() {
    return {
      top_bg:
        "backgroundImage:url(" + require("../../images/ios/bg@2x.png") + ")",
      userInfo: {},
      default_img: window.default_headimg,
      default_headimg:
        'this.src="' + window.default_headimg + '";this.onerror = null'
    };
  },
  computed:{
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  async beforeMount() {
    let res = await getUser();
    if (res.code == 1) {
      this.userInfo = res.data;
    }
  },
  methods: {
    goto(url, query) {
      if (query) {
        this.$router.push({ path: url, query: query });
      } else {
        this.$router.push(url);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#user {
  background: #eee;
  bottom: 1rem;
  .head {
    height: 1.7rem;
    padding: 0.2rem;
    font-size: 0.3rem;
    text-align: right;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    i {
      font-size: 0.5rem;
      color: #fafafa;
    }
  }
  .top {
    background: #fafafa;
    padding: 1.6rem 0.2rem 0.2rem 0.2rem;
    position: relative;
    .userinfo-box {
      padding: 0 0.3rem 0.24rem 0.3rem;
      background: #fafafa;
      position: absolute;
      top: -0.5rem;
      border-radius: 0.06rem;
      box-shadow: 0 1px 10px 1px #ccc;
      font-size: 0.3rem;
      .info {
        position: relative;
        top: -0.2rem;
      }
      i {
        font-size: 0.5rem;
        color: #ff4444;
      }
      .headimg {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        margin-right: 0.26rem;
        position: relative;
        background: #eee;
      }
    }
  }
  .shop {
    background: #fff;
    padding: 0.2rem 0.5rem;
    margin-bottom: 0.2rem;
    justify-content: space-around;
    div p:first-child {
      color: #ff4444;
    }
    div p:last-child {
      color: #666;
      font-size: 0.26rem;
    }
  }
  .menu-title {
    padding: 0.24rem;
    font-size: 0.3rem;
    margin-bottom: 1px;
    background: #fafafa;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    font-size: 0.3rem;
    .box {
      padding: 0 0.25rem;
      background: #eee;
      z-index: 10;
    }
    .line {
      width: 50%;
      height: 1px;
      background: #333;
      position: absolute;
    }
    .iconfont {
      font-size: 0.3rem;
    }
  }
  .menu {
    background: #fafafa;
    padding: 0.3rem 0.3rem 0.1rem 0.3rem;
    margin-bottom: 0.2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    img {
      width: 0.6rem;
      height: 0.6rem;
    }
    .text-align-center {
      // width: 25%;
      margin-bottom: 0.2rem;
    }
    p {
      color: #333;
      font-size: 0.24rem;
    }
  }
  .spread {
    background: #fafafa;
    padding: 0.3rem;
    margin-bottom: 0.2rem;
    text-align: center;
    justify-content: space-around;
  }
  .badge-container {
    position: relative;
    .order-badge {
      position: absolute;
      /* left: 0; */
      top: 0;
      right:-0.1rem;
      // margin-left: 0.5rem;
      font-size: 0.24rem;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 0.15rem;
      line-height: 0.3rem;
    }
  }
}
</style>
<style scoped>
#user .userinfo-box {
  width: calc(100% - 0.4rem);
}
</style>

