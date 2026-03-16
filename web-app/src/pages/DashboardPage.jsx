import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import APP_CONFIG from '../config';
import Navbar from '../components/Navbar';
import HeroCanvas from '../three/HeroCanvas';
import ProcessingPipeline from '../components/ProcessingPipeline';
import './DashboardPage.css';

import mammoth from 'mammoth';

/* ── SVG Icons ── */
const UploadCloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const FileTextIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);
const FilePdfIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
);
const FileDocIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>
);
const PaperclipIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const CloudUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><circle cx="12" cy="12" r="1"/><path d="M12 1v6m0 6v6"/><path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"/><path d="M1 12h6m6 0h6"/><path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>
);
const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} className="icon-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

/* Doc type icons — all SVG */
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const HandshakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ContractIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function FileIcon({ name, size = 16 }) {
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return <FilePdfIcon size={size} />;
  if (ext === 'docx' || ext === 'doc') return <FileDocIcon size={size} />;
  if (ext === 'txt') return <FileTextIcon size={size} />;
  return <PaperclipIcon size={size} />;
}

const DOC_TYPES = [
  { type: 'nda', label: 'NDA', desc: 'Non-Disclosure Agreement', icon: <ShieldIcon /> },
  { type: 'mou', label: 'MOU', desc: 'Memorandum of Understanding', icon: <HandshakeIcon /> },
  { type: 'service_agreement', label: 'Service', desc: 'Service Agreement', icon: <SettingsIcon /> },
  { type: 'partnership_agreement', label: 'Partnership', desc: 'Partnership Agreement', icon: <UsersIcon /> },
  { type: 'collaboration_agreement', label: 'Collaboration', desc: 'Collaboration Agreement', icon: <StarIcon /> },
  { type: 'contract', label: 'Contract', desc: 'General Contract', icon: <ContractIcon /> },
  { type: 'statement_of_agreement', label: 'Statement', desc: 'Statement of Agreement', icon: <MessageIcon /> },
  { type: 'meeting_resolution', label: 'Resolution', desc: 'Meeting Resolution', icon: <ClipboardIcon /> },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [localFiles, setLocalFiles] = useState([]);
  const [s3Files, setS3Files] = useState([]);
  const [selectedLocalId, setSelectedLocalId] = useState(null);
  const [selectedS3Keys, setSelectedS3Keys] = useState(new Set());
  const [activeTab, setActiveTab] = useState('upload');
  const [previewContent, setPreviewContent] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [draftedDocs, setDraftedDocs] = useState([]);
  const [activeDraftIdx, setActiveDraftIdx] = useState(null);
  const [pasteText, setPasteText] = useState('');

  const getS3 = useCallback(() => {
    if (!window.AWS) return null;
    window.AWS.config.region = APP_CONFIG.aws.region;
    window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
      IdentityPoolId: APP_CONFIG.aws.cognito.identityPoolId,
      Logins: { [`cognito-idp.${APP_CONFIG.aws.region}.amazonaws.com/${APP_CONFIG.aws.cognito.userPoolId}`]: user.idToken }
    });
    return new window.AWS.S3({ apiVersion: '2006-03-01', params: { Bucket: APP_CONFIG.aws.s3Bucket } });
  }, [user]);

  const handleFile = (file) => {
    if (!file) return;
    const id = Date.now() + '_' + Math.random().toString(36).slice(2);
    setLocalFiles(prev => [...prev, { file, id }]);
    setSelectedLocalId(id);
    previewLocal(file);
  };

  const previewLocal = async (file) => {
    setPreviewLoading(true);
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith('.pdf')) {
        setPreviewContent({ type: 'pdf', data: URL.createObjectURL(file) });
      } else if (name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer.slice(0) });
        let html = htmlResult?.value || '';
        const stripped = html.replace(/<[^>]*>/g, '').trim();
        if (!stripped) {
          const textResult = await mammoth.extractRawText({ arrayBuffer: arrayBuffer.slice(0) });
          const rawText = textResult?.value || '';
          setPreviewContent({ type: 'text', data: rawText.trim() || 'No text content found in this DOCX file.' });
        } else {
          setPreviewContent({ type: 'html', data: html });
        }
      } else if (name.endsWith('.txt')) {
        setPreviewContent({ type: 'text', data: await file.text() });
      } else {
        setPreviewContent({ type: 'text', data: 'Preview not supported for this file type.' });
      }
    } catch (err) {
      console.error(err);
      setPreviewContent({ type: 'text', data: 'Failed to generate preview.' });
    } finally {
      setPreviewLoading(false);
    }
  };

  const previewS3 = async (key) => {
    setPreviewLoading(true);
    try {
      const s3 = getS3();
      const data = await new Promise((resolve, reject) => {
        s3.getObject({ Key: key }, (err, d) => err ? reject(err) : resolve(d.Body));
      });
      const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
      const ext = key.split('.').pop().toLowerCase();
      if (ext === 'pdf') {
        setPreviewContent({ type: 'pdf', data: URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })) });
      } else if (ext === 'docx') {
        const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer.slice(0) });
        let html = htmlResult?.value || '';
        const stripped = html.replace(/<[^>]*>/g, '').trim();
        if (!stripped) {
          const textResult = await mammoth.extractRawText({ arrayBuffer: arrayBuffer.slice(0) });
          setPreviewContent({ type: 'text', data: textResult?.value || 'No text found.' });
        } else {
          setPreviewContent({ type: 'html', data: html });
        }
      } else if (ext === 'txt') {
        setPreviewContent({ type: 'text', data: new TextDecoder().decode(bytes) });
      }
      setUploadStatus({ type: 'success', title: 'Preview ready', message: '' });
    } catch (err) {
      setPreviewContent({ type: 'text', data: 'Failed to load preview: ' + err.message });
    } finally {
      setPreviewLoading(false);
    }
  };

  const toggleLocal = (entry) => {
    if (selectedLocalId === entry.id) { setSelectedLocalId(null); setPreviewContent(null); }
    else { setSelectedLocalId(entry.id); setSelectedS3Keys(new Set()); setActiveDraftIdx(null); previewLocal(entry.file); }
  };

  const toggleS3 = (key) => {
    const next = new Set(selectedS3Keys);
    if (next.has(key)) { next.delete(key); if (next.size === 0) setPreviewContent(null); else if (next.size === 1) previewS3([...next][0]); }
    else { next.add(key); if (next.size === 1) previewS3(key); }
    setSelectedS3Keys(next); setSelectedLocalId(null); setActiveDraftIdx(null);
  };

  const uploadToS3 = async () => {
    const entry = localFiles.find(e => e.id === selectedLocalId);
    if (!entry) return;
    setUploading(true);
    setUploadStatus({ type: 'uploading', title: 'Uploading...', message: entry.file.name });
    try {
      const s3 = getS3();
      const safeName = entry.file.name.replace(/\s+/g, '_');
      const key = 'uploads/' + Date.now() + '_' + Math.floor(Math.random() * 10000) + '_' + safeName;
      await new Promise((resolve, reject) => { s3.upload({ Key: key, Body: entry.file, ContentType: entry.file.type }, (err, data) => err ? reject(err) : resolve(data)); });
      setS3Files(prev => [...prev, { name: safeName, size: entry.file.size, key }]);
      setLocalFiles(prev => prev.filter(e => e.id !== selectedLocalId));
      setSelectedLocalId(null); setSelectedS3Keys(new Set([key]));
      setUploadStatus({ type: 'success', title: 'Upload Complete', message: key });
    } catch (err) {
      setUploadStatus({ type: 'error', title: 'Upload Failed', message: err.message });
    } finally { setUploading(false); }
  };

  const processFiles = async () => {
    if (!selectedDocType || selectedS3Keys.size === 0) return;
    setShowModal(false); setProcessing(true);
    setProcessingStep(0);
    setUploadStatus({ type: 'uploading', title: 'Processing...', message: 'Sending to AI engine' });
    try {
      for (const key of selectedS3Keys) {
        setProcessingStep(1);
        await new Promise(r => setTimeout(r, 400));
        setProcessingStep(2);
        const response = await fetch(APP_CONFIG.api.processUrl, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': user.idToken },
          body: JSON.stringify({ s3_key: key, doc_type: selectedDocType }),
        });
        setProcessingStep(3);
        if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || response.statusText); }
        const data = await response.json();
        setProcessingStep(4);
        await new Promise(r => setTimeout(r, 400));
        setDraftedDocs(prev => [...prev, { title: selectedDocType.toUpperCase(), summary: 'AI-generated legal document', pdf_url: data.pdf_url, latex_code: data.latex }]);
      }
      setUploadStatus({ type: 'success', title: 'Processing Complete', message: 'Document drafted successfully' });
    } catch (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes('token') || msg.includes('limit') || msg.includes('too large')) {
        setUploadStatus({ type: 'error', title: 'Token Limit Reached', message: 'Document exceeds max word limit. Upload a shorter document.' });
      } else { setUploadStatus({ type: 'error', title: 'Processing Failed', message: err.message }); }
    } finally { setProcessing(false); setSelectedDocType(null); setProcessingStep(-1); }
  };

  const addPastedText = () => {
    if (!pasteText.trim()) return;
    handleFile(new File([pasteText], `Pasted_Text_${Date.now()}.txt`, { type: 'text/plain' }));
    setPasteText(''); setActiveTab('upload');
    setUploadStatus({ type: 'success', title: 'Text Added', message: 'Pasted text added to documents list.' });
  };

  const toggleDraft = (idx) => {
    if (activeDraftIdx === idx) { setActiveDraftIdx(null); setPreviewContent(null); }
    else { setActiveDraftIdx(idx); setSelectedLocalId(null); setSelectedS3Keys(new Set()); setPreviewContent({ type: 'pdf', data: draftedDocs[idx].pdf_url }); }
  };

  const removeLocal = (id, e) => {
    e.stopPropagation();
    setLocalFiles(prev => prev.filter(e => e.id !== id));
    if (selectedLocalId === id) { setSelectedLocalId(null); setPreviewContent(null); }
  };

  // Cursor glow
  const dashRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (dashRef.current) {
      dashRef.current.style.setProperty('--mouse-x', e.clientX + 'px');
      dashRef.current.style.setProperty('--mouse-y', e.clientY + 'px');
    }
  }, []);

  // Upload pulse
  const [uploadPulse, setUploadPulse] = useState(false);
  const triggerPulse = () => { setUploadPulse(true); setTimeout(() => setUploadPulse(false), 700); };

  // Processing step
  const [processingStep, setProcessingStep] = useState(-1);

  return (
    <div className="dashboard" ref={dashRef} onMouseMove={handleMouseMove}>
      <div className="dash-cursor-glow" />
      <div className="dash-bg"><HeroCanvas style={{ opacity: 0.15 }} /></div>
      <Navbar />

      <div className="dash-layout">
        {/* LEFT PANEL */}
        <div className="dash-panel left-panel">
          <h2>Upload</h2>

          <div className="upload-tabs">
            <button className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>Upload File</button>
            <button className={`tab-btn ${activeTab === 'paste' ? 'active' : ''}`} onClick={() => setActiveTab('paste')}>Paste Text</button>
          </div>

          {activeTab === 'upload' && (
            <div className={`upload-zone ${uploadPulse ? 'pulse' : ''}`} onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
              onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); }}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); triggerPulse(); handleFile(e.dataTransfer.files[0]); }}
            >
              <div className="upload-icon"><UploadCloudIcon /></div>
              <div><strong>Click to browse</strong> or drag & drop</div>
              <div className="upload-hint">PDF, DOCX, TXT</div>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }}
                onChange={e => { handleFile(e.target.files[0]); e.target.value = ''; }} />
            </div>
          )}

          {activeTab === 'paste' && (
            <div>
              <textarea className="paste-area" placeholder="Paste your legal document text here..." value={pasteText} onChange={e => setPasteText(e.target.value)} />
              <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={addPastedText}><PlusIcon />Add as Text Document</button>
            </div>
          )}

          <div className="file-section-header">
            <h3>Documents</h3>
            <span className="file-count">{localFiles.length} files</span>
          </div>
          <ul className="file-list">
            {localFiles.map(entry => (
              <li key={entry.id} className={selectedLocalId === entry.id ? 'active' : ''} onClick={() => toggleLocal(entry)}>
                <span className="file-icon"><FileIcon name={entry.file.name} /></span>
                <span className="file-name">{entry.file.name}</span>
                <span className="file-size">{formatFileSize(entry.file.size)}</span>
                <button className="file-remove" onClick={e => removeLocal(entry.id, e)}><XIcon /></button>
              </li>
            ))}
          </ul>

          <div className="file-section-header">
            <h3>Uploaded to S3</h3>
            <span className="file-count">{s3Files.length} files</span>
          </div>
          <ul className="file-list">
            {s3Files.map(f => (
              <li key={f.key} className={selectedS3Keys.has(f.key) ? 'active' : ''} onClick={() => toggleS3(f.key)}>
                <input type="checkbox" checked={selectedS3Keys.has(f.key)} onChange={() => {}} className="file-checkbox" />
                <span className="file-icon"><FileIcon name={f.name} /></span>
                <span className="file-name">{f.name}</span>
                <span className="file-size">{formatFileSize(f.size)}</span>
              </li>
            ))}
          </ul>

          <div className="action-buttons">
            <button className="btn-ghost" disabled={!selectedLocalId || uploading} onClick={uploadToS3}>
              {uploading ? <><LoaderIcon />Uploading...</> : <><CloudUpIcon />Upload to S3</>}
            </button>
            <button className="btn-primary" disabled={selectedS3Keys.size === 0 || processing} onClick={() => setShowModal(true)}>
              {processing ? <><LoaderIcon />Processing...</> : <><SparklesIcon />Process Selected</>}
            </button>
          </div>
        </div>

        {/* MIDDLE PANEL */}
        <div className="dash-panel middle-panel">
          <div className="panel-top-bar">
            <h2>Preview</h2>
            {previewContent?.type === 'pdf' && (
              <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}
                onClick={() => window.open(previewContent.data, '_blank')}>
                <DownloadIcon />Download PDF
              </button>
            )}
          </div>
          <div className="preview-container">
            {previewLoading ? (
              <div className="preview-empty"><div className="preview-spinner"></div><p>Loading preview...</p></div>
            ) : previewContent ? (
              <>
                {previewContent.type === 'pdf' && <iframe src={previewContent.data} className="preview-iframe" title="PDF Preview" />}
                {previewContent.type === 'html' && <div className="preview-text" dangerouslySetInnerHTML={{ __html: previewContent.data }} />}
                {previewContent.type === 'text' && <div className="preview-text"><pre>{previewContent.data}</pre></div>}
              </>
            ) : (
              <div className="preview-empty">
                <div style={{ opacity: 0.2, marginBottom: 16 }}><FileTextIcon size={48} /></div>
                <p>Select a document to preview</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="dash-panel right-panel">
          <h2>Drafted Documents</h2>

          {uploadStatus && (
            <div className={`status-card status-${uploadStatus.type}`}>
              <strong>{uploadStatus.title}</strong>
              <span>{uploadStatus.message}</span>
              {uploadStatus.type === 'uploading' && <div className="progress-bar"><div className="progress-bar-fill" /></div>}
            </div>
          )}

          {/* Processing pipeline viz */}
          {processing && <ProcessingPipeline step={processingStep} />}

          <div className="drafted-list">
            {draftedDocs.map((doc, i) => (
              <div key={i} className={`drafted-card glow-border ${activeDraftIdx === i ? 'active' : ''}`} onClick={() => toggleDraft(i)}>
                <div className="drafted-icon"><ContractIcon /></div>
                <div>
                  <div className="drafted-title">{doc.title}</div>
                  <div className="drafted-summary">{doc.summary}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="info-card glass">
            <h4>Processing Options</h4>
            <div className="stat-row"><span>AI Engine</span><span className="stat-value">Gemini</span></div>
            <div className="stat-row"><span>Output</span><span className="stat-value">LaTeX → PDF</span></div>
            <div className="stat-row"><span>Formats</span><span className="stat-value">PDF, DOCX, TXT</span></div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Document Type</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><XIcon /></button>
            </div>
            <div className="doc-type-grid">
              {DOC_TYPES.map(dt => (
                <div key={dt.type} className={`doc-type-card glow-border ${selectedDocType === dt.type ? 'selected' : ''}`}
                  onClick={() => setSelectedDocType(dt.type)}>
                  <div className="dt-icon">{dt.icon}</div>
                  <div className="dt-label">{dt.label}</div>
                  <div className="dt-desc">{dt.desc}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" disabled={!selectedDocType} onClick={processFiles}>Generate Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
