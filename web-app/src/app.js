let currentFile = null;
let fileCount = 0;
let s3Files = [];
let draftedDocs = [];
let activeDraftedDocIndex = null;

function getConfig() {
  const cfg = window.APP_CONFIG;
  if (!cfg?.aws?.region || !cfg?.aws?.s3Bucket || !cfg?.aws?.cognito?.identityPoolId || !cfg?.aws?.cognito?.userPoolId || !cfg?.api?.processUrl) {
    throw new Error("Missing APP_CONFIG. Update web-app/src/config.js");
  }
  return cfg;
}

// API Gateway URL for AI Processing
const API_GATEWAY_URL = getConfig().api.processUrl;

// DOM Elements
const fileInput = document.getElementById('file-upload');
const fileList = document.getElementById('file-list');
const s3FileList = document.getElementById('s3-file-list');
const previewFrame = document.getElementById('preview-frame');
const previewEmpty = document.getElementById('preview-empty-state');
const textPreview = document.getElementById('text-preview');
const uploadBtn = document.getElementById('s3-upload-btn');
const processBtn = document.getElementById('process-btn');
const messagePanel = document.getElementById('message-panel');
const dropZone = document.getElementById('drop-zone');
const fileCountEl = document.getElementById('file-count');
const s3CountEl = document.getElementById('s3-count');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const draftedDocsContainer = document.getElementById('drafted-docs-container');
const latexRenderContainer = document.getElementById('latex-render-container');
const previewContainer = document.getElementById('preview-container');

// --- AWS AUTHENTICATION SETUP ---

function getTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('id_token');
}

const idToken = getTokenFromUrl();

if (!idToken) {
  alert("You must be logged in to view this page.");
  window.location.href = "index.html";
} else {
  const cfg = getConfig();
  AWS.config.region = cfg.aws.region;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cfg.aws.cognito.identityPoolId,
    Logins: {
      [`cognito-idp.${cfg.aws.region}.amazonaws.com/${cfg.aws.cognito.userPoolId}`]: idToken
    }
  });
  AWS.config.credentials.get(function(err) {
  if (err) {
    console.error("Error retrieving AWS credentials:", err);
  } else {
    console.log("AWS credentials initialized:", AWS.config.credentials);
  }
});
}

// Initialize S3 instance
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: getConfig().aws.s3Bucket }
});

// --- UTILITY FUNCTIONS ---

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileExtIcon(name) {
  const ext = name.split('.').pop().toLowerCase();

  // PDF
  if (ext === 'pdf') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 15h.01"/><path d="M13 15h.01"/><path d="M17 15h.01"/></svg>';
  }

  // DOCX / Word
  if (ext === 'docx') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M9 9h2l1 4 1-4h2"/><path d="M14 15h-4"/></svg>';
  }

  // TXT
  if (ext === 'txt') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="10" y1="12" x2="8" y2="12"/><line x1="16" y1="16" x2="8" y2="16"/><line x1="16" y1="12" x2="14" y2="12"/></svg>';
  }

  // JPG/JPEG
  if (ext === 'jpg' || ext === 'jpeg') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5-7 7"/></svg>';
  }

  // PNG
  if (ext === 'png') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5-7 7"/></svg>';
  }

  // Default
  return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5-7 7"/></svg>';
}

function updateFileCount() {
  fileCount = fileList.children.length;
  if (fileCountEl) {
    fileCountEl.textContent = fileCount + (fileCount === 1 ? ' file' : ' files');
  }
}

function updateS3Count() {
  const count = s3FileList.children.length;
  if (s3CountEl) {
    s3CountEl.textContent = count + (count === 1 ? ' file' : ' files');
  }
}

function setStatus(type, title, message, showProgress) {
  let iconSvg = '';
  if (type === 'waiting') {
    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  } else if (type === 'uploading') {
    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  } else if (type === 'success') {
    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }

  let html = '<div class="status-card status-' + type + '">';
  html += '<div class="status-icon">' + iconSvg + '</div>';
  html += '<div class="status-content">';
  html += '<strong>' + title + '</strong>';
  html += message;
  if (showProgress) {
    html += '<div class="progress-bar-container"><div class="progress-bar indeterminate" id="upload-progress"></div></div>';
  }
  html += '</div></div>';

  messagePanel.innerHTML = html;
}

// --- TAB SWITCHING ---

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const tabName = this.dataset.tab;

    // Remove active from all buttons and contents
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    // Add active to clicked button
    this.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

// --- PASTE TEXT FEATURE ---

