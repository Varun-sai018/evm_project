curl.exe -s -i -X POST http://localhost:8056/api/bookings -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTc3NDU5Nzk2NSwiZXhwIjoxNzc0NjMzOTY1fQ.FCGQxgI2V2lpgIywVd_PeWO5J57OBNRqgsbNKhjPzH8" -H "Content-Type: application/json" -d "{\"userId\":1,\"eventId\":5}" > report.txt
echo "
--- GET USER 1 ---
" >> report.txt
curl.exe -s -X GET http://localhost:8056/api/bookings/user/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTc3NDU5Nzk2NSwiZXhwIjoxNzc0NjMzOTY1fQ.FCGQxgI2V2lpgIywVd_PeWO5J57OBNRqgsbNKhjPzH8" >> report.txt
echo "
--- GET EVENT 5 ---
" >> report.txt
curl.exe -s -X GET http://localhost:8056/api/bookings/event/5 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTc3NDU5Nzk2NSwiZXhwIjoxNzc0NjMzOTY1fQ.FCGQxgI2V2lpgIywVd_PeWO5J57OBNRqgsbNKhjPzH8" >> report.txt
