import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { check, sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { scenario } from 'k6/execution'; // ใช้สำหรับดึงลำดับการรัน (Iteration)
import encoding from 'k6/encoding';

// 1. กำหนด Options (สำคัญมากเพื่อให้มีข้อมูลรัน)
/* export const options = {
    scenarios: {
        deadlock_battle: {
            executor: 'constant-arrival-rate',
            rate: 200,            // ต้องการ 200 requests
            timeUnit: '1s',       // ภายใน 1 วินาที (คือยิง 200 req/sec)
            duration: '5s',      // ยิงต่อเนื่อง 5 วินาที
            preAllocatedVUs: 200, // เตรียมคนไว้รอเลย 200 คน
            maxVUs: 1000,          // ถ้าคนไม่พอให้ขยายได้ถึง 1000
        },
    },
}; */

export const options = {
    scenarios: {
        spike_once: {
            executor: 'per-vu-iterations',
            vus: 100,          // ปล่อยคนออกมา x คนพร้อมกัน
            iterations: 1,     // ทุกคนยิงแค่คนละ 1 ครั้งแล้วจบงาน
            maxDuration: '60s', // กำหนดเวลาสูงสุดที่ยอมให้รัน
        },
    },
};

// 2. โหลดไฟล์ข้อมูล CSV
const csvData = new SharedArray('csv data', function () {
    // ต้องมั่นใจว่าไฟล์ .csv อยู่ที่เดียวกับไฟล์ .js นี้
    return papaparse.parse(open('./scenario_4.csv'), { header: true }).data;
});

export default function () {
    // 3. การเลือก Row แบบไม่ให้ซ้ำกัน (Unique Data per Iteration)
    // scenario.iterationInTest จะเริ่มที่ 0 และเพิ่มขึ้นเรื่อยๆ ทุกครั้งที่มีการยิง API ในระบบ
    const rowIndex = scenario.iterationInTest % csvData.length;
    const row = csvData[rowIndex];

    const encodedEmployeeId = encoding.b64encode(row.employee_id);
    const encodedInstanceServerId = encoding.b64encode(row.instance_server_id);
    const encodedInstanceServerChannelId = encoding.b64encode(row.instance_server_channel_id);

    const url = 'https://hms-php-core-payroll.azurewebsites.net/api-web.php';

    const payload = JSON.stringify({
        _compgrp: 'hrs',
        _comp: 'calculation_normal',
        _action: 'calculate_payroll',
        year_month: row.year_month,
        employee_id: encodedEmployeeId,
        calculate_person: 'calculate_person',
        calculate_to: 'NOW',
        instance_server_id: encodedInstanceServerId,
        instance_server_channel_id: encodedInstanceServerChannelId,
        identify_user_id: 'MjAyMjExMDJFQzRGNUJDNTZGRjg=',
        language_code: 'TH',
        user_name: '',
        user_psw: '',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    // sleep(1);
}