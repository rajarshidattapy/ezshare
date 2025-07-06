// API Base URL
const API_BASE = '/api';

// State management
let currentUser = null;
let selectedFiles = new Set();
let uploadedFiles = [];

// DOM elements
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const userMenu = document.getElementById('user-menu');
const userName = document.getElementById('user-name');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const filesGrid = document.getElementById('files-grid');
const selectAllBtn = document.getElementById('select-all-btn');
const downloadSelectedBtn = document.getElementById('download-selected-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const toastContainer = document.getElementById('toast-container');
const logoutBtn = document.getElementById('logout-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    const token = localStorage.getItem('access_token');
    if (token) {
        // Validate token and load user data
        validateToken(token).then(valid => {
            if (valid) {
                showMainSection();
                loadUserData();
            } else {
                showAuthSection();
            }
        });
    } else {
        showAuthSection();
    }
}

function setupEventListeners() {
    // Auth tabs
    loginTab.addEventListener('click', () => switchTab('login'));
    registerTab.addEventListener('click', () => switchTab('register'));
    
    // Auth forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Upload functionality
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    uploadBtn.addEventListener('click', handleUpload);
    
    // File management
    selectAllBtn.addEventListener('click', handleSelectAll);
    downloadSelectedBtn.addEventListener('click', handleDownloadSelected);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            showToast('Login successful!', 'success');
            showMainSection();
            loadUserData();
        } else {
            showToast(data.detail || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById('register-first-name').value;
    const lastName = document.getElementById('register-last-name').value;
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (password !== passwordConfirm) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                username,
                email,
                password,
                password_confirm: passwordConfirm
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            showToast('Registration successful!', 'success');
            showMainSection();
            loadUserData();
        } else {
            const errorMsg = Object.values(data).flat().join(', ');
            showToast(errorMsg || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function validateToken(token) {
    try {
        const response = await fetch(`${API_BASE}/auth/profile/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch {
        return false;
    }
}

function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    currentUser = null;
    selectedFiles.clear();
    uploadedFiles = [];
    showAuthSection();
    showToast('Logged out successfully', 'success');
}

// UI functions
function showAuthSection() {
    authSection.style.display = 'flex';
    mainSection.style.display = 'none';
    userMenu.style.display = 'none';
}

function showMainSection() {
    authSection.style.display = 'none';
    mainSection.style.display = 'block';
    userMenu.style.display = 'flex';
}

function switchTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
    }
}

function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// User data functions
async function loadUserData() {
    const token = localStorage.getItem('access_token');
    
    try {
        // Load user profile
        const profileResponse = await fetch(`${API_BASE}/auth/profile/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (profileResponse.ok) {
            currentUser = await profileResponse.json();
            userName.textContent = `${currentUser.first_name} ${currentUser.last_name}`;
        }
        
        // Load user stats
        const statsResponse = await fetch(`${API_BASE}/files/stats/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            document.getElementById('total-files').textContent = stats.total_files;
            document.getElementById('total-size').textContent = `${stats.total_size_mb} MB`;
            document.getElementById('total-downloads').textContent = stats.total_downloads;
        }
        
        // Load user files
        loadUserFiles();
        
    } catch (error) {
        showToast('Error loading user data', 'error');
    }
}

async function loadUserFiles() {
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch(`${API_BASE}/files/my-files/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            uploadedFiles = await response.json();
            renderFiles();
        }
    } catch (error) {
        showToast('Error loading files', 'error');
    }
}

// File upload functions
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        showUploadButton(files);
    }
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        showUploadButton(files);
    }
}

function showUploadButton(files) {
    uploadBtn.style.display = 'block';
    uploadBtn.textContent = `Upload ${files.length} file${files.length > 1 ? 's' : ''}`;
}

async function handleUpload() {
    const files = fileInput.files;
    if (files.length === 0) return;
    
    const formData = new FormData();
    for (let file of files) {
        formData.append('files', file);
    }
    
    const token = localStorage.getItem('access_token');
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/files/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message, 'success');
            fileInput.value = '';
            uploadBtn.style.display = 'none';
            loadUserData(); // Refresh data
        } else {
            showToast('Upload failed', 'error');
        }
    } catch (error) {
        showToast('Network error during upload', 'error');
    } finally {
        showLoading(false);
    }
}

