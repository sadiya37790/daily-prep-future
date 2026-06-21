const { dsaDatabase, verifyLeetCodeSubmission } = window;
const { aptitudeDatabase } = window;
const { dailyPrompts, analyzeParagraph } = window;
const { theoryConcepts, sqlQuestions, checkSQLQuery } = window;

// --- STATE MANAGEMENT ---
let activeUser = null;
let userProgress = null;
let emailReminderSentToday = false;

// --- TOAST NOTIFICATIONS ---
function showToast(title, desc, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-card ${type}`;

  let icon = '🔔';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';
  if (title.toLowerCase().includes('email')) icon = '✉️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
    <button class="toast-close">&times;</button>
  `;

  // Close button handler
  toast.querySelector('.toast-close').onclick = () => {
    toast.classList.add('removing');
    toast.onanimationend = () => toast.remove();
  };

  // Auto remove after 6 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('removing');
      toast.onanimationend = () => toast.remove();
    }
  }, 6000);

  container.appendChild(toast);
}

// Default progress object for a new user
const createDefaultProgress = () => ({
  streak: 0,
  lastActiveDate: null,
  completionHistory: {}, // format: { 'YYYY-MM-DD': ['dsa', 'aptitude', 'writing', 'theory'] }
  todayCompletion: {
    dsa: false,
    aptitude: false,
    writing: false,
    theory: false
  },
  leetcodeUsername: "",
  dsaSolved: {}, // format: { 'arrays': [false, false, false], 'strings': ... }
  aptitudeScore: null,
  aptitudeQuizzes: {}, // format: { 'number-systems': { questions: [], answers: {}, completed: false } }
  writingContent: "",
  writingSubmitted: false,
  theorySolved: false
});

// --- DOM ELEMENTS ---
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

// Auth Form Elements
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const formLogin = document.getElementById('form-login');
const formSignup = document.getElementById('form-signup');
const formForgot = document.getElementById('form-forgot');
const loginIdentifier = document.getElementById('login-identifier');
const loginPassword = document.getElementById('login-password');
const signupUsername = document.getElementById('signup-username');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const loginAlert = document.getElementById('login-alert');
const signupAlert = document.getElementById('signup-alert');
const googleLoginBtn = document.getElementById('google-login-btn');

// Forgot Password Form Elements
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLoginLink = document.getElementById('back-to-login-link');
const forgotEmail = document.getElementById('forgot-email');
const forgotAlert = document.getElementById('forgot-alert');
const forgotSuccess = document.getElementById('forgot-success');

// Dashboard Header Elements
const displayUsername = document.getElementById('display-username');
const displayAvatar = document.getElementById('display-avatar');
const logoutBtn = document.getElementById('logout-btn');

// Progress Elements
const progressCircle = document.getElementById('progress-circle');
const progressPercent = document.getElementById('progress-percent');
const progressFraction = document.getElementById('progress-fraction');
const streakCount = document.getElementById('streak-count');
const heatmapGrid = document.getElementById('heatmap');

// Navigation Tabs
const tabs = {
  dsa: document.getElementById('tab-module-dsa'),
  aptitude: document.getElementById('tab-module-aptitude'),
  writing: document.getElementById('tab-module-writing'),
  theory: document.getElementById('tab-module-theory')
};

// Panel Elements
const panels = {
  dsa: document.getElementById('panel-dsa'),
  aptitude: document.getElementById('panel-aptitude'),
  writing: document.getElementById('panel-writing'),
  theory: document.getElementById('panel-theory')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  setupAuthEventListeners();
  checkExistingSession();
  setupMidnightResetCheck();
});

function setupMidnightResetCheck() {
  setInterval(() => {
    if (activeUser && userProgress) {
      const todayStr = getTodayDateString();
      if (userProgress.lastActiveDate && userProgress.lastActiveDate !== todayStr) {
        // Date changed! Perform daily reset
        checkDailyReset();
        // Reload dashboard
        loadUserDashboard();
        showToast("New Day Started!", "Welcome to today's challenges. Daily tasks have been reset!", "success");
      }
    }
  }, 30000); // Check every 30 seconds
}

// --- SESSION CHECK ---
function checkExistingSession() {
  const session = localStorage.getItem('dailyprep_active_user');
  if (session) {
    activeUser = JSON.parse(session);
    loadUserDashboard();
  } else {
    showAuthScreen();
  }
}

function showAuthScreen() {
  authScreen.classList.remove('hidden');
  dashboardScreen.classList.add('hidden');
}

function loadUserDashboard() {
  authScreen.classList.add('hidden');
  dashboardScreen.classList.remove('hidden');
  
  // Set profile details
  displayUsername.textContent = activeUser.username;
  displayAvatar.textContent = activeUser.username.charAt(0).toUpperCase();
  if (activeUser.avatarUrl) {
    displayAvatar.innerHTML = `<img src="${activeUser.avatarUrl}" alt="Avatar">`;
  } else {
    displayAvatar.textContent = activeUser.username.charAt(0).toUpperCase();
  }

  // Load user progress
  const savedProgress = localStorage.getItem(`dailyprep_progress_${activeUser.username}`);
  if (savedProgress) {
    userProgress = JSON.parse(savedProgress);
    // Ensure all default properties are present (migration for existing accounts)
    const defaults = createDefaultProgress();
    userProgress = { ...defaults, ...userProgress };
    userProgress.todayCompletion = { ...defaults.todayCompletion, ...userProgress.todayCompletion };
    
    // Schema migration for dsaSolved array -> map
    if (Array.isArray(userProgress.dsaSolved)) {
      userProgress.dsaSolved = { 'arrays': userProgress.dsaSolved };
    }
    userProgress.aptitudeQuizzes = userProgress.aptitudeQuizzes || {};
  } else {
    userProgress = createDefaultProgress();
  }

  // Check date transitions
  checkDailyReset();
  
  // Render views
  updateOverallProgress();
  renderHeatmap();
  setupDashboardEventListeners();
  
  // Load initial tab (DSA)
  switchTab('dsa');
}

// Check if a new calendar day has started, reset daily metrics but save streaks
function checkDailyReset() {
  const todayStr = getTodayDateString();
  const lastActive = userProgress.lastActiveDate;

  if (lastActive && lastActive !== todayStr) {
    // Check if the streak is broken (did not log activity yesterday)
    const yesterdayStr = getYesterdayDateString();
    
    // Check if yesterday's completions had at least one completed item
    const completedYesterday = userProgress.completionHistory[yesterdayStr] && 
                          userProgress.completionHistory[yesterdayStr].length > 0;
                          
    if (!completedYesterday && lastActive !== yesterdayStr) {
      // Streak broken
      userProgress.streak = 0;
    }

    // Reset daily tasks
    userProgress.todayCompletion = {
      dsa: false,
      aptitude: false,
      writing: false,
      theory: false
    };
    userProgress.aptitudeScore = null;
    userProgress.aptitudeQuizzes = {};
    userProgress.writingContent = "";
    userProgress.writingSubmitted = false;
    userProgress.theorySolved = false;
    
    // Save lastActiveDate to todayStr so reset doesn't run again today
    userProgress.lastActiveDate = todayStr;
    
    saveProgressToStorage();
  }
}

