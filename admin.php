<?php
require_once __DIR__ . '/includes/init.php';
require_login();

if (empty($_SESSION['is_admin'])) {
    header('Location: index.php?status=' . urlencode('Unauthorized'));
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['approve_id'])) {
    $id = (int)$_POST['approve_id'];
    if ($id > 0) {
        $up = $pdo->prepare("UPDATE sightings SET status='approved' WHERE sighting_id = ?");
        $up->execute([$id]);
        header('Location: admin.php?status=' . urlencode('Sighting approved.'));
        exit;
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
    $id = (int)$_POST['delete_id'];
    if ($id > 0) {
        $del = $pdo->prepare('DELETE FROM sightings WHERE sighting_id = ?');
        $del->execute([$id]);
        header('Location: admin.php?status=' . urlencode('Sighting deleted.'));
        exit;
    }
}


$stmt = $pdo->query(
    "SELECT s.sighting_id, s.species, s.location, s.image_path, s.sighting_date, u.full_name
     FROM sightings s
     JOIN users u ON u.user_id = s.user_id
     WHERE s.status = 'pending'
     ORDER BY s.sighting_date DESC"
);
$pending = $stmt->fetchAll();

// Handle contact message actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['msg_action'], $_POST['message_id'])) {
    $msgId = (int)$_POST['message_id'];
    $action = $_POST['msg_action'];
    if ($msgId > 0 && in_array($action, ['read'], true)) {
        $up = $pdo->prepare('UPDATE contact_messages SET status = ? WHERE message_id = ?');
        $up->execute([$action, $msgId]);
        header('Location: admin.php?tab=messages&status=' . urlencode('Message marked as read.'));
        exit;
    }
}


$msgStmt = $pdo->query(
    "SELECT message_id, sender_name, sender_email, subject, message_text, status, created_at, admin_notes
     FROM contact_messages
     ORDER BY created_at DESC"
);
$messages = $msgStmt->fetchAll();


if (!function_exists('h')) {
    function h(string $v): string { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Feather Find — Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= (BASE_URL ?: '.') ?>/assets/css/styles.css" rel="stylesheet">
</head>
<body>
  <?php include __DIR__ . '/includes/nav.php'; ?>
  <main class="container">
    <section class="card">
      <header>
        <h1>Admin — Pending Approvals</h1>
        <?php if (!empty($_GET['status']) && (empty($_GET['tab']) || $_GET['tab'] !== 'messages')): ?>
          <p class="success"><?= h($_GET['status']) ?></p>
        <?php endif; ?>
        <p class="helper">Approve valid sightings to publish them to the directory.</p>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Species</th>
              <th>Location</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          <?php if (!$pending): ?>
            <tr><td colspan="6">No pending sightings.</td></tr>
          <?php else: ?>
            <?php foreach ($pending as $p): ?>
              <tr>
                <td>
                  <?php if (!empty($p['image_path'])): ?>
                    <img src="<?= h($p['image_path']) ?>" alt="Bird" style="width:96px;height:96px;object-fit:contain;object-position:center;background:#0b1220;border-radius:6px;border:1px solid var(--border);">
                  <?php endif; ?>
                </td>
                <td><?= h($p['species']) ?></td>
                <td><?= h($p['location']) ?></td>
                <td><?= h($p['full_name']) ?></td>
                <td><?= h(date('Y-m-d H:i', strtotime($p['sighting_date']))) ?></td>
                <td>
                  <form method="post" style="display:inline">
                    <input type="hidden" name="approve_id" value="<?= (int)$p['sighting_id'] ?>">
                    <button type="submit">Approve</button>
                  </form>
                  <form method="post" style="display:inline;margin-left:6px">
                    <input type="hidden" name="delete_id" value="<?= (int)$p['sighting_id'] ?>">
                    <button type="submit">Cancel</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Admin Messages Inbox -->
    <section class="card" id="messages">
      <header>
        <h1>Admin — Messages</h1>
        <?php if (!empty($_GET['status']) && !empty($_GET['tab']) && $_GET['tab'] === 'messages'): ?>
          <p class="success"><?= h($_GET['status']) ?></p>
        <?php endif; ?>
        <p class="helper">View and manage messages sent via the Contact form.</p>
      </header>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          <?php if (empty($messages)): ?>
            <tr><td colspan="7">No messages.</td></tr>
          <?php else: ?>
            <?php foreach ($messages as $m): ?>
              <tr>
                <td><?= h(date('Y-m-d H:i', strtotime($m['created_at']))) ?></td>
                <td><?= h($m['sender_name']) ?></td>
                <td><a href="mailto:<?= h($m['sender_email']) ?>"><?= h($m['sender_email']) ?></a></td>
                <td><?= h($m['subject']) ?></td>
                <td><?= h($m['status']) ?></td>
                <td>
                  <details>
                    <summary>View</summary>
                    <pre style="white-space:pre-wrap;margin:0;"><?= h($m['message_text']) ?></pre>
                    <?php if (!empty($m['admin_notes'])): ?>
                      <hr>
                      <small><strong>Admin notes:</strong> <?= h($m['admin_notes']) ?></small>
                    <?php endif; ?>
                  </details>
                </td>
                <td>
                  <form method="post" style="display:inline">
                    <input type="hidden" name="message_id" value="<?= (int)$m['message_id'] ?>">
                    <button type="submit" name="msg_action" value="read">Mark Read</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
          </tbody>
        </table>
      </div>
    </section>
  </main>
  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>
</body>
</html>