<?php require_once __DIR__ . '/includes/init.php'; ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Feather Find — Login / Register</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="<?= (BASE_URL ?: '.') ?>/assets/css/styles.css" rel="stylesheet">
</head>
<body>
  <main class="container">
    <section class="card">
      <header>
        <h1>Welcome to Feather Find</h1>
        <p class="helper">Track and share your bird sightings.</p>
        <?php if (!empty($_GET['status'])): ?>
          <p class="<?= stripos($_GET['status'], 'success') !== false ? 'success' : 'error' ?>"><?= h($_GET['status']) ?></p>
        <?php endif; ?>
      </header>

      <section id="login-wrap">
        <h2>Login</h2>
        <form action="auth_process.php" method="post" class="form" novalidate autocomplete="off">
          <input type="hidden" name="action" value="login">
          <div class="form-row">
            <div>
              <label for="login-email">Email</label>
              <input class="input" type="email" id="login-email" name="email" required autocomplete="off" autocapitalize="none" spellcheck="false" readonly>
            </div>
            <div>
              <label for="login-password">Password</label>
              <input class="input" type="password" id="login-password" name="password" required autocomplete="off" readonly>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit">Login</button>
            <a href="#" id="toggle-to-register" class="btn btn-secondary">Need an account? Register</a>
          </div>
        </form>
      </section>

      <section id="register-wrap" hidden>
        <h2>Create Account</h2>
        <form id="register-form" action="auth_process.php" method="post" class="form" novalidate autocomplete="off">
          <input type="hidden" name="action" value="register">
          <div class="form-row">
            <div>
              <label for="reg-name">Full Name</label>
              <input class="input" type="text" id="reg-name" name="full_name" required autocomplete="off" autocapitalize="words" spellcheck="false" readonly>
              <span class="error"></span>
            </div>
            <div>
              <label for="reg-email">Email</label>
              <input class="input" type="email" id="reg-email" name="email" required autocomplete="off" autocapitalize="none" spellcheck="false" readonly>
              <span class="error"></span>
            </div>
            <div>
              <label for="reg-password">Password</label>
              <input class="input" type="password" id="reg-password" name="password" required minlength="8" autocomplete="off" readonly>
              <span class="error"></span>
            </div>
            <div>
              <label for="reg-confirm">Confirm Password</label>
              <input class="input" type="password" id="reg-confirm" name="confirm_password" required minlength="8" autocomplete="off" readonly>
              <span class="error"></span>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit">Create Account</button>
            <a href="#" id="toggle-to-login" class="btn btn-secondary">Back to Login</a>
          </div>
        </form>
      </section>
    </section>
  </main>

  <footer>
    <p>&copy; <?= date('Y') ?> Feather Find</p>
  </footer>

  <script>
    (function() {
      function clearAndEnable(ids) {
        ids.forEach(function(id) {
          var el = document.getElementById(id);
          if (el) {
            el.value = '';
            el.setAttribute('autocomplete', 'off');
            setTimeout(function(){ el.removeAttribute('readonly'); }, 50);
          }
        });
      }
      clearAndEnable(['login-email','login-password','reg-email','reg-password','reg-confirm','reg-name']);
      var lf = document.querySelector('#login-wrap form');
      var rf = document.getElementById('register-form');
      if (lf) lf.setAttribute('autocomplete','off');
      if (rf) rf.setAttribute('autocomplete','off');
    })();
  </script>
  <script src="<?= (BASE_URL ?: '.') ?>/assets/js/auth.js" defer></script>
</body>
</html>
