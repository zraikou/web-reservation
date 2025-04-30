<?php
// Database configuration for InfinityFree
$host = 'sql312.infinityfree.com';  // Replace with your actual InfinityFree MySQL hostname
$username = 'if0_35473355';         // Replace with your InfinityFree MySQL username
$password = 'RkQbJFEJGz';           // Replace with your InfinityFree MySQL password
$database = 'if0_35473355_booking'; // Replace with your InfinityFree database name

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Set charset to utf8mb4
$conn->set_charset('utf8mb4');
?> 