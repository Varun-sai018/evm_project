$ErrorActionPreference = "Continue"

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8056/api/users/signin" -Method Post -Body '{"email":"test@gmail.com","password":"test123"}' -ContentType "application/json"
    $token = $resp.token
} catch [System.Net.WebException] {
    Write-Host "Failed to login: " $_.Exception.Message
    exit
}

$bookingData = '{"userId":1,"eventId":5}'

Write-Host "--- POSTING BOOKING ---"
try {
    $postResp = Invoke-RestMethod -Uri "http://localhost:8056/api/bookings" -Method Post -Body $bookingData -ContentType "application/json" -Headers @{"Authorization" = "Bearer $token"}
    $postResp | ConvertTo-Json -Depth 10 | Out-String | Write-Host
} catch [System.Net.WebException] {
    Write-Host "POST Exception: " $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd() | Write-Host
    }
}

Write-Host "--- GETTING USER 1 BOOKINGS ---"
try {
    $userBookings = Invoke-RestMethod -Uri "http://localhost:8056/api/bookings/user/1" -Method Get -Headers @{"Authorization" = "Bearer $token"}
    $userBookings | ConvertTo-Json -Depth 10 | Out-String | Write-Host
} catch [System.Net.WebException] {
    Write-Host "GET User 1 Exception: " $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd() | Write-Host
    }
}

Write-Host "--- GETTING EVENT 5 ATTENDEES ---"
try {
    $eventBookings = Invoke-RestMethod -Uri "http://localhost:8056/api/bookings/event/5" -Method Get -Headers @{"Authorization" = "Bearer $token"}
    $eventBookings | ConvertTo-Json -Depth 10 | Out-String | Write-Host
} catch [System.Net.WebException] {
    Write-Host "GET Event 5 Exception: " $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd() | Write-Host
    }
}

Write-Host "--- MYSQL QUERY ---"
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "USE EVM; SELECT b.id, u.email, e.title, b.status, b.booked_at FROM booking b JOIN user u ON b.user_id = u.id JOIN event e ON b.event_id = e.id;" | Out-String | Write-Host