// --- DATE HELPERS ---
function getDayOfYear() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function saveProgressToStorage() {
  localStorage.setItem(`dailyprep_progress_${activeUser.username}`, JSON.stringify(userProgress));
}

// --- AUTH LOGIC ---
function setupAuthEventListeners() {
  // Tab Switching
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    formLogin.classList.remove('hidden');
    formSignup.classList.add('hidden');
    formForgot.classList.add('hidden');
    loginAlert.classList.add('hidden');
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    formSignup.classList.remove('hidden');
    formLogin.classList.add('hidden');
    formForgot.classList.add('hidden');
    signupAlert.classList.add('hidden');
  });

  // Forgot Password Link Click
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    formLogin.classList.add('hidden');
    formSignup.classList.add('hidden');
    formForgot.classList.remove('hidden');
    tabLogin.parentElement.classList.add('hidden'); // Hide the tab switching buttons
    forgotAlert.classList.add('hidden');
    forgotSuccess.classList.add('hidden');
    forgotEmail.value = '';
  });

  // Back to Login Link Click
  backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    formForgot.classList.add('hidden');
    formLogin.classList.remove('hidden');
    tabLogin.parentElement.classList.remove('hidden'); // Show the tab switching buttons
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
  });

  // Forgot Password Form Submit
  formForgot.addEventListener('submit', (e) => {
    e.preventDefault();
    forgotAlert.classList.add('hidden');
    forgotSuccess.classList.add('hidden');

    const email = forgotEmail.value.trim();
    const users = JSON.parse(localStorage.getItem('dailyprep_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      forgotAlert.textContent = "No account found with this email address.";
      forgotAlert.classList.remove('hidden');
      return;
    }

    // Simulate sending email
    forgotSuccess.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 6px; color: #10b981; display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 1.1rem;">✉️</span> Password Recovered Successfully!
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">
        A simulated email has been dispatched to <strong>${user.email}</strong>.
      </div>
      <div style="background: rgba(0, 0, 0, 0.4); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); text-align: left;">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">Retrieved Details</div>
        <div style="font-size: 0.85rem; margin-bottom: 2px;">Username: <strong style="color: #f8fafc;">${user.username}</strong></div>
        <div style="font-size: 0.85rem;">Password: <strong style="color: #38bdf8;">${user.password}</strong></div>
      </div>
    `;
    forgotSuccess.classList.remove('hidden');
    
    showToast("Password Recovered", `Retrieved details for ${user.username}.`, "success");
  });

  // Login Form Submit
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    loginAlert.classList.add('hidden');

    const identifier = loginIdentifier.value.trim();
    const password = loginPassword.value;

    const users = JSON.parse(localStorage.getItem('dailyprep_users') || '[]');
    const user = users.find(u => 
      u.email.toLowerCase() === identifier.toLowerCase() || 
      u.username.toLowerCase() === identifier.toLowerCase()
    );

    if (!user || user.password !== password) {
      showAuthAlert(loginAlert, "Invalid email, username, or password.");
      return;
    }

    activeUser = { username: user.username, email: user.email };
    localStorage.setItem('dailyprep_active_user', JSON.stringify(activeUser));
    loadUserDashboard();
  });

  // Signup Form Submit
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    signupAlert.classList.add('hidden');

    const username = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (username.length < 3) {
      showAuthAlert(signupAlert, "Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      showAuthAlert(signupAlert, "Password must be at least 6 characters.");
      return;
    }

    const users = JSON.parse(localStorage.getItem('dailyprep_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showAuthAlert(signupAlert, "An account with this email already exists.");
      return;
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      showAuthAlert(signupAlert, "Username is already taken.");
      return;
    }

    // Register User
    users.push({ username, email, password });
    localStorage.setItem('dailyprep_users', JSON.stringify(users));

    activeUser = { username, email };
    localStorage.setItem('dailyprep_active_user', JSON.stringify(activeUser));
    
    // Setup initial progress
    userProgress = createDefaultProgress();
    saveProgressToStorage();

    loadUserDashboard();
  });

  // Google Login Simulation
  googleLoginBtn.addEventListener('click', () => {
    // Open a centered mock popup window
    const w = 500;
    const h = 600;
    const left = (screen.width/2)-(w/2);
    const top = (screen.height/2)-(h/2);
    
    const popup = window.open("", "Google Login Simulation", `width=${w},height=${h},top=${top},left=${left}`);
    
    popup.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sign in - Google Accounts</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #202124; padding: 30px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; }
          .logo { width: 48px; height: 48px; margin-bottom: 16px; }
          h2 { font-size: 22px; font-weight: 400; margin-bottom: 8px; margin-top: 0; color: #202124; }
          p { color: #5f6368; font-size: 15px; margin-bottom: 24px; margin-top: 0; }
          .accounts-list { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
          .account-box { border: 1px solid #dadce0; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left; transition: background 0.2s, border-color 0.2s; }
          .account-box:hover { background: #f8f9fa; border-color: #c2c3c4; }
          .avatar { width: 36px; height: 36px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; text-transform: uppercase; }
          .acc-details { display: flex; flex-direction: column; }
          .name { font-size: 14px; font-weight: 600; color: #3c4043; }
          .email { font-size: 12px; color: #5f6368; }
          .btn-use-other { background: none; border: 1px dashed #dadce0; border-radius: 8px; padding: 12px; width: 100%; max-width: 320px; font-size: 14px; font-weight: 600; color: #1a73e8; cursor: pointer; transition: background 0.2s; margin-top: 4px; }
          .btn-use-other:hover { background: #f4f8fe; border-color: #1a73e8; }
          
          .form-box { display: none; width: 100%; max-width: 320px; flex-direction: column; gap: 12px; text-align: left; }
          .input-group { display: flex; flex-direction: column; gap: 6px; }
          .input-group label { font-size: 12px; font-weight: 600; color: #5f6368; }
          .input-group input { padding: 10px 12px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; outline: none; transition: border-color 0.2s; }
          .input-group input:focus { border-color: #1a73e8; }
          .btn-submit { background: #1a73e8; color: #fff; border: none; border-radius: 4px; padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer; text-align: center; margin-top: 8px; }
          .btn-submit:hover { background: #1557b0; }
          .btn-back { background: none; border: none; color: #5f6368; font-size: 13px; cursor: pointer; text-align: center; margin-top: 8px; text-decoration: underline; }
        </style>
      </head>
      <body>
        <svg class="logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        
        <div id="selection-view" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
          <h2>Choose an account</h2>
          <p>to continue to DailyPrep</p>
          
          <div class="accounts-list" id="accounts-container"></div>
          
          <button class="btn-use-other" id="btn-show-form">+ Use another account</button>
        </div>

        <div id="form-view" class="form-box">
          <h2>Google Sign In</h2>
          <p style="margin-bottom: 16px;">Sign in with your Google email credentials</p>
          
          <div class="input-group">
            <label for="google-name">Your Full Name</label>
            <input type="text" id="google-name" placeholder="e.g. John Doe">
          </div>
          <div class="input-group">
            <label for="google-email">Google Email Address</label>
            <input type="email" id="google-email" placeholder="e.g. john.doe@gmail.com">
          </div>
          
          <button class="btn-submit" id="btn-submit-google">Continue to DailyPrep</button>
          <button class="btn-back" id="btn-show-selection">Back to account selection</button>
        </div>

        <script>
          const container = document.getElementById('accounts-container');
          const selectionView = document.getElementById('selection-view');
          const formView = document.getElementById('form-view');
          
          // Read local registered users
          const users = JSON.parse(localStorage.getItem('dailyprep_users') || '[]');
          
          // Always add a default student account if no users exist
          if (users.length === 0) {
            users.push({
              username: "Google_Student",
              email: "student.prep@gmail.com"
            });
          }

          // Render registered accounts
          users.forEach(user => {
            const box = document.createElement('div');
            box.className = 'account-box';
            const initial = user.username.charAt(0).toUpperCase();
            box.innerHTML = \`
              <div class="avatar">\${initial}</div>
              <div class="acc-details">
                <span class="name">\${user.username}</span>
                <span class="email">\${user.email}</span>
              </div>
            \`;
            box.onclick = () => {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                username: user.username,
                email: user.email
              }, '*');
              window.close();
            };
            container.appendChild(box);
          });

          // Toggle to input form
          document.getElementById('btn-show-form').onclick = () => {
            selectionView.style.display = 'none';
            formView.style.display = 'flex';
          };

          // Toggle back to list
          document.getElementById('btn-show-selection').onclick = () => {
            formView.style.display = 'none';
            selectionView.style.display = 'flex';
          };

          // Submit custom credentials
          document.getElementById('btn-submit-google').onclick = () => {
            const name = document.getElementById('google-name').value.trim();
            const email = document.getElementById('google-email').value.trim();
            
            if (!name || !email) {
              alert("Please enter both your name and email address.");
              return;
            }

            // Generate a clean username from name
            const username = name.replace(/\\s+/g, '_').toLowerCase();

            // Register user in main storage if they don't exist
            const allUsers = JSON.parse(localStorage.getItem('dailyprep_users') || '[]');
            const userExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (!userExists) {
              allUsers.push({ username, email, password: "google-linked-account" });
              localStorage.setItem('dailyprep_users', JSON.stringify(allUsers));
            }

            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              username: username,
              email: email
            }, '*');
            window.close();
          };
        </script>
      </body>
      </html>
    `);

    // Handle incoming window message from the popup
    const messageListener = (event) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', messageListener);
        
        activeUser = {
          username: event.data.username,
          email: event.data.email,
          avatarUrl: event.data.avatarUrl || null
        };
        
        localStorage.setItem('dailyprep_active_user', JSON.stringify(activeUser));
        
        // Ensure progress object exists for this Google login
        const savedProgress = localStorage.getItem(`dailyprep_progress_${activeUser.username}`);
        if (!savedProgress) {
          userProgress = createDefaultProgress();
          saveProgressToStorage();
        }
        
        loadUserDashboard();
      }
    };
    
    window.addEventListener('message', messageListener);
  });
}

