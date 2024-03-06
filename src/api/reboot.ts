import { getURLAndInit } from '$src/misc/request-helper';
import { ClashAPIConfig } from '$src/types';


export function rebootF(  apiConfig: ClashAPIConfig,listener: (s:any) => void){
  rebootRequest(apiConfig)
    .then(
      (res) => {
        if (res.ok) {
          listener(res.statusText)
        } else {
          let msg;
          if (res.status === 400) {
            res.text().then(function (text) {
              listener(text)
            })
            return
          } else if (res.status === 503) {
            msg = "先安装成系统服务。";
          } else {
            msg = "未知状态";
          }
          listener(msg)
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.log('Error update configs', err);
        throw err;
      }
    )
}
const endpoint = "/reboot"
async function rebootRequest(apiConfig: ClashAPIConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, { ...init, method: 'GET' });
}