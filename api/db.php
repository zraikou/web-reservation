<?php
$host = 'sql302.infinityfree.com';
$dbname = 'if0_38678988_aesthetic_clinic';
$username = 'if0_38678988';
$password = '136EX9c2Xx';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
} 