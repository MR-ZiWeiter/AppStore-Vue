<template>
  <div id="coupon">
    <head-top head-title="确认订单" :go-back='true' :rightMenu="true"></head-top>
    <div class="bottom">
      <div class="info">消耗{{appConfig.word?appConfig.word.balance:'余额'}}:
        <span class="price">{{info.count_money?info.count_money:0}}</span>
        <span v-if="info.count_point_exchange">消耗{{appConfig.word?appConfig.word.point:'积分'}}:<span class="price">{{info.count_point_exchange}}</span></span>
      </div>
      <div class="btn" @click="check_order">提交订单</div>
    </div>
    <div class="p-a-all">
      <div class="address" v-if="info.address_default" @click="goto('/address')">
        <i class="iconfont icon-dingwei"></i>
        <div>
          <p class="flex-box">
            <span>收货人信息:{{info.address_default.consigner}}</span>
            <span class="font-size-13">{{info.address_default.mobile}}</span>
          </p>
          <p class="font-size-13 text-color-666" v-html="'收货地址:'+info.address_default.consigner+info.address_default.address"></p>
        </div>
      </div>
      <div v-else class="p-10 m-b bg-white flex-box" @click="goto('/address')">
        <span>还没有添加收货地址</span>
        <i class="iconfont icon-right font-size-14 text-color-999"></i>
      </div>
      <div class="goods bg-white m-b" v-if="info.itemlist">
        <div class="flex-box" v-for="(item,index) in info.itemlist" :key="index">
          <img :src="item.picture_info?item.picture_info.domain+item.picture_info.pic_cover_small:''" alt="" :onerror="local_default_goods_img">
          <div style=" width: calc(100% - 2rem);">
            <p class="ellipsis">{{item.goods_name}}</p>
            <p class="font-size-13 text-color-999 ellipsis">{{item.sku_name}}</p>
            <p class="price font-size-12">价格 : {{item.price}} </p>
            <p class="price font-size-12" v-if="item.point_exchange>0">{{appConfig.word?appConfig.word.point:'积分'}} : {{item.point_exchange}} </p>
            <p class="font-size-12 text-color-999">x {{item.num}}</p>
          </div>
        </div>
      </div>
      <div @click="express_show=true;" class="flex-box bg-white p-10 m-b" v-if="Object.keys(express_info).length>0">
        <span>快递公司</span>
        <span class="font-size-14 text-color-666">{{express_info.name}}
          <i class="iconfont icon-right font-size-12 text-color-999"></i>
        </span>
      </div>
      <!-- <div class="flex-box bg-white p-10 m-b" v-if="info.member_account">
        <p>使用积分
          <span class="price font-size-13">{{info.member_account.balance}}</span>
        </p>
        <div>使用<input type="text" class="input-price" v-model="balance_use" @input="setBalance" placeholder="0.00">元</div>
      </div> -->
      
      <!-- <div class="flex-box bg-white p-10 m-b" v-if="info.coupon_list" @click="coupon_show=true">
        <span>优惠券</span>
        <span v-if="check_coupon.money" class="font-size-13 price">{{check_coupon.money}}</span>
        <span v-else class="font-size-13 text-color-999">不使用优惠券</span>
      </div> -->
      <div class="flex-box bg-white p-10 m-b remark">
        <p>买家留言 </p>
        <textarea placeholder="给卖家留言" v-model="remark" rows="2"></textarea>
      </div>
      <p class="p-10">结算信息</p>
      <div class="flex-box p-10 m-b bg-white" v-if="info.itemlist">
        <span>共{{info.itemlist.length}}件商品,总计</span>
        <span class="price font-size-13">{{info.count_money}}</span>
      </div>
      <div class="flex-box p-10 m-b bg-white">
        <span>运费</span>
        <span class="price font-size-13">{{express_info.fee?express_info.fee:0}}</span>
      </div>
      
      <div class="flex-box p-10 m-b bg-white">
        <span>{{appConfig.word?appConfig.word.point:'积分'}}使用</span>
        <span class="price font-size-13">{{info.count_point_exchange}}</span>
      </div>
      <div class="flex-box p-10 m-b bg-white" v-if="check_coupon.money">
        <span>优惠券使用</span>
        <span class="price font-size-13">{{check_coupon.money}}</span>
      </div>
    </div>
    <actionsheet v-model="express_show" :menus="express" @on-click-menu="check_express"></actionsheet>
    <div v-transfer-dom>
      <popup v-model="pwd_show" class="pwd-box">
        <popup-header :right-text="'取消'" :title="'请输入支付密码'" :show-bottom-border="false" @on-click-right="pwd_show = false"></popup-header>
        <pwd-box ref="pwd" @input-ok="createOrder"></pwd-box>
      </popup>
      <popup v-if="info.coupon_list" v-model="coupon_show">
        <div style="padding:0.2rem 0.3rem;">
          <button @click="check_coupon={};coupon_show=false;">不使用红包</button>
        </div>
        <list :list="info.coupon_list" @coupon_check="coupon_check"></list>
      </popup>
    </div>
  </div>