function showAuthAlert(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
}

// --- LOGOUT LOGIC ---
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('dailyprep_active_user');
  activeUser = null;
  userProgress = null;
  showAuthScreen();
});

// --- TAB ROUTING ---
function setupDashboardEventListeners() {
  // Navigation Tabs Event Listeners
  Object.keys(tabs).forEach(key => {
    tabs[key].addEventListener('click', () => switchTab(key));
  });
}

function switchTab(tabKey) {
  // Update nav active classes
  Object.keys(tabs).forEach(key => {
    if (key === tabKey) {
      tabs[key].classList.add('active');
      panels[key].classList.remove('hidden');
    } else {
      tabs[key].classList.remove('active');
      panels[key].classList.add('hidden');
    }
  });

  // Load appropriate panel code
  if (tabKey === 'dsa') renderDSAPanel();
  if (tabKey === 'aptitude') renderAptitudePanel();
  if (tabKey === 'writing') renderWritingPanel();
  if (tabKey === 'theory') renderTheoryPanel();
}

// --- CORE METRIC UPDATE ---
function updateOverallProgress() {
  const completedModules = Object.values(userProgress.todayCompletion).filter(Boolean).length;
  const percentage = Math.round((completedModules / 4) * 100);

  // Animate circular progress ring
  // radius = 74. circumference = 2 * pi * r = 464.96
  const circumference = 464.96;
  const offset = circumference - (percentage / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;

  // Text values
  progressPercent.textContent = `${percentage}%`;
  progressFraction.textContent = `${completedModules} / 4 Modules`;
  streakCount.textContent = `${userProgress.streak} Day Streak`;

  // Update checkmarks in tab navigation buttons
  Object.keys(userProgress.todayCompletion).forEach(key => {
    if (userProgress.todayCompletion[key]) {
      tabs[key].classList.add('completed');
    } else {
      tabs[key].classList.remove('completed');
    }
  });

  // Update dynamic consistency & task status banner
  const banner = document.getElementById('daily-status-banner');
  if (banner) {
    const remaining = 4 - completedModules;
    if (remaining > 0) {
      banner.className = "status-banner pending";
      banner.innerHTML = `
        <span style="font-size: 1.2rem;">⚠️</span>
        <div>
          <span style="font-weight: 700; color: #fff;">Unfinished daily tasks!</span> You have <strong>${remaining} pending module(s)</strong>. Complete all to protect your <strong>${userProgress.streak} day streak</strong>!
        </div>
      `;

      // Trigger simulated email notification once per login session
      if (activeUser && !emailReminderSentToday) {
        emailReminderSentToday = true;
        setTimeout(() => {
          showToast(
            "Simulated Email Sent",
            `Sent reminder notification to ${activeUser.email} to complete today's ${remaining} pending module(s).`,
            "warning"
          );
        }, 1200);
      }
    } else {
      banner.className = "status-banner completed";
      banner.innerHTML = `
        <span style="font-size: 1.2rem;">🏆</span>
        <div>
          <span style="font-weight: 700; color: #fff;">Congratulations!</span> All daily tasks completed. <strong>"Consistency is the key to success!"</strong> See tomorrow's coding questions preview below.
        </div>
      `;
    }
  }
}

function markModuleCompleted(moduleKey) {
  if (userProgress.todayCompletion[moduleKey]) return; // already completed

  userProgress.todayCompletion[moduleKey] = true;
  
  // Update streak logic
  const todayStr = getTodayDateString();
  const history = userProgress.completionHistory;
  
  if (!history[todayStr]) {
    history[todayStr] = [];
  }
  if (!history[todayStr].includes(moduleKey)) {
    history[todayStr].push(moduleKey);
  }

  // Calculate Streak
  const yesterdayStr = getYesterdayDateString();
  const loggedYesterday = history[yesterdayStr] && history[yesterdayStr].length > 0;
  const loggedToday = history[todayStr].length === 1; // first task completed today

  if (loggedToday) {
    if (loggedYesterday || userProgress.streak === 0) {
      userProgress.streak += 1;
    }
  }

  userProgress.lastActiveDate = todayStr;
  saveProgressToStorage();
  updateOverallProgress();
  renderHeatmap();
  
  // Re-render DSA panel to show tomorrow's preview if all completed
  renderDSAPanel();
}

// --- HEATMAP GENERATION ---
function renderHeatmap() {
  heatmapGrid.innerHTML = '';
  const today = new Date();
  
  // We want to draw 28 cells mapping back in time from today
  for (let i = 27; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - i);
    const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

    const cell = document.createElement('div');
    cell.classList.add('heatmap-day');
    
    // Check modules completed on this date
    const dayModules = userProgress.completionHistory[dateStr] || [];
    const count = dayModules.length;
    cell.classList.add(`level-${count}`);

    // Tooltip
    const formattedDate = targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const tooltipText = `${count} modules done on ${formattedDate} (${dayModules.join(', ') || 'none'})`;
    cell.innerHTML = `<span class="tooltip">${tooltipText}</span>`;

    heatmapGrid.appendChild(cell);
  }
}