// File management functions
function renderFiles() {
    if (uploadedFiles.length === 0) {
        filesGrid.innerHTML = `
            <div class="empty-state">
                <h3>No files uploaded yet</h3>
                <p>Start by uploading some files using the upload area above</p>
            </div>
        `;
        return;
    }
    
    filesGrid.innerHTML = uploadedFiles.map(file => `
        <div class="file-card" data-file-id="${file.id}">
            <input type="checkbox" class="file-checkbox" data-file-id="${file.id}">
            <div class="file-header">
                <div class="file-icon">${getFileIcon(file.content_type)}</div>
                <div class="file-info">
                    <h3>${file.original_name}</h3>
                    <p>${file.file_size_mb} MB • ${file.content_type}</p>
                </div>
            </div>
            <div class="file-meta">
                <span>Uploaded: ${new Date(file.upload_date).toLocaleDateString()}</span>
                <span>Downloads: ${file.download_count}</span>
            </div>
            <div class="file-actions">
                <button class="btn-icon download" onclick="downloadFile(${file.id})">
                    📥 Download
                </button>
                <button class="btn-icon delete" onclick="deleteFile(${file.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.file-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleFileSelection);
    });
}

function getFileIcon(contentType) {
    if (contentType.startsWith('image/')) return '🖼️';
    if (contentType.startsWith('video/')) return '🎥';
    if (contentType.startsWith('audio/')) return '🎵';
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('document') || contentType.includes('word')) return '📝';
    if (contentType.includes('spreadsheet') || contentType.includes('excel')) return '📊';
    if (contentType.includes('zip') || contentType.includes('archive')) return '📦';
    return '📁';
}

function handleFileSelection(e) {
    const fileId = parseInt(e.target.dataset.fileId);
    const fileCard = e.target.closest('.file-card');
    
    if (e.target.checked) {
        selectedFiles.add(fileId);
        fileCard.classList.add('selected');
    } else {
        selectedFiles.delete(fileId);
        fileCard.classList.remove('selected');
    }
    
    updateSelectionUI();
}

function updateSelectionUI() {
    const hasSelection = selectedFiles.size > 0;
    downloadSelectedBtn.style.display = hasSelection ? 'block' : 'none';
    downloadSelectedBtn.textContent = `Download Selected (${selectedFiles.size})`;
}

function handleSelectAll() {
    const checkboxes = document.querySelectorAll('.file-checkbox');
    const allSelected = selectedFiles.size === uploadedFiles.length;
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allSelected;
        const fileId = parseInt(checkbox.dataset.fileId);
        const fileCard = checkbox.closest('.file-card');
        
        if (!allSelected) {
            selectedFiles.add(fileId);
            fileCard.classList.add('selected');
        } else {
            selectedFiles.delete(fileId);
            fileCard.classList.remove('selected');
        }
    });
    
    updateSelectionUI();
    selectAllBtn.textContent = allSelected ? 'Select All' : 'Deselect All';
}

async function downloadFile(fileId) {
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch(`${API_BASE}/files/download/${fileId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = ''; // Filename will be set by Content-Disposition header
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Refresh stats
            loadUserData();
        } else {
            showToast('Download failed', 'error');
        }
    } catch (error) {
        showToast('Network error during download', 'error');
    }
}

async function handleDownloadSelected() {
    if (selectedFiles.size === 0) return;
    
    const token = localStorage.getItem('access_token');
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/files/download-multiple/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_ids: Array.from(selectedFiles)
            })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'files.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Clear selection
            selectedFiles.clear();
            document.querySelectorAll('.file-checkbox').forEach(cb => cb.checked = false);
            document.querySelectorAll('.file-card').forEach(card => card.classList.remove('selected'));
            updateSelectionUI();
            
            // Refresh stats
            loadUserData();
        } else {
            showToast('Download failed', 'error');
        }
    } catch (error) {
        showToast('Network error during download', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    const token = localStorage.getItem('access_token');
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/files/delete/${fileId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showToast('File deleted successfully', 'success');
            loadUserData(); // Refresh data
        } else {
            showToast('Delete failed', 'error');
        }
    } catch (error) {
        showToast('Network error during delete', 'error');
    } finally {
        showLoading(false);
    }
}