
$body = '{"action":"upload","sheet":"PMR","data":{"file":"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA==","fileName":"test_tiny.jpg","mimeType":"image/jpeg","profileId":"999"}}'
try {
    $r = Invoke-RestMethod -Uri 'https://script.google.com/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec' -Method Post -Body $body -ContentType 'application/json' -MaximumRedirection 5
    Write-Host 'SUCCESS:' ($r | ConvertTo-Json -Depth 10)
} catch {
    Write-Host 'ERROR:' $_.Exception.Message
}
