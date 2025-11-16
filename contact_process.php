<?php
require_once __DIR__ . '/includes/init.php';
require_login();

$name    = trim((string)($_POST['name'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

$ok = $name !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) && $subject !== '' && $message !== '';

if ($ok) {
    try {
        $uid = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
        $stmt = $pdo->prepare('INSERT INTO contact_messages (user_id, sender_name, sender_email, subject, message_text) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$uid, $name, $email, $subject, $message]);
        $status = 'Thank you! We received your message.';
    } catch (Throwable $e) {
        $status = 'Could not send your message at this time.';
        $ok = false;
    }
} else {
    $status = 'Please provide valid name, email, subject, and message.';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Feather Find — Contact</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= (BASE_URL ?: '.') ?>/assets/css/styles.css" rel="stylesheet">
</head>
<body>
  <?php include __DIR__ . '/includes/nav.php'; ?>
  <main class="container">
    <section class="card">
      <header><h1>Contact</h1></header>
      <section>
        <p class="<?= $ok ? 'success' : 'error' ?>"><?= htmlspecialchars($status, ENT_QUOTES, 'UTF-8') ?></p>
        <p><a class="btn" href="contact.php">Back</a></p>
      </section>
    </section>
  </main>
  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>
</body>
</html>
