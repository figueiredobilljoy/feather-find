document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('upload-form');
  const statusDiv = document.getElementById('upload-status');

  const setStatus = (msg, ok = false) => {
    statusDiv.textContent = msg;
    statusDiv.className = ok ? 'success' : 'error';
  };

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('Uploading...', true);

    try {
      const formData = new FormData(form);
      const resp = await fetch('process_upload.php', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (data.status === 'success') {
        setStatus(data.message, true);
        form.reset();
      } else {
        setStatus(data.message || 'Upload failed.');
      }
    } catch (err) {
      setStatus('Network error. Please try again.');
    }
  });
});
