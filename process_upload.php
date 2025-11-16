<?php
require_once __DIR__ . '/includes/init.php';
header('Content-Type: application/json');

if (!is_logged_in()) {
    echo json_encode(['status' => 'error', 'message' => 'Not authorized. Please log in.']);
    exit;
}

$user_id = (int)$_SESSION['user_id'];
$location = trim((string)($_POST['location'] ?? ''));

if ($location === '') {
    echo json_encode(['status' => 'error', 'message' => 'Location is required.']);
    exit;
}

if (!isset($_FILES['bird_image']) || $_FILES['bird_image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['status' => 'error', 'message' => 'Please provide a valid image file.']);
    exit;
}

$file = $_FILES['bird_image'];
$allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExt, true)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid file type. Use JPG, PNG, or WEBP.']);
    exit;
}
if ($file['size'] > $maxSize) {
    echo json_encode(['status' => 'error', 'message' => 'File too large. Max 5MB.']);
    exit;
}

$uploadsDir = __DIR__ . '/uploads';
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0775, true);
}
$basename = bin2hex(random_bytes(8)) . '.' . $ext;
$destPath = $uploadsDir . '/' . $basename;
$publicPath = 'uploads/' . $basename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
    exit;
}

$species = trim((string)($_POST['species'] ?? ''));
if ($species === '' || mb_strlen($species) > 100) {
    echo json_encode(['status' => 'error', 'message' => 'Bird name is required.']);
    exit;
}


// Save to DB
$ins = $pdo->prepare('INSERT INTO sightings (user_id, species, location, image_path) VALUES (?, ?, ?, ?)');
$ins->execute([$user_id, $species, $location, $publicPath]);

echo json_encode([
    'status' => 'success',
    'message' => "Sighting for '{$species}' logged!"
]);
