@echo off
start "Events API" cmd /k "npm run dev -w @events/api"
start "Events Web" cmd /k "npm run dev -w @events/web"
start "Events Admin" cmd /k "npm run dev -w @events/admin"
