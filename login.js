// Data akun demo
const demoAccounts = {
    siswa: {
        username: 'siswa_demo',
        password: 'siswa123',
        nama: 'Siswa Demo',
        kelas: 'XII IPA 1',
        redirect: 'siswa.html'
    },
    guru: {
        username: 'guru_demo',
        password: 'guru123',
        nama: 'Sriningsih, S.Pd',
        mataPelajaran: 'Ekonomi',
        redirect: 'guru.html'
    },
    admin: {
        username: 'admin_demo',
        password: 'admin123',
        nama: 'Admin Sekolah',
        jabatan: 'Administrator',
        redirect: 'admin.html'
    }
};

// State management
let currentRole = null;
let isLoading = false;

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeEventListeners();
    checkRememberedLogin();
});

// Inisialisasi aplikasi
function initializeApp() {
    // Simulasi loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 500);
    }, 2000);
}

// Inisialisasi event listeners
function initializeEventListeners() {
    // Role selection
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            selectRole(this.dataset.role);
        });
    });

    // Quick login buttons
    const quickButtons = document.querySelectorAll('.quick-btn');
    quickButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            selectRole(this.dataset.role);
        });
    });

    // Back button
    document.getElementById('backButton').addEventListener('click', showRoleSelection);

    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Password toggle
    document.getElementById('passwordToggle').addEventListener('click', togglePasswordVisibility);

    // Demo accounts
    const demoAccounts = document.querySelectorAll('.demo-account');
    demoAccounts.forEach(account => {
        account.addEventListener('click', function() {
            fillDemoAccount(this.dataset.role);
        });
    });

    // Forgot password
    document.getElementById('forgotPasswordLink').addEventListener('click', showForgotPasswordModal);

    // Modal events
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('resetPasswordForm').addEventListener('submit', handlePasswordReset);

    // Close modal when clicking outside
    document.getElementById('forgotPasswordModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Pilih role
function selectRole(role) {
    currentRole = role;
    
    // Update UI
    updateRoleSelectionUI(role);
    showLoginForm(role);
    updateQuickLoginButtons(role);
}

// Update tampilan pemilihan role
function updateRoleSelectionUI(role) {
    // Remove active class from all role cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected role card
    document.querySelector(`.role-card[data-role="${role}"]`).classList.add('active');
}

// Tampilkan form login berdasarkan role
function showLoginForm(role) {
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    const formTitle = document.getElementById('formTitle');
    const usernameLabel = document.getElementById('usernameLabel');
    const loginButtonText = document.getElementById('loginButtonText');
    
    // Hide role selection, show login form
    roleSelection.style.display = 'none';
    loginForm.style.display = 'block';
    
    // Update form based on role
    const roleConfig = {
        siswa: {
            title: 'Masuk sebagai Siswa',
            usernameLabel: 'NIS atau Username',
            buttonText: 'Masuk sebagai Siswa'
        },
        guru: {
            title: 'Masuk sebagai Guru',
            usernameLabel: 'NIP atau Username',
            buttonText: 'Masuk sebagai Guru'
        },
        admin: {
            title: 'Masuk sebagai Admin',
            usernameLabel: 'Username',
            buttonText: 'Masuk sebagai Admin'
        }
    };
    
    const config = roleConfig[role];
    formTitle.textContent = config.title;
    usernameLabel.textContent = config.usernameLabel;
    loginButtonText.textContent = config.buttonText;
    
    // Update additional fields based on role
    updateAdditionalFields(role);
    
    // Focus on username field
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 300);
}

// Kembali ke pemilihan role
function showRoleSelection() {
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    
    loginForm.style.display = 'none';
    roleSelection.style.display = 'block';
    currentRole = null;
    
    // Reset quick login buttons
    updateQuickLoginButtons(null);
}

// Update tombol quick login
function updateQuickLoginButtons(role) {
    const quickButtons = document.querySelectorAll('.quick-btn');
    quickButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.role === role) {
            btn.classList.add('active');
        }
    });
}

// Update field tambahan berdasarkan role
function updateAdditionalFields(role) {
    const additionalFields = document.getElementById('additionalFields');
    additionalFields.innerHTML = '';
    
    const fieldConfig = {
        siswa: `
            <div class="form-group floating-form">
                <select id="kelas" name="kelas" required>
                    <option value="">Pilih Kelas</option>
                    <option value="x">Kelas X</option>
                    <option value="xi">Kelas XI</option>
                    <option value="xii">Kelas XII</option>
                </select>
                <label for="kelas">Kelas</label>
                <i class="fas fa-users form-icon"></i>
                <div class="form-line"></div>
            </div>
        `,
        guru: `
            <div class="form-group floating-form">
                <select id="mataPelajaran" name="mataPelajaran" required>
                    <option value="">Pilih Mata Pelajaran</option>
                    <option value="ekonomi">Ekonomi</option>
                    <option value="akuntansi">Akuntansi</option>
                    <option value="matematika">Matematika</option>
                </select>
                <label for="mataPelajaran">Mata Pelajaran</label>
                <i class="fas fa-book form-icon"></i>
                <div class="form-line"></div>
            </div>
        `,
        admin: `
            <div class="form-group floating-form">
                <input type="text" id="kodeAkses" name="kodeAkses" required>
                <label for="kodeAkses">Kode Akses Admin</label>
                <i class="fas fa-key form-icon"></i>
                <div class="form-line"></div>
            </div>
        `
    };
    
    if (fieldConfig[role]) {
        additionalFields.innerHTML = fieldConfig[role];
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!username || !password) {
        showNotification('Harap isi semua field!', 'error');
        return;
    }
    
    // Validasi tambahan berdasarkan role
    if (!validateAdditionalFields()) {
        return;
    }
    
    // Simulasi proses login
    simulateLogin(username, password, rememberMe);
}

