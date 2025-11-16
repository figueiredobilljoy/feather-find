<?php
require_once __DIR__ . '/includes/init.php';
require_login();


$hlStmt = $pdo->query(
    "SELECT s.species, s.location, s.image_path, s.sighting_date, u.full_name
     FROM sightings s
     JOIN users u ON u.user_id = s.user_id
     WHERE s.status = 'approved'
     ORDER BY s.sighting_date DESC
     LIMIT 4"
);
$highlights = $hlStmt->fetchAll();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Feather Find — Home</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= (BASE_URL ?: '.') ?>/assets/css/styles.css" rel="stylesheet">
</head>
<body>
  <?php include __DIR__ . '/includes/nav.php'; ?>
  <main class="container">
    <section class="card">
      <header>
        <h1>Welcome, <?= h($_SESSION['full_name'] ?? 'Explorer') ?>!</h1>
      </header>
      <section class="grid-3">
        <article class="card">
          <h2>Our Mission</h2>
          <p>Feather Find helps birders record sightings, learn species, and share discoveries.</p>
        </article>
        <article class="card">
          <h2>Recent Sightings</h2>
          <p>Explore the <a href="directory.php">Bird Directory</a> to see what others have found.</p>
        </article>
        <article class="card">
          <h2>Share Yours</h2>
          <p>Upload your latest photo and we’ll simulate AI to identify the species.</p>
          <p><a class="btn" href="upload.php">Upload a Sighting</a></p>
        </article>
      </section>
    </section>

    <section class="card">
      <h2>Bird Highlights</h2>
      <?php if (!empty($highlights)): ?>
        <div class="figure-grid">
          <?php foreach ($highlights as $h): ?>
            <figure>
              <img src="<?= h($h['image_path']) ?>" alt="<?= h($h['species']) ?>" loading="lazy">
              <figcaption><?= h($h['species']) ?> — by <?= h($h['full_name']) ?></figcaption>
            </figure>
          <?php endforeach; ?>
        </div>
      <?php else: ?>
        <p class="helper">No approved sightings yet. Upload a sighting to get started.</p>
      <?php endif; ?>
    </section>
  </main>
  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>
</body>
</html>
