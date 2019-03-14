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
      <div v-if="virtual_goods_type_id==0">
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

      <div v-if="info.itemlist.length>0" class="goods flex-box" v-for="(item,key) in info.itemlist" :key="key">
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
      <div class="flex-box title">
        <span class="font-size-14">物流配送</span>
        <span class="font-size-14">运费 {{info.express}}</span>
      </div>
      <div class="title" style="padding-top: 0;">
        <input class="remark" type="text" placeholder="店铺订单留言:">
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="pwd_show" class="pwd-box">
        <popup-header :right-text="'取消'" :title="'请输入支付密码'" :show-bottom-border="false" @on-click-right="pwd_show = false"></popup-header>
        <pwd-box ref="pwd" @input-ok="createOrder"></pwd-box>
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
import { mapState } from "vuex";
export default {
  components: {
    headTop,
    pwdBox
  },
  data() {
    return {
      info: {},
      pwd_show: false,
      point_use_max: 0,
      balance_use_max: 0,
      remark: "",
      co_id: 0,
      virtual_goods_type_id:0,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  computed: {
     ...mapState({
      appConfig: state => state.config.appConfig
    }),
    total_balance() {
      if (this.info.count_money) {
        return (
          parseFloat(this.info.count_money) + parseFloat(this.info.express)
        ).toFixed(2);
      } else {
        return 0;
      }
    }
  },
  beforeMount() {
    this.virtual_goods_type_id=this.$route.query.virtual_goods_type_id;
    this.getInfo();
    //this.getGoodsExpress();
  },
  methods: {
    check_order() {
      if (!this.info.address_default&&this.virtual_goods_type_id==0) {
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
      this.$refs.pwd.clear();
      this.pwd_show = true;
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
      let res = await orderCreate(
        goods_sku_list,
        this.remark,
        pwd ? pwd : "",
        this.info.express_company_count,
        this.virtual_goods_type_id?1:0
      );
      that.$vux.loading.hide();
      if (res.code == 1) {
        this.$router.push("/pay_result?orderid=" + res.data);
      } else {
        this.$vux.toast.text(res.data?res.data:res.msg, "middle");
      }
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
        if (!this.info.address_default&&this.virtual_goods_type_id==0) {
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
