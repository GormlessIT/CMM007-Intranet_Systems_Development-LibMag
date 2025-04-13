<?php
$conn = new mysqli("localhost", "root", "oliSQL112", "LibMag");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully!";
?>