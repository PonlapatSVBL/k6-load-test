Download:   https://k6.io/docs/get-started/installation/

Run test local
1. k6 run test.js

Run test in the Cloud
1. choco install k6 or download official k6 installer: https://dl.k6.io/msi/k6-latest-amd64.msi
2. k6 login cloud --token <token>
3. k6 run --out=cloud test.js

Run test docker (influxDB & grafana)
1. https://nontster.medium.com/%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87%E0%B8%9C%E0%B8%A5-test-%E0%B8%82%E0%B8%AD%E0%B8%87-k6-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-grafana-%E0%B9%81%E0%B8%A5%E0%B8%B0-influxdb-d3bb7ba15f4d

Load Test Types
1. Smoke testing
2. Load testing
3. Stress testing
4. Soak testing
5. Spike testing