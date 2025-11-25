Write-Host "正在安装依赖包..." -ForegroundColor Green
npm install express socket.io mysql2 cors
Write-Host "安装完成！启动服务器..." -ForegroundColor Green
node server.js