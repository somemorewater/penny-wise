// Theme Toggle (works on all pages)
const html = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // If on login/signup pages and already logged in, redirect to dashboard
    if (isLoggedIn === 'true' && (currentPage.includes('login.html') || currentPage.includes('signup.html'))) {
        window.location.href = './index.html';
    }
    
    // If on index page and not logged in, redirect to login
    if (isLoggedIn !== 'true' && currentPage.includes('index.html')) {
        window.location.href = './login.html';
    }
}

// Run auth check on page load
checkAuth();

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Get stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Successful login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Show success message
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1000);
        } else {
            // Failed login
            showMessage('Invalid email or password. Please try again.', 'error');
        }
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.querySelector('.strength-bar');
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;
            
            strengthBar.className = 'strength-bar';
            if (strength === 1) strengthBar.classList.add('weak');
            else if (strength === 2) strengthBar.classList.add('medium');
            else if (strength === 3) strengthBar.classList.add('good');
            else if (strength === 4) strengthBar.classList.add('strong');
        });
    }
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validation
        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }
        
        if (!agreeTerms) {
            showMessage('Please agree to the Terms of Service and Privacy Policy.', 'error');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            showMessage('An account with this email already exists.', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            fullName,
            email,
            password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showMessage('Account created successfully! Redirecting to login...', 'success');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = './login.html';
        }, 1500);
    });
}

// Logout function (can be called from index.html)
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    window.location.href = './login.html';
}

// Show message function
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the form
    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Google Sign In (placeholder)
const googleButtons = document.querySelectorAll('.btn-social');
googleButtons.forEach(button => {
    button.addEventListener('click', function() {
        showMessage('Google Sign-In is not implemented in this demo.', 'info');
    });
});
