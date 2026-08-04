<?php 
include 'db.php';
// جلب الـ ID من الرابط
$id = $_GET['id']; 
$res = mysqli_query($conn, "SELECT * FROM doctors WHERE id = $id");
$doctor = mysqli_fetch_assoc($res);
?>

<h1><?php echo $doctor['name']; ?></h1>
<p><?php echo $doctor['bio']; ?></p>
