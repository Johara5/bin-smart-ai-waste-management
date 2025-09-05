# Start both backend and frontend servers for Bin Smart
Write-Host "Starting Bin Smart Application..." -ForegroundColor Green

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\johar\OneDrive\Desktop\bin smart\backend'; python app.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in current window
Write-Host "Starting frontend..." -ForegroundColor Yellow
Set-Location "C:\Users\johar\OneDrive\Desktop\bin smart"
npm run dev