const addTextBtn = document.getElementById('add-text-btn');
if (addTextBtn) {
  addTextBtn.addEventListener('click', function() {
    const textarea = document.getElementById('paste-textarea');
    const textContent = textarea.value.trim();

    if (!textContent) {
      setStatus('error', 'Empty Text', 'Please paste some text before adding.', false);
      return;
    }

    // Create a File object from pasted text
    const timestamp = Date.now();
    const file = new File([textContent], 'Pasted_Text_' + timestamp + '.txt', { type: 'text/plain' });

    // Handle the file as normal
    handleFile(file);

    // Clear the textarea
    textarea.value = '';

    // Show success
    setStatus('success', 'Text Added', 'Pasted text added to documents list.', false);
  });
}

// --- DRAG & DROP ---

if (dropZone) {
  dropZone.addEventListener('click', function () {
    fileInput.click();
  });

  dropZone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });
}

// --- FILE HANDLING ---

function handleFile(file) {
  if (!file) return;
  currentFile = file;

  const items = fileList.querySelectorAll('li');
  items.forEach(function (item) { item.classList.remove('active'); });

  const li = document.createElement('li');
  li.innerHTML =
    '<div class="file-icon">' + getFileExtIcon(file.name) + '</div>' +
    '<span class="file-name">' + file.name + '</span>' +
    '<span class="file-size">' + formatFileSize(file.size) + '</span>' +
    '<button class="file-remove-btn" title="Remove file" aria-label="Remove ' + file.name + '">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>';

  li.classList.add('active');

  li.onclick = function (e) {
    if (e.target.closest('.file-remove-btn')) return;
    currentFile = file;
    fileList.querySelectorAll('li').forEach(function (item) { item.classList.remove('active'); });
    li.classList.add('active');
    showPreview(file);
  };

  var removeBtn = li.querySelector('.file-remove-btn');
  removeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    li.remove();
    updateFileCount();

    if (currentFile === file) {
      currentFile = null;
      previewFrame.style.display = 'none';
      previewFrame.src = '';
      if (previewEmpty) previewEmpty.style.display = '';
      uploadBtn.disabled = true;
      messagePanel.innerHTML =
        '<div class="status-card status-waiting">' +
          '<div class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>' +
          '<div class="status-content"><strong>Awaiting upload</strong>Select a file and click "Upload to S3" to begin.</div>' +
        '</div>';
    }
  });

  fileList.appendChild(li);
  updateFileCount();
  showPreview(file);
}

function showPreview(file) {
  const name = (file?.name || '').toLowerCase();
  const isDocx = name.endsWith('.docx');
  const isTxt = name.endsWith('.txt');
  const isPdf = name.endsWith('.pdf');

  // Reset preview panes
  if (previewFrame) {
    previewFrame.style.display = 'none';
    previewFrame.src = '';
  }
  if (textPreview) {
    textPreview.style.display = 'none';
    textPreview.innerHTML = '';
  }

  // DOCX: convert to HTML in-browser (via mammoth)
  if (isDocx) {
    if (previewEmpty) {
      previewEmpty.style.display = '';
      const p = previewEmpty.querySelector('p');
      if (p) p.textContent = 'Loading DOCX preview...';
    }
    uploadBtn.disabled = false;
    setStatus('waiting', 'Ready to upload', `${file.name} (${formatFileSize(file.size)})`, false);

    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const arrayBuffer = e.target.result;
        if (!window.mammoth) throw new Error('DOCX renderer failed to load (mammoth)');

        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        const html = result?.value || '';

        if (previewEmpty) previewEmpty.style.display = 'none';
        if (textPreview) {
          textPreview.style.display = 'block';
          textPreview.innerHTML = html || '<p><em>No text found in DOCX.</em></p>';
        }
      } catch (err) {
        console.error(err);
        if (previewEmpty) {
          previewEmpty.style.display = '';
          const p = previewEmpty.querySelector('p');
          if (p) p.textContent = 'Could not preview DOCX. Please upload and process.';
        }
      }
    };
    reader.readAsArrayBuffer(file);
    return;
  }

  // TXT: show plain text (no iframe downloads)
  if (isTxt) {
    if (previewEmpty) {
      previewEmpty.style.display = '';
      const p = previewEmpty.querySelector('p');
      if (p) p.textContent = 'Loading text preview...';
    }
    uploadBtn.disabled = false;
    setStatus('waiting', 'Ready to upload', file.name + ' (' + formatFileSize(file.size) + ')', false);

    const reader = new FileReader();
    reader.onload = function () {
      const text = String(reader.result || '');
      if (previewEmpty) previewEmpty.style.display = 'none';
      if (textPreview) {
        textPreview.style.display = 'block';
        // Escape HTML
        textPreview.innerHTML = '<pre style="white-space: pre-wrap; margin: 0;"></pre>';
        textPreview.querySelector('pre').textContent = text;
      }
    };
    reader.readAsText(file);
    return;
  }

  // PDF (and other browser-viewable types): use iframe
  const objectUrl = URL.createObjectURL(file);
  previewFrame.src = objectUrl;
  previewFrame.style.display = 'block';
  if (previewEmpty) previewEmpty.style.display = 'none';
  uploadBtn.disabled = false;
  setStatus('waiting', 'Ready to upload', file.name + ' (' + formatFileSize(file.size) + ')', false);
}

fileInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  handleFile(file);
  fileInput.value = '';
});

// --- S3 UPLOAD ---

uploadBtn.addEventListener('click', function () {
  if (!currentFile) return;

  setStatus('uploading', 'Uploading...', currentFile.name, true);
  uploadBtn.disabled = true;
  const safeName = currentFile.name.replace(/\s+/g, "_");

// generate unique filename
const uniqueId = Date.now() + "_" + Math.floor(Math.random() * 10000);

const key = 'uploads/' + uniqueId + "_" + safeName;

const params = {
  Key: key,
  Body: currentFile,
  ContentType: currentFile.type,
};

  const managedUpload = s3.upload(params);

  managedUpload.on('httpUploadProgress', function (evt) {
    if (evt.total) {
      const pct = Math.round((evt.loaded / evt.total) * 100);
      const progressBar = document.getElementById('upload-progress');
      if (progressBar) {
        progressBar.classList.remove('indeterminate');
        progressBar.style.width = pct + '%';
      }
    }
  });

  managedUpload.send(function (err, data) {
    if (err) {
      console.error(err);
      setStatus('error', 'Upload Failed', err.message, false);
      uploadBtn.disabled = false;
    } else {
      // Move file to S3 list with checkbox
      addS3File({
  name: safeName,
  size: currentFile.size,
  key: key,
  location: data.Location
});

      setStatus('success', 'Upload Complete', '<small>' + data.Location + '</small>', false);

      // Clear current file and input list
      fileList.innerHTML = '';
      updateFileCount();
      currentFile = null;
      previewFrame.style.display = 'none';
      if (previewEmpty) previewEmpty.style.display = '';
      uploadBtn.disabled = true;
    }
  });
});

// --- S3 FILE MANAGEMENT ---

function addS3File(fileObj) {
  s3Files.push(fileObj);

  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'file-checkbox';
  checkbox.dataset.key = String(fileObj.key);
  const handleAutoPreview = async function () {
    try {
      const checkedBoxes = document.querySelectorAll('#s3-file-list input[type="checkbox"]:checked');
      if (checkedBoxes.length === 1) {
        const key = checkedBoxes[0].dataset.key;
        await previewS3Key(key);
      } else if (checkedBoxes.length === 0) {
        // No selection: clear preview back to empty state
        _clearPreviewToEmpty('Select a file to preview.');
        setStatus('waiting', 'Ready', 'Select a file to preview or process.', false);
      }
    } catch (e) {
      console.error(e);
      setStatus('error', 'Preview failed', e.message || String(e), false);
    } finally {
      updateProcessButtonState();
    }
  };

  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      li.classList.add('selected');
    } else {
      li.classList.remove('selected');
    }
    updateProcessButtonState();
    // Auto-preview only when exactly one file is selected
    handleAutoPreview();
  });

  // Clicking the row toggles selection (and triggers auto-preview via change handler)
  li.addEventListener('click', function (e) {
    if (e.target === checkbox) return;
    // If already selected and it's the only selected item, treat click as "close preview"
    const checkedBoxes = document.querySelectorAll('#s3-file-list input[type="checkbox"]:checked');
    if (checkbox.checked && checkedBoxes.length === 1) {
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  });

  li.appendChild(checkbox);

  const iconSpan = document.createElement('span');
  iconSpan.className = 'file-icon';
  iconSpan.innerHTML = getFileExtIcon(fileObj.name);
  li.appendChild(iconSpan);

  const nameSpan = document.createElement('span');
  nameSpan.className = 'file-name';
  nameSpan.textContent = fileObj.name;
  li.appendChild(nameSpan);

  const sizeSpan = document.createElement('span');
  sizeSpan.className = 'file-size';
  sizeSpan.textContent = formatFileSize(fileObj.size);
  li.appendChild(sizeSpan);

  s3FileList.appendChild(li);
  updateS3Count();
  updateProcessButtonState();
}

