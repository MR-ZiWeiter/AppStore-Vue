<template>
    <div id="collect">
        <head-top :go-back='true' head-title="我的足迹" :rightMenu="true"></head-top>
        <div class="menulist" v-if="categorylist.length>0">
            <div class="item " @click="checkCategory('')" :class="{checked:category_id==''}">全部</div>
            <div class="item " @click="checkCategory(item.category_id)" :class="{checked:item.category_id==category_id}" v-for="(item,index) in categorylist" :key="index">{{item.category_name}}</div>
        </div>
        <div class="p-a-all" @scroll="handleScroll">
            <div class="item" v-for="(item,index) in list" :key="index">
                <p class="time">{{time(index)}}</p>
                <p class="title" @click="goto('/goods?id='+item.goods_id)">{{item.fav_time}}</p>
                <div class="rows">
                    <img :src="imgBaseUrl+item.goods_info.picture_info.pic_cover_small" alt="" @click="goto('/goods?id='+item.goods_id)" :onerror="local_default_goods_img">
                    <div class="box">
                        <p class="title" @click="goto('/goods?id='+item.goods_id)">{{item.goods_info.goods_name}}</p>
                        <div class="flex-box">
                            <span class="price font-size-13">￥{{item.goods_info.promotion_price}}</span>
                            <span class="price" @click="del(item.browse_id)">删除</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="list.length==0" style="padding-top:20%;text-align:center;">没有浏览过商品</div>
        </div>
    </div>
</template>
<script>
import { newMyPath, delMyPath } from "src/service/getData";
import headTop from "src/components/header/head";
import { imgBaseUrl } from "src/config/env";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      page: 1,
      type: 0,
      isnext: true,
      list: [],
      imgBaseUrl: imgBaseUrl,
      categorylist: [],
      category_id: "",
       local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    timeFormat(val) {
      var thisyear = dateFormat(Date.parse(new Date()), "YYYY");
      let year = dateFormat(val * 1000, "YYYY");
      if (thisyear != year) {
        return dateFormat(val * 1000, "YYYY年MM月DD日");
      } else {
        return dateFormat(val * 1000, "MM月DD日");
      }
    },
    time(index) {
      let thistime = this.timeFormat(this.list[index].create_time);
      if (index == 0) {
        return thistime;
      } else {
        let time = this.timeFormat(this.list[index - 1].create_time);
        if (time != thistime) {
          return thistime;
        }
      }
    },
    checkCategory(value) {
      if (this.category_id == value) {
        return false;
      }
      this.category_id = value;
      this.page = 1;
      this.list = [];
      this.isnext = true;
      this.getList();
    },
    handleScroll() {
      let dom = this.$el.children[2];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.isnext) {
          this.getList();
        }
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    async del(id) {
      this.$vux.loading.show({ text: "提交中......" });
      let res = await delMyPath("browse_id", id);
      this.$vux.loading.hide();
      this.page = 1;
      this.list = [];
      this.getList();
    },
    async getList() {
      this.$vux.loading.show({ text: "正在获取中..." });
      let res = await newMyPath(this.category_id, this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        if (this.categorylist.length == 0) {
          this.categorylist = res.data.category_list;
        }
        this.isnext = res.data.page_count > this.page;
        let that = this;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#collect {
  .p-a-all {
    top: 1.7rem;
    background: #eee;
    padding-top:0;
    .time {
      display: flex;
      font-size: 0.26rem;
      color: #666;
    }
    .item {
      padding: 0.3rem;
      margin-bottom: 1px;
      font-size: 0.3rem;
      background: #fafafa;
      .title {
        font-size: 0.26rem;
        color: #666;
        padding: 0.1rem 0;
      }
      img {
        width: 1rem;
        height: 1rem;
        display: inline-block;
        background: #eee;
      }
      .box {
        display: inline-block;
        width: calc(100% - 1.1rem);
        height: 1rem;
        padding: 0 0.1rem;
      }
    }
    button {
      height: 0.8rem;
      font-size: 0.3rem;
      color: #666;
      margin-top: 1rem;
    }
  }
  .menulist {
    white-space: nowrap;
    padding: 0 0.2rem;
    height: 0.81rem;
    width: 100%;
    overflow-x: scroll;
    background: #fff;
    .item {
      display: inline-block;
      padding: 0.2rem;
    }
    .item.checked {
      color: #f5326e;
      border-bottom: 1px solid #f5326e;
      box-sizing: border-box;
    }
  }
}
</style>
