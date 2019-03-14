<template>
  <div class="goods-popup" v-if="spec_check_info.info">
    <div class="top" v-if="Object.keys(spec_check).length > 0">
      <img :src="spec_check_info.pic" alt="" :onerror="local_default_goods_img">
      <div style="width: calc(100% - 1.8rem);">
        <p class="font-size-16 text-color-666">{{spec_check_info.info.sku_name}}</p>
        <p class="font-size-16 price"><span class="text-color-666">价格 : </span> {{(spec_check_info.info.promote_price>spec_check_info.info.member_price)?spec_check_info.info.member_price:spec_check_info.info.member_price}} <span class="price" v-if="spec_check_info.info.point_exchange"> + {{spec_check_info.info.point_exchange}} {{appConfig.word?appConfig.word.point:'积分'}}</span></p>
        <p class="font-size-13 price" v-if="parseFloat(spec_check_info.info.sale_price)>0">售出价格 : {{spec_check_info.info.sale_price}} </p>
        <p v-if="info.is_stock_visible" class="text-color-666">库存 : {{spec_check_info.info.stock}}</p>
      </div>
    </div>
    <div class="top" v-else>
      <img :src="info.picture_detail.pic_cover" alt="" :onerror="local_default_goods_img">
      <div style="width: calc(100% - 1.8rem);">
        <p class="font-size-16 text-color-666">{{info.goods_name}}</p>
        <p class="font-size-16 price"><span class="text-color-666">价格 : </span> {{(info.sku_list[0].promote_price>info.sku_list[0].member_price)?info.sku_list[0].member_price:info.sku_list[0].promote_price}} <span class="price" v-if="spec_check_info.info.point_exchange"> + {{spec_check_info.info.point_exchange}} {{appConfig.word?appConfig.word.point:'积分'}}</span></p>
         <p class="font-size-13 price" v-if="parseFloat(info.sku_list[0].sale_price)>0">售出价格 : {{info.sku_list[0].sale_price}}</p>
        <p class="text-color-666" v-if="info.is_stock_visible">库存 : {{info.sku_list[0].stock}}</p>
      </div>
    </div>
    <div v-for="(items,index) in spec" :key="index">
      <p>{{items.spec_name}}</p>
      <span @click="getSpec(index,key)" class="label" :class="{checked:spec_check[index]==key}" v-for="(item,key) in items.value" :key="key">{{item.spec_value_name}}</span>
    </div>
    <div class="checknum flex-box" v-if="info.max_buy!=1">
      <span>购买数量</span>
      <div class="right">
        <span class="dec" @click="dec">-</span>
        <span class="num">{{goodnum}}</span>
        <span class="inc" @click="inc">+</span>
      </div>
    </div>
    <div v-if="spec_check_info.info.stock>0">
      <button v-if="type=='good'" @click="buy">下一步</button>
      <button v-if="type=='cart'" @click="add_cart()">加入购物车</button>
    </div>
    <button style="background:#b5a3a9;" v-else>没有库存了</button>
  </div>
