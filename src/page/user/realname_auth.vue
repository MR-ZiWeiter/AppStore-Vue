<template>
    <div id="set">
        <head-top :go-back='true' head-title="实名认证"></head-top>
        <div class="p-a-all">
            <p class="p-10 text-color-999">基本资料</p>
            <div class="bg-white">
                <x-input title="请输入真实姓名" type="text" placeholder="" v-model="realname" :disabled="status!=-1&&status!=2"></x-input>
                <x-input title="请确认身份证号" v-model="idcard" type="text" placeholder="" :disabled="status!=-1&&status!=2"></x-input>
            </div>
            <p class="p-10 text-color-999">上传身份证</p>
            <div class="bg-white p-10">
                <p class="text-align-center text-color-999 font-size-13 m-b-10">身份证正面</p>
                <div class="img-box m-b-10 needsclick" @click="imgclick('inputFile')">
                    <i class="iconfont icon-jia needsclick" v-if="!face"></i>
                    <img v-else :src="imgurl+'/'+face" alt="" class="needsclick">
                </div>
                <p class="text-align-center text-color-999 font-size-13 m-b-10">身份证反面</p>
                <div class="img-box needsclick" @click="$refs.inputFile1.click()">
                    <i class="iconfont icon-jia needsclick" v-if="!con"></i>
                    <img v-else :src="imgurl+'/'+con" alt="" class="needsclick">
                </div>
                <div v-if="status==-1||status==2">
                    <input type="file" id="inputFile" ref="inputFile"  accept="image/*" @change="handkeFileChange('inputFile','face')" style="opacity:0">
                    <input type="file" id="inputFile1" ref="inputFile1"  accept="image/*" @change="handkeFileChange('inputFile1','con')" style="opacity:0">
                </div>
            </div>
            <p class="text-align-center text-color-999 font-size-13  m-t-10">所传照片必须真实清晰才能通过审核</p>
            <div class="p-10">
                <button class="check" v-if="status==-1" @click="save">提交</button>
                <button v-if="status==0">等待审核</button>
                <button v-if="status==1">实名认证已通过</button>
                <button class="check" @click="save" v-if="status==2">重新提交</button>
            </div>

        </div>
    </div>
</template>
<script>
import { addAuth, getAuth } from "src/service/getData";
import headTop from "src/components/header/head";
import { getStore } from "src/config/mUtils";
import { baseUrl, imgBaseUrl } from "src/config/env";
export default {
  components: { headTop },
  data() {
    return {
      realname: "",
      idcard: "",
      face: "",
      con: "",
      host: "",
      imgurl: imgBaseUrl,
      info: {},
      status: -1
    };
  },
  beforeMount() {
    this.getInfo();
    this.host = baseUrl;
  },
  methods: {
    imgclick(field) {
      if (this.status == -1 || this.status == 2) {
        this.$refs[field].click();
      }
    },
    changeRealname() {
      let realname = this.realname;
      realname = realname.replace(/ /g, "");
      if (realname == "") {
        this.$vux.toast.text("真实姓名不能为空!", "middle");
        return false;
      }
      var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
      if (!reg.test(realname)) {
        this.$vux.toast.text("真实姓名格式错误!", "middle");
        return false;
      }
      this.realname = realname;
      return true;
    },
    checkCard() {
      let idcard = this.idcard;
      idcard = idcard.replace(/ /g, "");
      if (idcard == "") {
        this.$vux.toast.text("身份证号不能为空!", "middle");
        return false;
      }
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(idcard)) {
        this.$vux.toast.text("身份证号格式错误!", "middle");
        return false;
      }
      this.idcard = idcard;
      return true;
    },
    async save() {
      if (!this.changeRealname()) {
        return;
      }
      if (!this.checkCard()) {
        return;
      }
      if (!this.face || !this.con) {
        this.$vux.toast.text("身份证正反面未上传完成!", "middle");
      }
      this.$vux.loading.show({ text: "处理中..." });
      let res = await addAuth(this.realname, this.idcard, this.face, this.con);
      this.$vux.toast.text(res.msg, "middle");
      this.$vux.loading.hide();
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    },
    goto(url) {
      this.$router.push(url);
    },
    handkeFileChange(id, field) {
      let that = this;
      that.$vux.loading.show({
        text: "正在上传..."
      });
      var img = document.getElementById(id).files[0];
      var data = new FormData();
      data.append("file_path", "upload/auth/");
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
            that[field] = response.data;
          } else {
            that.$vux.toast.text(response.msg, "middle");
          }
        }
      };

      xhr.send(data);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "处理中..." });
      let res = await getAuth();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
        this.realname = res.data.realname;
        this.idcard = res.data.idcard;
        this.face = res.data.path_face;
        this.con = res.data.path_con;
        this.status = res.data.status;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#set {
  .p-10 {
    padding: 0.3rem;
  }
  .p-a-all {
    background: #eee;
    .img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 4rem;
      border: 0.05rem solid #ccc;
      i {
        font-size: 1rem;
        color: #ccc;
      }
      img {
        width: 100%;
        height: 3.94rem;
        background: #eee;
      }
    }
    button.check {
      background: #ff4444;
      color: #fff;
    }
    button {
      height: 0.8rem;
      font-size: 0.3rem;
      width: 100%;
      border-radius: 0.1rem;
    }
  }
}
</style>

