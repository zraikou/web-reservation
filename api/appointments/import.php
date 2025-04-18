<?php
header('Content-Type: application/json');

require_once '../db.php';

try {
    // Get the raw XML data
    $xmlString = file_get_contents('php://input');
    if (!$xmlString) {
        throw new Exception('No XML data received');
    }

    // Load and validate XML
    $xml = new SimpleXMLElement($xmlString);
    if (!$xml->appointment) {
        throw new Exception('Invalid XML format: no appointments found');
    }

    // Start transaction
    $pdo->beginTransaction();

    // Prepare insert statement
    $sql = "INSERT INTO appointments (fullName, contactNumber, email, service, appointmentDate, appointmentTime, notes) 
            VALUES (:fullName, :contactNumber, :email, :service, :date, :time, :notes)";
    $stmt = $pdo->prepare($sql);

    $successCount = 0;
    $errors = [];

    // Process each appointment
    foreach ($xml->appointment as $appointment) {
        try {
            // Validate required fields
            if (empty($appointment->fullName) || empty($appointment->contactNumber) || 
                empty($appointment->email) || empty($appointment->service) || 
                empty($appointment->date) || empty($appointment->time)) {
                throw new Exception('Missing required fields');
            }

            // Validate phone number
            if (!preg_match('/^\d{11}$/', (string)$appointment->contactNumber)) {
                throw new Exception('Invalid contact number format');
            }

            // Validate email
            if (!filter_var((string)$appointment->email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid email format');
            }

            // Execute insert
            $result = $stmt->execute([
                ':fullName' => (string)$appointment->fullName,
                ':contactNumber' => (string)$appointment->contactNumber,
                ':email' => (string)$appointment->email,
                ':service' => (string)$appointment->service,
                ':date' => (string)$appointment->date,
                ':time' => (string)$appointment->time,
                ':notes' => (string)$appointment->notes ?? null
            ]);

            if ($result) {
                $successCount++;
            }
        } catch (Exception $e) {
            $errors[] = "Error processing appointment for {$appointment->fullName}: {$e->getMessage()}";
        }
    }

    // If any appointments were successfully imported, commit the transaction
    if ($successCount > 0) {
        $pdo->commit();
        echo json_encode([
            'success' => true,
            'message' => "Successfully imported {$successCount} appointments" . 
                        (count($errors) > 0 ? " with " . count($errors) . " errors" : ""),
            'errors' => $errors
        ]);
    } else {
        // If no appointments were imported successfully, rollback
        $pdo->rollBack();
        throw new Exception('No appointments were imported successfully');
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 