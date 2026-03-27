$ErrorActionPreference = "Continue"

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8056/api/users/signin" -Method Post -Body '{"email":"admin@example.com","password":"admin123"}' -ContentType "application/json"
    $token = $resp.token

    Write-Host "`n--- Event 5 Analytics ---"
    $analytics = Invoke-RestMethod -Uri "http://localhost:8056/api/analytics/event/5" -Method Get -Headers @{"Authorization" = "Bearer $token"}
    $analytics | ConvertTo-Json | Write-Host

    Write-Host "`n--- Dashboard Summary ---"
    $summary = Invoke-RestMethod -Uri "http://localhost:8056/api/analytics/dashboard" -Method Get -Headers @{"Authorization" = "Bearer $token"}
    $summary | ConvertTo-Json | Write-Host

} catch [System.Net.WebException] {
    Write-Host "Exception: " $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd() | Write-Host
    }
}
