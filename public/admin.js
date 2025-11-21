// API Base URL
const API_BASE = 'http://localhost:3002/api';
let authToken = localStorage.getItem('authToken') || '';
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

document.addEventListener('DOMContentLoaded', () => {
    if (authToken && currentUser.id && currentUser.role === 'admin') {
        showApp();
        loadDashboard();
    } else {
        showLogin();
    }
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(item.dataset.section);
        });
    });

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
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
        if (response.ok && data.user.role === 'admin') {
            authToken = data.access_token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showApp();
            loadDashboard();
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = 'Chỉ admin mới được đăng nhập ở đây. User vui lòng vào trang user.';
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

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    const section = document.getElementById(sectionName);
    if (section) section.classList.add('active');
    
    const navItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (navItem) navItem.classList.add('active');

    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
        case 'teams':
            loadTeams();
            break;
        case 'statistics':
            loadStatistics();
            break;
    }
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

// Dashboard
async function loadDashboard() {
    try {
        const overview = await apiCall('/statistics/overview');
        
        document.getElementById('stat-teams').textContent = overview.summary?.totalTeams || 0;
        document.getElementById('stat-users').textContent = overview.summary?.totalUsers || 0;
        document.getElementById('stat-records').textContent = overview.summary?.totalRecords || 0;

        const totalsDiv = document.getElementById('totals-display');
        const summary = overview.summary || {};
        totalsDiv.innerHTML = `
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
                        <h3>${summary.grandTotal || 0}</h3>
                        <p>Tổng cộng</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Users
let allTeams = [];

async function loadUsers() {
    try {
        const users = await apiCall('/users');
        allTeams = await apiCall('/teams');
        renderUsersTable(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Không có tài khoản nào</td></tr>';
        return;
    }
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.team ? user.team.teamName : '-'}</td>
            <td><span class="badge ${user.role === 'admin' ? 'badge-info' : 'badge-success'}">${user.role === 'admin' ? 'Admin' : 'User'}</span></td>
            <td>${user.email || '-'}</td>
            <td><span class="badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}">${user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function openUserModal(id = null) {
    await loadUsers();
    
    const modal = createModal(id ? 'Sửa Tài khoản' : 'Thêm Tài khoản', getUserModalContent(id));
    document.getElementById('modal-overlay').appendChild(modal);
    document.getElementById('modal-overlay').classList.add('active');

    const teamSelect = document.getElementById('user-teamId');
    if (teamSelect) {
        teamSelect.innerHTML = '<option value="">-- Không chọn --</option>';
        allTeams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = `${team.teamCode} - ${team.teamName}`;
            teamSelect.appendChild(option);
        });
    }

    if (id) {
        await loadUserData(id);
    }

    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveUser(id);
    });
}

function getUserModalContent(id) {
    return `
        <form id="user-form">
            <div class="form-grid">
                <div class="form-group form-group-full">
                    <label>Username *</label>
                    <input type="text" id="user-username" required>
                </div>
                <div class="form-group form-group-full">
                    <label>Họ và tên *</label>
                    <input type="text" id="user-fullName" required>
                </div>
                <div class="form-group">
                    <label>Password ${id ? '(để trống nếu không đổi)' : '*'}</label>
                    <input type="password" id="user-password" ${id ? '' : 'required'}>
                </div>
                <div class="form-group">
                    <label>Vai trò *</label>
                    <select id="user-role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Team</label>
                    <select id="user-teamId">
                        <option value="">-- Không chọn --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="user-email">
                </div>
                <div class="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" id="user-phone">
                </div>
                <div class="form-group">
                    <label>Trạng thái *</label>
                    <select id="user-status" required>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
        </form>
    `;
}

async function loadUserData(id) {
    try {
        const user = await apiCall(`/users/${id}`);
        document.getElementById('user-username').value = user.username;
        document.getElementById('user-fullName').value = user.fullName;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-phone').value = user.phone || '';
        document.getElementById('user-status').value = user.status;
        if (user.teamId) {
            document.getElementById('user-teamId').value = user.teamId;
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

async function saveUser(id) {
    const data = {
        username: document.getElementById('user-username').value,
        fullName: document.getElementById('user-fullName').value,
        role: document.getElementById('user-role').value,
        email: document.getElementById('user-email').value || undefined,
        phone: document.getElementById('user-phone').value || undefined,
        status: document.getElementById('user-status').value,
        teamId: document.getElementById('user-teamId').value || undefined,
    };

    const password = document.getElementById('user-password').value;
    if (password) {
        data.password = password;
    }

    try {
        if (id) {
            await apiCall(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        } else {
            await apiCall('/users', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
        closeModal();
        loadUsers();
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboard();
        }
    } catch (error) {
        alert('Lỗi khi lưu: ' + (error.message || 'Unknown error'));
    }
}

async function editUser(id) {
    openUserModal(id);
}

async function deleteUser(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
        try {
            await apiCall(`/users/${id}`, { method: 'DELETE' });
            loadUsers();
            if (document.getElementById('dashboard').classList.contains('active')) {
                loadDashboard();
            }
        } catch (error) {
            alert('Lỗi khi xóa');
        }
    }
}

// Teams
async function loadTeams() {
    try {
        const teams = await apiCall('/teams');
        renderTeamsTable(teams);
    } catch (error) {
        console.error('Error loading teams:', error);
    }
}

function renderTeamsTable(teams) {
    const tbody = document.getElementById('teams-tbody');
    tbody.innerHTML = '';
    if (teams.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không có team nào</td></tr>';
        return;
    }
    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.teamCode}</td>
            <td>${team.teamName}</td>
            <td>${team.description || '-'}</td>
            <td><span class="badge ${team.status === 'active' ? 'badge-success' : 'badge-danger'}">${team.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary" onclick="editTeam('${team.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTeam('${team.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function openTeamModal(id = null) {
    const modal = createModal(id ? 'Sửa Team' : 'Thêm Team', getTeamModalContent(id));
    document.getElementById('modal-overlay').appendChild(modal);
    document.getElementById('modal-overlay').classList.add('active');

    if (id) {
        await loadTeamData(id);
    }

    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTeam(id);
    });
}

function getTeamModalContent(id) {
    return `
        <form id="team-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Mã Team *</label>
                    <input type="text" id="team-teamCode" required>
                </div>
                <div class="form-group form-group-full">
                    <label>Tên Team *</label>
                    <input type="text" id="team-teamName" required>
                </div>
                <div class="form-group form-group-full">
                    <label>Mô tả</label>
                    <textarea id="team-description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Trạng thái *</label>
                    <select id="team-status" required>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
        </form>
    `;
}

async function loadTeamData(id) {
    try {
        const team = await apiCall(`/teams/${id}`);
        document.getElementById('team-teamCode').value = team.teamCode;
        document.getElementById('team-teamName').value = team.teamName;
        document.getElementById('team-description').value = team.description || '';
        document.getElementById('team-status').value = team.status;
    } catch (error) {
        console.error('Error loading team:', error);
    }
}

async function saveTeam(id) {
    const data = {
        teamCode: document.getElementById('team-teamCode').value,
        teamName: document.getElementById('team-teamName').value,
        description: document.getElementById('team-description').value || undefined,
        status: document.getElementById('team-status').value,
    };

    try {
        if (id) {
            await apiCall(`/teams/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        } else {
            await apiCall('/teams', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        }
        closeModal();
        loadTeams();
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboard();
        }
    } catch (error) {
        alert('Lỗi khi lưu: ' + (error.message || 'Unknown error'));
    }
}

