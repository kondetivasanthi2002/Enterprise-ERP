Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = "C:\Users\pravallika\.gemini\antigravity\scratch\apex_erp"
$zipPath1 = "C:\Users\pravallika\Desktop\Enterprise-ERP-Full.zip"
$zipPath2 = "C:\Users\pravallika\Desktop\Enterprise-ERP.zip"

if (Test-Path $zipPath1) { Remove-Item $zipPath1 -Force }
if (Test-Path $zipPath2) { Remove-Item $zipPath2 -Force }

[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $zipPath1, [System.IO.Compression.CompressionLevel]::Optimal, $true)
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $zipPath2, [System.IO.Compression.CompressionLevel]::Optimal, $true)

Write-Host "Created native Windows Zip files."
