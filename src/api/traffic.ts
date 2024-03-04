import { ClashAPIConfig } from '$src/types';

import { buildWebSocketURL, getURLAndInit } from '../misc/request-helper';

const endpoint = '/traffic';
const textDecoder = new TextDecoder('utf-8');

const Size = 150;

const traffic = {
  // labels: Array(Size).fill(0),
  // up: Array(Size),
  // down: Array(Size),


  size: Size,
  subscribers: [],
  appendData(o) {
    // { up: number; down: number }
    Object.keys(o).map((k) => {
      const item = o[k];
      const titem = this.gettraffic(k)
      titem.up.shift();
      titem.down.shift();
      titem.labels.shift();

      const l = Date.now();
      titem.up.push(item.up);
      titem.down.push(item.down);
      titem.labels.push(l);
      titem.subscribers.forEach((f) => f(o));

      return true
    });


    this.subscribers.forEach((f) => f(o));
  },
  gettraffic(id:string) {
     const traffic = this[id];
     if (traffic) {
       return traffic;
     }
     this[id] = {
       subscribers: [],
       labels: Array(Size).fill(0),
       up: Array(Size).fill(0),
       down: Array(Size).fill(0),
       subscribe(listener: (x: any) => void) {
         this.subscribers.push(listener);
         return () => {
           const idx = this.subscribers.indexOf(listener);
           this.subscribers.splice(idx, 1);
         };
       },
     }
     return this[id]
  },
  subscribe(listener: (x: any) => void) {
    this.subscribers.push(listener);
    return () => {
      const idx = this.subscribers.indexOf(listener);
      this.subscribers.splice(idx, 1);
    };
  },
};

let fetched = false;
let decoded = '';

function parseAndAppend(x: string) {
  // {"DIRECT":{"up":0,"down":0},"socks":{"up":0,"down":0}}
  traffic.appendData(JSON.parse(x));
}

function pump(reader: ReadableStreamDefaultReader) {
  return reader.read().then(({ done, value }) => {
    const str = textDecoder.decode(value, { stream: !done });
    decoded += str;

    const splits = decoded.split('\n');

    const lastSplit = splits[splits.length - 1];

    for (let i = 0; i < splits.length - 1; i++) {
      parseAndAppend(splits[i]);
    }

    if (done) {
      parseAndAppend(lastSplit);
      decoded = '';

      // eslint-disable-next-line no-console
      console.log('GET /traffic streaming done');
      fetched = false;
      return;
    } else {
      decoded = lastSplit;
    }
    return pump(reader);
  });
}

// 1 OPEN
// other value CLOSED
// similar to ws readyState but not the same
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
let wsState: number;
function fetchData(apiConfig: ClashAPIConfig, id:string) {
  if (id != undefined) {
    return traffic.gettraffic(id)
  }
  if (fetched || wsState === 1) return traffic;
  wsState = 1;
  const url = buildWebSocketURL(apiConfig, endpoint);
  const ws = new WebSocket(url);
  ws.addEventListener('error', function (_ev) {
    wsState = 3;
  });
  ws.addEventListener('close', function (_ev) {
    wsState = 3;
    fetchDataWithFetch(apiConfig);
  });
  ws.addEventListener('message', function (event) {
    parseAndAppend(event.data);
  });

  return traffic;
}

function fetchDataWithFetch(apiConfig: ClashAPIConfig) {
  if (fetched) return traffic;
  fetched = true;
  const { url, init } = getURLAndInit(apiConfig);
  fetch(url + endpoint, init).then(
    (response) => {
      if (response.ok) {
        const reader = response.body.getReader();
        pump(reader);
      } else {
        fetched = false;
      }
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.log('fetch /traffic error', err);
      fetched = false;
    }
  );
  return traffic;
}

export { fetchData };