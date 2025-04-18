<?php
header('Content-Type: application/json');

require_once '../db.php';

try {
    // Get the ID from the request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        throw new Exception('Appointment ID is required');
    }
    
    $id = $data['id'];
    
    // Prepare and execute delete statement
    $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = :id");
    $result = $stmt->execute([':id' => $id]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    } else {
        throw new Exception('Failed to delete appointment');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 