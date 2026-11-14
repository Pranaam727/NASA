Add-Type -AssemblyName System.IO.Compression.FileSystem

$rootDir = (Get-Item .).FullName
$backupsDir = Join-Path $rootDir "backups"

Write-Output "=== ASTROCARE P10 BACKUP VERIFICATION ==="

$promptZip = Join-Path $backupsDir "AstroCare_P10_Prompt_Package.zip"
$fullZip = Join-Path $backupsDir "AstroCare_P10_Backup.zip"

if (Test-Path $promptZip) {
    $pInfo = Get-Item $promptZip
    Write-Output "1. Prompt Package: $($pInfo.Name)"
    Write-Output "   Size: $($pInfo.Length) bytes ($([math]::Round($pInfo.Length / 1KB, 2)) KB)"
    $pArch = [System.IO.Compression.ZipFile]::OpenRead($promptZip)
    Write-Output "   Entries count: $($pArch.Entries.Count)"
    foreach ($entry in $pArch.Entries) {
        Write-Output "     - $($entry.FullName) ($($entry.Length) bytes)"
    }
    $pArch.Dispose()
} else {
    Write-Error "Prompt package not found!"
}

if (Test-Path $fullZip) {
    $fInfo = Get-Item $fullZip
    Write-Output "`n2. Full Backup: $($fInfo.Name)"
    Write-Output "   Size: $($fInfo.Length) bytes ($([math]::Round($fInfo.Length / 1MB, 2)) MB)"
    $fArch = [System.IO.Compression.ZipFile]::OpenRead($fullZip)
    Write-Output "   Total entries count: $($fArch.Entries.Count)"
    Write-Output "   Sample entries:"
    $count = 0
    foreach ($entry in $fArch.Entries) {
        if ($count -lt 15) {
            Write-Output "     - $($entry.FullName)"
            $count++
        }
    }
    $fArch.Dispose()
} else {
    Write-Error "Full backup not found!"
}

Write-Output "`n=== VERIFICATION COMPLETE ==="
