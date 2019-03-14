<template>
    <div>
        <head-top head-title="发货" :go-back='true'></head-top>
        <div class="bottom">
            <div class="info">消耗积分:
                <span class="price">{{info.count_money?info.count_money:0}}</span>
            </div>
            <div class="btn" @click="check_order">立即支付</div>
        </div>
        <div class="p-a-all">
            <div class="address m-b" v-if="address.id" @click="goto('/address')">
                <i class="iconfont icon-dingwei"></i>
                <div>
                    <p>收货人:{{address.consigner}}
                        <span class="font-size-15 font-bold">{{address.mobile}}</span>
                    </p>
                    <p class="font-size-15 text-color-666 ellipsis" v-html="'收货地址:'+address.address_info+address.address"></p>
                </div>
                <i style="width:auto;" class="iconfont icon-right text-color-999"></i>
            </div>
            <div v-else class="p-10 m-b bg-white flex-box" @click="goto('/address')">
                <span>还没有添加收货地址</span>
                <i class="iconfont icon-right font-size-14 text-color-999"></i>
            </div>
            <div v-if="info.order_goods" class="goods flex-box" v-for="(item,key) in info.order_goods" :key="key">
                <img @click="gotoDetail(info.order_id)" :src="item.picture_info.pic_cover_small">
                <div class="good-info">
                    <p @click="gotoDetail(info.order_id)" class="ellipsis-2">{{item.goods_name}}</p>
                    <p @click="gotoDetail(info.order_id)" class="font-size-12 text-color-999">{{item.sku_name}}</p>
                    <div @click="gotoDetail(info.order_id)" class="flex-box" style="width:100%">
                        <p class="text-color-999 font-size-12 ">积分
                            <span class="font-bold font-size-16 price">{{item.price}}</span>
                            <span class="price font-size-12">(已付款)</span>
                        </p>
                        <p class="font-size-14 text-color-333">{{item.num}}件</p>
                    </div>
                </div>
            </div>
            <div class="flex-box title">
                <span class="font-size-14">物流配送</span>
                <span class="font-size-14">运费 10 积分</span>
            </div>
            <div class="title" style="padding-top: 0;">
                <input class="remark" type="text" placeholder="店铺订单留言:">
            </div>
        </div>
    </div>
</template>
<script>
import pwdBox from "src/components/common/pwd";
import headTop from "src/components/header/head";
import {
  defaultAddress,
  orderDetail,
  getGoodsExpress
} from "src/service/getData";
export default {
  components: {
    headTop,
    pwdBox
  },
  data() {
    return {
      address: {},
      info: {}
    };
  },
  beforeMount() {
    this.getAddress();
    this.getInfo();
    this.getExpress();
  },
  methods: {
    check_order(){

    },
    async getAddress() {
      let res = await defaultAddress();
      if (res.code == 1 && res.data.data.length > 0) {
        this.address = res.data.data[0];
      }
    },
    async getInfo() {
      let res = await orderDetail(this.$route.query.id);
      if (res.code == 1) {
        this.info = res.data.order;
        let that=this;
        for(let i in res.data.order.order_goods){
            that.getGoodsExpress(res.data.order.order_goods[i].goods_id);
        }
      }
    },
    async getGoodsExpress(id) {
        // let res
    }
  }
};
</script>
<style lang="scss" scoped>
.p-a-all{
    top:0.9rem;
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
