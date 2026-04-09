// Supabase Configuration
const supabaseUrl = 'https://caiambiptiuuxtdyacmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaWFtYmlwdGl1dXh0ZHlhY214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjAwMzYsImV4cCI6MjA5MTIzNjAzNn0.V60E1xXqvICAFS8RKP_2DFLWm2SVcZ9WcxmdE1QTDS4';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    initAuthListeners();
    checkSession();
});

// Initialize form listeners
function initAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const googleBtn = document.querySelector('.btn-google');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const submitBtn = loginForm.querySelector('.auth-submit');
            
            setLoading(submitBtn, true, 'Signing In...');
            
            const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                alert('Login Error: ' + error.message);
            } else {
                console.log('Login successful, checking session...');
                closeLoginModal();
                await checkSession();
            }
            setLoading(submitBtn, false, 'Sign In');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const submitBtn = signupForm.querySelector('.auth-submit');

            setLoading(submitBtn, true, 'Creating Account...');

            const { data, error } = await _supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });

            if (error) {
                alert('Signup Error: ' + error.message);
            } else {
                alert('Verification email sent! Please check your inbox.');
                closeLoginModal();
            }
            setLoading(submitBtn, false, 'Create Account');
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            const { error } = await _supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
            if (error) alert('Google Login Error: ' + error.message);
        });
    }
}

// Sync user data to profiles table manually as a backup
async function syncProfile(user) {
    if (!user) return;
    
    const { email, id, user_metadata } = user;
    const full_name = user_metadata.full_name || email.split('@')[0];
    
    const { error } = await _supabase
        .from('profiles')
        .upsert({
            id: id,
            email: email,
            full_name: full_name,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
    
    if (error) {
        console.error('Profile sync error:', error);
        // Do not alert user for background sync errors, but log it
    } else {
        console.log('Profile synced successfully for:', email);
    }
}

// Session Management
async function checkSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    const navLinks = document.getElementById('navLinks');
    
    // Find the Client Login link in the nav bar
    const loginLinks = document.querySelectorAll('a[onclick*="openLoginModal"]');
    
    if (session) {
        const user = session.user;
        await syncProfile(user); // Ensure profile exists on every check
        
        const displayName = user.user_metadata.full_name || user.email.split('@')[0];
        
        loginLinks.forEach(link => {
            const parent = link.parentElement;
            parent.innerHTML = `
                <div class="user-info-nav" style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: var(--primary-cyan); font-weight: 600; font-size: 0.9rem;">Hi, ${displayName}</span>
                    <button onclick="handleLogout()" class="btn btn-outline" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Logout</button>
                </div>
            `;
        });
    } else {
        // Ensure buttons are reset if logged out (though static HTML handles this)
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    window.location.reload();
}

function setLoading(btn, isLoading, text) {
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    } else {
        btn.disabled = false;
        btn.innerHTML = `${text} <i class="fas fa-arrow-right" style="margin-left: 5px;"></i>`;
    }
}

// Expose logout globally
window.handleLogout = handleLogout;
