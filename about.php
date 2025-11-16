<?php
require_once __DIR__ . '/includes/init.php';
require_login();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Feather Find — About</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= (BASE_URL ?: '.') ?>/assets/css/styles.css" rel="stylesheet">
</head>
<body>
  <?php include __DIR__ . '/includes/nav.php'; ?>
  <main class="container">
    <article class="card">
      <header>
        <h1>About Feather Find</h1>
      </header>
      <section>
        <h2>Our Vision</h2>
        <p>To create the world's most comprehensive, community-driven database for real-time bird tracking, focusing specifically on migratory routes and endangered species. We believe that citizen science is the most powerful tool for effective global conservation.</p>

        <h2>How It Works</h2>
        <p>Feather Find leverages the passion of bird enthusiasts to achieve its goals:</p>
        <ol>
          <li><strong>Locate & Upload:</strong> Users log in to upload a bird's picture .</li>
          <li><strong>Verify & Track:</strong> The sighting is logged into the Directory, providing real-time data to all users.</li>
          <li><strong>Preserve & Protect:</strong> This data is shared with environmental NGOs and government agencies, allowing them to dispatch teams and allocate resources to preserve the habitat at the precise location of a rare sighting.</li>
        </ol>
      </section>
    </article>
  </main>
  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>
</body>
</html>
