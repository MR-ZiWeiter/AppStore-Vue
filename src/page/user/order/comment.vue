<template>
  <div id="comment">
    <head-top :go-back='true' :head-title="title" :rightMenu="true"></head-top>
    <div class="p-a-all">
      <div class="comment-box" v-for="(item,key) in info" :key="key">
        <div class="goods flex-box" @click="goto('/goods?id='+item.goods_id)">
          <img :src="item.picture_info.pic_cover_small" alt="" :onerror="local_default_goods_img">
          <div>
            <p class="ellipsis">{{item.goods_name}}</p>
            <p class="font-size-12 text-color-999">{{item.sku_name}}</p>
            <p class="price">￥{{item.price}}</p>
            <p class="font-size-12 text-color-999">x{{item.num}}</p>
          </div>
        </div>
        <div class="flex">
          <textarea rows="5" v-model="contents[key]" placeholder="请输入要评价的内容，不要超过150个字符。。"></textarea>
        </div>
        <div class="img-box">
          <div class="list">
            <img v-for="(item,index) in imgs[key]" :key="index" :src="imgurl+item" @click="del(key,index)">
          </div>
          <div class="add-box">
            <i @click="upload(key)" class="iconfont icon-camera needsclick"></i>
            发照片 {{imgs[key]?imgs[key].length:0}}/5
            <span class="font-size-12 text-color-999">(点击图片删除)</span>
          </div>
        </div>
        <div v-if="!type">
          <div class="flex-box" style="padding:0.2rem 0.3rem;background:#fff;">
            <span>商品与描述相符</span>
            <div class="rater" v-if="score_list[key]">
              <i @click="setField('score_list',key,n)" class="iconfont " :class="{'icon-ziyuan':n<=score_list[key],'icon-xingxing-copy':n>score_list[key]}" v-for="n in 5" :key="n"></i>
            </div>
          </div>
          <div class="flex-box anonymous" @click="setField('anonymous',key,!anonymous[key])">
            <input v-model="anonymous[key]" type="checkbox">
            <span>匿名评价</span>
          </div>
        </div>
      </div>
      <input type="file" id="inputFile" ref="inputFile" capture="camera" accept="image/*" @change="handkeFileChange" style="opacity:0;">
      <div class="text-align-center">
        <button @click="submit">提交</button>
      </div>
    </div>

  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { getStore } from "src/config/mUtils";
