$ErrorActionPreference = "Stop"

$resp = Invoke-RestMethod -Uri "http://localhost:8056/api/users/signin" -Method Post -Body '{"email":"new_smtp_test1@gmail.com","password":"testpassword123"}' -ContentType "application/json"
$token = $resp.token
Write-Host "Obtained fresh JWT token: $token"

$event = '{"title":"Tech Conference 2026","description":"Annual tech event","startTime":"2026-04-01T10:00:00","endTime":"2026-04-01T18:00:00","ticketPrice":499}'

Write-Host "--- POSTING EVENT ---"
Invoke-RestMethod -Uri "http://localhost:8056/api/events" -Method Post -Body $event -ContentType "application/json" -Headers @{"Authorization" = "Bearer $token"} | ConvertTo-Json -Depth 10 | Out-String | Write-Host

Write-Host "--- GETTING EVENTS ---"
Invoke-RestMethod -Uri "http://localhost:8056/api/events" -Method Get | ConvertTo-Json -Depth 10 | Out-String | Write-Host

Write-Host "--- MYSQL QUERY ---"
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "USE EVM; SELECT id, title, description, start_time, ticket_price FROM event WHERE title='Tech Conference 2026';" | Out-String | Write-Host
