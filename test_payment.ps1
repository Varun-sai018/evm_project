$ErrorActionPreference = "Continue"

try {
    # 1. Login
    $resp = Invoke-RestMethod -Uri "http://localhost:8056/api/users/signin" -Method Post -Body '{"email":"test@gmail.com","password":"test123"}' -ContentType "application/json"
    $token = $resp.token
    Write-Host "Logged in"

    # 2. Process Payment for Booking 3 (which was created previously for user 1 and event 5)
    # We can also create a new one to be safe
    $bookResp = Invoke-RestMethod -Uri "http://localhost:8056/api/bookings" -Method Post -Body '{"userId":1,"eventId":5}' -Headers @{"Authorization" = "Bearer $token"} -ContentType "application/json"
    $bookingId = $bookResp.id
    Write-Host "Created booking $bookingId"

    # 3. Process payment
    $payData = @{
        bookingId = $bookingId
        amount = 499.0
    } | ConvertTo-Json
    
    $payResp = Invoke-RestMethod -Uri "http://localhost:8056/api/payments/process" -Method Post -Body $payData -Headers @{"Authorization" = "Bearer $token"} -ContentType "application/json"
    Write-Host "Payment processed:"
    $payResp | ConvertTo-Json | Write-Host

    # 4. Get payment status
    $statusResp = Invoke-RestMethod -Uri "http://localhost:8056/api/payments/booking/$bookingId" -Method Get -Headers @{"Authorization" = "Bearer $token"}
    Write-Host "Payment status:"
    $statusResp | ConvertTo-Json | Write-Host

} catch [System.Net.WebException] {
    Write-Host "Exception: " $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd() | Write-Host
    }
}

Write-Host "--- MYSQL CHECK ---"
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "USE EVM; SELECT id, status, is_paid, amount FROM booking ORDER BY id DESC LIMIT 5;" | Out-String | Write-Host
