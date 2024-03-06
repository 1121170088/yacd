import { ClashAPIConfig } from '$src/types';

import { buildWebSocketURL } from '../misc/request-helper';

const endpoint = '/memory';

// 1 OPEN
// other value CLOSED
// similar to ws readyState but not the same
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
let wsState: number;
let ws:WebSocket
function fetchMemory(apiConfig: ClashAPIConfig, listener: (x: any) => void) {
  if (wsState === 1) {
    ws.addEventListener('message', function (event) {
      listener(event.data);
    });
    return
  };
  wsState = 1;
  const url = buildWebSocketURL(apiConfig, endpoint);
  ws = new WebSocket(url);
  ws.addEventListener('error', function (_ev) {
    wsState = 3;
  });
  ws.addEventListener('close', function (_ev) {
    wsState = 3;
  });
  ws.addEventListener('message', function (event) {
    listener(event.data);
  });
}
export { fetchMemory };
