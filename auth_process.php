<?php
require_once __DIR__ . '/includes/init.php';

$action = $_POST['action'] ?? '';

if ($action === 'register') {
    $full_name = trim((string)($_POST['full_name'] ?? ''));
    $email     = trim((string)($_POST['email'] ?? ''));
    $password  = (string)($_POST['password'] ?? '');
    $confirm   = (string)($_POST['confirm_password'] ?? '');

    if ($full_name === '' || $email === '' || $password === '') {
        header('Location: login.php?status=' . urlencode('All fields are required.'));
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header('Location: login.php?status=' . urlencode('Invalid email.'));
        exit;
    }
    if (strlen($password) < 8 || $password !== $confirm) {
        header('Location: login.php?status=' . urlencode('Password invalid or does not match.'));
        exit;
    }

    // Check if email exists
    $stmt = $pdo->prepare('SELECT user_id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        header('Location: login.php?status=' . urlencode('Email already registered.'));
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins = $pdo->prepare('INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)');
    $ins->execute([$full_name, $email, $hash]);

    header('Location: login.php?status=' . urlencode('Registration successful. Please login (success).'));
    exit;
}

if ($action === 'login') {
    $email    = trim((string)($_POST['email'] ?? ''));
    $password = (string)($_POST['password'] ?? '');

    if ($email === '' || $password === '') {
        header('Location: login.php?status=' . urlencode('Invalid email/password.'));
        exit;
    }
    $stmt = $pdo->prepare('SELECT user_id, password_hash, full_name, is_admin FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        header('Location: login.php?status=' . urlencode('Invalid email/password.'));
        exit;
    }

    $_SESSION['user_id'] = (int)$user['user_id'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['is_admin'] = (int)($user['is_admin'] ?? 0);

    if (!empty($_SESSION['is_admin'])) {
        header('Location: admin.php');
    } else {
        header('Location: index.php');
    }
    exit;
}

header('Location: login.php?status=' . urlencode('Unknown action.'));
