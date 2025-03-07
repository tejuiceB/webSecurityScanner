# First test ZAP connection
Write-Host "Testing ZAP connection..."
try {
    $zapApiKey = "jsp45gqnkmqo676fasg1i7qbkc"
    $zapResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8090/JSON/core/view/version/?apikey=$zapApiKey" -Method Get
    Write-Host "ZAP is running and accessible"
} catch {
    Write-Host "Error: ZAP is not running or not accessible."
    Write-Host "Please ensure:"
    Write-Host "1. OWASP ZAP is running"
    Write-Host "2. In ZAP: Tools > Options > API:"
    Write-Host "   - API is Enabled"
    Write-Host "   - API Key: $zapApiKey"
    Write-Host "3. In ZAP: Tools > Options > Local Proxies:"
    Write-Host "   - Address: 127.0.0.1"
    Write-Host "   - Port: 8090"
    exit
}

# Test data
$body = @{
    url = "http://testphp.vulnweb.com"
    scan_type = "full"
} | ConvertTo-Json

Write-Host "Testing scan endpoint..."
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/scan" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"

    Write-Host "`nResponse:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_"
    Write-Host "Response Content: $($_.ErrorDetails.Message)"
}
