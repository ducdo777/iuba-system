// API Base URL
const API_BASE = 'http://localhost:3002/api';
let authToken = localStorage.getItem('authToken') || '';
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

document.addEventListener('DOMContentLoaded', () => {
    if (authToken && currentUser.id) {
        showApp();
        loadData();
        loadTeamStats();
    } else {
        showLogin();
    }
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

function showLogin() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

function showApp() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    if (currentUser.fullName) {
        document.getElementById('user-name').textContent = currentUser.fullName;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok && data.user.role === 'user') {
            authToken = data.access_token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showApp();
            loadData();
            loadTeamStats();
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = 'Chỉ user mới được đăng nhập ở đây. Admin vui lòng vào trang admin.';
        }
    } catch (error) {
        errorDiv.textContent = 'Lỗi kết nối. Vui lòng thử lại.';
    }
}

function handleLogout() {
    authToken = '';
    currentUser = {};
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showLogin();
}

async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (response.status === 401) {
        handleLogout();
        throw new Error('Unauthorized');
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API Error');
    }
    return response.json();
}

async function loadData() {
    try {
        const data = await apiCall('/activity-data');
        renderDataTable(data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderDataTable(dataList) {
    const tbody = document.getElementById('data-tbody');
    tbody.innerHTML = '';
    if (dataList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Chưa có dữ liệu</td></tr>';
        return;
    }
    dataList.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(data.date)}</td>
            <td>${data.donThuan || 0}</td>
            <td>${data.huuHieu || 0}</td>
            <td>${data.baptem || 0}</td>
            <td>${data.thoPhuong || 0}</td>
            <td>${data.laxaro || 0}</td>
            <td>${data.notes || '-'}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary" onclick="editData('${data.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteData('${data.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openDataModal(id = null) {
    const modal = createModal(id ? 'Sửa dữ liệu' : 'Thêm dữ liệu', getDataModalContent(id));
    document.getElementById('modal-overlay').appendChild(modal);
    document.getElementById('modal-overlay').classList.add('active');

    if (id) {
        loadDataItem(id);
    } else {
        document.getElementById('data-date').value = new Date().toISOString().split('T')[0];
    }

    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveData(id);
    });
}

function getDataModalContent(id) {
    return `
        <form id="data-form">
            <div class="form-grid">
                <div class="form-group form-group-full">
                    <label>Ngày *</label>
                    <input type="date" id="data-date" required>
                </div>
                <div class="form-group">
                    <label>Đơn thuần *</label>
                    <input type="number" id="data-donThuan" min="0" value="0" required>
                </div>
                <div class="form-group">
                    <label>Hữu hiệu *</label>
                    <input type="number" id="data-huuHieu" min="0" value="0" required>
                </div>
                <div class="form-group">
                    <label>Baptem *</label>
                    <input type="number" id="data-baptem" min="0" value="0" required>
                </div>
                <div class="form-group">
                    <label>Thờ phượng *</label>
                    <input type="number" id="data-thoPhuong" min="0" value="0" required>
                </div>
                <div class="form-group">
                    <label>Laxaro *</label>
                    <input type="number" id="data-laxaro" min="0" value="0" required>
                </div>
                <div class="form-group form-group-full">
                    <label>Ghi chú</label>
                    <textarea id="data-notes" rows="3"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
        </form>
    `;
}

async function loadDataItem(id) {
    try {
        const data = await apiCall(`/activity-data/${id}`);
        document.getElementById('data-date').value = data.date;
        document.getElementById('data-donThuan').value = data.donThuan || 0;
        document.getElementById('data-huuHieu').value = data.huuHieu || 0;
        document.getElementById('data-baptem').value = data.baptem || 0;
        document.getElementById('data-thoPhuong').value = data.thoPhuong || 0;
        document.getElementById('data-laxaro').value = data.laxaro || 0;
        document.getElementById('data-notes').value = data.notes || '';
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function saveData(id) {
    const data = {
        date: document.getElementById('data-date').value,
        donThuan: parseInt(document.getElementById('data-donThuan').value) || 0,
        huuHieu: parseInt(document.getElementById('data-huuHieu').value) || 0,
        baptem: parseInt(document.getElementById('data-baptem').value) || 0,
        thoPhuong: parseInt(document.getElementById('data-thoPhuong').value) || 0,
        laxaro: parseInt(document.getElementById('data-laxaro').value) || 0,
        notes: document.getElementById('data-notes').value || undefined,
    };

    try {
        if (id) {
            await apiCall(`/activity-data/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        } else {
            await apiCall('/activity-data', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
        closeModal();
        loadData();
        loadTeamStats();
    } catch (error) {
        alert('Lỗi khi lưu: ' + (error.message || 'Unknown error'));
    }
}

async function editData(id) {
    openDataModal(id);
}

async function deleteData(id) {
    if (confirm('Bạn có chắc chắn muốn xóa dữ liệu này?')) {
        try {
            await apiCall(`/activity-data/${id}`, { method: 'DELETE' });
            loadData();
            loadTeamStats();
        } catch (error) {
            alert('Lỗi khi xóa');
        }
    }
}

async function loadTeamStats() {
    try {
        const stats = await apiCall('/statistics/my-team');
        renderTeamStats(stats);
        if (stats && stats.teamName) {
            document.getElementById('team-name').textContent = stats.teamName;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function renderTeamStats(stats) {
    const div = document.getElementById('team-stats');
    if (!stats) {
        div.innerHTML = '<p>Chưa có thống kê</p>';
        return;
    }

    const summary = stats.summary || {};
    div.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fas fa-hand-holding-heart"></i></div>
                <div class="stat-info">
                    <h3>${summary.donThuan || 0}</h3>
                    <p>Đơn thuần</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info">
                    <h3>${summary.huuHieu || 0}</h3>
                    <p>Hữu hiệu</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fas fa-water"></i></div>
                <div class="stat-info">
                    <h3>${summary.baptem || 0}</h3>
                    <p>Baptem</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fas fa-praying-hands"></i></div>
                <div class="stat-info">
                    <h3>${summary.thoPhuong || 0}</h3>
                    <p>Thờ phượng</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fas fa-heart"></i></div>
                <div class="stat-info">
                    <h3>${summary.laxaro || 0}</h3>
                    <p>Laxaro</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fas fa-list"></i></div>
                <div class="stat-info">
                    <h3>${summary.total || 0}</h3>
                    <p>Tổng cộng</p>
                </div>
            </div>
        </div>
    `;
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            ${content}
        </div>
    `;
    return modal;
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    overlay.innerHTML = '';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}
