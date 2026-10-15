@echo off
chcp 65001 >nul
title Smart Land Mapping - Admin Portal
echo ==========================================================
echo   Smart Land Mapping (স্মার্ট ল্যান্ড ম্যাপিং)
echo   অ্যাডমিন প্যানেলটি আপনার ব্রাউজারে চালু হচ্ছে...
echo   ডিফল্ট ইউজারনেম: sowrovshiekjh
echo   ডিফল্ট পাসওয়ার্ড: 01742244518
echo ==========================================================
start "" "%~dp0admin.html"
exit
