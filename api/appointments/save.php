<?php
header('Content-Type: application/json');
require_once '../db.php';

try {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        throw new Exception('Invalid input data');
    }

    // Required fields
    $required = ['fullName', 'contactNumber', 'email', 'service', 'date', 'time'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }

    // Validate phone number (11 digits)
    if (!preg_match('/^\d{11}$/', $data['contactNumber'])) {
        throw new Exception('Contact number must be exactly 11 digits');
    }

    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Prepare the SQL statement - updated to match schema column names exactly
    $sql = "INSERT INTO appointments (fullName, contactNumber, email, service, appointmentDate, appointmentTime, notes) 
            VALUES (:fullName, :contactNumber, :email, :service, :date, :time, :notes)";
    
    $stmt = $pdo->prepare($sql);
    
    // Execute with the data
    $result = $stmt->execute([
        ':fullName' => $data['fullName'],
        ':contactNumber' => $data['contactNumber'],
        ':email' => $data['email'],
        ':service' => $data['service'],
        ':date' => $data['date'],
        ':time' => $data['time'],
        ':notes' => $data['notes'] ?? null
    ]);

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Appointment saved successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        throw new Exception('Failed to save appointment');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 