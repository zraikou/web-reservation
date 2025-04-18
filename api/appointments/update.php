<?php
header('Content-Type: application/json');

require_once '../db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['appointment']) || !isset($data['index'])) {
        throw new Exception('Invalid request data');
    }
    
    $appointment = $data['appointment'];
    
    // Validate required fields
    $required_fields = ['fullName', 'contactNumber', 'email', 'service', 'date', 'time'];
    foreach ($required_fields as $field) {
        if (!isset($appointment[$field]) || empty($appointment[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }
    
    // Validate contact number
    if (!preg_match('/^[0-9]{11}$/', $appointment['contactNumber'])) {
        throw new Exception('Contact number must be exactly 11 digits');
    }
    
    // Validate email
    if (!filter_var($appointment['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    $stmt = $pdo->prepare("
        UPDATE appointments 
        SET full_name = ?, 
            contact_number = ?, 
            email = ?, 
            service = ?, 
            appointment_date = ?, 
            appointment_time = ?,
            updated_at = NOW()
        WHERE id = ?
    ");
    
    $result = $stmt->execute([
        $appointment['fullName'],
        $appointment['contactNumber'],
        $appointment['email'],
        $appointment['service'],
        $appointment['date'],
        $appointment['time'],
        $data['index']
    ]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Appointment updated successfully']);
    } else {
        throw new Exception('Failed to update appointment');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 