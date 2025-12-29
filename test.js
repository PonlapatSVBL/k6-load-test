import http from 'k6/http';
import { sleep, check } from 'k6';

/* export const options = {
    vus: 5000,      // จำนวน Virtual Users
    duration: '1s', // ระยะเวลาที่จะทดสอบ
}; */
export const options = {
    stages: [
        { duration: '5s', target: 500 },
        { duration: '10s', target: 1000 },
        { duration: '5s', target: 0 },
    ],
    cloud: {
        // Project: Load Test
        projectID: 3710879,
        // Test runs with the same name groups test runs together.
        name: 'Test (26/08/2024-10:43:00)'
    }
};

export default function() {
    // const endpoint = 'http://localhost:8080/api/v1/systems/healthcheck';
    const endpoint = 'http://localhost:3000/api/v1/chat-acp/chatroom/list-chatroom';

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