// ==================== 1. DSA PANEL ====================
let activeDSATopic = "arrays";

const dsaTopicMapping = {
  "arrays": 0,
  "strings": 1,
  "linked-lists": 2,
  "stacks-queues": 3,
  "trees": 4,
  "graphs": 5,
  "dynamic-programming": 6,
  "heaps-priority-queues": 7,
  "binary-search": 8,
  "backtracking": 9
};

function getCompanyBadgeHtml(companyName) {
  const colors = {
    "Google": { bg: "rgba(66, 133, 244, 0.1)", border: "rgba(66, 133, 244, 0.25)", text: "#93c5fd" },
    "Amazon": { bg: "rgba(255, 153, 0, 0.1)", border: "rgba(255, 153, 0, 0.25)", text: "#fde047" },
    "Microsoft": { bg: "rgba(0, 164, 239, 0.1)", border: "rgba(0, 164, 239, 0.25)", text: "#7dd3fc" },
    "Meta": { bg: "rgba(6, 104, 222, 0.1)", border: "rgba(6, 104, 222, 0.25)", text: "#60a5fa" },
    "Goldman Sachs": { bg: "rgba(115, 150, 0, 0.1)", border: "rgba(115, 150, 0, 0.25)", text: "#bef264" },
    "Adobe": { bg: "rgba(255, 0, 0, 0.1)", border: "rgba(255, 0, 0, 0.25)", text: "#fca5a5" },
    "TCS": { bg: "rgba(0, 128, 128, 0.1)", border: "rgba(0, 128, 128, 0.25)", text: "#5eead4" },
    "Infosys": { bg: "rgba(0, 120, 215, 0.1)", border: "rgba(0, 120, 215, 0.25)", text: "#7dd3fc" },
    "Wipro": { bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.25)", text: "#c084fc" },
    "Cognizant": { bg: "rgba(0, 0, 102, 0.15)", border: "rgba(0, 0, 102, 0.3)", text: "#a5b4fc" },
    "Accenture": { bg: "rgba(161, 0, 255, 0.1)", border: "rgba(161, 0, 255, 0.25)", text: "#d8b4fe" },
    "Capgemini": { bg: "rgba(0, 112, 173, 0.1)", border: "rgba(0, 112, 173, 0.25)", text: "#7dd3fc" }
  };

  const style = colors[companyName] || { bg: "rgba(255, 255, 255, 0.05)", border: "rgba(255, 255, 255, 0.1)", text: "var(--text-secondary)" };
  return `<span class="company-badge" style="background: ${style.bg}; border: 1px solid ${style.border}; color: ${style.text}; font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; transition: var(--transition-smooth); cursor: default;">${companyName}</span>`;
}

