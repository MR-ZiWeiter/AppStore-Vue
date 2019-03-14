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
        <div @click="province_show=true">
          <x-input label-width="1.5rem" title="省份:" required v-model="province.name" disabled placeholder="请选择省份"></x-input>
        </div>
      </group>
      <group v-if="citylist.length>0">
        <div @click="city_show=true">
          <x-input label-width="1.5rem" title="城市:" required v-model="city.name" disabled placeholder="请选择城市"></x-input>
        </div>
      </group>
      <group v-if="districtlist.length>0">
        <div @click="district_show=true">
          <x-input label-width="1.5rem" title="区县:" required v-model="district.name" disabled placeholder="请选择区县"></x-input>
        </div>
      </group>
      <group>
        <x-input label-width="1.5rem" title="详细地址:" required v-model="address" placeholder="请输入详细地址"></x-input>
      </group>
      <group>
        <x-input label-width="1.5rem" title="邮编:" required v-model="zip_code" placeholder="请输入邮编"></x-input>
      </group>
      <div class="btn" @click="save">保存</div>
    </div>
    <div v-transfer-dom>
      <popup v-model="province_show" v-if="province_show">
        <popup-header left-text="取消" right-text="确定" title="请选择省份" :show-bottom-border="false" @on-click-left="province_show = false" @on-click-right="done(1,'province_show')">
        </popup-header>
        <picker ref="picker1" :data='provincelist' v-if="provincelist.length>0" v-model='province_value'></picker>
      </popup>
      <popup v-model="city_show" v-if="city_show">
        <popup-header left-text="取消" right-text="确定" title="请选择城市" :show-bottom-border="false" @on-click-left="city_show = false" @on-click-right="done(2,'city_show')">
        </popup-header>
        <picker ref="picker2" :data='citylist' v-if="citylist.length>0" v-model='city_value'></picker>
      </popup>
      <popup v-model="district_show" v-if="district_show">
        <popup-header left-text="取消" right-text="确定" title="请选择区县" :show-bottom-border="false" @on-click-left="district_show = false" @on-click-right="done(3,'district_show')">
        </popup-header>
        <picker ref="picker3" :data='districtlist' v-if="districtlist.length>0" v-model='district_value'></picker>
      </popup>
      <popup v-model="test" v-if="addressAll.length>0">
        <popup-header left-text="取消" right-text="确定" title="请选择地址" :show-bottom-border="false" @on-click-left="test = false" @on-click-right="done(3,'district_show')">
        </popup-header>
        <picker :data='addressAll' :columns=3 v-model='test_value' @on-change='change'></picker>
      </popup>

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
import { mapState } from "vuex";
import headTop from "src/components/header/head";
export default {
  components: {
    headTop
  },
  data() {
    return {
      test_value: [],
      test: true,
      province_show: false,
      city_show: false,
      district_show: false,
      provincelist: [],
      citylist: [],
      districtlist: [],
      consigner: "",
      mobile: "",
      address: "",
      province_value: [],
      city_value: [],
      district_value: [],
      province: { name: "", value: "" },
      city: { name: "", value: "" },
      district: { name: "", value: "" },
      zip_code: "",
      type: this.$route.query.id ? "update" : "add",
      id: this.$route.query.id ? this.$route.query.id : ""
    };
  },
  watch: {
    province(val) {
      this.getCityList(val.value);
    },
    city(val) {
      if (val) {
        this.getDistrictList(val.value);
      }
    }
  },
  computed: {
    ...mapState({
      addressAll: state => state.config.addressAll
    })
  },
  beforeMount() {
    if (this.id) {
      this.getInfo();
    } else {
      this.getProvinceList();
    }
  },
  methods: {
    change(data) {
      console.log(data);
    },
    done(index, key) {
      switch (index) {
        case 1:
          this.province = {
            name: this.$refs["picker" + index].getNameValues(),
            value: this.province_value[0]
          };
          this.citylist = [];
          this.city = { name: "", value: "" };
          this.districtlist = [];
          this.district = { name: "", value: "" };
          break;
        case 2:
          this.city = {
            name: this.$refs["picker" + index].getNameValues(),
            value: this.city_value[0]
          };
          this.districtlist = [];
          this.district = { name: "", value: "" };
          break;
        case 3:
          this.district = {
            name: this.$refs["picker" + index].getNameValues(),
            value: this.district_value[0]
          };
          break;
      }
      this[key] = false;
    },
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
        this.province.value = obj.province;
        this.city.value = obj.city;
        this.district.value = obj.district;
        this.getProvinceList();
        this.getCityList(obj.province);
        this.getDistrictList(obj.city);
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async save() {
      if (
        !this.consigner ||
        !this.mobile ||
        !this.address ||
        !this.province.value ||
        !this.city.value ||
        !this.district.value ||
        !this.zip_code
      ) {
        this.$vux.toast.text("表单不完整", "middle");
        return false;
      }
      this.$vux.loading.show({ text: "处理中..." });
      let res = await addOrSetAddress(
        this.consigner,
        this.mobile,
        this.province.value,
        this.city.value,
        this.district.value,
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
        let that = this;
        for (let i in res.data) {
          let obj = {
            value: res.data[i].province_id + "",
            name: res.data[i].province_name
          };
          if (that.province.value == obj.value) {
            that.province.name = obj.name;
          }
          list.push(obj);
        }
        this.provincelist = [list];
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getCityList(id) {
      if (!id) {
        return false;
      }
      let res = await getCity(id);
      if (res.code == 1) {
        let list = [];
        let that = this;
        for (let i in res.data) {
          let obj = {
            value: res.data[i].city_id + "",
            name: res.data[i].city_name
          };
          list.push(obj);
          if (that.city.value == obj.value) {
            that.city.name = obj.name;
          }
        }

        this.citylist = [list];
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async getDistrictList(id) {
      if (!id) {
        return false;
      }
      let res = await getDistrict(id);
      if (res.code == 1) {
        let list = [];
        let that = this;
        for (let i in res.data) {
          let obj = {
            value: res.data[i].district_id + "",
            name: res.data[i].district_name
          };
          list.push(obj);
          if (that.district.value == obj.value) {
            that.district.name = obj.name;
          }
        }

        this.districtlist = [list];
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
  .weui-cell__hd,
  .weui-label {
    width: 1.5rem !important;
  }

  option {
    display: inline-block;
    font-size: 0.1rem;
  }
}

.scroller-mask {
  background-size: 100% 1.62rem !important;
}
.scroller-item {
  font-size: 0.3rem !important;
  height: 0.68rem !important;
  line-height: 0.68rem !important;
}
.scroller-indicator {
  height: 0.68rem !important;
  background-size: 100% 0;
}
.scroller-component {
  height: 4rem !important;
}
.scroller-content {
  top: -0.38rem !important;
}

// .scroller-mask {
//   background-size: 100% 1.75rem !important;
// }
// .scroller-item {
//   font-size: 0.28rem !important;
//   height: 0.5rem !important;
//   line-height: 0.5rem !important;
// }
// .scroller-indicator {
//       display: none;
//   height: 0.5rem !important;
//   background-size:100% 0;
// }
// .scroller-component {
//   height: 4rem !important;
// }
// .scroller-content {
//   top: -0.25rem !important;
// }
</style>

