Write-Host "Testing auth flow..."

# Try login first (in case user exists)
Write-Host "`nTesting login..."
$loginBody = "username=tejuice&password=7889&grant_type=password"

try {
    $loginResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/token" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/x-www-form-urlencoded"

    Write-Host "Login successful!"
    $token = ($loginResponse.Content | ConvertFrom-Json).access_token
    Write-Host "Access Token: $token"
    $token | Out-File -FilePath "auth_token.txt"

} catch {
    Write-Host "Login failed, trying registration..."
    
    # Registration
    $userData = @{
        email = "tejasbhurbhure07@gmail.com"
        username = "tejuice"
        password = "7889"
    } | ConvertTo-Json

    try {
        $regResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/register" `
            -Method Post `
            -Body $userData `
            -ContentType "application/json"

        Write-Host "Registration successful! Trying login again..."

        Start-Sleep -Seconds 2  # Wait for registration to complete

        # Try login again after registration
        $loginResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/token" `
            -Method Post `
            -Body $loginBody `
            -ContentType "application/x-www-form-urlencoded"

        $token = ($loginResponse.Content | ConvertFrom-Json).access_token
        Write-Host "Access Token: $token"
        $token | Out-File -FilePath "auth_token.txt"
    } catch {
        $errorContent = $_.ErrorDetails.Message
        Write-Host "Error during registration/login: $_"
        Write-Host "Response Content: $errorContent"
        
        if ($errorContent -like '*Email already registered*') {
            Write-Host "`nTry running 'python cleanup_db.py' to reset the database and try again"
        }
        exit
    }
}

# Test protected endpoint
Write-Host "`nTesting protected scan endpoint..."
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$scanBody = @{
    url = "http://testphp.vulnweb.com"
    scan_type = "full"
} | ConvertTo-Json

try {
    $scanResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/scan" `
        -Method Post `
        -Headers $headers `
        -Body $scanBody

    Write-Host "`nScan Response:"
    $scanResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error during scan: $_"
    Write-Host "Response Content: $($_.ErrorDetails.Message)"
}