function renderDSAPanel() {
  const usernameInput = document.getElementById('leetcode-username');
  const saveBtn = document.getElementById('save-leetcode-username');
  const dsaList = document.getElementById('dsa-questions-list');

  usernameInput.value = userProgress.leetcodeUsername || "";

  // LeetCode Username Save
  saveBtn.onclick = () => {
    userProgress.leetcodeUsername = usernameInput.value.trim();
    saveProgressToStorage();
    showToast("Username Saved", "Your LeetCode username has been updated!", "success");
    renderDSAPanel();
  };

  dsaList.innerHTML = "";

  const topicKeys = [
    "arrays", "strings", "linked-lists", "stacks-queues", 
    "trees", "graphs", "dynamic-programming", 
    "heaps-priority-queues", "binary-search", "backtracking"
  ];

  // 1. Flatten all questions from the database with references to their keys
  const allQuestions = [];
  topicKeys.forEach((tKey) => {
    // Ensure progress state exists for this topic
    if (!userProgress.dsaSolved[tKey]) {
      userProgress.dsaSolved[tKey] = [false, false, false];
    }
    const topicIdx = dsaTopicMapping[tKey];
    const topicData = dsaDatabase[topicIdx];
    if (topicData) {
      topicData.questions.forEach((q, idx) => {
        allQuestions.push({
          ...q,
          topicKey: tKey,
          questionIdx: idx
        });
      });
    }
  });

  // 2. Select 3 questions. If all 4 modules are completed, show a preview of tomorrow's questions!
  const completedModulesCount = Object.values(userProgress.todayCompletion).filter(v => v).length;
  const allCompletedToday = completedModulesCount === 4;
  
  let daySeed = getDayOfYear();
  let isPreviewOnly = false;
  if (allCompletedToday) {
    daySeed = daySeed + 1;
    isPreviewOnly = true;
  }
  
  const todayQuestions = [];
  const totalQs = allQuestions.length;
  if (totalQs > 0) {
    for (let i = 0; i < 3; i++) {
      const qIdx = (daySeed * 3 + i) % totalQs;
      todayQuestions.push(allQuestions[qIdx]);
    }
  }

  // Render a banner inside the DSA container if in tomorrow preview mode
  if (isPreviewOnly) {
    const previewBanner = document.createElement('div');
    previewBanner.className = "alert alert-success";
    previewBanner.style.marginBottom = "1.5rem";
    previewBanner.style.display = "flex";
    previewBanner.style.alignItems = "center";
    previewBanner.style.justifyContent = "space-between";
    previewBanner.style.flexWrap = "wrap";
    previewBanner.style.gap = "8px";
    previewBanner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem;">🎉</span>
        <div>
          <strong style="color: #fff;">Today's tasks finished!</strong> Showing a locked preview of tomorrow's DSA questions.
        </div>
      </div>
      <span style="font-size: 0.75rem; background: rgba(255,255,255,0.08); color: var(--text-secondary); padding: 4px 10px; border-radius: 6px; font-weight: 700; border: 1px solid rgba(255,255,255,0.03);">Tomorrow's Tasks</span>
    `;
    dsaList.appendChild(previewBanner);
  }

  // 3. Render the 3 questions
  todayQuestions.forEach((q) => {
    const tKey = q.topicKey;
    const idx = q.questionIdx;
    const isSolved = userProgress.dsaSolved[tKey][idx];
    const item = document.createElement('div');
    item.classList.add('dsa-item');
    item.style.flexDirection = "column";
    item.style.alignItems = "stretch";
    item.style.gap = "1rem";
    if (isSolved) item.classList.add('solved');

    const companyBadgesHtml = q.companies.map(c => getCompanyBadgeHtml(c)).join(' ');
    const isLeetCode = q.link && q.link.includes('leetcode.com');
    const hintsPanelId = `dsa-hints-${tKey}-${idx}`;

    item.innerHTML = `
      <div class="dsa-main-row" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <div class="dsa-details">
          <div class="dsa-title">
            <a href="${q.link}" target="_blank" class="dsa-link">
              ${q.title}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px;">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <span class="difficulty-badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
          </div>
          <div class="dsa-status-meta" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 4px;">
            <span style="font-size:0.8rem; color:var(--text-muted);">Asked in:</span>
            <span style="display: inline-flex; gap: 4px; flex-wrap: wrap;">${companyBadgesHtml}</span>
            <span style="color:var(--text-muted);">•</span>
            <span class="status-lbl" style="color: ${isSolved ? 'var(--success)' : 'var(--warning)'}; font-weight:700;">
              ${isSolved ? 'Solved' : 'Not Solved'}
            </span>
          </div>
        </div>

        <div class="dsa-actions" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="dsa-hints-toggle-btn" data-panel-id="${hintsPanelId}" style="background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.15); color: #c084fc; padding: 10px 14px; border-radius: var(--border-radius-sm); font-weight: 700; font-size: 0.85rem; height: 38px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>💡</span> Show Hints & Tracer
          </button>
          ${isPreviewOnly ? `
            <span class="lock-preview-badge" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); color: var(--text-muted); padding: 0 16px; border-radius: var(--border-radius-sm); font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; height: 38px; cursor: not-allowed; user-select: none;">
              <span>🔒</span> Locked Preview
            </span>
          ` : isSolved ? `
            <span class="verified-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${isLeetCode ? 'Verified' : 'Completed'}
            </span>
          ` : `
            <a href="${q.link}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 10px 18px; border-radius: var(--border-radius-sm); font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; justify-content: center; height: 38px;">Solve</a>
            ${isLeetCode ? `
              <button class="verify-btn" data-topic="${tKey}" data-index="${idx}" style="height: 38px;">Verify Solution</button>
            ` : `
              <button class="manual-solve-btn" data-topic="${tKey}" data-index="${idx}" style="height: 38px; background: var(--accent-gradient); border: none; color: var(--text-main); font-weight: 700; font-size: 0.85rem; padding: 0 18px; border-radius: var(--border-radius-sm); cursor: pointer; transition: var(--transition-smooth);">Mark as Solved</button>
            `}
          `}
        </div>
      </div>

      <!-- Collapsible Hints & Tracer Panel -->
      <div class="dsa-hints-panel hidden" id="${hintsPanelId}" style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <!-- Brute Force Card -->
          <div class="hint-approach-card" style="background: rgba(239, 68, 68, 0.02); border: 1px solid rgba(239, 68, 68, 0.1); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
            <div>
              <h5 style="color: #fca5a5; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.1rem;">🔴</span> Brute Force Approach
              </h5>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
                ${q.bruteForce.desc}
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.75rem; background: rgba(239, 68, 68, 0.1); color: #fca5a5; padding: 3px 8px; border-radius: 6px; font-weight: 700; border: 1px solid rgba(239, 68, 68, 0.15);">Time: ${q.bruteForce.time}</span>
              <span style="font-size: 0.75rem; background: rgba(239, 68, 68, 0.1); color: #fca5a5; padding: 3px 8px; border-radius: 6px; font-weight: 700; border: 1px solid rgba(239, 68, 68, 0.15);">Space: ${q.bruteForce.space}</span>
            </div>
          </div>

          <!-- Optimal Card -->
          <div class="hint-approach-card" style="background: rgba(6, 182, 212, 0.02); border: 1px solid rgba(6, 182, 212, 0.1); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
            <div>
              <h5 style="color: #67e8f9; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.1rem;">🟢</span> Optimal Approach
              </h5>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
                ${q.optimal.desc}
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.75rem; background: rgba(6, 182, 212, 0.1); color: #67e8f9; padding: 3px 8px; border-radius: 6px; font-weight: 700; border: 1px solid rgba(6, 182, 212, 0.15);">Time: ${q.optimal.time}</span>
              <span style="font-size: 0.75rem; background: rgba(6, 182, 212, 0.1); color: #67e8f9; padding: 3px 8px; border-radius: 6px; font-weight: 700; border: 1px solid rgba(6, 182, 212, 0.15);">Space: ${q.optimal.space}</span>
            </div>
          </div>
        </div>

        <!-- Step-by-Step Code Tracer -->
        <div class="tracer-section" style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <h5 style="color: #38bdf8; font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1.1rem;">🔍</span> Dry Run & Variables Tracer
          </h5>
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Sample Input:</span>
            <code style="font-family: monospace; background: rgba(0, 0, 0, 0.35); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: #38bdf8; margin-left: 6px; border: 1px solid rgba(255,255,255,0.03);">${q.tracer.input}</code>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(8, 12, 20, 0.6); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
            ${q.tracer.steps.map(step => `
              <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.02); padding-bottom: 4px; margin-bottom: 4px; display: flex; align-items: flex-start; gap: 8px;">
                <span style="color: #38bdf8; user-select: none;">▸</span>
                <span>${step.replace(/\*\*(.*?)\*\"/g, '<strong>$1</strong>')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="verification-error-box hidden" id="dsa-error-${tKey}-${idx}"></div>
    `;

    dsaList.appendChild(item);
  });

  // Attach event handlers for manual solve buttons
  dsaList.querySelectorAll('.manual-solve-btn').forEach(btn => {
    btn.onclick = () => {
      const topic = btn.getAttribute('data-topic');
      const idx = parseInt(btn.getAttribute('data-index'));
      
      userProgress.dsaSolved[topic][idx] = true;
      markModuleCompleted('dsa');
      saveProgressToStorage();
      
      const topicData = dsaDatabase[dsaTopicMapping[topic]];
      renderDSAPanel();
      showToast("Task Solved", `Marked "${topicData.questions[idx].title}" as solved!`, "success");
    };
  });

  // Attach event handlers for hints toggle buttons
  dsaList.querySelectorAll('.dsa-hints-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const panelId = btn.getAttribute('data-panel-id');
      const panel = document.getElementById(panelId);
      const isHidden = panel.classList.contains('hidden');

      if (isHidden) {
        panel.classList.remove('hidden');
        btn.innerHTML = `<span>💡</span> Hide Hints & Tracer`;
      } else {
        panel.classList.add('hidden');
        btn.innerHTML = `<span>💡</span> Show Hints & Tracer`;
      }
    };
  });

  // Attach event handlers for verify buttons
  dsaList.querySelectorAll('.verify-btn').forEach(btn => {
    btn.onclick = async (e) => {
      const topic = btn.getAttribute('data-topic');
      const idx = parseInt(btn.getAttribute('data-index'));
      const errorBox = document.getElementById(`dsa-error-${topic}-${idx}`);
      errorBox.classList.add('hidden');

      // Auto-save whatever is currently in the LeetCode username text box, in case they forgot to click "Save Username"
      const currentInputUsername = document.getElementById('leetcode-username').value.trim();
      if (currentInputUsername) {
        userProgress.leetcodeUsername = currentInputUsername;
        saveProgressToStorage();
      }

      if (!userProgress.leetcodeUsername) {
        errorBox.textContent = "Error: Please enter a LeetCode username above before verifying.";
        errorBox.classList.remove('hidden');
        return;
      }

      btn.classList.add('loading');
      btn.innerHTML = `<span class="spinner"></span> Verifying...`;
      btn.disabled = true;

      const topicData = dsaDatabase[dsaTopicMapping[topic]];
      const result = await verifyLeetCodeSubmission(userProgress.leetcodeUsername, topicData.questions[idx].slug);

      btn.classList.remove('loading');
      btn.innerHTML = `Verify Solution`;
      btn.disabled = false;

      if (result.success) {
        userProgress.dsaSolved[topic][idx] = true;
        markModuleCompleted('dsa');
        saveProgressToStorage();
        
        renderDSAPanel();
        showToast("Submission Verified", `Successfully verified "${topicData.questions[idx].title}" on LeetCode!`, "success");
      } else {
        errorBox.textContent = `Verification Failed: ${result.message}`;
        errorBox.classList.remove('hidden');
      }
    };
  });
}

