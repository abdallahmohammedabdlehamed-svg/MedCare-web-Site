<?php
// إعدادات قاعدة البيانات
$host     = 'localhost';     // اسم السيرفر (غالباً localhost)
$db_name  = 'medcare_db';    // اسم قاعدة البيانات اللي عملتها في phpMyAdmin
$username = 'root';          // اسم المستخدم (الافتراضي في XAMPP هو root)
$password = '';              // كلمة السر (الافتراضي في XAMPP بتبقى فاضية)

try {
    // إنشاء الاتصال باستخدام PDO
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    
    // ضبط وضع الأخطاء لإظهار استثناءات في حالة وجود مشكلة
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // ضبط جلب البيانات ليكون على هيئة مصفوفة ترابطية (Associative Array) بشكل افتراضي
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // echo "Connected successfully ✅"; // شيل التعليق ده لو عايز تتأكد إن الاتصال شغال
    
} catch(PDOException $e) {
    // في حالة فشل الاتصال
    die("Connection failed ❌: " . $e->getMessage());
}
?>