// Validasi field tambahan
function validateAdditionalFields() {
    if (currentRole === 'siswa') {
        const kelas = document.getElementById('kelas').value;
        if (!kelas) {
            showNotification('Harap pilih kelas!', 'error');
            return false;
        }
    } else if (currentRole === 'guru') {
        const mataPelajaran = document.getElementById('mataPelajaran').value;
        if (!mataPelajaran) {
            showNotification('Harap pilih mata pelajaran!', 'error');
            return false;
        }
    } else if (currentRole === 'admin') {
        const kodeAkses = document.getElementById('kodeAkses').value.trim();
        if (!kodeAkses) {
            showNotification('Harap masukkan kode akses admin!', 'error');
            return false;
        }
    }
    
    return true;
}

// Simulasi proses login
function simulateLogin(username, password, rememberMe) {
    isLoading = true;
    const loginButton = document.getElementById('loginButton');
    
    // Show loading state
    loginButton.classList.add('loading');
    
    // Simulasi delay network
    setTimeout(() => {
        // Check if it's a demo account
        if (demoAccounts[currentRole] && 
            username === demoAccounts[currentRole].username && 
            password === demoAccounts[currentRole].password) {
            
            // Save login data if remember me is checked
            if (rememberMe) {
                saveLoginData(username, currentRole);
            }
            
            // Show success and redirect
            showNotification('Login berhasil! Mengarahkan...', 'success');
            redirectToDashboard();
            
        } else {
            // Show error
            showNotification('Username atau password salah!', 'error');
            loginButton.classList.remove('loading');
            isLoading = false;
        }
    }, 2000);
}

// Redirect ke dashboard sesuai role
function redirectToDashboard() {
    setTimeout(() => {
        window.location.href = demoAccounts[currentRole].redirect;
    }, 1500);
}

// Toggle visibility password
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('passwordToggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Isi akun demo
function fillDemoAccount(role) {
    if (currentRole !== role) {
        selectRole(role);
        // Tunggu sebentar untuk form muncul
        setTimeout(() => {
            fillDemoCredentials(role);
        }, 100);
    } else {
        fillDemoCredentials(role);
    }
}

function fillDemoCredentials(role) {
    const account = demoAccounts[role];
    document.getElementById('username').value = account.username;
    document.getElementById('password').value = account.password;
    
    // Fill additional fields based on role
    if (role === 'siswa') {
        document.getElementById('kelas').value = 'xii';
    } else if (role === 'guru') {
        document.getElementById('mataPelajaran').value = 'ekonomi';
    } else if (role === 'admin') {
        document.getElementById('kodeAkses').value = 'admin2024';
    }
    
    showNotification(`Akun demo ${role} telah diisi!`, 'success');
}

// Modal lupa password
function showForgotPasswordModal(e) {
    e.preventDefault();
    document.getElementById('forgotPasswordModal').style.display = 'flex';
    document.getElementById('roleField').style.display = 'block';
}

function closeModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    document.getElementById('resetPasswordForm').reset();
}

function handlePasswordReset(e) {
    e.preventDefault();
    
    const identifier = document.getElementById('resetIdentifier').value.trim();
    const role = document.getElementById('resetRole').value;
    
    if (!identifier || !role) {
        showNotification('Harap isi semua field!', 'error');
        return;
    }
    
    // Simulasi pengiriman reset password
    const resetButton = document.querySelector('.btn-reset-submit');
    resetButton.classList.add('loading');
    
    setTimeout(() => {
        resetButton.classList.remove('loading');
        closeModal();
        showNotification('Link reset password telah dikirim ke email Anda!', 'success');
    }, 2000);
}

// Simpan data login untuk remember me
function saveLoginData(username, role) {
    const loginData = {
        username: username,
        role: role,
        timestamp: Date.now()
    };
    localStorage.setItem('finEdu_remembered_login', JSON.stringify(loginData));
}

// Cek login yang diingat
function checkRememberedLogin() {
    const remembered = localStorage.getItem('finEdu_remembered_login');
    if (remembered) {
        const loginData = JSON.parse(remembered);
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 minggu dalam milliseconds
        
        // Cek jika data masih valid (kurang dari 1 minggu)
        if (Date.now() - loginData.timestamp < oneWeek) {
            // Auto-fill form
            selectRole(loginData.role);
            setTimeout(() => {
                document.getElementById('username').value = loginData.username;
                document.getElementById('rememberMe').checked = true;
            }, 100);
        } else {
            // Hapus data yang sudah kedaluwarsa
            localStorage.removeItem('finEdu_remembered_login');
        }
    }
}

// Fungsi notifikasi
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        info: 'linear-gradient(135deg, #3498db, #2980b9)'
    };
    return colors[type] || colors.info;
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);