function updateProcessButtonState() {
  const checkedBoxes = document.querySelectorAll('#s3-file-list input[type="checkbox"]:checked');
  processBtn.disabled = checkedBoxes.length === 0;
}

function _clearPreviewToEmpty(message) {
  if (previewFrame) {
    previewFrame.style.display = 'none';
    previewFrame.src = '';
  }
  if (textPreview) {
    textPreview.style.display = 'none';
    textPreview.innerHTML = '';
  }
  if (previewEmpty) {
    previewEmpty.style.display = '';
    const p = previewEmpty.querySelector('p');
    if (p) p.textContent = message || 'Select a file to preview.';
  }
  if (downloadPdfBtn) downloadPdfBtn.style.display = 'none';
}

function _renderText(text) {
  if (previewEmpty) previewEmpty.style.display = 'none';
  if (previewFrame) {
    previewFrame.style.display = 'none';
    previewFrame.src = '';
  }
  if (textPreview) {
    textPreview.style.display = 'block';
    textPreview.innerHTML = '<pre style="white-space: pre-wrap; margin: 0;"></pre>';
    textPreview.querySelector('pre').textContent = text || '';
  }
}

function _renderHtml(html) {
  if (previewEmpty) previewEmpty.style.display = 'none';
  if (previewFrame) {
    previewFrame.style.display = 'none';
    previewFrame.src = '';
  }
  if (textPreview) {
    textPreview.style.display = 'block';
    textPreview.innerHTML = html || '<p><em>No content.</em></p>';
  }
}

function _renderPdfFromBytes(bytes) {
  if (previewEmpty) previewEmpty.style.display = 'none';
  if (textPreview) {
    textPreview.style.display = 'none';
    textPreview.innerHTML = '';
  }
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  if (previewFrame) {
    previewFrame.style.display = 'block';
    previewFrame.src = url;
  }
  if (downloadPdfBtn) {
    downloadPdfBtn.style.display = 'flex';
    downloadPdfBtn.onclick = function () {
      window.open(url, "_blank");
    };
  }
}

function _s3GetObjectBytes(key) {
  return new Promise((resolve, reject) => {
    s3.getObject({ Key: key }, function (err, data) {
      if (err) return reject(err);
      // data.Body is Buffer-like (Uint8Array) in browser SDK
      resolve(data.Body);
    });
  });
}

async function previewS3Key(key) {
  const lowerKey = String(key || '').toLowerCase();
  const ext = lowerKey.split('.').pop();

  _clearPreviewToEmpty('Loading preview...');
  setStatus('uploading', 'Loading preview...', key, true);

  const body = await _s3GetObjectBytes(key);
  const bytes = body instanceof Uint8Array ? body : new Uint8Array(body);

  if (ext === 'txt') {
    const text = new TextDecoder('utf-8').decode(bytes);
    _renderText(text);
    setStatus('success', 'Preview ready', 'Text loaded.', false);
    return;
  }

  if (ext === 'docx') {
    if (!window.mammoth) throw new Error('DOCX renderer failed to load (mammoth)');
    const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    const result = await window.mammoth.convertToHtml({ arrayBuffer });
    _renderHtml(result?.value || '');
    setStatus('success', 'Preview ready', 'DOCX rendered as HTML.', false);
    return;
  }

  if (ext === 'pdf') {
    _renderPdfFromBytes(bytes);
    setStatus('success', 'Preview ready', 'PDF loaded.', false);
    return;
  }

  _clearPreviewToEmpty('Preview not supported for this file type.');
  setStatus('waiting', 'Ready', 'Preview not supported for this file type.', false);
}

// --- MODAL & DOCUMENT TYPE SELECTION ---

