<?php
header('Content-Type: application/json');

require_once '../db.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            fullName,
            contactNumber,
            email,
            service,
            appointmentDate,
            appointmentTime,
            notes,
            createdAt
        FROM appointments 
        ORDER BY appointmentDate ASC, appointmentTime ASC
    ");
    
    $stmt->execute();
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Appointments retrieved successfully',
        'appointments' => $appointments
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 