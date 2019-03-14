<template>
  <div id="cart">
    <head-top :go-back='false' head-title="购物车" ></head-top>
    <div class="footer">
      <div class="left flex-box">
        <span>
          <check-icon :value.sync="isCheckAll"> {{isCheckAllText}}</check-icon>
        </span>
        <div>合计:
          <span class="font-size-14 text-color-red">{{totalPrice }}</span>
          <span class="font-size-14"></span>
        </div>
      </div>
      <div class="right" :class="{gray:totalPrice==0}" @click="buy">去结算</div>
    </div>
    <div v-if="list.length>0" class="content p-a-all">
      <swipeout class="list">
        <swipeout-item :threshold="1" transition-mode="follow" v-for="(item,key) in list" :key="key">
          <div slot="right-menu">
            <swipeout-button :width="160" @click.native="del(item.cart_id)" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="goods">
            <span>
              <check-icon :value.sync="item.checked"></check-icon>
            </span>
            <img @click="getshop(item.goods_id)" :src="item.picture_info?item.picture_info.domain+item.picture_info.pic_cover_small:item.picture_info.domain+item.goods_picture" alt="" :onerror="local_default_goods_img">
            <div class="right ">
              <p @click="getshop(item.goods_id)" class="font-size-14 ellipsis">{{item.goods_name}}</p>
               <p class="text-color-666 font-size-12">{{item.sku_name}} </p>
              <div class="flex-box">
                <p class="price font-size-13">
                 {{item.promotion_price}}积分</p>
                <div class="calc">
                  <div @click="dec(key)" class="left">-</div>
                  <div class="center">{{item.num}}</div>
                  <div @click="inc(key)" class="right">+</div>
                </div>
              </div>
            </div>
          </div>
        </swipeout-item>
      </swipeout>
    </div>
    <div v-else class="no-goods">
      <p>您的购物车还是空的</p>
      <span>随便逛逛</span>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { cartList, cartDelete, cartAdjustNum } from "src/service/getData";
export default {
  components: { headTop },
  data() {
    return {
      list: [],
      isCheckAllText: "全选",
      isCheckAll: false,
      imgurl: window.imgBaseUrl,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  computed: {
    totalPrice: function() {
      let that = this;
      let price = 0;
      for (let i in this.list) {
        if (that.list[i].checked) {
          price = price + that.list[i].num * that.list[i].price;
        }
      }
      return price.toFixed(2);
    }
  },
  watch: {
    isCheckAll(value) {
      let that = this;
      let allnum = 0;
      for (let i in this.list) {
        that.list[i].checked = value;
      }
      this.isCheckAllText = value ? "全不选" : "全选";
    }
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    buy() {
      let cart_id = "";
      let that = this;
      for (let i in this.list) {
        if (that.list[i].checked) {
          cart_id = cart_id + that.list[i].cart_id + ",";
        }
      }
      if (!cart_id) {
        this.$vux.toast.text("没有选择购物车商品", "middle");
        return false;
      }
      cart_id = cart_id.substring(0, cart_id.length - 1);
      this.$router.push("/confirmOrder?type=cart&ids=" + cart_id);
    },
    getshop(id) {
      this.$router.push("goods?id=" + id);
    },
    async edit(id, num) {
      this.$vux.loading.show({ text: "正在修改......" });
      let res = await cartAdjustNum(id, num);
      this.$vux.loading.hide();
      if (res.code != 1) {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async del(id) {
      this.$vux.loading.show({ text: "正在删除......" });
      let res = await cartDelete(id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.getList();
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getList() {
      this.$vux.loading.show({ text: "获取中......" });
      let res = await cartList();
      this.$vux.loading.hide();
      if (res.code == 1) {
        for (let i in res.data) {
          res.data[i].checked = false;
        }
        this.list = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    inc(key) {
      var info = this.list[key];
      if (info.stock <= info.num) {
        return false;
      }
      info.num++;
      this.edit(info.cart_id, info.num);
    },
    dec(key) {
      var info = this.list[key];
      if (info.num <= 1) {
        return false;
      }
      info.num--;
      this.edit(info.cart_id, info.num);
    }
  }
};
</script>
<style lang="scss" scoped>
.gray{
  background: #aaa!important;
}
.inline-block {
  display: inline-block;
}
#cart {
  background: #eeeeee;
  font-size: 0.23rem;
  position: absolute;
  top: 1px;
  bottom: 1rem;
  left: 0;
  right: 0;
  overflow-y: auto;
  .no-goods {
    padding-top: 70%;
    text-align: center;
    span {
      display: inline-block;
      margin-top: 0.5rem;
      background: #fff;
      font-size: 0.24rem;
      padding: 0.05rem 0.1rem;
      border: 1px solid #ccc;
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1rem;
    background: #f9f9f9;
    padding: 0;
    display: flex;
    .left {
      padding: 0 0.2rem;
    }
    .right {
      width: 2rem;
      text-align: center;
      line-height: 1rem;
      background: #ff4444;
      color: #fff;
    }
  }
  .content.p-a-all {
    top: 0.9rem;
    bottom: 1rem;
  }
  .content {
    .list {
      margin-bottom: 0.2rem;
    }
    .store {
      padding: 0.2rem 0.3rem;
      background: #fff;
      border-bottom: 1px solid #ccc;
      span {
        padding-left: 0.7rem;
      }
      .vux-check-icon {
        width: 100%;
      }
    }

    .goods {
      padding: 0.2rem 0.3rem;
      background: #fff;
      border-bottom: 1px solid #ccc;
      height: 1.8rem;
      display: flex;
      align-items: center;
      .flex-box {
        width: 100%;
      }
      .right {
        width: calc(100% - 2rem);
        flex-wrap: wrap;
      }

      p {
        line-height: 0.5rem;
      }

      img {
        width: 1.3rem;
        height: 1.3rem;
        margin-right: 0.2rem;
        background: #eee;
        display: inline-block;
      }
      .icon-del {
        font-size: 0.4rem;
      }
      .calc {
        border: 1px solid #aaa;
        display: flex;
        div {
          width: 0.5rem;
          height: 0.5rem;
          text-align: center;
        }
        .left,
        .center {
          border-right: 1px solid #aaa;
        }
        .left,
        .right {
          background: #f4f4f4;
        }
      }
    }
  }
}
</style>
<style scoped>
.footer .left {
  width: calc(100% - 2rem);
}
.col-right {
  width: calc(100% - 2.8rem);
}
</style>


