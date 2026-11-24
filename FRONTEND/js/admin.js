// Check if user is admin on page load
const user = JSON.parse(localStorage.getItem('profile_user') || '{}');
if (user.role !== 'admin') {
    window.location.href = 'admin-login.html';
}

const token = localStorage.getItem('profile_token');
const API = ''; // Relative path since backend serves frontend

// Load dashboard data
async function loadDashboard() {
    try {
        // 1. Fetch Stats
        const statsRes = await fetch(`${API}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (statsRes.ok) {
            const stats = await statsRes.json();
            document.getElementById('statUsers').textContent = stats.userCount;
            document.getElementById('statResumes').textContent = stats.resumeCount;
            document.getElementById('statLogs').textContent = stats.logCount;
        }

        // 2. Fetch Users
        const usersRes = await fetch(`${API}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (usersRes.ok) {
            const users = await usersRes.json();
            const tbody = document.getElementById('userTableBody');
            tbody.innerHTML = '';

            users.forEach(u => {
                const tr = document.createElement('tr');
                const date = new Date(u.created_at).toLocaleDateString();
                tr.innerHTML = `
          <td>#${u.id}</td>
          <td>${u.full_name}</td>
          <td>${u.username}</td>
          <td><span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}">${u.role}</span></td>
          <td>${date}</td>
          <td>
            ${u.role !== 'admin' ? `<button class="btn-danger" onclick="deleteUser(${u.id})">Delete</button>` : '<span style="color:#aaa;font-size:12px;">Protected</span>'}
          </td>
        `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Failed to load admin dashboard:', err);
    }
}

// Delete a user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user? All their resumes will be lost.')) return;

    try {
        const res = await fetch(`${API}/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            alert('User deleted successfully.');
            loadDashboard(); // Refresh the table
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to delete user.');
        }
    } catch (err) {
        console.error('Delete error:', err);
    }
}

// Logout
function logout() {
    localStorage.removeItem('profile_token');
    localStorage.removeItem('profile_user');
    window.location.href = 'admin-login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', loadDashboard);