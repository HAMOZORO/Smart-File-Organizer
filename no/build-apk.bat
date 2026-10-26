@echo off
setlocal
echo ===================================================
echo   Smart File Organizer Pro - Mobile APK Builder
echo ===================================================
echo.

if defined JAVA_HOME goto check_jdk
if exist "C:\Program Files\Java\jdk-25.0.2" set "JAVA_HOME=C:\Program Files\Java\jdk-25.0.2"
if exist "C:\Program Files\Java\latest" set "JAVA_HOME=C:\Program Files\Java\latest"

:check_jdk
echo Preparing mobile assets...
call node prepare-mobile.js
call npx cap sync android

echo.
echo Building Android Debug APK...
cd android
call gradlew.bat assembleDebug

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo [SUCCESS] APK built successfully!
    echo Output location: android\app\build\outputs\apk\debug\app-debug.apk
    echo ===================================================
    cd ..
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "Smart-File-Organizer-Pro.apk"
        echo Copied APK to root: Smart-File-Organizer-Pro.apk
    )
) else (
    echo.
    echo [ERROR] Gradle build encountered an issue.
    echo Note: If the Android SDK is not yet installed on this PC, you can either:
    echo 1. Open the 'android' folder directly in Android Studio and click 'Build APK'.
    echo 2. Or install the app instantly as a PWA on your phone browser (Chrome/Safari).
    cd ..
)

pause
