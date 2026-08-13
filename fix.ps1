$html = Get-ChildItem -Path . -Filter "*.html" -Recurse
foreach ($f in $html) {
    $c = Get-Content $f.FullName -Raw
    $c = $c -replace "unload", "beforeunload"
    $c = $c -replace 'onunload\s*=\s*["'']' + '[^"'']*["'']', ''
    $c | Set-Content $f.FullName -Encoding UTF8
}
if (Test-Path "base.html") {
    $c = Get-Content "base.html" -Raw
    $c = $c -replace "enableMultiTabIndexedDbPersistence\(\)", "settings({cache: {enabled: true}})"
    $c | Set-Content "base.html" -Encoding UTF8
}
if (-not (Test-Path "favicon.ico")) { $null = New-Item -Path "favicon.ico" -ItemType File -Force }
Write-Host "✅ Done! Refresh browser." -ForegroundColor Green
