$body = '{"action":"upload","sheet":"PMR","data":{"file":"test","fileName":"test.jpg","mimeType":"image/jpeg","profileId":"1"}}'
try {
    $r = Invoke-RestMethod -Uri 'https://script.google.com/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec' -Method Post -Body $body -ContentType 'application/json' -MaximumRedirection 5
    Write-Host 'Success:' ($r | ConvertTo-Json -Depth 10)
} catch {
    Write-Host 'Error:' $_.Exception.Message
}
