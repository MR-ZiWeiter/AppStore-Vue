import { getAppConfig ,getAddressAll} from 'src/service/getData';

import getters from './getters'
const state = {
    appConfig: {},
    addressAll:{},
}

const mutations = {
    up_config(state, data) {
        state.appConfig = data;
    },
    up_address(state, data) {
        state.addressAll = data;
    }
}
getInfo();
// getAddress();
async function getInfo() {
    let res = await getAppConfig();
    if (res.code == 1) {
        window.default_goods_img = res.data.img.default_goods_img;
        window.default_headimg = res.data.img.default_headimg
        mutations.up_config(state, res.data);
    }
}
async function getAddress() {
    let res = await getAddressAll();
    if (res.code == 1) {
        let list=[];
        for(let i in res.data.province){
            let obj={
                name:res.data.province[i].province_name,
                value:res.data.province[i].province_id+'_p',
                parent:0
            };
            list.push(obj);
        }
        for(let i in res.data.city){
            let obj={
                name:res.data.city[i].city_name,
                value:res.data.city[i].city_id+'_c',
                parent:res.data.city[i].province_id+'_p',
            };
            list.push(obj);
        }

        for(let i in res.data.district){
            let obj={
                name:res.data.district[i].district_name,
                value:res.data.district[i].district_id+'_d',
                parent:res.data.district[i].city_id+'_c',
            };
            list.push(obj);
        }
        // console.log(list);

        // let district=[];
        // for(let i in res.data.district){
        //     if(!district[res.data.district[i].city_id]){
        //         district[res.data.district[i].city_id]=[];
        //     }
        //     district[res.data.district[i].city_id].push(res.data.district[i]);
        // }
        // let cityList=res.data.city;
        // let city=[];
        // for(let i in cityList){
        //     cityList[i].children=district[cityList[i].city_id];

        //     if(!city[cityList[i].province_id]){
        //         city[cityList[i].province_id]=[];
        //     }
        //     city[cityList[i].province_id].push(cityList[i]);
        // }
        // let province=res.data.province;
        // for(let i in province){
        //     province[i].children=city[province[i].province_id];
        // }
        mutations.up_address(state, list);
    }
}

export default {
    state,
    mutations,
    getters
}
