<?php
require_once __DIR__ . '/includes/init.php';
require_login();

$prefillName  = isset($_SESSION['full_name']) ? (string)$_SESSION['full_name'] : '';
$prefillEmail = '';
if (isset($_SESSION['user_id'])) {
    try {
        $stmt = $pdo->prepare('SELECT email FROM users WHERE user_id = ? LIMIT 1');
        $stmt->execute([ (int)$_SESSION['user_id'] ]);
        $row = $stmt->fetch();
        if ($row && !empty($row['email'])) {
            $prefillEmail = (string)$row['email'];
        }
    } catch (Throwable $e) {
    }
       
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
      <header>
        <h1>Contact Us</h1>
      </header>
      <section>
        <form action="contact_process.php" method="post" class="form">
          <div class="form-row">
            <div>
              <label for="c-name">Your Name</label>
              <input class="input" type="text" id="c-name" name="name" required value="<?= h($prefillName) ?>">
            </div>
            <div>
              <label for="c-email">Your Email</label>
              <input class="input" type="email" id="c-email" name="email" required value="<?= h($prefillEmail) ?>">
            </div>
            <div>
              <label for="c-subject">Subject</label>
              <input class="input" type="text" id="c-subject" name="subject" required>
            </div>
            <div>
              <label for="c-message">Message</label>
              <textarea class="input" id="c-message" name="message" rows="5" required></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit">Send</button>
            <span class="helper">We’ll get back to you soon.</span>
          </div>
        </form>
      </section>
    </section>
  </main>
  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>
</body>
</html>
