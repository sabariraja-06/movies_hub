// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1XJEUoz-mcEwrcDtvkygZmwMxy4_o5dc",
    authDomain: "login-1b059.firebaseapp.com",
    projectId: "login-1b059",
    storageBucket: "login-1b059.appspot.com",
    messagingSenderId: "533391868382",
    appId: "1:533391868382:web:dfd0fcd3ff264b94395d4f",
    measurementId: "G-KEB8LH9QNT"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Initialize particles.js
particlesJS("particles-js", {
    // ... (keep your existing particles.js config)
});

// Set persistence (optional but recommended)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Auth persistence enabled");
    })
    .catch((error) => {
        console.error("Error enabling persistence:", error);
    });

// Check if user is already logged in


// Tab Switching
document.querySelectorAll('.auth-tab, .switch-tab').forEach(tab => {
    tab.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.remove('active');
        });
        document.querySelector(`.auth-tab[data-tab="${tabId}"]`).classList.add('active');
        
        // Update active form
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tabId}Form`).classList.add('active');
    });
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtnText = document.getElementById('loginBtnText');
    const loginSpinner = document.getElementById('loginSpinner');
    const message = document.getElementById('loginMessage');
    
    // Show loading state
    loginBtnText.textContent = 'Signing In...';
    loginSpinner.style.display = 'inline-block';
    
    // Firebase login
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Store user ID in localStorage
            localStorage.setItem('loggedInUserId', userCredential.user.uid);
            
            // Update last login timestamp
            return db.collection('users').doc(userCredential.user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            // Success
            message.textContent = 'Login successful! Redirecting...';
            message.className = 'auth-message success';
            
            // Redirect
            redirectToMainSite();
        })
        .catch((error) => {
            // Error handling
            let errorMessage = 'An error occurred. Please try again.';
            switch(error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
            }
            
            message.textContent = errorMessage;
            message.className = 'auth-message error';
            
            // Reset button state
            loginBtnText.textContent = 'Sign In';
            loginSpinner.style.display = 'none';
        });
});

// Register Form Submission
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values with trim() to remove whitespace
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    
    const registerBtnText = document.getElementById('registerBtnText');
    const registerSpinner = document.getElementById('registerSpinner');
    const message = document.getElementById('registerMessage');
    
    // Debug: Log password values to console
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Match:', password === confirmPassword);
    console.log('Password:', password);
console.log('Confirm Password:', confirmPassword);
console.log('Match:', password === confirmPassword);
console.log('Password length:', password.length);
console.log('Confirm Password length:', confirmPassword.length);
    
    // Clear previous messages
    message.textContent = '';
    message.className = 'auth-message';
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        message.textContent = 'Please fill in all fields';
        message.className = 'auth-message error';
        return;
    }
    
    // Case-sensitive exact match comparison
    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match';
        message.className = 'auth-message error';
        
        // Highlight the password fields
        document.getElementById('registerPassword').style.borderColor = '#d63031';
        document.getElementById('registerConfirmPassword').style.borderColor = '#d63031';
        return;
    }
    
    if (password.length < 6) {
        message.textContent = 'Password must be at least 6 characters';
        message.className = 'auth-message error';
        return;
    }
    
    // Rest of your registration logic...
    // Show loading state
    registerBtnText.textContent = 'Creating Account...';
    registerSpinner.style.display = 'inline-block';
    
    try {
        // Registration code...
    } catch (error) {
        // Error handling...
    } finally {
        // Reset button state...
    }
});

// Google Sign In
document.getElementById('googleSignIn').addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const message = document.getElementById('loginMessage');
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Store user ID in localStorage
            localStorage.setItem('loggedInUserId', result.user.uid);
            
            // Check if this is a new user
            if (result.additionalUserInfo.isNewUser) {
                // Store new user data in Firestore
                return db.collection('users').doc(result.user.uid).set({
                    name: result.user.displayName,
                    email: result.user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    uid: result.user.uid
                });
            } else {
                // Update last login for existing user
                return db.collection('users').doc(result.user.uid).update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        })
        .then(() => {
            // Success
            message.textContent = 'Google sign-in successful! Redirecting...';
            message.className = 'auth-message success';
            
            // Redirect after delay
            redirectToMainSite();
        })
        .catch((error) => {
            // Error handling
            message.textContent = 'Google sign-in failed. Please try again.';
            message.className = 'auth-message error';
        });
});

// Forgot Password
document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Please enter your email address to reset your password:');
    
    if (email) {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert('Password reset email sent. Please check your inbox.');
            })
            .catch((error) => {
                alert('Error sending reset email: ' + error.message);
            });
    }
});

// Message display function
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000);
}
