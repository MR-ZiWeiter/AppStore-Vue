<template>
  <div>
    <swiper v-if="1" dots-position="center" :show-desc-mask="false" :aspect-ratio="1" :list="banner" v-model="balance_index"></swiper>
    <div class="goodsinfo" v-if="info&&Object.keys(info).length > 0">
      <div class="promotion" v-if="info.is_wholesale">
        <div class="title">批发区商品</div>
        <div class="flex-box">
          <div class="promotion-price" v-if="pricelist.length==1">
            {{pricelist[0].price}}
          </div>
          <div class="promotion-price" v-else-if="pricelist.length>1">
            {{pricelist[0].price}} - {{pricelist[pricelist.length-1].price}}
          </div>
          <div v-else></div>
          <div v-if="now<info.start_time">
            <p>距开始仅剩</p>
            <clocker :time="info.start_time|date">
              <span class="time-label">%D</span>
              <span>天</span>
              <span class="time-label">%H</span>
              <span>:</span>
              <span class="time-label">%M</span>
              <span>:</span>
              <span class="time-label">%S</span>
            </clocker>
          </div>
          <div v-else>
            <p>距结束仅剩</p>
            <clocker :time="info.end_time|date">
              <span class="time-label">%D</span>
              <span>天</span>
              <span class="time-label">%H</span>
              <span>:</span>
              <span class="time-label">%M</span>
              <span>:</span>
              <span class="time-label">%S</span>
            </clocker>
          </div>
        </div>
      </div>
      <div class="promotion" v-if="info.promotion_type&&info.promotion_type==2&&promotion_text=='结束'">
        <div class="title">{{info.promotion_info}}</div>
        <div class="flex-box">
          <div class="promotion-price">
            <p>￥{{info.promotion_price}}</p>
            <p>￥{{info.member_price}}</p>
          </div>
          <div>
            <p>距结束仅剩</p>
            <clocker :time="info.promotion_detail.end_time|date">
              <span>%D 天</span>
              <span>%H 小时</span>
              <span>%M 分 %S 秒</span>
            </clocker>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="flex-box ">
          <div style="width:calc(100% - 1rem);">
            <p class="font-size-14" style="border:0">{{info.goods_name}}
              <span class="good-label" v-if="info.is_hot">热卖</span>
              <span class="good-label" v-if="info.is_recommend">精品</span>
              <span class="good-label" v-if="info.is_new">新品</span>
              <span class="good-label" v-for="(group_item,group_index) in info.goods_group_list" :key="group_index">{{group_item.group_name}}</span>
            </p>
            <p class="font-size-12 price" v-if="info.introduction">{{info.introduction}}</p>
          </div>
          <div style="width:1rem;text-align:center;" v-if="device_type!='web'" @click="share">
            <i class="iconfont icon-fenxiang"></i>
            <p style="justify-content: center;font-size:0.26rem;">分享</p>
          </div>
        </div>
        <p style="padding:0.2rem 0;display: flex;align-items: center; ">
          <span class="label" style="margin-right:0.1rem;margin-left:0">价格</span>
          <span class="price font-bold font-size-16" v-if="pricelist.length==1">{{pricelist[0].price}}</span>
          <span class="price font-bold font-size-16" v-else-if="pricelist.length>1"> {{pricelist[0].price}} - {{pricelist[pricelist.length-1].price}}</span>
          <span v-if="info.member_discount!=1" class="label" style="margin-left:0.1rem;">{{info.member_discount*10}}折</span>
        </p>
        <p style="padding-bottom: 0.2rem;display: flex;align-items: center; " v-if="pricelist[0].point&&info.is_wholesale">
          <span class="price font-size-14" v-if="pricelist.length==1">{{pricelist[0].point}}</span>
          <span class="price font-size-14" v-else-if="pricelist.length>1"> {{pricelist[0].point}} - {{pricelist[pricelist.length-1].point}}</span>
          <span class="label">{{appConfig.word?appConfig.word.point:'积分'}}</span>
        </p>
        <p style="padding-bottom: 0.2rem;display: flex;align-items: center; " v-if="pricelist[0].sale_price&&info.is_wholesale">
          <span class="price font-size-14" v-if="pricelist.length==1">{{info.real_price}}</span>
          <span class="price font-size-14" v-else-if="pricelist.length>1"> {{pricelist[0].sale_price}} - {{pricelist[pricelist.length-1].sale_price}}</span>
          <span class="label">挂售价格</span>
        </p>
        <div class="flex-box other-info">
          <span>销量 : {{info.sales}}笔</span>
          <span>运费 : {{info.shipping_fee_name=='免邮'?'免邮':'￥'+info.shipping_fee_name[0].express_fee}}</span>
          <span>点击 : {{info.clicks}}</span>
        </div>
      </div>

      <div class="bg-white p-h-10 m-b-10">
        <div class="flex-box p-v-10" style="border-bottom: 1px solid #eee;" v-if="info.give_point">
          <div class="font-size-14">优惠
            <span class="label">{{appConfig.word?appConfig.word.point:'积分'}}</span>
            <span class="font-size-13 text-color-666">购买可赠送{{info.give_point}}{{appConfig.word?appConfig.word.point:'积分'}}</span>
          </div>
        </div>
        <div class="flex-box p-v-10">
          <div class="font-size-14">已选择</div>
          <div class="text-color-666">{{(this.checkInfo&&this.checkInfo.info)?this.checkInfo.info.sku_name:''}} {{num}}件</div>
        </div>
      </div>

      <div class="comments" v-if="Object.keys(comment).length > 0" @click="goto">
        <div class="flex-box">
          <p>商品评价
          </p>
          <p class="font-color-666">({{comment.total_count}}条评价)
            <i class="iconfont icon-right"></i>
          </p>
        </div>
        <div class="comment" v-for="(item,index) in comment.data" :key="index">
          <p class="flex-box">
            <span> {{item.is_anonymous?item.member_name.substring(0,1)+'***(匿名)':item.member_name}}</span>
            <span class="font-size-13 text-color-999">{{item.addtime|date}}</span>
          </p>
          <p class="text-color-666">{{item.content}} </p>
        </div>
      </div>
      <div class="description">
        <p style="border-bottom: 1px solid #eee;padding-bottom:0.1rem;color:#666;">商品详情</p>
        <div v-html="info.description"> </div>
      </div>
    </div>
    <actionsheet v-model="shareStatus" :menus="shareMenu" @on-click-menu="shareClick" show-cancel></actionsheet>
  </div>
