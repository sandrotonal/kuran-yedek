@echo off
echo ===================================================
echo   KUR'AN ANLAM HARITASI - BASLATILIYOR 
echo ===================================================
echo.
echo 1. Backend Baslatiliyor...
start "Backend Server" cmd /k "cd backend && npm start"

echo 2. Frontend Baslatiliyor...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo 3. Embedding Servisi (Python) Baslatiliyor...
start "Embedding Service" cmd /k "cd embedding-service && python app.py"

echo.
echo ===================================================
echo   BASARIYLA BASLATILDI!
echo ===================================================
echo.
echo Bilgisayardan su adrese gir:
echo   Local:   https://localhost:5173
echo.
echo Telefondan su adrese gir (IP degisebilir!):
ipconfig | findstr /i "IPv4"
echo   Port:    :5173 (HTTPS - Guvenlik uyarisini kabul et!)
echo.
echo Pencereyi kapatabilirsiniz, sunucular arka planda calisiyor.
pause
