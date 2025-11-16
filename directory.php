<?php
require_once __DIR__ . '/includes/init.php';
require_login();


$q    = trim((string)($_GET['q'] ?? ''));
$sort = (string)($_GET['sort'] ?? 'date');
$dir  = strtolower((string)($_GET['dir'] ?? 'desc')) === 'asc' ? 'ASC' : 'DESC';

$sortMap = [
  'species'  => 's.species',
  'location' => 's.location',
  'user'     => 'u.full_name',
  'date'     => 's.sighting_date'
];
$orderBy = $sortMap[$sort] ?? $sortMap['date'];

$sql = "SELECT s.species, s.location, s.image_path, s.sighting_date, u.full_name
        FROM sightings s
        JOIN users u ON u.user_id = s.user_id
        WHERE s.status = 'approved'";
$params = [];
if ($q !== '') {
  $sql .= " AND (s.species LIKE ? OR s.location LIKE ? OR u.full_name LIKE ?)%s";
}
$sql .= " ORDER BY {$orderBy} {$dir}";

if ($q !== '') {
  $like = "%{$q}%";
  $stmt = $pdo->prepare(sprintf($sql, ''));
  $stmt->execute([$like, $like, $like]);
} else {
  $stmt = $pdo->prepare(sprintf($sql, ''));
  $stmt->execute();
}
$rows = $stmt->fetchAll();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Feather Find — Bird Directory</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= (BASE_URL ?: '.') ?>/assets/css/styles.css" rel="stylesheet">
</head>
<body>
  <?php include __DIR__ . '/includes/nav.php'; ?>
  <main class="container">
    <section class="card">
      <header>
        <h1>Bird Directory</h1>
        <p class="helper">All confirmed sightings by the community.</p>
        <form method="get" class="form" style="margin-top:12px">
          <div class="form-row">
            <div>
              <label for="q">Search</label>
              <input class="input" type="text" id="q" name="q" value="<?= isset($q) ? h($q) : '' ?>" placeholder="Search species, location, user">
            </div>
            <div>
              <label for="sort">Sort by</label>
              <select class="input" id="sort" name="sort">
                <option value="date" <?= ($sort ?? '') === 'date' ? 'selected' : '' ?>>Date</option>
                <option value="species" <?= ($sort ?? '') === 'species' ? 'selected' : '' ?>>Species</option>
                <option value="location" <?= ($sort ?? '') === 'location' ? 'selected' : '' ?>>Location</option>
                <option value="user" <?= ($sort ?? '') === 'user' ? 'selected' : '' ?>>User</option>
              </select>
            </div>
            <div>
              <label for="dir">Order</label>
              <select class="input" id="dir" name="dir">
                <option value="desc" <?= (strtoupper($dir ?? 'DESC') === 'DESC') ? 'selected' : '' ?>>Desc</option>
                <option value="asc" <?= (strtoupper($dir ?? 'DESC') === 'ASC') ? 'selected' : '' ?>>Asc</option>
              </select>
            </div>
            <div style="align-self:end">
              <button type="submit">Apply</button>
            </div>
          </div>
        </form>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Location</th>
              <th>Sighted By</th>
              <th>Date</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
          <?php if (!$rows): ?>
            <tr>
              <td colspan="5">No sightings yet. Be the first to upload!</td>
            </tr>
          <?php else: ?>
            <?php foreach ($rows as $r): ?>
              <tr>
                <td><?= h($r['species']) ?></td>
                <td><?= h($r['location']) ?></td>
                <td><?= h($r['full_name']) ?></td>
                <td><?= h(date('Y-m-d H:i', strtotime($r['sighting_date']))) ?></td>
                <td>
                  <?php if (!empty($r['image_path'])): ?>
                    <img class="zoomable" src="<?= h($r['image_path']) ?>" alt="Bird" style="width:96px;height:96px;object-fit:contain;object-position:center;background:#0b1220;border-radius:6px;border:1px solid var(--border);cursor:zoom-in;" data-full="<?= h($r['image_path']) ?>">
                  <?php endif; ?>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <div id="lightbox" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.9);z-index:9999;">
    <img id="lightbox-img" src="" alt="Preview" style="max-width:92vw;max-height:92vh;box-shadow:0 12px 40px rgba(0,0,0,0.6);border-radius:10px;">
  </div>

  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>

  <script>
    (function(){
      var overlay = document.getElementById('lightbox');
      var imgEl = document.getElementById('lightbox-img');
      function open(src){ if (!overlay || !imgEl) return; imgEl.src = src; overlay.style.display = 'flex'; }
      function close(){ if (!overlay) return; overlay.style.display = 'none'; imgEl.src=''; }
      document.addEventListener('click', function(e){
        var t = e.target;
        if (t && t.classList && t.classList.contains('zoomable')) {
          e.preventDefault();
          open(t.getAttribute('data-full') || t.src);
        } else if (overlay && overlay.style.display !== 'none' && (t === overlay || t === imgEl)) {
          close();
        }
      });
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
    })();
  </script>
</body>
</html>
