import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 30,
  duration: '10s', // ทดสอบเป็นเวลา 1 นาที
};

export default function () {
  const url = 'http://localhost:3000/stream/shared-drive%2Fsukiteenoi%2Flibrary%2Fvideo%2FhkKskqY4oE.mp4';
  
  // ส่งคำขอ Range header
  let res = http.get(url, {
    headers: {
      Range: 'bytes=0-100000', // จำลองการโหลดวิดีโอช่วงแรก
    },
  });

  check(res, {
    'status is 206': (r) => r.status === 206,
    'content length matches': (r) => r.headers['Content-Length'] === '100001',
  });

  sleep(1);
}