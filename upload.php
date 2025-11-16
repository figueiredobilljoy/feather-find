<?php
require_once __DIR__ . '/includes/init.php';
require_login();
if (!empty($_SESSION['is_admin'])) {
  header('Location: admin.php?status=' . urlencode('Admins cannot upload. Use the approval panel.'));
  exit;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Feather Find — Upload Sighting</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= (BASE_URL ?: '.') ?>/assets/css/styles.css" rel="stylesheet">
</head>
<body>
  <?php include __DIR__ . '/includes/nav.php'; ?>

  <main class="container">
    <section class="card">
      <header>
        <h1>Upload a Bird Sighting</h1>
      </header>
      <section>
        <form id="upload-form" enctype="multipart/form-data">
          <div class="form-row">
            <div>
              <label for="bird_image">Bird Image</label>
              <input class="input" type="file" id="bird_image" name="bird_image" accept="image/*" required>
            </div>
            <div>
              <label for="location">Location</label>
              <input class="input" type="text" id="location" name="location" placeholder="e.g., Pilar, Goa" required>
            </div>
            <div>
              <label for="species">Bird name</label>
              <input class="input" type="text" id="species" name="species" placeholder="eg peacock" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit">Submit Sighting</button>
            <span id="upload-status" class="helper"></span>
          </div>
        </form>
      </section>
    </section>
  </main>

  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>

  <script src="<?= (BASE_URL ?: '.') ?>/assets/js/upload.js" defer></script>
</body>
</html>
