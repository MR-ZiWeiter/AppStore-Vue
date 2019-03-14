<template>
    <div id="address-add">
        <head-top head-title="添加收货地址" :go-back='true' :rightMenu="true"></head-top>
        <div class="p-a-all">
            <group>
                <x-input label-width="1.5rem" title="姓名:" required v-model="consigner" placeholder="请输入姓名"></x-input>
            </group>
            <group>
                <x-input label-width="1.5rem" title="手机号:" required v-model="mobile" placeholder="请输入手机号"></x-input>
            </group>
            <group v-if="provincelist.length>0">
                <selector label-width="1.5rem" placeholder="请选择省份" title="省份:" v-model="province" :options="provincelist"></selector>
            </group>
            <group v-if="citylist.length>0">
                <selector label-width="1.5rem" placeholder="请选择城市" title="城市:" v-model="city" :options="citylist"></selector>
            </group>
            <group v-if="districtlist.length>0">
                <selector label-width="1.5rem" placeholder="请选择区县" title="区县:" v-model="district" :options="districtlist"></selector>
            </group>
            <group>
                <x-input label-width="1.5rem" title="详细地址:" required v-model="address" placeholder="请输入详细地址"></x-input>
            </group>
            <group>
                <x-input label-width="1.5rem" title="邮编:" required v-model="zip_code" placeholder="请输入邮编"></x-input>
            </group>
            <div class="btn" @click="save">保存</div>
        </div>
    </div>
</template>
<script>
import {
  getProvince,
  getCity,
  getDistrict,
  addOrSetAddress,
  getUserAddress
} from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: {
    headTop
  },
  data() {
    return {
      provincelist: [],
      citylist: [],
      districtlist: [],
      consigner: "",
      mobile: "",
      address: "",
      province: "",
      city: "",
      district: "",
      zip_code: "",
      type: this.$route.query.id ? "update" : "add",
      id: this.$route.query.id ? this.$route.query.id : ""
    };
  },
  watch: {
    province(val) {
      //   this.citylist = [];
      //   this.districtlist = [];
      //   this.city = "";
      //   this.district = "";
      this.getCityList(val);
    },
    city(val) {
      //this.districtlist = [];
      //   this.district = "";
      if (val) {
        this.getDistrictList(val);
      }
    }
  },
  beforeMount() {
    this.getProvinceList();
    if (this.id) {
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await getUserAddress(2, this.id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        let obj = res.data.data[0];
        this.consigner = obj.consigner;
        this.mobile = obj.mobile;
        this.address = obj.address;
        this.zip_code = obj.zip_code;
        this.province = obj.province;
        this.city = obj.city;
        this.district = obj.district;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async save() {
      if (
        !this.consigner ||
        !this.mobile ||
        !this.address ||
        !this.province ||
        !this.city ||
        !this.district ||
        !this.zip_code
      ) {
        this.$vux.toast.text("表单不完整", "middle");
        return false;
      }
      this.$vux.loading.show({ text: "处理中..." });
      let res = await addOrSetAddress(
        this.consigner,
        this.mobile,
        this.province,
        this.city,
        this.district,
        this.address,
        this.zip_code,
        this.type,
        this.id
      );
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.go(-1);
        }, 2000);
      }
    },
    async getProvinceList() {
      let res = await getProvince();
      if (res.code == 1) {
        let list = [];
        for (let i in res.data) {
          let obj = {
            key: res.data[i].province_id,
            value: res.data[i].province_name
          };
          list.push(obj);
        }
        this.provincelist = list;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getCityList(id) {
      let res = await getCity(id);
      if (res.code == 1) {
        let list = [];
        for (let i in res.data) {
          let obj = {
            key: res.data[i].city_id,
            value: res.data[i].city_name
          };
          list.push(obj);
        }
        this.citylist = list;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getDistrictList(id) {
      let res = await getDistrict(id);
      if (res.code == 1) {
        let list = [];
        for (let i in res.data) {
          let obj = {
            key: res.data[i].district_id,
            value: res.data[i].district_name
          };
          list.push(obj);
        }
        this.districtlist = list;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.v-center {
  display: flex;
  align-items: center;
}
#address-add {
  .btn {
    width: calc(100% - 0.6rem);
    margin: 0.3rem;
    padding: 0.2rem;
    background: #eec242;
    text-align: center;
    color: #fff;
    border-radius: 0.1rem;
  }
}
</style>
<style lang="scss">
#address-add {
  .weui-cell__hd ,.weui-label{
    width: 1.5rem !important;
  }
  .weui-select{
    height:0.4rem!important;
    line-height: 0.4rem!important;
  }
  option {
    display: inline-block;
    font-size: 0.1rem;
  }
}
</style>

