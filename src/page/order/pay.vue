<template>
  <div id="pay-value">
    <head-top
      :go-back='true'
      head-title="订单支付"
      :rightMenu="true"
    ></head-top>
    <div
      class="bottom"
      @click="pay"
    >
      确认支付￥{{info.pay_value.pay_money}}
    </div>
    <div class="p-a-all">
      <div class="top">
        <p class="font-size-15">向{{appname}}支付</p>
        <p class="font-size-18">￥{{info.pay_value.pay_money}}</p>
      </div>
      <div class="box">
        <div class="title">充值方式</div>
        <div
          class="flex-box"
          v-if="info.pay_config.ali_pay_config.is_use==1&&!this.isWeiXin() "
          @click="setPay('alipay')"
        >
          <span class="rows"><img
              class="icon"
              src="../../images/zhifubao.png"
              alt=""
            >支付宝</span>
          <i
            class="material-icons"
            :class="{check:checkPay=='alipay'}"
          >
            check_circle
          </i>
        </div>
        <div
          class="flex-box"
          v-if="info.pay_config.wchat_pay_config.is_use==1&&wxshow"
          @click="setPay('wxpay')"
        >
          <span class="rows"><img
              class="icon"
              src="../../images/weixin.png"
              alt=""
            >微信</span>
          <i
            class="material-icons"
            :class="{check:checkPay=='wxpay'}"
          >
            check_circle
          </i>
        </div>
        <div
          class="flex-box"
          v-if="info.pay_config.offline_pay_config.is_use==1"
          @click="setPay('bank')"
        >
          <span class="rows"><img
              class="icon"
              src="../../images/bank.png"
              alt=""
            >银行卡转账</span>
          <i
            class="material-icons"
            :class="{check:checkPay=='bank'}"
          >
            check_circle
          </i>
        </div>
        <div
          class="flex-box"
          v-if="info.pay_config.ali_offline_pay_config.is_use==1"
          @click="setPay('ali_pay')"
        >
          <span class="rows"><img
              class="icon"
              src="../../images/zhifubao.png"
              alt=""
            >支付宝转账</span>
          <i
            class="material-icons"
            :class="{check:checkPay=='ali_pay'}"
          >
            check_circle
          </i>
        </div>
        <div
          class="flex-box"
          v-if="info.pay_config.wx_offline_pay_config.is_use==1"
          @click="setPay('wx_pay')"
        >
          <span class="rows"><img
              class="icon"
              src="../../images/weixin.png"
              alt=""
            >微信转账</span>
          <i
            class="material-icons"
            :class="{check:checkPay=='wx_pay'}"
          >
            check_circle
          </i>
        </div>
        <div
          class="bank-content "
          v-if="checkPay=='bank'"
        >
          <div class="text-align-center ">
            <p>收款银行 : {{info.pay_config.offline_pay_config.value.bank}}</p>
            <p>收款账号 : {{info.pay_config.offline_pay_config.value.bank_number}}</p>
            <p>收款者 : {{info.pay_config.offline_pay_config.value.bank_user}}</p>
          </div>
          <div class="bank-box ">
            <input
              type="text"
              v-model="transaction_id"
              placeholder="请输入汇款单号"
            >
            <div
              class="upload-img needsclick "
              v-if="uploadimg"
              @click="$refs.inputFile.click()"
            >
              <img
                :src="imgurl+uploadimg"
                class="needsclick"
                alt=""
              >
            </div>
            <div
              class="upload-box needsclick "
              v-else
              @click="$refs.inputFile.click()"
            >
              <img
                src="../../images/upload.png"
                class="needsclick"
                alt=""
              >
              <p>请上传汇款凭证</p>
            </div>
          </div>
          <input
            type="file"
            id="inputFile"
            ref="inputFile"
            capture="camera"
            accept="image/*"
            @change="handkeFileChange"
            style="opacity:0"
          >
        </div>
        <div
          class="bank-content "
          v-if="checkPay=='ali_pay'"
        >
          <div class="text-align-center ">
            <div>收款二维码:</div>
            <div>
              <img
                :src="imgurl+info.pay_config.ali_offline_pay_config.value.ali_qrcode"
                alt=""
                style="width:2.5rem;height:2.5rem;"
                @touchstart="gtouchstart(1)"
                @touchmove="gtouchmove"
                @touchend="gtouchend"
              >
              <p style="color: #666;">长按识别二维码付款</p>
            </div>
            <p>支付宝账号 : {{info.pay_config.ali_offline_pay_config.value.account}}</p>
            <p>真实姓名 : {{info.pay_config.ali_offline_pay_config.value.realname}}</p>
            <p>联系方式 : {{info.pay_config.ali_offline_pay_config.value.phone}}</p>
          </div>
          <div class="bank-box ">
            <input
              type="text"
              v-model="transaction_id"
              placeholder="请输入付款账号"
            >
            <div
              class="upload-img needsclick "
              v-if="uploadimg"
              @click="$refs.inputFile.click()"
            >
              <img
                :src="imgurl+uploadimg"
                class="needsclick"
                alt=""
              >
            </div>
            <div
              class="upload-box needsclick "
              v-else
              @click="$refs.inputFile.click()"
            >
              <img
                src="../../images/upload.png"
                class="needsclick"
                alt=""
              >
              <p>请上传汇款凭证</p>
            </div>
          </div>
          <input
            type="file"
            id="inputFile"
            ref="inputFile"
            capture="camera"
            accept="image/*"
            @change="handkeFileChange"
            style="opacity:0"
          >
        </div>
        <div
          class="bank-content "
          v-if="checkPay=='wx_pay'"
        >
          <div class="text-align-center ">
            <div>收款二维码:</div>
            <div>
              <img
                :src="imgurl+info.pay_config.wx_offline_pay_config.value.wx_qrcode"
                alt=""
                style="width:2.5rem;height:2.5rem;"
                @touchstart="gtouchstart(2)"
                @touchmove="gtouchmove"
                @touchend="gtouchend"
              >              
              <p style="color: #666;">扫描二维码付款</p>
            </div>
            <p>手机号 : {{info.pay_config.wx_offline_pay_config.value.phone}}</p>
          </div>
          <div class="bank-box ">
            <input
              type="text"
              v-model="transaction_id"
              placeholder="请输入付款账号"
            >
            <div
              class="upload-img needsclick "
              v-if="uploadimg"
              @click="$refs.inputFile.click()"
            >
              <img
                :src="imgurl+uploadimg"
                class="needsclick"
                alt=""
              >
            </div>
            <div
              class="upload-box needsclick "
              v-else
              @click="$refs.inputFile.click()"
            >
              <img
                src="../../images/upload.png"
                class="needsclick"
                alt=""
              >
              <p>请上传付款凭证</p>
            </div>
          </div>
          <input
            type="file"
            id="inputFile"
            ref="inputFile"
            capture="camera"
            accept="image/*"
            @change="handkeFileChange"
            style="opacity:0"
          >
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import headTop from "src/components/header/head";
import AvatarCropper from "src/components/common/AvatarCropper";
import {
  getpayvalue,
  AddTransaction,
  wchatPay,
  companyPaymentpx,
  companyPaymenttail,
  serviceAddTransaction
} from "src/service/getData";
import { baseUrl } from "src/config/env";
import { getStore } from "src/config/mUtils";
let timeOutEvent=null;
export default {
  components: { headTop, AvatarCropper },
  data() {
    return {
      deviceType: getStore("device_type"),
      transaction_id: "",
      appname: appname,
      checkPay: "",
      tempUrl: "",
      uploadimg: "",
      host: "",
      imgurl: "",
      pay_type: "",
      info: {
        pay_value: { pay_money: 0 },
        pay_config: {
          ali_pay_config: { is_use: 0 },
          offline_pay_config: { is_use: 0 },
          wchat_pay_config: { is_use: 0 },
          ali_offline_pay_config: { is_use: 0 },
          wx_offline_pay_config: { is_use: 0 }
        }
      },
      wxshow: true
    };
  },
  beforeMount() {
    this.host = baseUrl;
    this.getinfo();
    if (this.deviceType == "web" && !this.isWeiXin()) {
      this.wxshow = false;
    }
  },
  methods: {
    //开始按
    gtouchstart(item) {
      let deviceType = getStore("device_type");
      if (deviceType == "web") {
        return
      }
      let that=this;
      let url=""
      if(item==1){
        url=this.info.pay_config.ali_offline_pay_config.value.ali_url
      }
      if(item==2){
        url=this.info.pay_config.wx_offline_pay_config.value.wx_url
      }
      if(!url){
        return
      }
      timeOutEvent = setTimeout(function() {
         plus.runtime.openURL(url);
      }, 1000); //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
      return false;
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gtouchend(item) {
      clearTimeout(timeOutEvent); //清除定时器
      if (timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
        //vm.goChat(item);
      }
      return false;
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gtouchmove() {
      clearTimeout(timeOutEvent); //清除定时器
      timeOutEvent = 0;
    },

    //真正长按后应该执行的内容
    longPress: function longPress(item) {
      timeOutEvent = 0;
      //执行长按要执行的内容，如弹出菜单
      console.log("longPress")
    },
    isWeiXin() {
      //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
      var ua = window.navigator.userAgent.toLowerCase();
      //通过正则表达式匹配ua中是否含有MicroMessenger字符串
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    pay() {
      switch (this.checkPay) {
        case "alipay":
          this.alipay();
          break;
        case "wxpay":
          this.wxpay();
          break;
        case "bank":
          this.pay_type = 0;
          this.addtran();
          break;
        case "ali_pay":
          this.pay_type = 1;
          this.addtran();
          break;
        case "wx_pay":
          this.pay_type = 2;
          this.addtran();
          break;
      }
    },
    async alipay() {
      let that = this;
      let deviceType = getStore("device_type");
      this.$vux.loading.show({
        text: "正在处理..."
      });
      if (deviceType == "web") {
        location.href =
          baseUrl +
          "Pay/companyPaymenttail&out_trade_no=" +
          this.$route.query.id;
      } else {
        let res = await companyPaymenttail(this.$route.query.id);
        this.$vux.loading.hide();
        if (res.code == 1) {
          plus.payment.request(
            aliChannel,
            res.data,
            function(result) {
              setTimeout(() => {
                that.$router.push("/user");
              }, 2000);
            },
            function(error) {
              this.$vux.toast.text("支付失败：" + error.code, "middle");
            }
          );
        }
      }
    },
    async wxpay() {
      let that = this;
      let deviceType = getStore("device_type");
      if (deviceType == "web") {
        location.href =
          baseUrl + "Pay/companyPaymentpx&out_trade_no=" + this.$route.query.id;
      } else {
        this.$vux.loading.show({
          text: "正在处理..."
        });
        let res = await companyPaymentpx(this.$route.query.id);
        this.$vux.loading.hide();
        // console.log(JSON.stringify(res));
        if (res.code == 1) {
          let payData = JSON.parse(res.data);
          let varpay = {
            //参数顺序必须正确
            retcode: 0, //5+必备参数
            retmsg: "ok", //5+必备参数
            appid: payData.appid,
            noncestr: payData.noncestr,
            package: "Sign=WXPay",
            partnerid: payData.partnerid,
            prepayid: payData.prepayid,
            timestamp: payData.timestamp,
            sign: payData.sign
          };
          // console.log(JSON.stringify(varpay));

          plus.payment.request(
            wxChannel,
            varpay,
            function(result) {
              setTimeout(() => {
                that.$router.push("/user");
              }, 2000);
            },
            function(error) {
              this.$vux.toast.text("支付失败：" + error.code, "middle");
            }
          );
        }
      }
    },
    async addtran() {
      if (!this.transaction_id || !this.uploadimg) {
        this.$vux.toast.text("请填写汇款单号和汇款图片", "middle");
        return false;
      }
      this.$vux.loading.show({
        text: "正在提交..."
      });
      let res = await AddTransaction(
        this.$route.query.id,
        this.transaction_id,
        this.uploadimg,
        this.pay_type,
        this.info.pay_value.type
      );
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.push("/user");
          //this.$router.push('/pay_result?orderid='+this.info.pay_value.type_alis_id);
        });
      }
    },
    handkeFileChange(e) {
      let that = this;
      that.$vux.loading.show({
        text: "正在上传..."
      });
      var img = document.getElementById("inputFile").files[0];
      var data = new FormData();
      data.append("file_path", "upload/pay/");
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
            that.uploadimg = response.data;
          } else {
            that.$vux.toast.text(response.msg, "middle");
          }
        }
      };

      xhr.send(data);
    },
    setPay(name) {
      this.checkPay = name;
    },
    async getinfo() {
      this.$vux.loading.show({
        text: "正在获取订单信息..."
      });
      let res = await getpayvalue(this.$route.query.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        if (res.msg == "订单已经支付或者订单价格为0.00，无需再次支付!") {
          this.$router.push("/order");
        }
        this.imgurl = res.data.url + "/";
        this.info = res.data;
        if (this.info.pay_config.ali_pay_config.is_use == 1) {
          this.checkPay = "alipay";
        } else if (this.info.pay_config.wchat_pay_config.is_use == 1) {
          this.checkPay = "wxpay";
        } else if (this.info.pay_config.offline_pay_config.is_use == 1) {
          this.checkPay = "bank";
        } else if (this.info.pay_config.ali_offline_pay_config.is_use == 1) {
          this.checkPay = "ali_pay";
        } else if (this.info.pay_config.wx_offline_pay_config.is_use == 1) {
          this.checkPay = "wx_pay";
        }
        if (!this.checkPay) {
          this.$vux.toast.text("未开启支付!", "middle");
          this.$router.go(-1);
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#pay-value {
  .bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1rem;
    padding: 0;
    background: #eec242;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .p-a-all {
    bottom: 1.01rem;
  }
  .bank-content {
    padding: 0 0.3rem;
    .upload-img {
      width: 100%;
      // height: 2.8rem;
      margin-top: 0.2rem;
      img {
        width: 100%;
      }
    }
    .upload-box {
      text-align: center;
      border: 1px dashed #999;
      margin-top: 0.2rem;
      width: 100%;
      height: 2.8rem;
      padding: 0.5rem 0;
      img {
        width: 1rem;
        height: 1rem;
      }
    }
    p {
      line-height: 0.6rem;
    }
    .bank-box {
      input {
        margin-top: 0.2rem;
        padding: 0.2rem 0.3rem;
        background: #eee;
        width: 100%;
        border-radius: 0.2rem;
      }
    }
  }
  .top {
    padding: 1.4rem 0 0.5rem;
    text-align: center;
  }
  .box {
    position: relative;
    top: 1px;
    background: #fafafa;
    width: 100%;
    font-size: 0.3rem;
    padding: 0.32rem;
    margin-bottom: 0.2rem;
    color: #666666;
    .flex-box {
      padding: 0.3rem 0 0.1rem 0;
      i {
        font-size: 0.5rem;
        color: #ccc;
      }
      i.check {
        color: #4cd964;
      }
    }
    input {
      outline: none;
      background: #fafafa;
      width: 80%;
      color: #696969;
    }
    input::-webkit-input-placeholder {
      color: #ccc;
    }
    .icon {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
    }
  }
}
</style>