import { baseUrl, imgBaseUrl } from "src/config/env";
import {
  serviceOrderDetail,
  orderDetail,
  addgoodsevaluate,
  addgoodsevaluateagain,
  addServiceGoodsEvaluate,
  addServiceGoodsEvaluateAgain
} from "src/service/getData";
export default {
  components: {
    headTop
  },
  data() {
    return {
      title: "评价",
      host: "",
      imgurl: imgBaseUrl,

      info: {},
      type: "",

      score_list: [],
      contents: [],
      imgs: [],
      imgcheck: -1,
      anonymous: [],
      local_default_goods_img:
        'this.src="' + window.default_goods_img + '";this.onerror = null'
    };
  },
  watch: {
    content(val) {
      if (val.length > 150) {
        this.content = val.substring(0, 150);
      }
    }
  },
  beforeMount() {
    this.host = baseUrl;
    this.getInfo();
    if (this.type && this.type != "agent") {
      this.$router.go(-1);
    }
  },
  methods: {
    upload(key) {
      if (this.imgs[key] && this.imgs[key].length >= 5) {
        return false;
      }
      this.imgcheck = key;
      this.$refs.inputFile.click();
    },
    setField(field, key, n) {
      this.$set(this[field], key, n);
    },
    setData(goods) {
      let that = this;
      for (let i in goods) {
        that.score_list[i] = 5;
        that.contents[i] = "";
        that.anonymous[i] = false;
        that.imgs[i] = [];
      }
      this.info = goods;
    },
    async getInfo() {
      this.$vux.loading.show({ text: "正在获取中......" });
      let res;
      if (this.$route.query.type == "service") {
        res = await serviceOrderDetail(this.$route.query.id);
      } else {
        res = await orderDetail(this.$route.query.id);
      }
      this.$vux.loading.hide();
      if (res.code == 1) {
        if (res.data.order.is_evaluate == 1) {
          this.type = "agent";
          this.title = "追加评价";
        } else if (res.data.order.is_evaluate == 2) {
          this.$router.go(-1);
        }
        this.setData(res.data.order.order_goods);
      } else {
        this.$vux.toast.text(res.msg, "middle");
        setTimeout(() => {
          this.$router.go(-1);
        });
      }
    },
    submit() {
      if (this.type == "agent") {
        this.agent();
      } else {
        this.save();
      }
    },
    async agent() {
      let list = [];
      let that = this;
      for (let i in this.info) {
        let obj = {
          order_id: that.info[i].order_id,
          order_goods_id: that.info[i].order_goods_id,
          imgs: that.imgs[i] + "",
          content: that.contents[i] ? that.contents[i] : "此用户没有填写评价"
        };
        list.push(obj);
      }
      this.$vux.loading.show({
        text: "正在提交..."
      });

      let res;
      if (this.$route.query.type == "service") {
        res = await addServiceGoodsEvaluateAgain(this.$route.query.id, list);
      } else {
        res = await addgoodsevaluateagain(this.$route.query.id, list);
      }
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.$router.go(-1);
      }
    },
    get_explain_type(score) {
      if (score >= 4) {
        return 1;
      } else if (score >= 2) {
        return 2;
      } else {
        return 3;
      }
    },
    async save() {
      let list = [];
      let that = this;
      for (let i in this.info) {
        let obj = {
          is_anonymous: that.anonymous[i],
          order_id: that.info[i].order_id,
          order_goods_id: that.info[i].order_goods_id,
          scores: that.score_list[i],
          explain_type: that.get_explain_type(that.score_list[i]),
          imgs: that.imgs[i] + "",
          content: that.contents[i] ? that.contents[i] : "此用户没有填写评价"
        };
        list.push(obj);
      }

      this.$vux.loading.show({
        text: "正在提交..."
      });

      let res;
      if (this.$route.query.type == "service") {
        res = await addServiceGoodsEvaluate(
          this.$route.query.id,
          this.$route.query.order_no,
          list
        );
      } else {
        res = await addgoodsevaluate(
          this.$route.query.id,
          this.$route.query.order_no,
          list
        );
      }

      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.$router.go(-1);
      }
    },

    del(key, index) {
      let obj = [];
      let that = this;
      for (let i in this.imgs[key]) {
        if (i != index) {
          obj.push(that.imgs[key][i]);
        }
      }
      this.$set(this.imgs, key, obj);
    },
    handkeFileChange(e) {
      let that = this;
      var img = document.getElementById("inputFile").files[0];
      if (!img) {
        return false;
      }
      that.$vux.loading.show({
        text: "正在上传..."
      });

      var data = new FormData();
      data.append("file_path", "upload/comment/");
      data.append("file_upload", img);
      let xhr = new XMLHttpRequest();
      xhr.open("POST", this.host + "Uploade/uploadFile", true);
      xhr.setRequestHeader("Device-Type", getStore("device_type"));
      xhr.setRequestHeader("Token", getStore("token"));
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          that.$vux.loading.hide();
          let response = "";
          try {
            response = JSON.parse(xhr.responseText);
          } catch (err) {
            response = xhr.responseText;
          }
          if (response.code == 1) {
            let list = [];
            if (that.imgs[that.imgcheck]) {
              list = that.imgs[that.imgcheck];
            }
            list.push(response.data);
            that.$set(that.imgs, that.imgcheck, list);
          } else {
            that.$vux.toast.text(response.msg, "middle");
          }
        }
      };

      xhr.send(data);
    },
    goto(url) {
      this.$router.push(url);
    }
  }
};
</script>
<style lang="scss" scoped>
#comment {
  .p-a-all {
    background: #eee;
    padding-bottom: 0.2rem;
    .comment-box {
      margin-bottom: 0.2rem;
    }
    .rater {
      i {
        color: #ff4444;
        margin: 0 0.1rem;
      }
    }
    button {
      height: 0.8rem;
      font-size: 0.3rem;
      color: #666;
      margin-top: 1rem;
      width: calc(100% - 2rem);
      color: #fff;
      background: #ff4444;
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
    .anonymous {
      padding: 0.2rem 0.3rem;
      margin: 0;
      background: #fff;
      input {
        width: 0.3rem;
        height: 0.3rem;
      }
    }
    textarea {
      width: 100%;
      resize: none;
      color: #666;
      font-size: 0.26rem;
      padding: 0.2rem 0.3rem;
      margin: 0;
    }
    .img-box {
      padding: 0.2rem 0.3rem;
      margin: 0;
      background: #fff;
      .list {
        font-size: 0;
        margin-bottom: 0.2rem;

        img {
          position: relative;
          width: 1rem;
          height: 1rem;
          background: #eee;
          display: inline-block;
          margin-right: 0.2rem;
        }
      }
      .add-box {
        display: flex;
        align-items: center;
        i {
          width: 1rem;
          height: 1rem;
          border: 1px solid #aaa;
          text-align: center;
          line-height: 1rem;
          margin-right: 0.2rem;
          color: #666;
        }
      }
    }
  }
}
</style>


