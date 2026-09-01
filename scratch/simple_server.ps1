$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8090/")
$listener.Start()

$htmlPath = "C:\Users\pravallika\.gemini\antigravity\scratch\apex_erp\index.html"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $response = $context.Response
        $htmlBytes = [System.IO.File]::ReadAllBytes($htmlPath)
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $htmlBytes.Length
        $response.OutputStream.Write($htmlBytes, 0, $htmlBytes.Length)
        $response.Close()
    } catch {
        break
    }
}
