<?php
include 'db.php';

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['doc_name'];
    $spec = $_POST['doc_specialty'];
    $bio = $_POST['doc_bio'];
    
    // كود بسيط لرفع الصورة
    $img = $_FILES['doc_image']['name'];
    move_uploaded_file($_FILES['doc_image']['tmp_name'], "img/".$img);

    $sql = "INSERT INTO doctors (name, specialty, image, bio) VALUES ('$name', '$spec', '$img', '$bio')";
    
    if(mysqli_query($conn, $sql)) {
        header("Location: dashboard.php?success=1");
    }
}
?>