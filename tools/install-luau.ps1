$ErrorActionPreference = 'Stop'
$version = '0.741'
$expectedHash = 'BE90C3223F3DC26777EF234244C2B1EAE16B3C574F1AB7D1446972F72C28CAB1'
$root = Split-Path $PSScriptRoot -Parent
$destination = Join-Path $root ".tools\luau-$version"
if (Test-Path $destination) {
    throw "Destination already exists: $destination. Existing tools have not been modified."
}
$staging = Join-Path ([System.IO.Path]::GetTempPath()) ([guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $staging | Out-Null
try {
    $archive = Join-Path $staging 'luau.zip'
    Invoke-WebRequest -Uri "https://github.com/luau-lang/luau/releases/download/$version/luau-windows.zip" -OutFile $archive
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $stream = [System.IO.File]::OpenRead($archive)
    try { $actualHash = [System.BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '') }
    finally { $stream.Dispose(); $sha.Dispose() }
    if ($actualHash -ne $expectedHash) {
        throw 'Official Luau archive checksum mismatch; nothing installed.'
    }
    $extracted = Join-Path $staging 'bin'
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($archive, $extracted)
    foreach ($name in @('luau.exe', 'luau-analyze.exe')) {
        if (-not (Test-Path (Join-Path $extracted $name) -PathType Leaf)) { throw "Missing $name in archive" }
    }
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/luau-lang/luau/$version/LICENSE.txt" -OutFile (Join-Path $extracted 'LICENSE.txt')
    New-Item -ItemType Directory -Path (Split-Path $destination -Parent) -Force | Out-Null
    Move-Item -LiteralPath $extracted -Destination $destination
    Write-Output "Installed official Luau $version to $destination (SHA-256 verified)."
} finally {
    Remove-Item -LiteralPath $staging -Recurse -Force
}
