<?php
header('Content-Type: application/json');

require_once '../db.php';

try {
    $stmt = $pdo->prepare("TRUNCATE TABLE appointments");
    $result = $stmt->execute();
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'All appointments cleared successfully'
        ]);
    } else {
        throw new Exception('Failed to clear appointments');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 