async function editTeam(id) {
    openTeamModal(id);
}

async function deleteTeam(id) {
    if (confirm('Bạn có chắc chắn muốn xóa team này?')) {
        try {
            await apiCall(`/teams/${id}`, { method: 'DELETE' });
            loadTeams();
            if (document.getElementById('dashboard').classList.contains('active')) {
                loadDashboard();
            }
        } catch (error) {
            alert('Lỗi khi xóa');
        }
    }
}

// Statistics
async function loadStatistics() {
    const startDate = document.getElementById('stats-start-date')?.value || '';
    const endDate = document.getElementById('stats-end-date')?.value || '';
    const teamId = document.getElementById('stats-team')?.value || '';
    const content = document.getElementById('statistics-content');

    try {
        let stats;
        if (teamId) {
            stats = await apiCall(`/statistics/by-team?teamId=${teamId}&${startDate ? `startDate=${startDate}&` : ''}${endDate ? `endDate=${endDate}&` : ''}`);
        } else {
            stats = await apiCall(`/statistics/by-team?${startDate ? `startDate=${startDate}&` : ''}${endDate ? `endDate=${endDate}&` : ''}`);
        }

        const teams = Array.isArray(stats) ? stats : [stats];
        
        let html = '';
        teams.forEach(team => {
            html += `
                <div class="stats-table-container" style="margin-bottom: 2rem;">
                    <h3>${team.teamName} (${team.teamCode})</h3>
                    <p><strong>Số thành viên:</strong> ${team.totalMembers}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Thành viên</th>
                                <th>Đơn thuần</th>
                                <th>Hữu hiệu</th>
                                <th>Baptem</th>
                                <th>Thờ phượng</th>
                                <th>Laxaro</th>
                                <th>Tổng</th>
                                <th>Số bản ghi</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            team.byUser?.forEach(member => {
                html += `
                    <tr>
                        <td>${member.fullName}</td>
                        <td>${member.donThuan || 0}</td>
                        <td>${member.huuHieu || 0}</td>
                        <td>${member.baptem || 0}</td>
                        <td>${member.thoPhuong || 0}</td>
                        <td>${member.laxaro || 0}</td>
                        <td><strong>${member.total || 0}</strong></td>
                        <td>${member.recordCount || 0}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                        <tfoot>
                            <tr style="background: #f0f0f0; font-weight: bold;">
                                <td>TỔNG</td>
                                <td>${team.summary?.donThuan || 0}</td>
                                <td>${team.summary?.huuHieu || 0}</td>
                                <td>${team.summary?.baptem || 0}</td>
                                <td>${team.summary?.thoPhuong || 0}</td>
                                <td>${team.summary?.laxaro || 0}</td>
                                <td>${team.summary?.total || 0}</td>
                                <td>${team.summary?.recordCount || 0}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        });
        
        content.innerHTML = html;
        
        // Populate team dropdown
        if (!teamId) {
            const teams = await apiCall('/teams');
            const teamSelect = document.getElementById('stats-team');
            teamSelect.innerHTML = '<option value="">Tất cả Teams</option>';
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = `${team.teamCode} - ${team.teamName}`;
                teamSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
        content.innerHTML = '<p>Lỗi khi tải thống kê</p>';
    }
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