</template>
<script>
import { addCart } from "src/service/getData";
import {mapMutations,mapState } from "vuex";
import store from "src/store/";
export default {
  props: ["info", "type"],
  data() {
    return {
      spec: [],
      spec_check: [],
      spec_check_info: {},
      sku_obj: {},
      sku_pic_obj: {},
      pic_id_obj: {},
      goodnum: 1,
      max_buy:1,
      min_buy:1,
      imgurl: window.imgBaseUrl,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  computed:{
    ...mapState({
      appConfig: state => state.config.appConfig
    })
  },
  watch:{
    goodnum(val){
      this.SET_GOODNUM(val);
    }
  },
  beforeMount() {
    this.max_buy=this.info.max_buy;
     this.min_buy=this.info.min_buy;
     this.goodnum=this.min_buy>0?this.min_buy:1;
    this.setSpec(
      this.info.spec_list,
      this.info.sku_list,
      this.info.sku_picture_list
    );
  },
  methods: {
    ...mapMutations([ "SET_GOODCHECK",'SET_GOODNUM']), 
    getSpec(index, key) {
      this.$set(this.spec_check, index, key);
      this.selectSku();
    },
    setSpec(spec_list, sku_list, sku_picture_list) {
      this.spec = spec_list;
      let that = this;
      let sku_obj = {};
      for (let i in sku_list) {
        sku_obj[sku_list[i].attr_value_items] = sku_list[i];
      }
      this.sku_obj = sku_obj;
      let sku_picture_obj = {};
      for (let i in sku_picture_list) {
        sku_picture_obj[
          sku_picture_list[i].spec_id + ":" + sku_picture_list[i].spec_value_id
        ] =
          sku_picture_list[i];
      }
      this.sku_pic_obj = sku_picture_obj;
      for (let i in spec_list) {
        this.spec_check[i] = 0;
      }
      this.spec = spec_list;
      this.selectSku();
    },
    clickmenu(menuKey, menuItem) {
      this.$router.push("/" + menuKey);
    },
    inc() {
      if(this.goodnum<this.max_buy||this.max_buy==0){
        this.goodnum++;
      }else{
        this.$vux.toast.text('此商品限购'+this.max_buy+'件','middle');
      }
      
    },
    dec() {
      if(this.goodnum<=this.min_buy){
         this.$vux.toast.text("最小数量为"+this.min_buy, "middle");
        return false;
      }
      if (this.goodnum <= 1) {
        this.$vux.toast.text("最小数量为1", "middle");
        return false;
      }
      this.goodnum--;
    },
    selectSku() {
      let sku = "";
      let that = this;
      let val = this.spec_check;
      for (let i in val) {
        sku =
          sku +
          that.spec[i].spec_id +
          ":" +
          that.spec[i].value[val[i]].spec_value_id +
          ";";
      }
      if (sku) {
        sku = sku.substring(0, sku.length - 1);
      }
      this.spec_check_info.sku = sku;
      this.spec_check_info.info = this.sku_obj[sku];
      for (let i in this.sku_pic_obj) {
        if (sku.indexOf(i) > -1) {
          that.spec_check_info.pic_id =
            that.sku_pic_obj[i].sku_picture_query[0].pic_id;
          that.spec_check_info.pic =
            that.sku_pic_obj[i].pic_cover_small;
          break;
        }
      }
      if(this.info.sku_picture_list.length==0){
        that.spec_check_info.pic_id=that.info.picture_detail.pic_id;
        that.spec_check_info.pic=that.info.picture_detail.pic_cover_mid
      }
      // console.log( this.spec_check_info);
      // console.log(this.spec_check_info);
      this.SET_GOODCHECK(this.spec_check_info);
      // this.spec_check_info.pic = this.sku_pic_obj[sku];
    },
    buy() {
      let sku_id = this.spec_check_info.info
        ? this.spec_check_info.info.sku_id
        : this.info.sku_list[0].sku_id;
      let url = "";
      if (this.info.is_wholesale==1) {
        url = "/confirm_order_wholesale?sku_id=" + sku_id + "&num=" + this.goodnum;
      } else {
        url = "/confirmOrder?goods_type="+this.info.goods_type+"&sku_id=" + sku_id + "&num=" + this.goodnum;
      }
      this.$router.push(url);
    },
    async add_cart() {
      let obj = {
        trueId: this.info.goods_id,
        goods_name: this.info.goods_name,
        count: this.goodnum,
        shop_id: this.info.shop_id,
        shop_name: this.info.shop_name
      };
      let sku = "";
      if (this.spec_check_info.info) {
        obj.picture = this.spec_check_info.pic_id?this.spec_check_info.pic_id: this.info.picture_detail.pic_id;
        obj.select_skuName = this.spec_check_info.info.sku_name;
        obj.price = (this.spec_check_info.info.promote_price>this.spec_check_info.info.member_price)?this.spec_check_info.info.member_price:this.spec_check_info.info.promote_price;
        obj.cost_price = this.spec_check_info.info.cost_price;
        obj.select_skuid = this.spec_check_info.info.sku_id;
      } else {
        obj.picture = this.info.picture_detail.pic_id;
        obj.select_skuName = this.info.sku_list[0].sku_name;
        obj.price = (this.info.sku_list[0].promote_price>this.info.sku_list[0].member_price)?this.info.sku_list[0].member_price:this.info.sku_list[0].promote_price;
        obj.cost_price = this.info.sku_list[0].cost_price;
        obj.select_skuid = this.info.sku_list[0].sku_id;
      }
      this.$vux.loading.show({ text: "正在处理" });
      let res = await addCart(obj);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      this.$emit("popup");
    }
  }
};
</script>
<style lang="scss">
.goods-popup {
  button {
    display: block;
    width: 100%;
    padding: 0.2rem;
    border-radius: 0.1rem;
    color: #fff;
    background: #ff4444;
    margin-top: 0.3rem;
  }
  padding: 0.3rem;
  background: #fff;
  .top {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.2rem;
    margin-bottom: 0.2rem;
    img {
      width: 1.8rem;
      height: 1.8rem;
      margin-right: 0.2rem;
      background: #eee;
    }
  }
  p {
    margin: 0.1rem 0;
  }
  .label {
    padding: 0.1rem 0.2rem;
    background: #eee;
    margin-right: 0.2rem;
    margin-bottom: 0.2rem;
    display: inline-block;
    border-radius: 0.1rem;
  }
  .label.checked {
    color: #FF4444;
    border:1px solid #FF797A;
    background: #FFE4E4;
  }
  button {
    display: block;
    width: 100%;
    padding: 0.2rem;
    border-radius: 0.1rem;
    color: #fff;
    background: #ff4444;
    margin-top: 0.3rem;
  }
  .checknum {
    padding: 0.2rem 0;
    align-items: center;
    .right {
      display: flex;
      span {
        display: inline-block;
        border: 1px solid #aaa;
        margin: 0;
        width: 0.6rem;
        height: 0.5rem;
        text-align: center;
        line-height: 0.45rem;
      }
      .num {
        border-left: 0;
        border-right: 0;
      }
      .dec,
      .inc {
        background: #eee;
      }
    }
  }
}
</style>
