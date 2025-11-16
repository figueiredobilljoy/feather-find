<?php
?>
<header>
  <nav class="site-nav" aria-label="Primary">
    <div class="brand">
      <a href="<?= (BASE_URL ?: '.') ?>/index.php" class="logo">Feather Find</a>
    </div>
    <button class="nav-toggle" aria-expanded="false" aria-controls="primary-menu">☰</button>
    <ul id="primary-menu" class="nav-links">
      <?php if (!empty($_SESSION['is_admin'])): ?>
        <li><a href="<?= (BASE_URL ?: '.') ?>/admin.php">Admin</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/admin.php?tab=messages">Messages</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/directory.php">Bird Directory</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/logout.php">Logout</a></li>
      <?php else: ?>
        <li><a href="<?= (BASE_URL ?: '.') ?>/index.php">Home</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/directory.php">Bird Directory</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/upload.php">Upload Sighting</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/about.php">About</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/contact.php">Contact</a></li>
        <li><a href="<?= (BASE_URL ?: '.') ?>/logout.php">Logout</a></li>
      <?php endif; ?>
    </ul>
  </nav>
</header>
<script>
  const toggleBtn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
    });
  }
</script>
