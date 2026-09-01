$ports = @(5000, 8000, 8090, 3001)
$listener = $null
$selectedPort = 0

foreach ($port in $ports) {
    try {
        $l = New-Object System.Net.HttpListener
        $l.Prefixes.Add("http://localhost:$port/")
        $l.Prefixes.Add("http://127.0.0.1:$port/")
        $l.Start()
        $listener = $l
        $selectedPort = $port
        Write-Host "SUCCESS: Server running on http://localhost:$selectedPort/"
        break
    } catch {
        Write-Host "Port $port in use, trying next..."
    }
}

if ($null -eq $listener) {
    Write-Host "Could not bind any port."
    exit 1
}

$htmlPath = "C:\Users\pravallika\.gemini\antigravity\scratch\apex_erp\index.html"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        if (Test-Path $htmlPath) {
            $htmlBytes = [System.IO.File]::ReadAllBytes($htmlPath)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $htmlBytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($htmlBytes, 0, $htmlBytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    } catch {
        # Continue
    }
}
