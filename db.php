
<?php
// Database connection file - would be used when implementing the SQL database
// This is a sample PHP file that would handle the database operations

// Database configuration - should be stored in environment variables in production
$db_host = 'sql302.infinityfree.com';
$db_name = 'if0_38678988_aesthetic_clinic';
$db_user = 'if0_38678988';
$db_pass = '136EX9c2Xx'; 

// Create PDO connection
function getDbConnection() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    try {
        $conn = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        
        error_log("Connection failed: " . $e->getMessage());
        return null;
    }
}

// Save appointment to database
function saveAppointment($appointment) {
    $conn = getDbConnection();
    if (!$conn) return false;
    
    try {
        $stmt = $conn->prepare("INSERT INTO appointments 
            (fullName, contactNumber, email, service, appointmentDate, appointmentTime, notes) 
            VALUES (:fullName, :contactNumber, :email, :service, :appointmentDate, :appointmentTime, :notes)");
            
        $stmt->bindParam(':fullName', $appointment['fullName']);
        $stmt->bindParam(':contactNumber', $appointment['contactNumber']);
        $stmt->bindParam(':email', $appointment['email']);
        $stmt->bindParam(':service', $appointment['service']);
        $stmt->bindParam(':appointmentDate', $appointment['date']);
        $stmt->bindParam(':appointmentTime', $appointment['time']);
        $stmt->bindParam(':notes', $appointment['notes']);
        
        $stmt->execute();
        return true;
    } catch(PDOException $e) {
        error_log("Save appointment failed: " . $e->getMessage());
        return false;
    }
}

// Get all appointments
function getAllAppointments() {
    $conn = getDbConnection();
    if (!$conn) return [];
    
    try {
        $stmt = $conn->query("SELECT * FROM appointments ORDER BY appointmentDate, appointmentTime");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Get appointments failed: " . $e->getMessage());
        return [];
    }
}

// Search appointments
function searchAppointments($searchTerm) {
    $conn = getDbConnection();
    if (!$conn) return [];
    
    try {
        $searchTerm = "%$searchTerm%";
        $stmt = $conn->prepare("SELECT * FROM appointments 
            WHERE fullName LIKE :searchTerm 
            OR email LIKE :searchTerm 
            OR service LIKE :searchTerm
            ORDER BY appointmentDate, appointmentTime");
            
        $stmt->bindParam(':searchTerm', $searchTerm);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Search appointments failed: " . $e->getMessage());
        return [];
    }
}

// Generate XML from appointments (for XSLT processing)
function generateAppointmentsXML($appointments) {
    $xml = new SimpleXMLElement('<appointments></appointments>');
    
    foreach ($appointments as $appointment) {
        $apptNode = $xml->addChild('appointment');
        $apptNode->addChild('fullName', htmlspecialchars($appointment['fullName']));
        $apptNode->addChild('contactNumber', htmlspecialchars($appointment['contactNumber']));
        $apptNode->addChild('email', htmlspecialchars($appointment['email']));
        $apptNode->addChild('service', htmlspecialchars($appointment['service']));
        $apptNode->addChild('date', htmlspecialchars($appointment['appointmentDate']));
        $apptNode->addChild('time', htmlspecialchars($appointment['appointmentTime']));
        $apptNode->addChild('notes', htmlspecialchars($appointment['notes']));
        $apptNode->addChild('createdAt', htmlspecialchars($appointment['createdAt']));
    }
    
    return $xml->asXML();
}

// Get all services
function getAllServices() {
    $conn = getDbConnection();
    if (!$conn) return [];
    
    try {
        $stmt = $conn->query("SELECT * FROM services ORDER BY serviceName");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Get services failed: " . $e->getMessage());
        return [];
    }
}
