Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = "C:\Users\pravallika\.gemini\antigravity\scratch\apex_erp"
$zipPath1 = "C:\Users\pravallika\Desktop\Enterprise-ERP-Full.zip"
$zipPath2 = "C:\Users\pravallika\Desktop\Enterprise-ERP.zip"

if (Test-Path $zipPath1) { Remove-Item $zipPath1 -Force }
if (Test-Path $zipPath2) { Remove-Item $zipPath2 -Force }

function Create-RootZip($src, $dest) {
    $zip = [System.IO.Compression.ZipFile]::Open($dest, [System.IO.Compression.ZipArchiveMode]::Create)
    $files = Get-ChildItem -Path $src -Recurse -Force
    foreach ($file in $files) {
        if ($file.PSIsContainer) { continue }
        $relPath = $file.FullName.Substring($src.Length + 1).Replace("\", "/")
        if ($relPath -like "scratch/*") { continue }
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relPath, [System.IO.Compression.CompressionLevel]::Optimal)
    }
    $zip.Dispose()
}

Create-RootZip $sourceDir $zipPath1
Create-RootZip $sourceDir $zipPath2

Write-Host "Created root-level ZIP archives."
