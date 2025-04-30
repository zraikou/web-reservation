<?php
require_once 'database.php';

// Create appointments table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    service VARCHAR(50) NOT NULL,
    appointmentDate DATE NOT NULL,
    appointmentTime TIME NOT NULL,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table appointments created successfully or already exists\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

$conn->close();
?> 