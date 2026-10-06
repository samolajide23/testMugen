const MAX_ZIP_BYTES = 50 * 1024 * 1024;

export function validateZipSelection(files) {
  if (files.length !== 1) return 'Choose one character ZIP at a time.';
  const file = files[0];
  if (!/\.zip$/i.test(file.name)) return 'Choose a .zip file, not a folder, RAR, or 7z archive.';
  if (!file.size) return 'This ZIP file is empty.';
  if (file.size > MAX_ZIP_BYTES) return 'ZIP exceeds the 50 MiB upload limit.';
  return null;
}

export function sendCharacterZip(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/import-zip');
    xhr.setRequestHeader('Content-Type', 'application/zip');
    xhr.setRequestHeader('X-Rift-Import', '1');
    xhr.setRequestHeader('X-Character-Filename', encodeURIComponent(file.name));
    xhr.responseType = 'json';
    xhr.upload.onprogress = (event) => onProgress(event.lengthComputable ? Math.round(event.loaded / event.total * 100) : null);
    xhr.upload.onload = () => onProgress(100);
    xhr.onerror = () => reject(new Error('Connection lost. Check whether the character was saved before retrying.'));
    xhr.onabort = () => reject(new Error('Upload interrupted. Check the library before retrying.'));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response?.character) resolve(xhr.response);
      else reject(new Error(xhr.response?.error ?? 'ZIP import unavailable. Restart the local preview server and try again.'));
    };
    xhr.send(file);
  });
}

export function setupZipUpload(onImported) {
  const zone = document.getElementById('drop-zone');
  const input = document.getElementById('zip-file');
  const button = document.getElementById('choose-zip');
  const status = document.getElementById('upload-status');
  const progress = document.getElementById('upload-progress');
  let busy = false;
  let dragDepth = 0;
  const resetDrag = () => { dragDepth = 0; zone.classList.remove('drag-over'); };
  const importFiles = async (files) => {
    if (busy) return;
    const error = validateZipSelection(files);
    status.classList.toggle('upload-error', Boolean(error));
    if (error) { status.textContent = error; return; }
    busy = true;
    button.disabled = true;
    input.disabled = true;
    zone.setAttribute('aria-busy', 'true');
    progress.hidden = false;
    progress.value = 0;
    status.textContent = `Sending ${files[0].name} to the local importer…`;
    try {
      const result = await sendCharacterZip(files[0], (percent) => {
        if (percent === null || percent === 100) {
          progress.removeAttribute('value');
          status.textContent = 'Checking ZIP, extracting, and importing sprites… Keep this page open.';
        } else {
          progress.value = percent;
          status.textContent = `Uploading to this PC: ${percent}%`;
        }
      });
      progress.value = 100;
      status.textContent = `Saved ${result.character.name} to ${result.savedFolder}. Loading preview…`;
      try {
        await onImported(result.character);
        status.textContent = `Saved to ${result.savedFolder} and imported. ${result.warnings?.length ?? 0} compatibility warnings—see the report.`;
      } catch {
        status.classList.add('upload-error');
        status.textContent = `Saved to ${result.savedFolder}, but the preview could not refresh. Reload this page; do not upload again.`;
      }
    } catch (failure) {
      status.classList.add('upload-error');
      status.textContent = failure.message;
    } finally {
      busy = false;
      button.disabled = false;
      input.disabled = false;
      input.value = '';
      progress.hidden = true;
      zone.setAttribute('aria-busy', 'false');
      resetDrag();
    }
  };
  button.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { if (input.files.length) void importFiles([...input.files]); });
  zone.addEventListener('dragenter', (event) => {
    event.preventDefault();
    dragDepth++;
    if (!busy) zone.classList.add('drag-over');
  });
  zone.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = busy ? 'none' : 'copy';
  });
  zone.addEventListener('dragleave', () => { if (--dragDepth <= 0) resetDrag(); });
  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    resetDrag();
    void importFiles([...(event.dataTransfer?.files ?? [])]);
  });
  // Prevent a missed drop from navigating away from the local tool.
  for (const name of ['dragover', 'drop']) document.addEventListener(name, (event) => {
    if ([...(event.dataTransfer?.types ?? [])].includes('Files')) event.preventDefault();
  });
}
