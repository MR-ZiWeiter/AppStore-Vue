<template>
  <div>
    <head-top head-title="创建订单" :go-back='true' :rightMenu="true"></head-top>
    <div class="bottom">
      <div class="info">合计 :
        <span class="price">￥{{total_balance}}</span>
      </div>
      <div class="btn" @click="check_order">立即支付</div>
    </div>
    <div class="p-a-all" v-if="info.shop_config">
      <div v-if="goods_type==1">
        <div class="address m-b" v-if="info.address_is_have" @click="goto('/address')">
          <i class="iconfont icon-dingwei"></i>
          <div>
            <p>收货人:{{info.address_default.consigner}}
              <span class="font-size-15 font-bold">{{info.address_default.mobile}}</span>
            </p>
            <p class="font-size-15 text-color-666 ellipsis" v-html="'收货地址:'+info.address_default.address_info+info.address_default.address"></p>
          </div>
          <i style="width:auto;" class="iconfont icon-right text-color-999"></i>
        </div>
        <div v-else class="p-10 m-b bg-white flex-box" @click="goto('/address')">
          <span>还没有添加收货地址</span>
          <i class="iconfont icon-right font-size-14 text-color-999"></i>
        </div>
      </div>

      <div v-if="info.itemlist.length>0" class="goods flex-box border-bottom" v-for="(item,key) in info.itemlist" :key="key">
        <img :src="item.picture_info.pic_cover_small" :onerror="local_default_goods_img">
        <div class="good-info">
          <p class="ellipsis-2">{{item.goods_name}}</p>
          <p class="font-size-12 text-color-999">{{item.sku_name}}</p>
          <div class="flex-box" style="width:100%">
            <p class="text-color-999 font-size-12 ">价格
              <span class="font-bold font-size-16 price">{{item.price}}</span>
            </p>
            <p class="font-size-14 text-color-333">{{item.num}}件</p>
          </div>
        </div>
      </div>

      <div @click="express_show=true;" class="flex-box bg-white p-10 border-bottom" v-if="Object.keys(express_info).length>0&&parseFloat(info.express)>0">
        <span class="left-text">快递公司</span>
        <span class="font-size-14 text-color-666">{{express_info.name}}
          <i class="iconfont icon-right font-size-12 text-color-999"></i>
        </span>
      </div>
      <div class="flex-box bg-white p-10 border-bottom" v-if="info.member_account">
        <p class="left-text">使用{{info.shop_config.money_name}}
          <span class="price font-size-13">{{info.member_account.balance}}</span>
        </p>
        <div class="left-text">使用<input type="text" class="input-price" v-model="balance_use" @input="setBalance" placeholder="0.00"></div>
      </div>
      <div class="flex-box bg-white p-10 border-bottom" v-if="info.member_account">
        <p class="left-text">使用{{info.shop_config.point_name}}
          <span class="price font-size-13">{{info.member_account.point?info.member_account.point:0}}个
            <span class="font-size-12 text-color-999" v-if="info.count_point_use">(最多使用{{info.count_point_use}})</span>
          </span>
        </p>
        <div class="left-text">使用<input type="text" class="input-price" v-model="point_use" placeholder="0"></div>
      </div>
      <div class="flex-box bg-white p-10 border-bottom" v-if="info.coupon_list" @click="coupon_show=true">
        <span class="left-text">优惠券</span>
        <span v-if="check_coupon.money" class="font-size-13 price">￥{{check_coupon.money}}</span>
        <span v-else class="font-size-13 text-color-999">不使用优惠券</span>
      </div>
      <div class="title border-bottom">
        <input class="remark" type="text" placeholder="店铺订单留言:">
      </div>
      <p class="p-10">结算信息</p>
      <div class="flex-box p-10 border-bottom bg-white" v-if="info.itemlist">
        <span class="left-text">共{{info.itemlist.length}}件商品,总计</span>
        <span class="price font-size-13">￥{{info.count_money}}</span>
      </div>
      <div class="flex-box p-10 border-bottom bg-white" v-if="goods_type">
        <span class="left-text">运费</span> 
        <span class="price font-size-13">￥{{express_info.fee?express_info.fee:0}}</span>
      </div>
      <div class="flex-box p-10 border-bottom bg-white">
        <span class="left-text">积分使用</span>
        <span class="price font-size-13">{{point_use}}</span>
      </div>
      <div class="flex-box p-10 border-bottom bg-white">
        <span class="left-text">{{info.shop_config.money_name}}使用</span>
        <span class="price font-size-13">￥{{balance_use}}</span>
      </div>
      <div class="flex-box p-10 border-bottom bg-white" v-if="check_coupon.money">
        <span class="left-text">优惠券使用</span>
        <span class="price font-size-13">￥{{check_coupon.money}}</span>
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
  defaultAddress,
  paymentOrder,
  orderCreate,
  cartpaymentOrder
} from "src/service/getData";
import list from "src/components/coupon/index";
import { mapState } from "vuex";
export default {
  components: {
    headTop,
    pwdBox,
    list
  },
  data() {
    return {
      coupon_show: false,
      info: {},
      check_coupon: {},
      pwd_show: false,
      point_use_max: 0,
      balance_use_max: 0,
      balance_use: 0,
      point_use: 0,
      remark: "",
      co_id: 0,
      express: {},
      express_info: {},
      express_show: false,
      goods_type: 1,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    }),
    total_balance() {
      if (Object.keys(this.info).length > 0) {
        let money = (
          parseFloat(
            Object.keys(this.express_info).length > 0
              ? this.express_info.fee
              : 0
          ) + parseFloat(this.info.count_money)
        ).toFixed(2);
        let coupon_money = 0;
        if (this.check_coupon && this.check_coupon.money) {
          coupon_money = parseFloat(this.check_coupon.money);
        }
        let point_rate = 1; // parseFloat(this.info.point_rate);
        this.setBalanceUseMax(coupon_money);
        this.setPointUseMax(coupon_money);
        return (
          parseFloat(money) -
          coupon_money -
          parseFloat(this.balance_use) -
          parseFloat(this.point_use) * point_rate
        ).toFixed(2);
      }
      return 0;
    }
  },
  watch: {
    check_coupon(value) {
      let point_rate = 1; // parseFloat(this.info.point_rate);
      let money = (
        parseFloat(
          Object.keys(this.express_info).length > 0 ? this.express_info.fee : 0
        ) + parseFloat(this.info.count_money)
      ).toFixed(2);
      if (
        this.balance_use +
          this.point_use * point_rate +
          parseFloat(value.money) >
        money
      ) {
        let coupom_money = value.money;
        if (this.balance_use >= coupom_money) {
          let isdec =
            this.balance_use +
            this.point_use * point_rate +
            parseFloat(value.money) -
            money;
          this.balance_use = this.balance_use - isdec;
        } else if (this.point_use * point_rate >= coupom_money) {
          this.point_use = Math.ceil(
            (this.point_use * point_rate - coupom_money) / point_rate
          );
        }
      }
    },
    balance_use(value) {
      if (!value) {
        this.balance_use = 0;
      }
    },
    point_use(value) {
      if (!value) {
        this.point_use = 0;
        return 0;
      }
      let is_num = /^\d+$/;
      if (!is_num.test(value)) {
        this.point_use = Math.abs(parseInt(value));
        return false;
      }
      this.point_use = parseInt(this.point_use);
      if (Object.keys(this.info).length > 0) {
        let max = this.point_use_max;
        if (this.point_use > max) {
          this.point_use = max;
        }
      }
    }
  },
  beforeMount() {
    this.goods_type = this.$route.query.goods_type==1;
    console.log(this.goods_type);
    this.getInfo();
    //this.getGoodsExpress();
  },
  methods: {
    coupon_check(data) {
      this.check_coupon = data;
      this.coupon_show = false;
    },
    check_order() {
      if (!this.info.address_default && this.goods_type == 1) {
        this.$vux.toast.text("未选择收货地址!", "middle");
        return false;
      }

      let that = this;
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
      if (this.balance_use || this.point_use || this.check_coupon.coupon_id) {
        this.$refs.pwd.clear();
        this.pwd_show = true;
      } else {
        this.createOrder("");
      }
    },
    async createOrder(pwd) {
      let goods_sku_list = "";
      this.pwd_show = false;
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
      let express=(parseFloat(this.info.express)==0)?0:( this.express_info.id ? this.express_info.id : 0)
      let res = await orderCreate(
        goods_sku_list,
        this.remark,
        pwd ? pwd : "",
        express,
        this.point_use,
        this.balance_use,
        this.check_coupon.coupon_id ? this.check_coupon.coupon_id : "",
        this.goods_type ? 0 : 1
      );
      that.$vux.loading.hide();
      if (res.code == 1) {
        if (this.total_balance > 0) {
          this.$router.push("pay?id=" + res.data);
        } else {
          this.$router.push("/order");
        }
        // this.$router.push("/pay_result?orderid=" + res.data);
      } else {
        this.$vux.toast.text(res.data ? res.data : res.msg, "middle");
      }
    },
    setBalanceUseMax(coupon_money) {
      let money = (
        parseFloat(
          Object.keys(this.express_info).length > 0 ? this.express_info.fee : 0
        ) + parseFloat(this.info.count_money)
      ).toFixed(2);
      ///^\d+\.?\d{0,2}$/
      let balance_use_max = parseFloat(this.info.member_account.balance);
      balance_use_max =
        balance_use_max > parseFloat(money) ? parseFloat(money) : balance_use_max;
      let point_rate = parseFloat(this.info.point_rate);
      if (this.point_use_max) {
        balance_use_max =
          balance_use_max - parseInt(this.point_use) * point_rate;
        balance_use_max = balance_use_max > 0 ? balance_use_max : 0;
      }
      this.balance_use_max = balance_use_max - coupon_money;
    },
    setPointUseMax(coupon_money) {
      let point_rate = parseFloat(this.info.point_rate);
      let money = (
        parseFloat(
          Object.keys(this.express_info).length > 0 ? this.express_info.fee : 0
        ) + parseFloat(this.info.count_money)
      ).toFixed(2);
      let point_use_max =
        this.info["count_point_use"] > this.info.member_account["point"]
          ? this.info.member_account["point"]
          : this.info["count_point_use"];
      point_use_max =
        point_use_max > parseInt(money) ? parseInt(money) : point_use_max;
      if (this.balance_use) {
        let thismax = (money - Math.ceil(this.balance_use)) / point_rate;
        thismax = Math.ceil(thismax);
        point_use_max = point_use_max > thismax ? thismax : point_use_max;
      }
      this.point_use_max = point_use_max - coupon_money;
    },
    setBalance(e) {
      let is_num = /^\d+\.?\d{0,2}$/;
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
    goto(url){
      this.$router.push(url);
    },
    async getAddress() {
      let res = await defaultAddress();
      if (res.code == 1 && res.data.data.length > 0) {
        this.address = res.data.data[0];
      }
    },
    async getInfo() {
      this.$vux.loading.show({
        text: "加载中"
      });

      if (this.$route.query.type == "cart") {
        var res = await cartpaymentOrder("cart", this.$route.query.ids);
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
        if (!this.info.address_default && this.goods_type ==1) {
          this.$vux.confirm.show({
            title: "地址未设置",
            content: "是否前往设置?",
            onConfirm() {
              that.$router.push("/address_add");
            }
          });
          return false;
        }
        for (let i in this.info.express_company_list) {
          that.co_id = that.info.express_company_list[i].co_id;
        }
        let money = parseFloat(this.info.count_money).toFixed(2);
        let point_use_max =
          this.info.count_point_use > this.info.member_account.point
            ? this.info.member_account.point
            : this.info.count_point_use;
        this.point_use = point_use_max;
        if(this.goods_type){
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
        }
        
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all {
  top: 0.9rem;
}
.bottom {
  z-index: 10;
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
.remark {
  width: 100%;
  background: #eee;
  padding: 0.1rem 0.2rem;
  border-radius: 0.1rem;
  font-size: 0.26rem;
}
.title {
  padding: 0.2rem 0.3rem;
  background: #fff;
}
.address {
  padding: 0.2rem;
  background: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 0.02rem;
  i {
    display: block;
    width: 0.5rem;
  }
  div {
    width: calc(100% - 1rem);
  }
}
.goods {
  background: #fff;
  padding: 0.2rem 0.3rem;
  margin-bottom: 1px;
  p {
    font-size: 0.28rem;
  }
  img {
    width: 1.5rem;
    height: 1.5rem;
    background: #eee;
  }
  div {
    width: calc(100% - 2rem);
    text-align: right;
  }
}
.m-b {
  margin-bottom: 0.2rem;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.input-price {
  width: 1.2rem;
  text-align: center;
  border-bottom: 1px dashed #000;
}
.left-text {
  color: #666;
  font-size: 0.28rem;
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