const docTypeModal = document.getElementById('doc-type-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalGenerateBtn = document.getElementById('modal-generate-btn');
const docTypeCards = document.querySelectorAll('.doc-type-card');

let selectedDocType = null;
let filesToProcess = [];

// Show modal when "Process Selected" is clicked
processBtn.addEventListener('click', function () {

  const checkedBoxes = document.querySelectorAll('#s3-file-list input[type="checkbox"]:checked');

  if (checkedBoxes.length === 0) {
    setStatus('error','No file selected','Please select a file before processing.',false);
    return;
  }

  filesToProcess = Array.from(checkedBoxes).map(cb => cb.dataset.key);

  console.log("Files to process:", filesToProcess);

  selectedDocType = null;

  docTypeCards.forEach(card => card.classList.remove('selected'));
  modalGenerateBtn.disabled = true;

  docTypeModal.style.display = 'flex';
});

// Close modal
function closeDocTypeModal() {
  docTypeModal.style.display = 'none';
}

modalCloseBtn.addEventListener('click', closeDocTypeModal);
modalCancelBtn.addEventListener('click', closeDocTypeModal);
modalOverlay.addEventListener('click', closeDocTypeModal);

// Select document type
docTypeCards.forEach(card => {
  card.addEventListener('click', function() {
    docTypeCards.forEach(c => c.classList.remove('selected'));
    this.classList.add('selected');
    selectedDocType = this.dataset.type;
    modalGenerateBtn.disabled = false;
  });
});

// Generate document after type selection
modalGenerateBtn.addEventListener('click', async function () {
  if (!selectedDocType || filesToProcess.length === 0) return;

  closeDocTypeModal();

  setStatus('uploading', 'Processing documents...', 'Sending to AI engine', true);
  processBtn.disabled = true;

  try {
    const documentType = selectedDocType || "nda";

for (const key of filesToProcess) {

  console.log("Processing:", key);

  const response = await fetch(API_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": idToken
    },
    body: JSON.stringify({
  s3_key: key,
  doc_type: documentType
})
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMsg = errorData.error || response.statusText;
    throw new Error(`Backend Error: ${errorMsg}`);
  }

  const data = await response.json();

draftedDocs.push({
  title: documentType.toUpperCase(),
  summary: "AI-generated legal document",
  pdf_url: data.pdf_url,
  latex_code: data.latex
});
}

renderDraftedDocuments();

filesToProcess = [];
selectedDocType = null;

setStatus('success', 'Processing Complete', 'Document drafted successfully', false);
  } catch (error) {
    console.error(error);

    // Check for token limit errors
    const errorMsg = error.message.toLowerCase();
    if (errorMsg.includes('token') || errorMsg.includes('limit') || errorMsg.includes('size') || errorMsg.includes('too large')) {
      setStatus('error', 'Token Limit Reached', 'The uploaded document exceeds the maximum word limit allowed by the Gemini AI engine. Please upload a shorter document or split your text.', false);
    } else {
      setStatus('error', 'Processing Failed', error.message, false);
    }
  }

  updateProcessButtonState();
});


function renderDraftedDocuments() {
  draftedDocsContainer.innerHTML = '';

  draftedDocs.forEach((doc, index) => {
    const card = document.createElement('div');
    card.className = 'drafted-doc-card';
    card.innerHTML = `
      <div class="drafted-doc-header">
        <div class="drafted-doc-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
            <path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div class="drafted-doc-title">${doc.title}</div>
          <div class="drafted-doc-summary">${doc.summary}</div>
        </div>
      </div>
    `;

    card.addEventListener('click', function () {
      // Clicking the same drafted document toggles the preview off.
      if (activeDraftedDocIndex === index) {
        activeDraftedDocIndex = null;
        document.querySelectorAll('.drafted-doc-card').forEach(c => c.classList.remove('active', 'expanded'));
        _clearPreviewToEmpty('Select a file to preview.');
        setStatus('waiting', 'Ready', 'Select a file to preview or process.', false);
        return;
      }

      activeDraftedDocIndex = index;
      document.querySelectorAll('.drafted-doc-card').forEach(c => c.classList.remove('active', 'expanded'));
      card.classList.add('active', 'expanded');
      renderLatexInMiddlePanel(doc);
    });

    draftedDocsContainer.appendChild(card);
  });
}

function renderLatexInMiddlePanel(doc) {

  // hide latex renderer
  latexRenderContainer.style.display = 'none';

  // show pdf preview
  previewFrame.style.display = 'block';
  previewFrame.src = doc.pdf_url;

  if (previewEmpty) previewEmpty.style.display = 'none';

  // enable download button
  downloadPdfBtn.style.display = 'flex';
  downloadPdfBtn.onclick = function () {
    window.open(doc.pdf_url, "_blank");
  };
}

// --- DOWNLOAD PDF ---

downloadPdfBtn.addEventListener('click', function () {

  const activeDoc = draftedDocs.find(doc => doc.pdf_url);

  if (!activeDoc) return;

  window.open(activeDoc.pdf_url, "_blank");

});

// --- LOGOUT ---

function logout() {
  window.location.href = "index.html";
}

// Initialize
updateProcessButtonState();