</template>
<script>
import { imgBaseUrl } from "src/config/env";
import { getStore } from "src/config/mUtils";
import { dateFormat } from "vux";
import { mapState } from "vuex";
export default {
  props: ["comment"],
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  data() {
    return {
      shareStatus:false,
      shareMenu:{
        WXSceneSession:'分享到微信好友',
        WXSceneTimeline:'分享到微信朋友圈'
      },
      promotion_time: 0,
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null',
      imgurl: imgBaseUrl,
      balance_index: 0,
      banner: [],
      pricelist: [],
      device_type:getStore('device_type')
    };
  },
  watch: {
    info(val) {
      let that = this;
      let img = require("src/images/resource/good.gif");
      let tmp=[];
      for (let i in this.info.img_list) {
        let obj = {
          url: "javascript:void(0)",
          img: this.info.img_list[i].pic_cover,
          fallbackImg: img
        };
        tmp.push(obj);
      }
      this.banner=tmp;
      this.getPriceList(val);
    }
  },
  computed: {
    ...mapState({
      appConfig: state => state.config.appConfig,
      info: state => state.goods.info,
      checkInfo: state => state.goods.checkInfo,
      num: state => state.goods.num
    }),
    now() {
      return new Date().getTime() / 1000;
    },
    promotion_text() {
      if (!this.info.promotion_detail) {
        return "";
      }
      let timestamp = Date.parse(new Date()) / 1000;
      if (timestamp < this.info.promotion_detail.start_time) {
        return "开始";
      } else {
        return "结束";
      }
    }
  },

  methods: {
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    getPriceList(val) {
      let that = this;
      let list = [];
      for (let i in val.sku_list) {
        let data = {
          price: (val.sku_list[i].promote_price>val.sku_list[i].member_price)?val.sku_list[i].member_price:val.sku_list[i].promote_price,
          point: val.sku_list[i].point_exchange,
          sale_price: val.sku_list[i].sale_price
        };
        that.pricelist.push(data);
      }
      this.pricelist.sort(this.compare("price"));
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    shareClick(key, item){
      this.shareAction('weixin',key);
      // switch(key){
      //   case 'WXSceneSession':
      //   break;
      //   case 'WXSceneTimeline':
      //   break;
      // }
    },
    shareAction(s,ex){
      var self = this;
				var s = shares[s];
				if(!s) {
          this.$vux.toast.text('无效的分享服务！','middle');
					return;
				}
				if(s.authenticated) {
          this.$vux.toast.text('---已授权---','middle');
					self.shareMessage(s, ex);
				} else {
           this.$vux.toast.text('---未授权---','middle');
					s.authorize(function() {
						self.shareMessage(s, ex);
					}, function(e) {
             this.$vux.toast.text("认证授权失败：" + e.code + " - " + e.message,'middle');
					});
				}
    },
    shareMessage: function(s, ex) {
				var self = this;
				var msg = {
					content: this.info.goods_name,
					extra: {
						scene: ex
					}
				};
				msg.title = this.info.goods_name;
				msg.href = this.imgurl + '/index.html#/goods?id=' +this.info.goods_id ;
				//				msg.thumbs = ['img/logo@2x.png'];
				s.send(msg, function() {
					alert("分享到\"" + s.description + "\"成功！ ");
				}, function(e) {
					alert("分享到\"" + s.description + "\"失败: " + e.code + " - " + e.message);
				});
			},
    share() {
      if (getStore("device_type") == "web") {
        if (this.isWeiXin()) {
          this.$emit("share");
        }else{
          this.$vux.toast.text('请通过微信浏览器或APP进行分享','middle');
        }
      } else {
        this.shareStatus=true;
      }
    },
    goto() {
      if (this.$route.path == "/serviceDetails") {
        this.$router.push("/comment??type=service&id=" + this.info.goods_id);
      } else {
        this.$router.push("/comment?id=" + this.info.goods_id);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.good-label{
      font-size: 0.24rem;
      color:#fff;
      background: #ff4444;
      padding:0.03rem 0.1rem;
    }
.time-label {
  color: #ff4444 !important;
  padding: 0.02rem 0.05rem;
  font-size: 0.26rem;
  background: #fff;
  text-align: center;
  border-radius: 0.1rem;
}
.goodsinfo {
  border-top: 1px solid #ccc;
  position: relative;
  background: #f4f4f4;
  .label {
    font-size: 0.22rem;
    background: #ffd9d9;
    color: #ff4444;
    margin-left: 0.1rem;
    padding: 0.01rem 0.1rem;
  }
  .other-info {
    border-top: 1px solid #eee;
    padding: 0.2rem 0;
    span {
      color: #999;
      font-size: 0.26rem;
    }
  }
  .info {
    padding: 0.2rem 0.3rem 0.1rem;
    background: #fff;
    margin-bottom: 0.2rem;
  }
  .good-check {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 0.2rem;
    .label {
      border: 1px solid #aaa;
      font-size: 0.24rem;
      padding: 0.05rem 0.1rem;
      margin-left: 0.15rem;
    }
    i {
      font-size: 0.26rem;
      color: #666;
    }
  }
}
.comments {
  padding: 0.2rem 0.3rem;
  background: #fff;
  margin: 0.2rem 0;
  > .flex-box {
    padding-bottom: 0.2rem;
    border-bottom: 1px solid #ccc;
  }
  > .comment:last-child {
    border-bottom: 0;
  }
  .comment {
    padding: 0.2rem 0 0.15rem;
    border-bottom: 1px solid #ccc;
  }
  p,
  span,
  i {
    font-size: 0.26rem;
  }
  i {
    color: #666;
  }
}
.recomment-title {
  padding: 0.2rem 0.3rem;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.recomment-goods {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0.2rem 0;
  background: #fff;
  .box {
    display: inline-block;
    text-align: center;
    width: 30%;
  }
}
.comment-box {
  top: 0.9rem;
  .top {
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-bottom: 0.2rem;
    span {
      display: inline-block;
      margin-right: 0.15rem;
      padding: 0.15rem 0.2rem;
      font-size: 0.24rem;
      background: #eee;
    }
    span.checked {
      color: #fff;
      background: #f5326e;
    }
  }
  .judge-box {
    .judge-item {
      background: #fff;
      margin-bottom: 0.1rem;
      padding: 0.2rem 0.3rem;
      .user-header {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        margin-right: 0.2rem;
      }
      .rows:first-child {
        padding-bottom: 0.2rem;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
.promotion {
  margin-top: -51px;
  .promotion-price {
    color: #fff;
    font-size: 0.35rem;
  }
  .title {
    display: inline-block;
    background: #ff4444;
    color: #fff;
    padding: 0.1rem 0.2rem;
    font-size: 0.24rem;
  }
  .flex-box {
    margin-top: -1px;
    padding: 0.1rem 0.2rem;
    background: #ff4444;
    p,
    span {
      color: #fff;
      font-size: 0.26rem;
    }
    div:last-child {
      text-align: right;
    }
  }
}
.fee {
  padding: 0.2rem 0.3rem;
  background: #fff;
  margin-bottom: 0.02rem;
}
</style>
