import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { check, sleep } from 'k6';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { scenario } from 'k6/execution'; // ใช้สำหรับดึงลำดับการรัน (Iteration)
import encoding from 'k6/encoding';

// 1. กำหนด Options (สำคัญมากเพื่อให้มีข้อมูลรัน)
export const options = {
    vus: 1,            // จำนวนคนจำลอง
    iterations: 1,    // จำนวนครั้งที่จะรันทั้งหมด (หารเฉลี่ยกันในหมู่ VUs)
};

// 2. โหลดไฟล์ข้อมูล CSV
const csvData = new SharedArray('csv data', function () {
    // ต้องมั่นใจว่าไฟล์ .csv อยู่ที่เดียวกับไฟล์ .js นี้
    return papaparse.parse(open('./scenario_1.csv'), { header: true }).data;
});

export default function () {
    // 3. การเลือก Row แบบไม่ให้ซ้ำกัน (Unique Data per Iteration)
    // scenario.iterationInTest จะเริ่มที่ 0 และเพิ่มขึ้นเรื่อยๆ ทุกครั้งที่มีการยิง API ในระบบ
    const rowIndex = scenario.iterationInTest % csvData.length;
    const row = csvData[rowIndex];

    const encodedEmployeeId = encoding.b64encode(row.employee_id);
    const encodedInstanceServerId = encoding.b64encode(row.instance_server_id);
    const encodedInstanceServerChannelId = encoding.b64encode(row.instance_server_channel_id);

    const url = 'http://localhost:3001';

    const payload = JSON.stringify({
        _compgrp: 'hrs',
        _comp: 'calculation_normal',
        _action: 'calculate_month',
        year_month: row.year_month,
        employee_id: encodedEmployeeId,
        instance_server_id: encodedInstanceServerId,
        instance_server_channel_id: encodedInstanceServerChannelId,
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

    sleep(1);
}