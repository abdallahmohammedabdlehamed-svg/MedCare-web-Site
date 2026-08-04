<?php
include 'db.php'; // التأكد من وجود ملف الربط في نفس الفولدر

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // 1. استقبال البيانات من الفورم
    $name  = $_POST['doc_name'];
    $spec  = $_POST['doc_spec'];
    $exp   = $_POST['doc_exp'];
    $count = $_POST['doc_count'];
    
    // 2. معالجة رفع الصورة
    $img_name = $_FILES['doc_img']['name'];
    $tmp_name = $_FILES['doc_img']['tmp_name'];
    
    // المسار: هنطلع بره فولدر Backend ونروح لفولدر img
    $upload_path = "../img/" . $img_name;
    
    if (move_uploaded_file($tmp_name, $upload_path)) {
        // 3. كتابة أمر الإدخال في الداتا بيز
        // ملاحظة: تأكد أن جدول doctors يحتوي على أعمدة (experience و patients_count)
        $sql = "INSERT INTO doctors (name, specialty, experience, patients_count, image) 
                VALUES ('$name', '$spec', '$exp', '$count', '$img_name')";
        
        if (mysqli_query($conn, $sql)) {
            // لو نجح يرجع للداشبورد ويظهر رسالة نجاح
            header("Location: ../dashboard.php?msg=success");
        } else {
            echo "Error: " . mysqli_error($conn);
        }
    } else {
        echo "Failed to upload image.";
    }
}
?>