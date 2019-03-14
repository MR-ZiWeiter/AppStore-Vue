import { baseUrl } from './env'
import { getStore } from './mUtils'
export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase()
  url = baseUrl + url

  if (type == 'GET') {
    let dataStr = '' //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }
  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      // credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Device-Type': getStore('device_type'),
        'Token':  getStore('token'),
        'X-Requested-With':true
      },
      mode: 'cors',
      cache: 'no-cache'
    }

    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      const response = await fetch(url, requestConfig)
      const responseJson = await response.json()
     // console.log(responseJson)
      if (
        responseJson &&
        responseJson.hasOwnProperty('code') &&
        responseJson.code == 10001
      ) {
        window.myvue.$root.$children[0].showlogin = true
      }
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } 
  
  
}