</template>
<script>
import pwdBox from "src/components/common/pwd";
import headTop from "src/components/header/head";
import {
  paymentOrder,
  orderCreate,
  cartpaymentOrder,
  servicePaymentOrder,
  serviceOrderCreate
} from "src/service/getData";
import { mapState } from "vuex";
import list from "src/components/coupon/index";
import { TransferDom } from "vux";

export default {
  directives: {
    TransferDom
  },
  components: {
    headTop,
    pwdBox,
    list
  },
  data() {
    return {
      check_coupon: {},
      coupon_show: false,
      pwd_show: false,
      balance_use: 0,
      point_use: 0,
      info: {},
      express: {},
      express_info: {},
      express_show: false,
      point_use_max: 0,
      balance_use_max: 0,
      remark: "",
      local_default_goods_img: 'this.src="'+window.default_goods_img+'";this.onerror = null'
    };
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    }),
    // total_balance() {
    //   if (Object.keys(this.info).length > 0) {
    //     let money = (
    //       parseFloat(this.express_info.fee ? this.express_info.fee : 0) +
    //       parseFloat(this.info.count_money)
    //     ).toFixed(2);
    //     //console.log(money);
    //     let coupon_money = 0;
    //     if (this.check_coupon.money) {
    //       coupon_money = parseFloat(this.check_coupon.money);
    //     }
    //     this.setBalanceUseMax(coupon_money);
    //     this.setPointUseMax(coupon_money);
    //     return (
    //       parseFloat(money) -
    //       coupon_money -
    //       parseFloat(this.balance_use) -
    //       parseFloat(this.point_use)
    //     ).toFixed(2);
    //   }
    //   return 0;
    // }
  },
  watch: {
    // check_coupon(value) {
    //   let money = (
    //     parseFloat(this.express_info.fee ? this.express_info.fee : 0) +
    //     parseFloat(this.info.count_money)
    //   ).toFixed(2);
    //   if (this.balance_use + this.point_use + value.money > money) {
    //     let coupom_money = value.money;
    //     if (this.balance_use >= coupom_money) {
    //       this.balance_use = this.balance_use - coupom_money;
    //     } else if (this.point_use >= coupom_money) {
    //       this.point_use = this.point_use - coupom_money;
    //     }
    //   }
    // },
    // balance_use(value) {
    //   if (!value) {
    //     this.balance_use = 0;
    //   }
    // },
    // point_use(value) {
    //   if (!value) {
    //     this.point_use = 0;
    //     return 0;
    //   }
    //   let is_num = /^\d+$/;
    //   if (!is_num.test(value)) {
    //     this.point_use = Math.abs(parseInt(value));
    //     return false;
    //   }
    //   this.point_use = parseInt(this.point_use);
    //   if (Object.keys(this.info).length > 0) {
    //     let max = this.point_use_max;
    //     if (this.point_use > max) {
    //       this.point_use = max;
    //     }
    //   }
    // }
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    coupon_check(data) {
      this.check_coupon = data;
      this.coupon_show = false;
    },
    check_order() {
      if (!this.info.address_default) {
        this.$vux.toast.text("未选择收货地址!", "middle");
        return false;
      }
      let that = this;
      // if (this.balance_use || this.point_use || this.check_coupon.coupon_id) {
        if (!this.info.is_paypassword) {
          this.$vux.confirm.show({
            title: "支付密码未设置",
            content: "是否前往设置支付密码?",
            onConfirm() {
              that.$router.push("/userinfo");
            }
          });
          return false;
        }
         this.$refs.pwd.clear(); 
        this.pwd_show = true;
      // } else {
      //   this.createOrder("");
      // }
    },
    async createOrder(pwd) {
      let goods_sku_list = "";
      let that = this;
      for (let i in this.info.itemlist) {
        goods_sku_list =
          goods_sku_list +
          this.info.itemlist[i].sku_id +
          ":" +
          this.info.itemlist[i].num +
          ",";
      }
      goods_sku_list = goods_sku_list.substring(0, goods_sku_list.length - 1);
      that.$vux.loading.show({
        text: "正在创建..."
      });
      let res;
      if (this.$route.path == "/confirmServiceOrder") {
        res = await serviceOrderCreate(
          goods_sku_list,
          this.info.address_default.id,
          this.remark,
          this.point_use,
          this.balance_use,
          this.check_coupon.coupon_id ? this.check_coupon.coupon_id : "",
          this.express_info.id,
          pwd ? pwd : ""
        );
      } else {
        res = await orderCreate(
          goods_sku_list,
          this.info.address_default.id,
          this.remark,
          this.point_use,
          this.balance_use,
          this.check_coupon.coupon_id ? this.check_coupon.coupon_id : "",
          this.express_info.id,
          pwd ? pwd : ""
        );
      }
      that.$vux.loading.hide();
      if (res.code == 1) {
        if (this.total_balance > 0) {
          if (this.$route.path == "/confirmServiceOrder") {
            this.$router.push("servicePay?id=" + res.data);
          } else {
            this.$router.push("pay?id=" + res.data);
          }
        } else {
          if (this.$route.path == "/confirmServiceOrder") {
            this.$router.push("/serviceorder");
          } else {
            this.$router.push("/order");
          }
        }
      } else {
        this.$vux.toast.text(res.data, "middle");
      }
    },
    setBalanceUseMax(coupon_money) {
      let money = (
        parseFloat(this.express_info.fee ? this.express_info.fee : 0) +
        parseFloat(this.info.count_money)
      ).toFixed(2);
      let balance_use_max = parseFloat(this.info.member_account.balance);
      balance_use_max =
        balance_use_max > parseInt(money) ? parseInt(money) : balance_use_max;
      if (this.point_use_max) {
        balance_use_max = balance_use_max - parseInt(this.point_use);
        balance_use_max = balance_use_max > 0 ? balance_use_max : 0;
      }
      this.balance_use_max = balance_use_max - coupon_money;
    },
    setPointUseMax(coupon_money) {
      let money = (
        parseFloat(this.express_info.fee ? this.express_info.fee : 0) +
        parseFloat(this.info.count_money)
      ).toFixed(2);
      let point_use_max =
        this.info["count_point_use"] > this.info.member_account["point"]
          ? this.info.member_account["point"]
          : this.info["count_point_use"];
      point_use_max =
        point_use_max > parseInt(money) ? parseInt(money) : point_use_max;
      if (this.balance_use) {
        point_use_max = point_use_max - Math.ceil(this.balance_use);
        point_use_max = point_use_max > 0 ? point_use_max : 0;
      }
      this.point_use_max = point_use_max - coupon_money;
    },
    setBalance(e) {
      let is_num = /^[0-9]*$/;
      if (!is_num.test(e.data) && e.data != ".") {
        this.balance_use = 0;
        return false;
      }
      let num = this.balance_use;
      let list = num.split(".");
      if (list.length > 2) {
        this.balance_use = parseInt(list[0]) + "." + (list[1] ? list[1] : 0);
      } else if (list.length == 2 && list[1]) {
        let list_2 = list[1] ? list[1] : 0;
        list_2 = list_2.substring(0, 2);
        this.balance_use = parseInt(list[0]) + "." + list_2;
      } else if (list.length == 1) {
        this.balance_use = parseFloat(this.balance_use);
      }
      if (parseFloat(this.balance_use) > this.balance_use_max) {
        this.balance_use = this.balance_use_max;
      }
    },
    check_express(data) {
      let that = this;
      let list = this.info.express_company_list;
      for (let i in list) {
        if (list[i].co_id == data) {
          that.express_info = {
            id: list[i].co_id,
            name: list[i].company_name,
            fee: list[i].express_fee
          };
          return false;
        }
      }
    },
    async getInfo() {
      this.$vux.loading.show({
        text: "正在生成订单信息..."
      });

      if (this.$route.query.type == "cart") {
        var res = await cartpaymentOrder("cart", this.$route.query.ids);
      } else if (this.$route.path == "/confirmServiceOrder") {
        var res = await servicePaymentOrder(
          this.$route.query.sku_id,
          this.$route.query.num ? this.$route.query.num : 1
        );
      } else {
        var res = await paymentOrder(
          this.$route.query.sku_id,
          this.$route.query.num ? this.$route.query.num : 1
        );
      }
      this.$vux.loading.hide();
      let that = this;
      if (res.code == 1) {
        this.info = res.data;
        if (!this.info.address_default) {
          this.$vux.confirm.show({
            title: "地址未设置",
            content: "是否前往设置?",
            onConfirm() {
              that.$router.push("/address_add");
            }
          });
          return false;
        }
        // this.total_balance=res.data.count_money;
        let money = parseFloat(this.info.count_money).toFixed(2);
        let point_use_max =
          this.info.count_point_use > this.info.member_account.point
            ? this.info.member_account.point
            : this.info.count_point_use;
        this.point_use = point_use_max;
        for (let i in res.data.express_company_list) {
          that.express[res.data.express_company_list[i].co_id] =
            res.data.express_company_list[i].company_name;
          if (res.data.express_company_list[i].is_default) {
            that.express_info = {
              id: res.data.express_company_list[i].co_id,
              name: res.data.express_company_list[i].company_name,
              fee: res.data.express_company_list[i].express_fee
            };
          }
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
button {
  width: 100%;
  padding: 0.2rem 0;
}
#coupon {
  .m-b {
    margin-bottom: 0.02rem;
  }

  .bottom {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 1rem;
    padding: 0;
    display: flex;
    align-items: center;
    .btn {
      height: 1rem;
      background: #ff4444;
      color: #fff;
      line-height: 1rem;
      width: 2rem;
      text-align: center;
      border-top: 1px solid #ccc;
    }
    .info {
      border-top: 1px solid #ccc;
      height: 1rem;
      line-height: 1rem;
      width: calc(100% - 2rem);
      text-align: right;
      background: #fff;
      padding-right: 0.25rem;
    }
  }
  .p-a-all {
    bottom: 1rem;
    top: 1rem;
    background: #eee;
    .address {
      padding: 0.2rem 0.3rem;
      background: #fff;
      display: flex;
      align-items: center;
      margin-bottom: 0.02rem;
      i {
        display: block;
        width: 0.5rem;
      }
      div {
        width: 100%;
      }
    }
    .goods {
      .flex-box {
        padding: 0.2rem 0.3rem;
        img {
          width: 1.5rem;
          height: 1.5rem;
          background: #eee;
        }
        div {
          text-align: right;
        }
      }
    }
    .input-price {
      width: 1.2rem;
      text-align: center;
      border-bottom: 1px dashed #000;
    }
    .remark {
      textarea {
        width: calc(100% - 2rem);
        background: #f4f4f4;
        padding: 0.1rem;
        resize: none;
      }
    }
  }
}
</style>
<style lang="scss">
.pwd-box {
  .vux-popup-header-right {
    position: absolute;
    right: 15px;
  }
}
.weui-mask {
  z-index: 3000;
}
</style>
