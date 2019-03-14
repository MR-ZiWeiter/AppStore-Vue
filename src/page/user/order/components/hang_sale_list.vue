<template>
  <div class="list p-a-all" @scroll="handleScroll">
    <div v-if="list.length==0" style="text-align:center;padding-top:20%;">没有购买过商品</div>
    <div class="item" v-for="(items,index) in list" :key="index">
      <p @click="gotoDetail(items.order_id)" class="store flex-box">
        <span class="font-size-14 ">交易单号 : {{items.order_no}}</span>
        <span class="price font-size-13">{{setStatusName(items.is_hang_sale)}}</span>
      </p>
      <div class="goods flex-box" v-for="(item,key) in items.order_item_list" :key="key">
        <img @click="gotoDetail(items.order_id)" :src="item.picture.pic_cover_small" :onerror="local_default_goods_img">
        <div class="good-info">
          <p @click="gotoDetail(items.order_id)" class="ellipsis-2">{{item.goods_name}}</p>
          <p @click="gotoDetail(items.order_id)" class="font-size-12 text-color-999">{{item.sku_name}}</p>
          <p @click="gotoDetail(items.order_id)" class="text-color-999 font-size-12 ">
            <span class="font-bold font-size-13">{{item.price}}</span> {{appConfig.word?appConfig.word.balance:'余额'}}</p>
          <p @click="gotoDetail(items.order_id)" class="font-size-12 text-color-999">x{{item.num}}</p>

        </div>
      </div>
      <div class="flex-box status" v-if="items.coupon_money>0">
        <span>优惠券</span>
        <span class="font-size-13 price">-{{items.coupon_money}}</span>
      </div>
      <div @click="gotoDetail(items.order_id)" class="flex-box status">
        <span></span>
        <div class="text-color-666 font-size-13">共{{items.count}}件, 合计
          <span class="font-size-15 font-bold"> {{items.user_money}}{{appConfig.word?appConfig.word.balance:'余额'}}</span>
          <span class=" font-size-15 font-bold" v-if="items.point>0"> + {{parseInt(items.point)}}{{appConfig.word?appConfig.word.point:'积分'}}</span>
        </div>
      </div>
      <clocker @on-finish="getNow" v-if="items.hang_sale_time>now&&items.is_hang_sale==2" :time="items.hang_sale_time|date" class="clocker">
          <span>%D 天</span>
          <span>%H 小时</span>
          <span>%M 分</span>
          <span>%S 秒</span>
          <span>后进入挂售市场</span>
        </clocker>
        <div class="clocker font-size-13" v-if="(items.hang_sale_time<now&&items.is_hang_sale==2) || items.is_hang_sale==3">
         已卖出 : {{items.sale_num}} 件
        </div>
      <div class="buttons">
        <!-- <div @click="goto('/delivery?id='+items.order_id)" >发货</div> -->
        <div v-if="items.is_hang_sale==1" @click="hang_sale=true;hang_sale_id=items.order_id">我要挂售</div>
        <div v-if="items.is_hang_sale==2 || items.is_hang_sale==3" @click="withdraw(items.order_id,index)">撤回</div>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="hang_sale" confirm-text="挂售" @on-confirm="hangSale" @on-hide="hang_sale_id=0" :title="'是否挂售?'">
      </confirm>
    </div>
  </div>
</template>
<script>
import { changeSale, getGuaShouList, undoSale } from "src/service/getData";
import { dateFormat } from "vux";
import { mapState } from "vuex";
export default {
  data() {
    return {
      hang_sale: false,
      hang_sale_id: 0,
      page: 1,
      page_count: 1,
      list: [],
      take_show: false,
      take_check_id: 0,
      now:new Date().getTime() / 1000,
      check: this.$route.query.type ? this.$route.query.type : 0,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig
    }),
    orderStatus() {
      switch (parseInt(this.check)) {
        case 0:
          return "";
        case 1:
          return "1";
        case 2:
          return "2";
        case 3:
          return "4";
      }
    }
  },
  watch: {
    $route(val) {
      this.check = val.query.type;
      this.rush();
    }
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    getNow(){
      this.now= new Date().getTime() / 1000;
    },
    setStatusName(is_hang_sale) {
      switch (is_hang_sale) {
        case 1:
          return "待处理";
        case 2:
        case 3:
          return "挂售中";
        case 4:
          return "已完成";
        case 5:
          return "已撤回";
      }
    },
    async undosale(id) {
      this.$vux.loading.show({ text: "撤回中......" });
      let res = await undoSale(id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.rush();
        }, 2000);
      }
    },
    withdraw(id,index) {
      let now=new Date().getTime() / 1000;
      let content='';
      if(this.list[index].hang_sale_time<now){
        content='撤回后不能继续挂售';
      }
      let that = this;
      this.$vux.confirm.show({
        title: "是否撤回",
        content:content,
        onConfirm() {
          that.undosale(id);
        }
      });
    },
    async hangSale() {
      this.$vux.loading.show({ text: "正在处理" });
      let res = await changeSale(this.hang_sale_id);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.rush();
        }, 2000);
      }
    },
    upimg(e) {
      e.src = appConfig.img.default_goods_img;
    },
    goto(url) {
      this.$router.push(url);
    },
    rush() {
      this.page = 1;
      this.page_count = 1;
      this.list = [];
      this.getList();
    },

    gotoDetail(id) {
      this.$router.push("/orderdetail?id=" + id);
    },
    handleScroll() {
      let dom = this.$el;
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        if (this.page < this.page_count) {
          this.page++;
          this.getList();
        }
      }
    },

    async getList() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res = await getGuaShouList(this.orderStatus, this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.page_count = res.data.page_count;
        let that = this;
        for (let i in res.data.data) {
          let items = res.data.data[i];
          let count = 0;
          let sale_hour = items.sale_hour
            ? parseFloat(items.sale_hour) * 60 * 60
            : 0;
          items.hang_sale_time = items.hang_sale_time + sale_hour;
          let sale_num=0
          for (let j in items.order_item_list) {
            count += parseInt(items.order_item_list[j].num);
            sale_num+=items.order_item_list[j].sale_num;
          }
          items["count"] = count;
          items["sale_num"] = sale_num;
          that.list.push(items);
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
  top: 1.71rem;
}
.clocker{
  padding:0.2rem 0.3rem;
  background:#fff;
  width: 100%;
  text-align: right;
  color: #ff4444;
  span{
    font-size: 0.26rem!important;
    color: #ff4444;
  }
}
.item {
  width: 100%;
  margin-bottom: 0.2rem;
  .store {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 1px;
  }
  .status {
    padding: 0.2rem 0.3rem;
    background: #fff;
  }
  .good-info {
    .buttons {
      width: 100%;
      padding: 0;
      div {
        width: auto;
        font-size: 0.24rem;
      }
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
  .amount {
    background: #fff;
    padding: 0.2rem 0.3rem;
    text-align: right;
    font-size: 0.32rem;
    margin-bottom: 1px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    padding: 0.2rem 0.3rem;
    background: #fff;
    div {
      font-size: 0.24rem;
      padding: 0.1rem 0.4rem;
      color: #ff4444;
      border: 1px solid #ff4444;
      border-radius: 0.1rem;
      margin-left: 0.15rem;
      box-shadow: 3px 3px 0 0 #ded6d6;
    }
  }
}
</style>