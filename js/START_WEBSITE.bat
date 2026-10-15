@echo off
chcp 65001 >nul
title Smart Land Mapping - Starting Website
echo ==========================================================
echo   Smart Land Mapping (স্মার্ট ল্যান্ড ম্যাপিং)
echo   ওয়েবসাইটটি আপনার ব্রাউজারে চালু হচ্ছে...
echo ==========================================================
start "" "%~dp0index.html"
exit
