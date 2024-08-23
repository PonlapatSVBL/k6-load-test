import http from 'k6/http';
import { sleep, check } from 'k6';

/* export const options = {
    vus: 5000,      // จำนวน Virtual Users
    duration: '1s', // ระยะเวลาที่จะทดสอบ
}; */
export const options = {
    stages: [
        { duration: '10s', target: 10 }, // เพิ่ม VUs เป็น 10 ใน 10 วินาที
        { duration: '20s', target: 20 }, // เพิ่ม VUs เป็น 20 ใน 20 วินาที
        { duration: '10s', target: 0 },  // ลด VUs เป็น 0 ใน 10 วินาที (เย็นลง)
    ],
};

export default function() {
    const endpoint = 'https://hms-golang-inquiry-prod.azurewebsites.net/ping';

    const payload = JSON.stringify({
        key1: 'value1',
        key2: 'value2',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(endpoint, payload, params);

    check(res, {
        'status was 200': (r) => r.status == 200,
    });

    sleep(1);
}