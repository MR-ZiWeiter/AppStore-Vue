<template>
    <div id="download">
        <!-- <head-top :go-back='true' head-title="设置密码"></head-top> -->
        <div class="p-a-all">
            <img src="../../images/download/download_bg_11.png" class="width-100" alt="">
            <img src="../../images/download/download_bg_2.jpg" class="bottom width-100" alt="">
            <div class="back" @click="back">
                <i class="iconfont icon-home1"></i>
            </div>
            <div class="buttons">
                <div class="btn" @click="download('android')"><img src="../../images/download/Android.png">Android 版{{androidUrl?'免费下载':'即将开放'}}</div>
                <div class="btn" @click="download('ios')"><img src="../../images/download/ios.png">iPhone 版{{iosUrl?'免费下载':'即将开放'}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import headTop from "src/components/header/head";

export default {
  components: { headTop },
  data() {
    return {
      androidUrl: window.androidUrl,
      iosUrl: window.iosUrl
    };
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    download(type){
        let url=this[type+'Url'];
        if(!url){
            this.$vux.toast.text('即将开放','middle');
        }else{
            window.open(url);
        }
    }
  }
};
</script>
<style lang="scss" scoped>
#download {
  .p-a-all {
    background: #fff;
    .bottom {
      position: absolute;
      bottom: 0;
    }
    .back {
      position: absolute;
      top: 0.6rem;
      background: #ff4444;
      color: #fff;
      display: inline;
      padding: 0.1rem 0.2rem;
      font-size: 0.24rem;
      border-top-right-radius: 0.2rem;
      border-bottom-right-radius: 0.2rem;
      i {
        color: #fff;
      }
    }
    .buttons {
      position: absolute;
      bottom: 0.8rem;
      width: 100%;
      padding: 0 1rem;
      .btn {
        padding: 0.2rem 0;
        color: #fff;
        border: 1px solid #ccc;
        margin-top: 0.3rem;
        border-radius: 0.5rem;
        font-size: 0.3rem;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 20px 1px rgba(255, 255, 255, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          margin-right: 0.2rem;
          width: 0.5rem;
        }
      }
    }
  }
  .width-100 {
    width: 100%;
  }
}
</style>
