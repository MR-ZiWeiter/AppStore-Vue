<template>
  <div id="cart">
    <head-top :go-back='false' head-title="购物车"></head-top>
    <div class="footer">
      <div class="left flex-box">
        <span @click="checkAll">
          <check-icon :value.sync="isCheckAll"> {{isCheckAllText}}</check-icon>
        </span>
        <div>合计:
          <span class="font-size-14 text-color-red">￥{{totalPrice }}</span>
          <span class="font-size-14"></span>
        </div>
      </div>
      <div class="right" >去结算</div>
    </div>
    <div v-if="cart.length>0" class="content p-a-all">
      <div class="list" v-for="(items,index) in cart" :key="index">
        <div class="store" @click="checkStore(index)">
          <check-icon :value.sync="items.checked">{{items.title}}</check-icon>
        </div>
        <div class="goods" v-for="(item,key) in items.list" :key="key">
          <span @click="checkStore(index,key)">
            <check-icon :value.sync="item.checked"></check-icon>
          </span>

          <div class="flex-box">
            <div class="flex">
              <img :src="item.img" alt="">
              <div>
                <p class="font-size-14 ellipsis">{{item.title}}</p>
                <p class="price font-size-13">￥{{item.price}}</p>
              </div>
            </div>
            <div style="text-align:right;">
              <i class="iconfont icon-del"></i>
              <div class="calc">
                <div @click="dec(index,key)" class="left">-</div>
                <div class="center">{{item.number}}</div>
                <div @click="inc(index,key)" class="right">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-goods">
      <p>您的购物车还是空的</p>
      <span>随便逛逛</span>
    </div>
  </div>
</template>
<script>
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  data() {
    return {
      cart: [ ],
      isCheckAllText: "全选",
      isCheckAll: false,
     
    };
  },
  computed: {
    totalPrice: function() {
      let that = this;
      let price=0;
      for (let i in this.cart) {
        for (let j in that.cart[i].list) {
          if (that.cart[i].list[j].checked) {
            price =
              price +
              that.cart[i].list[j].number * that.cart[i].list[j].price;
          }
        }
      }
      return price.toFixed(2);
    }
  },
  watch: {
    isCheckAll(value) {
      this.isCheckAllText = value ? "全不选" : "全选";
    },
    cart: {
      handler: function(value) {
      },
      deep: true
    }
  },
  async mounted() {},
  methods: {
    checkAll() {
      let value = this.isCheckAll;
      let that = this;
      for (let i in this.cart) {
        that.cart[i].checked = value;
        for (let j in that.cart[i].list) {
          that.cart[i].list[j].checked = value;
        }
      }
    },
    getIsCheckAll() {
      let flag = true;
      let that = this;
      for (let i in this.cart) {
        if (!that.cart[i].checked) {
          flag = false;
          break;
        }
        for (let j in that.cart[i].list) {
          if (!that.cart[i].list[j].checked) {
            flag = false;
            break;
          }
        }
      }
      this.isCheckAll = flag;
    },
    checkStore(index, key = null) {
      let that = this;
      if (key !== null) {
        let flag = true;
        for (let i in this.cart[index].list) {
          if (!that.cart[index].list[i].checked) {
            flag = false;
            break;
          }
        }
        this.cart[index].checked = flag;
        this.getIsCheckAll();
        return false;
      }
      for (let i in this.cart[index].list) {
        that.cart[index].list[i].checked = that.cart[index].checked;
      }
      this.getIsCheckAll();
    },
    inc(index, key) {
      var info = this.cart[index].list[key];
      info.number++;
    },
    dec(index, key) {
      var info = this.cart[index].list[key];
      if (info.number <= 1) {
        return false;
      }
      info.number--;
    }
  }
};
</script>
<style lang="scss" scoped>
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
      height: 1.6rem;
      display: flex;
      align-items: center;
      .flex-box {
        width: 100%;
      }
      p {
        line-height: 0.6rem;
      }
      img {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.2rem;
      }
      .icon-del {
        font-size: 0.4rem;
      }
      .calc {
        margin-top: 0.2rem;
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

