<?php
header('Content-Type: application/json');
require_once '../db.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the raw POST data and log it
$rawData = file_get_contents('php://input');
error_log("Raw POST data: " . $rawData);

$data = json_decode($rawData, true);
error_log("Decoded data: " . print_r($data, true));

// Check for JSON decode errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false, 
        'message' => 'JSON decode error: ' . json_last_error_msg(),
        'raw_data' => $rawData
    ]);
    exit;
}

// Validate required fields
if (!isset($data['id']) || !isset($data['fullName']) || !isset($data['contactNumber']) || 
    !isset($data['email']) || !isset($data['service']) || !isset($data['appointmentDate']) || 
    !isset($data['appointmentTime'])) {
    echo json_encode([
        'success' => false, 
        'message' => 'Missing required fields',
        'received_data' => $data
    ]);
    exit;
}

try {
    // Prepare the update statement
    $stmt = $pdo->prepare("
        UPDATE appointments 
        SET fullName = :fullName, 
            contactNumber = :contactNumber, 
            email = :email, 
            service = :service, 
            appointmentDate = :appointmentDate, 
            appointmentTime = :appointmentTime, 
            notes = :notes
        WHERE id = :id
    ");

    // Bind parameters
    $params = [
        ':id' => $data['id'],
        ':fullName' => $data['fullName'],
        ':contactNumber' => $data['contactNumber'],
        ':email' => $data['email'],
        ':service' => $data['service'],
        ':appointmentDate' => $data['appointmentDate'],
        ':appointmentTime' => $data['appointmentTime'],
        ':notes' => $data['notes']
    ];

    // Execute the update
    $stmt->execute($params);

    // Check if any rows were affected
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Appointment updated successfully']);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'No appointment found with ID ' . $data['id'],
            'debug_info' => [
                'id' => $data['id'],
                'affected_rows' => $stmt->rowCount()
            ]
        ]);
    }

} catch (PDOException $e) {
    error_log("Error in update.php: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Database error: ' . $e->getMessage(),
        'debug_info' => [
            'error_type' => get_class($e),
            'error_line' => $e->getLine(),
            'error_file' => $e->getFile()
        ]
    ]);
}
?> 