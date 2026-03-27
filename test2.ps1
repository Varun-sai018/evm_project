$t = (Invoke-RestMethod -Uri "http://localhost:8056/api/users/signin" -Method Post -Body '{"email":"test@gmail.com","password":"test123"}' -ContentType "application/json").token
curl.exe -s -i -X POST http://localhost:8056/api/bookings -H "Authorization: Bearer $t" -H "Content-Type: application/json" -d '{\"userId\":1,\"eventId\":5}' > report2.txt
echo "`n--- GET USER 1 ---`n" >> report2.txt
curl.exe -s -X GET http://localhost:8056/api/bookings/user/1 -H "Authorization: Bearer $t" >> report2.txt
echo "`n--- GET EVENT 5 ---`n" >> report2.txt
curl.exe -s -X GET http://localhost:8056/api/bookings/event/5 -H "Authorization: Bearer $t" >> report2.txt
echo "`n--- MYSQL QUERY ---`n" >> report2.txt
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "USE EVM; SELECT b.id, u.email, e.title, b.status, b.booked_at FROM booking b JOIN user u ON b.user_id = u.id JOIN event e ON b.event_id = e.id;" >> report2.txt