// ==================== 2. APTITUDE PANEL ====================
let activeAptitudeTopic = "";
let currentQuizAnswers = {};
let activeAptitudeTab = 'notes'; // 'notes' or 'quiz'

function renderAptitudePanel() {
  const select = document.getElementById('aptitude-topic-select');
  const quizArea = document.getElementById('aptitude-quiz-area');
  const badge = document.getElementById('aptitude-topic-badge');

  select.value = activeAptitudeTopic;

  select.onchange = () => {
    activeAptitudeTopic = select.value;
    badge.textContent = select.options[select.selectedIndex].text;
    currentQuizAnswers = {};
    activeAptitudeTab = 'notes';
    loadAptitudeQuestions();
  };

  if (activeAptitudeTopic) {
    loadAptitudeQuestions();
  } else {
    quizArea.classList.add('hidden');
  }
}

function loadAptitudeQuestions() {
  const quizArea = document.getElementById('aptitude-quiz-area');
  const questionsList = document.getElementById('aptitude-questions-list');
  const scoreCard = document.getElementById('aptitude-score-card');
  const submitBtn = document.getElementById('submit-aptitude-quiz');
  
  // Study Notes Elements
  const notesArea = document.getElementById('aptitude-notes-area');
  const notesIntro = document.getElementById('notes-intro');
  const notesTipsList = document.getElementById('notes-tips-list');
  const startQuizBtn = document.getElementById('start-practice-quiz-btn');
  const quizFooter = document.getElementById('aptitude-quiz-footer');
  
  // Sub Tab Buttons
  const btnNotes = document.getElementById('aptitude-btn-notes');
  const btnQuiz = document.getElementById('aptitude-btn-quiz');

  quizArea.classList.remove('hidden');
  questionsList.innerHTML = "";

  const topicData = aptitudeDatabase[activeAptitudeTopic];
  if (!topicData) return;

  // Check if all modules are completed to load tomorrow's preview
  const completedModulesCount = Object.values(userProgress.todayCompletion).filter(v => v).length;
  const allCompletedToday = completedModulesCount === 4;

  let quizState = userProgress.aptitudeQuizzes[activeAptitudeTopic];

  if (allCompletedToday) {
    // Tomorrow preview mode for Aptitude!
    if (!userProgress.aptitudeAttempts) {
      userProgress.aptitudeAttempts = {};
    }
    const attempt = userProgress.aptitudeAttempts[activeAptitudeTopic] || 0;
    const randomQs = window.getRandomQuestions(activeAptitudeTopic, attempt, 1); // daySeedOffset = 1
    
    quizState = {
      questions: randomQs,
      answers: {},
      score: null,
      completed: false,
      attempt: attempt,
      isPreview: true
    };
  } else if (!quizState) {
    if (!userProgress.aptitudeAttempts) {
      userProgress.aptitudeAttempts = {};
    }
    const attempt = userProgress.aptitudeAttempts[activeAptitudeTopic] || 0;
    const randomQs = window.getRandomQuestions(activeAptitudeTopic, attempt, 0);
    quizState = {
      questions: randomQs,
      answers: {},
      score: null,
      completed: false,
      attempt: attempt
    };
    userProgress.aptitudeQuizzes[activeAptitudeTopic] = quizState;
    saveProgressToStorage();
  }

  const isCompleted = quizState.completed;
  currentQuizAnswers = quizState.answers || {};

  // Populate study notes
  notesIntro.textContent = topicData.notes.intro;
  
  // Parse and display formulas and solved example
  const formulasRaw = topicData.notes.formulas;
  const formulasContainer = document.getElementById('notes-formulas-container');
  if (formulasRaw.includes("**🔥 Shortcut Solved Example:**")) {
    const parts = formulasRaw.split("**🔥 Shortcut Solved Example:**");
    const formulasText = parts[0].trim();
    const exampleText = parts[1].trim();

    formulasContainer.innerHTML = `
      <pre id="notes-formulas" style="background: rgba(0,0,0,0.3); padding: 12px 16px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; color: #38bdf8; margin-bottom: 1.25rem; white-space: pre-wrap; line-height: 1.4; border: 1px solid rgba(255,255,255,0.04);">${formulasText}</pre>
      <div class="shortcut-example-card" style="background: rgba(139, 92, 246, 0.03); border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
        <h5 style="color: #c084fc; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
          <span>🔥</span> Shortcut Solved Example
        </h5>
        <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; white-space: pre-wrap; font-family: var(--font-family);">
          ${exampleText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </div>
      </div>
    `;
  } else {
    formulasContainer.innerHTML = `
      <pre id="notes-formulas" style="background: rgba(0,0,0,0.3); padding: 12px 16px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; color: #38bdf8; margin-bottom: 1.25rem; white-space: pre-wrap; line-height: 1.4; border: 1px solid rgba(255,255,255,0.04);">${formulasRaw}</pre>
    `;
  }

  notesTipsList.innerHTML = topicData.notes.tips.map(tip => `
    <li>${tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
  `).join('');

  // Handle Tab Switch Actions
  const switchTabUI = (targetTab) => {
    activeAptitudeTab = targetTab;
    if (targetTab === 'notes') {
      btnNotes.classList.add('active');
      btnNotes.style.color = "var(--text-main)";
      btnNotes.style.borderBottom = "2px solid var(--accent-primary)";
      
      btnQuiz.classList.remove('active');
      btnQuiz.style.color = "var(--text-secondary)";
      btnQuiz.style.borderBottom = "none";

      notesArea.classList.remove('hidden');
      questionsList.classList.add('hidden');
      quizFooter.classList.add('hidden');
      scoreCard.classList.add('hidden');
    } else {
      btnQuiz.classList.add('active');
      btnQuiz.style.color = "var(--text-main)";
      btnQuiz.style.borderBottom = "2px solid var(--accent-primary)";
      
      btnNotes.classList.remove('active');
      btnNotes.style.color = "var(--text-secondary)";
      btnNotes.style.borderBottom = "none";

      notesArea.classList.add('hidden');
      questionsList.classList.remove('hidden');

      if (quizState.isPreview) {
        scoreCard.classList.add('hidden');
        quizFooter.classList.add('hidden');
      } else if (isCompleted) {
        scoreCard.classList.remove('hidden');
        document.getElementById('aptitude-score-value').textContent = `${quizState.score} / 10`;
        quizFooter.classList.add('hidden');
      } else {
        scoreCard.classList.add('hidden');
        quizFooter.classList.remove('hidden');
      }
    }
  };

  btnNotes.onclick = () => switchTabUI('notes');
  btnQuiz.onclick = () => switchTabUI('quiz');
  startQuizBtn.onclick = () => switchTabUI('quiz');

  // Set default view on load
  if (isCompleted) {
    switchTabUI('quiz');
  } else {
    switchTabUI(activeAptitudeTab);
  }

  // Prepend tomorrow's preview banner if in preview mode
  if (quizState.isPreview) {
    const previewAlert = document.createElement('div');
    previewAlert.className = "alert alert-success";
    previewAlert.style.marginBottom = "1.5rem";
    previewAlert.style.display = "flex";
    previewAlert.style.alignItems = "center";
    previewAlert.style.justifyContent = "space-between";
    previewAlert.style.flexWrap = "wrap";
    previewAlert.style.gap = "8px";
    previewAlert.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem;">🔒</span>
        <div>
          <strong style="color: #fff;">Today's tasks finished!</strong> Showing a locked preview of tomorrow's Quantitative Aptitude quiz.
        </div>
      </div>
      <span style="font-size: 0.75rem; background: rgba(255,255,255,0.08); color: var(--text-secondary); padding: 4px 10px; border-radius: 6px; font-weight: 700; border: 1px solid rgba(255,255,255,0.03);">Tomorrow's Quiz</span>
    `;
    questionsList.appendChild(previewAlert);
  }

  // Populate Quiz Questions
  quizState.questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.classList.add('quiz-question-card');
    card.id = `aptitude-q-card-${idx}`;

    const solutionId = `aptitude-solution-${idx}`;
    const showSolutionBtnId = `show-sol-btn-${idx}`;

    // Render options
    let optionsHtml = "";
    q.options.forEach((opt, optIdx) => {
      let optionClass = "option-btn";
      const isSelected = currentQuizAnswers[idx] === optIdx;

      if (isCompleted) {
        if (optIdx === q.answer) {
          optionClass += " correct";
        } else if (isSelected) {
          optionClass += " wrong";
        }
      } else if (isSelected) {
        optionClass += " selected";
      }

      optionsHtml += `
        <button class="${optionClass}" data-q="${idx}" data-opt="${optIdx}" ${isCompleted || quizState.isPreview ? 'disabled' : ''}>
          ${String.fromCharCode(65 + optIdx)}. ${opt}
        </button>
      `;
    });

    card.innerHTML = `
      <div class="question-num">Question ${idx + 1} of 10</div>
      <div class="question-text">${q.question}</div>
      <div class="options-grid">
        ${optionsHtml}
      </div>
      
      ${isCompleted ? `
        <div class="question-actions" style="margin-top: 0.75rem;">
          <button class="show-solution-btn" id="${showSolutionBtnId}">Show Solution Explanation</button>
        </div>
        <div id="${solutionId}" class="solution-box hidden">
          <h5>Step-by-Step Explanation</h5>
          <p>${q.explanation}</p>
        </div>
      ` : ''}
    `;

    questionsList.appendChild(card);

    // Solution toggler (only if quiz is completed)
    const toggleBtn = card.querySelector('.show-solution-btn');
    if (toggleBtn) {
      const solBox = document.getElementById(solutionId);
      toggleBtn.onclick = () => {
        if (solBox.classList.contains('hidden')) {
          solBox.classList.remove('hidden');
          toggleBtn.textContent = "Hide Solution Explanation";
        } else {
          solBox.classList.add('hidden');
          toggleBtn.textContent = "Show Solution Explanation";
        }
      };
    }

    // Option clicks (only if not completed)
    if (!isCompleted) {
      card.querySelectorAll('.option-btn').forEach(btn => {
        btn.onclick = () => {
          const qIdx = parseInt(btn.getAttribute('data-q'));
          const optIdx = parseInt(btn.getAttribute('data-opt'));
          
          currentQuizAnswers[qIdx] = optIdx;
          quizState.answers = currentQuizAnswers;
          saveProgressToStorage();
          
          card.querySelectorAll('.option-btn').forEach(b => {
            const bOpt = parseInt(b.getAttribute('data-opt'));
            if (bOpt === optIdx) {
              b.classList.add('selected');
            } else {
               b.classList.remove('selected');
            }
          });
        };
      });
    }
  });

  // Submit Handler
  submitBtn.onclick = () => {
    const answeredCount = Object.keys(currentQuizAnswers).length;

    if (answeredCount < 10) {
      alert(`Please answer all 10 questions before submitting. You have answered ${answeredCount}/10.`);
      return;
    }

    let score = 0;
    quizState.questions.forEach((q, idx) => {
      if (currentQuizAnswers[idx] === q.answer) {
        score++;
      }
    });

    quizState.score = score;
    quizState.completed = true;
    userProgress.aptitudeScore = score;
    
    markModuleCompleted('aptitude');
    saveProgressToStorage();
    
    showToast("Quiz Submitted", `You scored ${score}/10 on ${topicData.title}!`, "success");
    loadAptitudeQuestions();
  };

  // Practice Again / Reset Handler
  const practiceAgainBtn = document.getElementById('aptitude-practice-again-btn');
  if (practiceAgainBtn) {
    practiceAgainBtn.onclick = () => {
      if (!userProgress.aptitudeAttempts) {
        userProgress.aptitudeAttempts = {};
      }
      const prevAttempt = userProgress.aptitudeAttempts[activeAptitudeTopic] || 0;
      userProgress.aptitudeAttempts[activeAptitudeTopic] = prevAttempt + 1;

      userProgress.aptitudeQuizzes[activeAptitudeTopic] = null;
      saveProgressToStorage();
      activeAptitudeTab = 'notes';
      showToast("Quiz Shuffled", `Loaded a different set of questions for ${topicData.title}!`, "success");
      loadAptitudeQuestions();
    };
  }
}

// ==================== 3. PARAGRAPH WRITING PANEL ====================
function renderWritingPanel() {
  const promptText = document.getElementById('writing-prompt-text');
  const editor = document.getElementById('writing-editor');
  const wordCountVal = document.getElementById('metric-words');
  const charCountVal = document.getElementById('metric-chars');
  const readTimeVal = document.getElementById('metric-read');
  const submitBtn = document.getElementById('submit-writing');
  const statusMsg = document.getElementById('writing-status-msg');
  const warningAlert = document.getElementById('anti-cheat-alert');

  // Rotate prompts daily based on day of year. If all completed today, load tomorrow's preview prompt!
  const completedModulesCount = Object.values(userProgress.todayCompletion).filter(v => v).length;
  const allCompletedToday = completedModulesCount === 4;
  let daySeed = getDayOfYear();
  let isPreview = false;
  if (allCompletedToday) {
    daySeed = daySeed + 1;
    isPreview = true;
  }
  const dateHash = daySeed % dailyPrompts.length;
  promptText.textContent = dailyPrompts[dateHash];

  // Load saved content
  editor.value = userProgress.writingContent || "";
  updateWritingMetrics(editor.value);

  const isCompleted = userProgress.todayCompletion.writing || userProgress.writingSubmitted;

  if (isPreview) {
    editor.disabled = true;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.innerHTML = '🔒 Locked Preview';
    submitBtn.classList.remove('hidden');
    statusMsg.innerHTML = `<span style="color:var(--warning)">🔒 Today's tasks finished! Showing a locked preview of tomorrow's writing prompt.</span>`;
  } else if (isCompleted) {
    editor.disabled = true;
    submitBtn.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.innerHTML = 'Submit Paragraph';
    statusMsg.innerHTML = `<span style="color:var(--success)">✓ Your paragraph was submitted successfully today!</span>`;
  } else {
    editor.disabled = false;
    submitBtn.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.innerHTML = 'Submit Paragraph';
    statusMsg.textContent = "";
  }

  // --- ANTI-CHEAT: BLOCK COPY & PASTE ---
  const triggerAntiCheat = (e) => {
    e.preventDefault();
    warningAlert.classList.add('show');
    setTimeout(() => {
      warningAlert.classList.remove('show');
    }, 4000);
  };

  // Block keyboard shortcuts (Ctrl+V, Cmd+V, Shift+Insert)
  editor.onkeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      triggerAntiCheat(e);
    }
    if (e.shiftKey && e.key === 'Insert') {
      triggerAntiCheat(e);
    }
  };

  // Block paste event
  editor.onpaste = (e) => triggerAntiCheat(e);

  // Block drop event (drag and drop text)
  editor.ondrop = (e) => triggerAntiCheat(e);

  // Block right-click context menu paste shortcut
  editor.oncontextmenu = (e) => {
    e.preventDefault();
    showToast("Copy-Paste Blocked", "Right-click is disabled to prevent pasting. Please type manually.", "warning");
  };

  // Real-time input updates
  editor.oninput = (e) => {
    const text = e.target.value;
    userProgress.writingContent = text;
    saveProgressToStorage();
    updateWritingMetrics(text);
  };

  function updateWritingMetrics(text) {
    const stats = analyzeParagraph(text);
    wordCountVal.textContent = stats.words;
    charCountVal.textContent = stats.characters;
    readTimeVal.textContent = `${stats.readingTime}s`;
  }

  // Submit Action
  submitBtn.onclick = () => {
    const text = editor.value.trim();
    const stats = analyzeParagraph(text);

    if (stats.words < 20) {
      alert("Please write a bit more to submit. Your response must be at least 20 words long.");
      return;
    }

    userProgress.writingSubmitted = true;
    markModuleCompleted('writing');
    renderWritingPanel();
  };
}

// ==================== 4. CORE CS THEORY & SQL PANEL ====================
let selectedMCQOption = null;

function renderTheoryPanel() {
  const completedModulesCount = Object.values(userProgress.todayCompletion).filter(v => v).length;
  const allCompletedToday = completedModulesCount === 4;
  let dateHash = getDayOfYear();
  let isPreview = false;
  if (allCompletedToday) {
    dateHash = dateHash + 1;
    isPreview = true;
  }
  
  // Concept Flashcard Rotation
  const conceptIdx = dateHash % theoryConcepts.length;
  const concept = theoryConcepts[conceptIdx];

  document.getElementById('theory-subject').textContent = concept.subject;
  document.getElementById('theory-question').textContent = concept.question;
  
  // Format description answers to support markdown lists
  document.getElementById('theory-answer').innerHTML = concept.answer
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  // MCQ Section
  const quiz = concept.quiz;
  const quizTitle = document.getElementById('theory-quiz-question');
  const quizOptions = document.getElementById('theory-quiz-options');
  const quizResult = document.getElementById('theory-quiz-result');

  quizTitle.innerHTML = `⚡ Mini Quiz: ${quiz.question}`;
  quizOptions.innerHTML = "";
  quizResult.classList.add('hidden');

  const isCompleted = userProgress.todayCompletion.theory || userProgress.theorySolved;

  quiz.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = opt;

    if (isPreview) {
      btn.disabled = true;
    } else if (isCompleted) {
      btn.disabled = true;
      if (idx === quiz.answer) {
        btn.classList.add('correct');
      }
    }

    btn.onclick = () => {
      // Clear selections
      quizOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMCQOption = idx;

      // Immediately check correctness
      quizResult.classList.remove('hidden');
      if (idx === quiz.answer) {
        quizResult.className = "alert alert-success";
        quizResult.textContent = "Correct Answer! SQL challenge is unlocked below.";
        
        // Solve the MCQ portion - can unlock SQL
        btn.classList.remove('selected');
        btn.classList.add('correct');
        quizOptions.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
      } else {
        quizResult.className = "alert alert-error";
        quizResult.textContent = "Wrong answer. Please review the flashcard content above and select again.";
        btn.classList.remove('selected');
        btn.classList.add('wrong');
      }
    };

    quizOptions.appendChild(btn);
  });

  // SQL playground rotation
  const sqlIdx = dateHash % sqlQuestions.length;
  const sql = sqlQuestions[sqlIdx];

  document.getElementById('sql-title').textContent = sql.title;
  document.getElementById('sql-description').textContent = sql.description;
  document.getElementById('sql-schema').textContent = sql.schema;
  document.getElementById('sql-input').textContent = sql.sampleInput;
  document.getElementById('sql-output').textContent = sql.sampleOutput;
  
  const sqlEditor = document.getElementById('sql-code-editor');
  const sqlFeedback = document.getElementById('sql-feedback');
  const sqlVerifyBtn = document.getElementById('verify-sql-btn');
  const revealSolBtn = document.getElementById('reveal-sql-solution');
  const solBox = document.getElementById('sql-solution-box');
  const solText = document.getElementById('sql-solution-text');

  solBox.classList.add('hidden');
  revealSolBtn.textContent = "Reveal Standard Solution";
  solText.textContent = sql.solution;

  if (isPreview) {
    sqlEditor.disabled = true;
    sqlVerifyBtn.classList.add('hidden');
    revealSolBtn.classList.add('hidden');
    sqlFeedback.className = "alert alert-warning";
    sqlFeedback.textContent = "🔒 Today's tasks finished! Showing a locked preview of tomorrow's SQL challenge.";
    sqlFeedback.classList.remove('hidden');
    
    // Show locked feedback on MCQ Result too
    quizResult.className = "alert alert-warning";
    quizResult.textContent = "🔒 Today's tasks finished! Tomorrow's MCQ is locked.";
    quizResult.classList.remove('hidden');
  } else if (isCompleted) {
    sqlEditor.disabled = true;
    sqlVerifyBtn.classList.add('hidden');
    revealSolBtn.classList.remove('hidden');
    sqlFeedback.className = "alert alert-success";
    sqlFeedback.textContent = "✓ SQL challenge completed successfully today!";
    sqlFeedback.classList.remove('hidden');
  } else {
    sqlEditor.disabled = false;
    sqlVerifyBtn.classList.remove('hidden');
    revealSolBtn.classList.remove('hidden');
    sqlFeedback.classList.add('hidden');
  }

  // Verify SQL Button
  sqlVerifyBtn.onclick = () => {
    const userQuery = sqlEditor.value;
    const checkResult = checkSQLQuery(sql.id, userQuery);
    
    sqlFeedback.classList.remove('hidden');
    
    if (checkResult.success) {
      sqlFeedback.className = "alert alert-success";
      sqlFeedback.textContent = checkResult.message;
      
      // Complete the theory/sql module!
      userProgress.theorySolved = true;
      markModuleCompleted('theory');
      renderTheoryPanel();
    } else {
      sqlFeedback.className = "alert alert-error";
      sqlFeedback.textContent = checkResult.message;
    }
  };

  // Reveal Solution Button
  revealSolBtn.onclick = () => {
    if (solBox.classList.contains('hidden')) {
      solBox.classList.remove('hidden');
      revealSolBtn.textContent = "Hide Standard Solution";
    } else {
      solBox.classList.add('hidden');
      revealSolBtn.textContent = "Reveal Standard Solution";
    }
  };
}
