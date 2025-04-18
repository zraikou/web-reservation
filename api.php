
<?php
// API endpoint 
// This file would handle AJAX requests from the frontend

header('Content-Type: application/json');
require_once 'db.php';

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Route the request
switch ($method) {
    case 'GET':
        handleGetRequest();
        break;
    case 'POST':
        handlePostRequest();
        break;
    default:
        sendResponse(405, ['error' => 'Method not allowed']);
}

// Handle GET requests
function handleGetRequest() {
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'getAppointments':
            // Get search term if any
            $searchTerm = $_GET['search'] ?? '';
            
            if (!empty($searchTerm)) {
                $appointments = searchAppointments($searchTerm);
            } else {
                $appointments = getAllAppointments();
            }
            
            sendResponse(200, ['appointments' => $appointments]);
            break;
            
        case 'getServices':
            $services = getAllServices();
            sendResponse(200, ['services' => $services]);
            break;
            
        case 'getAppointmentsXML':
            $appointments = getAllAppointments();
            $xml = generateAppointmentsXML($appointments);
            
            header('Content-Type: application/xml');
            echo $xml;
            exit;
            
        default:
            sendResponse(400, ['error' => 'Invalid action']);
    }
}

// Handle POST requests
function handlePostRequest() {
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'saveAppointment':
            // Get and validate form data
            $formData = json_decode(file_get_contents('php://input'), true);
            
            if (!validateAppointmentData($formData)) {
                sendResponse(400, ['error' => 'Invalid appointment data']);
                return;
            }
            
            // Save appointment
            $success = saveAppointment($formData);
            
            if ($success) {
                sendResponse(201, ['message' => 'Appointment created successfully']);
            } else {
                sendResponse(500, ['error' => 'Failed to save appointment']);
            }
            break;
            
        default:
            sendResponse(400, ['error' => 'Invalid action']);
    }
}

// Validate appointment data
function validateAppointmentData($data) {
    // Check required fields
    $requiredFields = ['fullName', 'contactNumber', 'email', 'service', 'date', 'time'];
    
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            return false;
        }
    }
    
    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    
    return true;
}

// Send JSON response
function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}
