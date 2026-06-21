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
  theorySolved: false,
  bookmarkedAptitude: [], // format: [{ topic: 'number-systems', topicTitle: 'Number Systems', question: qObj }]
  xp: 0,
  level: 1,
  theme: 'dark'
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
    userProgress.bookmarkedAptitude = userProgress.bookmarkedAptitude || [];
  } else {
    userProgress = createDefaultProgress();
  }

  // Check date transitions
  checkDailyReset();
  
  // Apply theme
  if (userProgress.theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  // Render views
  updateOverallProgress();
  updateGamifiedDashboard();
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
    updateGamifiedDashboard();
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
  setupCompanionDrawerEvents();
  setupSettingsModal();
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

  // Handle Aptitude Companion Trigger Visibility
  const companionTrigger = document.getElementById('btn-companion-trigger');
  if (companionTrigger) {
    if (tabKey === 'aptitude') {
      companionTrigger.classList.remove('hidden');
      updateCompanionDrawerUI();
    } else {
      companionTrigger.classList.add('hidden');
      // Auto close drawer if open
      const drawer = document.getElementById('drawer-companion');
      if (drawer) drawer.classList.remove('open');
    }
  }

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
              <span>📅</span> Tomorrow's Task
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
      gainXp(100, `Solved "${topicData.questions[idx].title}"`);
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
        gainXp(100, `Verified "${topicData.questions[idx].title}" on LeetCode`);
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
let aptitudeTimerInterval = null;
let aptitudeTimeElapsed = 0;
let activeCompanionTab = 'formulas';
let currentAptitudeQuestionIndex = 0;

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
    stopAptitudeTimer(true);
    currentAptitudeQuestionIndex = 0;
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
    
    // Toggle active timer display based on subtab selection
    const timerWidget = document.getElementById('aptitude-timer-widget');
    if (targetTab === 'quiz' && !isCompleted && !quizState.isPreview) {
      if (timerWidget) timerWidget.classList.remove('hidden');
      startAptitudeTimer();
    } else {
      if (timerWidget) timerWidget.classList.add('hidden');
      stopAptitudeTimer(false);
    }

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

        // Render completed scorecard stats
        const timeElapsed = quizState.timeTaken || 0;
        const mins = Math.floor(timeElapsed / 60);
        const secs = timeElapsed % 60;
        document.getElementById('stat-time-val').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        const avgSpeed = (timeElapsed / 10).toFixed(1);
        document.getElementById('stat-speed-val').textContent = `${avgSpeed}s/q`;
        
        let rating = "Thorough Thinker";
        if (quizState.score >= 8) {
          if (avgSpeed < 20) rating = "Speed Demon ⚡";
          else rating = "Balanced Analyst 🧠";
        } else if (quizState.score >= 6) {
          if (avgSpeed < 30) rating = "Quick Thinker ⚡";
          else rating = "Balanced Analyst 🧠";
        }
        document.getElementById('stat-badge-val').textContent = rating;
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



  // Populate Quiz Questions
  quizState.questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.classList.add('quiz-question-card');
    card.id = `aptitude-q-card-${idx}`;
    card.style.position = 'relative';

    // Hide all except current question in active quiz mode
    if (!isCompleted && idx !== currentAptitudeQuestionIndex) {
      card.classList.add('hidden');
    }

    const solutionId = `aptitude-solution-${idx}`;
    const showSolutionBtnId = `show-sol-btn-${idx}`;

    // Render options
    let optionsHtml = "";
    q.options.forEach((opt, optIdx) => {
      const isSelected = currentQuizAnswers[idx] === optIdx;
      let optionClass = "option-btn";
      if (isCompleted) {
        if (optIdx === q.answer) optionClass += " correct";
        else if (isSelected) optionClass += " wrong";
      } else if (isSelected) {
        optionClass += " selected";
      }

      optionsHtml += `
        <button class="${optionClass}" data-q="${idx}" data-opt="${optIdx}" ${isCompleted || quizState.isPreview ? 'disabled' : ''}>
          ${String.fromCharCode(65 + optIdx)}. ${opt}
        </button>
      `;
    });

    const isBookmarked = userProgress.bookmarkedAptitude.some(b => b.question.question === q.question);
    const starBtnHtml = `
      <button class="bookmark-star-btn ${isBookmarked ? 'active' : ''}" 
              id="star-btn-${idx}" 
              data-qidx="${idx}" 
              title="Bookmark Question" 
              style="position: absolute; top: 1.25rem; right: 1.25rem;">
        ⭐
      </button>
    `;

    card.innerHTML = `
      ${starBtnHtml}
      <div class="question-num">Question ${idx + 1} of 10</div>
      <div class="question-text">${q.question}</div>
      <div class="options-grid">
        ${optionsHtml}
      </div>
      
      <div class="question-actions" style="margin-top: 0.75rem;">
        <button class="show-solution-btn" id="${showSolutionBtnId}">Show Solution</button>
      </div>
      <div id="${solutionId}" class="solution-box hidden">
        <h5>Step-by-Step Explanation</h5>
        <p>${q.explanation}</p>
      </div>
    `;

    questionsList.appendChild(card);

    // Star bookmark toggle handler
    const starBtn = card.querySelector('.bookmark-star-btn');
    if (starBtn) {
      starBtn.onclick = (e) => {
        e.stopPropagation();
        const indexInBookmarks = userProgress.bookmarkedAptitude.findIndex(b => b.question.question === q.question);
        
        if (indexInBookmarks > -1) {
          userProgress.bookmarkedAptitude.splice(indexInBookmarks, 1);
          starBtn.classList.remove('active');
          showToast("Bookmark Removed", `Removed question from ${topicData.title}`, "success");
        } else {
          userProgress.bookmarkedAptitude.push({
            topic: activeAptitudeTopic,
            topicTitle: topicData.title,
            question: q
          });
          starBtn.classList.add('active');
          showToast("Question Bookmarked", `Saved to your Aptitude Companion!`, "success");
        }
        
        saveProgressToStorage();
        updateCompanionDrawerUI();
      };
    }

    // Helper to dynamically update option styles based on solution visibility
    const updateOptionStyles = (isSolRevealed) => {
      const selectedOptIdx = currentQuizAnswers[idx];
      card.querySelectorAll('.option-btn').forEach(btn => {
        const optIdx = parseInt(btn.getAttribute('data-opt'));
        btn.classList.remove('selected', 'correct', 'wrong');
        
        if (isCompleted) {
          if (optIdx === q.answer) {
            btn.classList.add('correct');
          } else if (selectedOptIdx === optIdx) {
            btn.classList.add('wrong');
          }
        } else {
          if (selectedOptIdx === optIdx) {
            btn.classList.add('selected');
          }
          if (isSolRevealed) {
            if (optIdx === q.answer) {
              btn.classList.add('correct');
            } else if (selectedOptIdx === optIdx) {
              btn.classList.add('wrong');
            }
          }
        }
      });
    };

    // Solution toggler
    const toggleBtn = card.querySelector('.show-solution-btn');
    if (toggleBtn) {
      const solBox = document.getElementById(solutionId);
      toggleBtn.onclick = () => {
        if (solBox.classList.contains('hidden')) {
          solBox.classList.remove('hidden');
          toggleBtn.textContent = "Hide Solution";
          updateOptionStyles(true);
        } else {
          solBox.classList.add('hidden');
          toggleBtn.textContent = "Show Solution";
          updateOptionStyles(false);
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
          
          const solBox = document.getElementById(solutionId);
          const isSolRevealed = !solBox.classList.contains('hidden');
          updateOptionStyles(isSolRevealed);
          
          // Re-render footer to reflect that dot status has updated to "answered"
          loadAptitudeQuestions();
        };
      });
    }
  });

  // Submit Submission execution helper
  const executeQuizSubmission = () => {
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
    quizState.timeTaken = aptitudeTimeElapsed;
    stopAptitudeTimer(false);
    userProgress.aptitudeScore = score;
    
    markModuleCompleted('aptitude');
    saveProgressToStorage();
    
    showToast("Quiz Submitted", `You scored ${score}/10 on ${topicData.title}!`, "success");
    gainXp(150, `Completed ${topicData.title} Quiz (Score: ${score}/10)`);
    currentAptitudeQuestionIndex = 0; // Reset index to 0
    loadAptitudeQuestions();
  };

  // Dynamic pagination navigation bar inside footer
  if (!isCompleted) {
    quizFooter.classList.remove('hidden');
    
    const isSubmitVisible = currentAptitudeQuestionIndex === 9 && !quizState.isPreview;
    const isNextVisible = currentAptitudeQuestionIndex < 9;
    
    quizFooter.innerHTML = `
      <div class="aptitude-nav-actions" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
        <button id="aptitude-prev-q-btn" class="btn-secondary" style="flex: 1; max-width: 150px; height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 0;" ${currentAptitudeQuestionIndex === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''}>
          <span>←</span> Prev
        </button>
        
        <!-- Step Indicators (dots) -->
        <div class="aptitude-progress-dots" style="display: flex; gap: 8px; align-items: center; justify-content: center; flex-wrap: wrap;">
          ${quizState.questions.map((_, dotIdx) => {
            const hasAnswered = currentQuizAnswers[dotIdx] !== undefined;
            const isActive = dotIdx === currentAptitudeQuestionIndex;
            let dotColor = 'rgba(255, 255, 255, 0.15)';
            if (isActive) dotColor = 'var(--accent-primary)';
            else if (hasAnswered) dotColor = 'var(--accent-secondary)';
            
            let borderStyle = isActive ? '2px solid #fff' : '1px solid rgba(255,255,255,0.08)';
            
            return `
              <span class="aptitude-dot ${isActive ? 'active' : ''} ${hasAnswered ? 'answered' : ''}" 
                    data-idx="${dotIdx}"
                    style="width: 10px; height: 10px; border-radius: 50%; background: ${dotColor}; border: ${borderStyle}; cursor: pointer; transition: var(--transition-smooth);"
                    title="Question ${dotIdx + 1}">
              </span>
            `;
          }).join('')}
        </div>

        ${isSubmitVisible ? `
          <button id="submit-aptitude-quiz" class="submit-quiz-btn" style="flex: 1; max-width: 180px; height: 44px; margin: 0; background: var(--accent-gradient); border: none; color: #fff; font-weight: 700; border-radius: var(--border-radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            Submit Quiz 🏆
          </button>
        ` : isNextVisible ? `
          <button id="aptitude-next-q-btn" class="btn-primary" style="flex: 1; max-width: 150px; height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            Next <span>→</span>
          </button>
        ` : `
          <div style="flex: 1; max-width: 150px;"></div>
        `}
      </div>
    `;

    // Attach listeners for prev/next buttons
    const prevBtn = document.getElementById('aptitude-prev-q-btn');
    if (prevBtn && currentAptitudeQuestionIndex > 0) {
      prevBtn.onclick = () => {
        currentAptitudeQuestionIndex--;
        loadAptitudeQuestions();
      };
    }
    
    const nextBtn = document.getElementById('aptitude-next-q-btn');
    if (nextBtn && currentAptitudeQuestionIndex < 9) {
      nextBtn.onclick = () => {
        currentAptitudeQuestionIndex++;
        loadAptitudeQuestions();
      };
    }
    
    // Attach listener for submit button
    const activeSubmitBtn = document.getElementById('submit-aptitude-quiz');
    if (activeSubmitBtn) {
      activeSubmitBtn.onclick = () => {
        executeQuizSubmission();
      };
    }

    // Attach listeners for dot clicks
    quizFooter.querySelectorAll('.aptitude-dot').forEach(dot => {
      dot.onclick = () => {
        const dotIdx = parseInt(dot.getAttribute('data-idx'));
        currentAptitudeQuestionIndex = dotIdx;
        loadAptitudeQuestions();
      };
    });
  } else {
    quizFooter.classList.add('hidden');
  }

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
      stopAptitudeTimer(true);
      saveProgressToStorage();
      activeAptitudeTab = 'notes';
      currentAptitudeQuestionIndex = 0; // Reset index to 0
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
    submitBtn.innerHTML = "Tomorrow's Prompt";
    submitBtn.classList.add('hidden');
    statusMsg.innerHTML = "";
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
    gainXp(100, "Completed paragraph writing prompt");
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
        gainXp(50, "Solved CS Core MCQ challenge");
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
    sqlFeedback.classList.add('hidden');
    quizResult.classList.add('hidden');
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
      gainXp(120, `Verified SQL query "${sql.title}"`);
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

// ==================== APTITUDE COMPANION & STOPWATCH LOGIC ====================

function startAptitudeTimer() {
  if (aptitudeTimerInterval) return;
  aptitudeTimerInterval = setInterval(() => {
    aptitudeTimeElapsed++;
    updateAptitudeTimerDisplay();
  }, 1000);
}

function stopAptitudeTimer(reset = false) {
  if (aptitudeTimerInterval) {
    clearInterval(aptitudeTimerInterval);
    aptitudeTimerInterval = null;
  }
  if (reset) {
    aptitudeTimeElapsed = 0;
  }
  updateAptitudeTimerDisplay();
}

function updateAptitudeTimerDisplay() {
  const display = document.getElementById('aptitude-timer-display');
  if (display) {
    const mins = Math.floor(aptitudeTimeElapsed / 60);
    const secs = aptitudeTimeElapsed % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

// Update the entire companion drawer (badges, formulas, bookmarks list)
function updateCompanionDrawerUI() {
  if (!userProgress) return;
  
  // Update floating trigger badge count
  const badgeVal = userProgress.bookmarkedAptitude ? userProgress.bookmarkedAptitude.length : 0;
  const triggerBadge = document.getElementById('companion-trigger-badge');
  if (triggerBadge) {
    triggerBadge.textContent = badgeVal;
    if (badgeVal > 0) {
      triggerBadge.classList.remove('hidden');
    } else {
      triggerBadge.classList.add('hidden');
    }
  }

  // Update tab headers badge count
  const countSpan = document.getElementById('drawer-bookmarks-count');
  if (countSpan) {
    countSpan.textContent = badgeVal;
  }

  // Update formulas pane
  const formulasContent = document.getElementById('drawer-formulas-content');
  const formulasLoading = document.getElementById('drawer-formulas-loading');
  if (activeAptitudeTopic && aptitudeDatabase[activeAptitudeTopic]) {
    if (formulasLoading) formulasLoading.classList.add('hidden');
    
    const topicData = aptitudeDatabase[activeAptitudeTopic];
    const formulasRaw = topicData.notes.formulas;
    let formulasHtml = "";
    
    if (formulasRaw.includes("**🔥 Shortcut Solved Example:**")) {
      const parts = formulasRaw.split("**🔥 Shortcut Solved Example:**");
      const formulasText = parts[0].trim();
      const exampleText = parts[1].trim();

      formulasHtml = `
        <h4 style="color:var(--text-main); font-size:0.9rem; font-weight:700; margin-bottom:0.5rem; margin-top: 0.5rem;">Formulas for ${topicData.title}:</h4>
        <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; color: #38bdf8; margin-bottom: 1rem; white-space: pre-wrap; line-height: 1.4; border: 1px solid rgba(255,255,255,0.04);">${formulasText}</pre>
        <div style="background: rgba(139, 92, 246, 0.03); border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 8px; padding: 1rem;">
          <h5 style="color: #c084fc; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 4px;">
            <span>🔥</span> Shortcut Example
          </h5>
          <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; white-space: pre-wrap;">
            ${exampleText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </div>
        </div>
      `;
    } else {
      formulasHtml = `
        <h4 style="color:var(--text-main); font-size:0.9rem; font-weight:700; margin-bottom:0.5rem; margin-top: 0.5rem;">Formulas for ${topicData.title}:</h4>
        <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; color: #38bdf8; margin-bottom: 1rem; white-space: pre-wrap; line-height: 1.4; border: 1px solid rgba(255,255,255,0.04);">${formulasRaw}</pre>
      `;
    }
    
    // Add tips too
    formulasHtml += `
      <h4 style="color:var(--text-main); font-size:0.9rem; font-weight:700; margin-top:1.25rem; margin-bottom:0.5rem;">Shortcut Tips:</h4>
      <ul style="margin-left: 1.25rem; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px; line-height: 1.4;">
        ${topicData.notes.tips.map(tip => `<li>${tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
      </ul>
    `;
    
    if (formulasContent) formulasContent.innerHTML = formulasHtml;
  } else {
    if (formulasLoading) formulasLoading.classList.remove('hidden');
    if (formulasContent) formulasContent.innerHTML = "";
  }

  // Update bookmarked list pane
  const emptyMsg = document.getElementById('drawer-bookmarks-empty');
  const listContainer = document.getElementById('drawer-bookmarks-list');
  const bookmarkedList = userProgress.bookmarkedAptitude || [];
  
  if (bookmarkedList.length === 0) {
    if (emptyMsg) emptyMsg.classList.remove('hidden');
    if (listContainer) listContainer.innerHTML = "";
  } else {
    if (emptyMsg) emptyMsg.classList.add('hidden');
    if (listContainer) {
      listContainer.innerHTML = bookmarkedList.map((bookmark, idx) => {
        const q = bookmark.question;
        
        return `
          <div class="bookmarked-q-card" id="bookmark-card-${idx}">
            <div class="bookmarked-q-topic">${bookmark.topicTitle}</div>
            <div class="bookmarked-q-text">${q.question}</div>
            
            <div class="bookmarked-q-options">
              ${q.options.map((opt, optIdx) => `
                <div class="bookmarked-q-option-line ${optIdx === q.answer ? 'correct-opt' : ''}">
                  ${String.fromCharCode(65 + optIdx)}. ${opt}
                </div>
              `).join('')}
            </div>

            <div id="bookmark-sol-${idx}" class="solution-box hidden" style="margin: 0.5rem 0; font-size: 0.82rem; background: rgba(6, 182, 212, 0.02);">
              <h5 style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom: 0.25rem;">Step-by-step Explanation</h5>
              <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4; margin:0;">${q.explanation}</p>
            </div>

            <div class="bookmarked-q-actions">
              <button class="remove-bookmark-btn" onclick="removeAptitudeBookmark(${idx})">
                🗑️ Remove
              </button>
              <button class="toggle-bookmark-sol-btn" id="btn-toggle-bookmark-sol-${idx}" onclick="toggleBookmarkSolution(${idx})">
                📖 View Solution
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// Global functions so onclick HTML handlers can access them
window.removeAptitudeBookmark = function(idx) {
  if (!userProgress.bookmarkedAptitude) return;
  const removed = userProgress.bookmarkedAptitude.splice(idx, 1)[0];
  saveProgressToStorage();
  updateCompanionDrawerUI();
  showToast("Bookmark Removed", `Removed question from ${removed.topicTitle}`, "success");
  
  // Update star buttons on current quiz screen if they match the removed bookmark
  document.querySelectorAll('.bookmark-star-btn').forEach(btn => {
    const qIdx = parseInt(btn.getAttribute('data-qidx'));
    const qCard = btn.closest('.quiz-question-card');
    if (qCard) {
      const qText = qCard.querySelector('.question-text').textContent;
      if (qText === removed.question.question) {
        btn.classList.remove('active');
      }
    }
  });
};

window.toggleBookmarkSolution = function(idx) {
  const solBox = document.getElementById(`bookmark-sol-${idx}`);
  const btn = document.getElementById(`btn-toggle-bookmark-sol-${idx}`);
  if (solBox && btn) {
    if (solBox.classList.contains('hidden')) {
      solBox.classList.remove('hidden');
      btn.textContent = "🙈 Hide Solution";
    } else {
      solBox.classList.add('hidden');
      btn.textContent = "📖 View Solution";
    }
  }
};

// Initialize Companion Drawer DOM Event Listeners
function setupCompanionDrawerEvents() {
  const trigger = document.getElementById('btn-companion-trigger');
  const drawer = document.getElementById('drawer-companion');
  const closeBtn = document.getElementById('drawer-close');
  const tabFormulas = document.getElementById('drawer-tab-btn-formulas');
  const tabBookmarks = document.getElementById('drawer-tab-btn-bookmarks');
  const panelFormulas = document.getElementById('drawer-panel-formulas');
  const panelBookmarks = document.getElementById('drawer-panel-bookmarks');

  if (!trigger || !drawer || !closeBtn) return;

  trigger.onclick = () => {
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open')) {
      updateCompanionDrawerUI();
    }
  };

  closeBtn.onclick = () => {
    drawer.classList.remove('open');
  };

  const switchDrawerTab = (tab) => {
    activeCompanionTab = tab;
    if (tab === 'formulas') {
      tabFormulas.classList.add('active');
      tabBookmarks.classList.remove('active');
      panelFormulas.classList.add('active');
      panelBookmarks.classList.remove('active');
    } else {
      tabBookmarks.classList.add('active');
      tabFormulas.classList.remove('active');
      panelBookmarks.classList.add('active');
      panelFormulas.classList.remove('active');
      updateCompanionDrawerUI(); // refresh bookmarks view
    }
  };

  tabFormulas.onclick = () => switchDrawerTab('formulas');
  tabBookmarks.onclick = () => switchDrawerTab('bookmarks');
}

// ==================== GAMIFIED STATS & XP SYSTEM ====================

function gainXp(amount, reason) {
  if (!userProgress) return;
  const oldLevel = Math.floor((userProgress.xp || 0) / 1000) + 1;
  userProgress.xp = (userProgress.xp || 0) + amount;
  const newLevel = Math.floor(userProgress.xp / 1000) + 1;
  
  saveProgressToStorage();
  updateGamifiedDashboard();
  
  showToast(`+${amount} XP Earned`, reason, "success");
  
  if (newLevel > oldLevel) {
    const rankName = getRankName(newLevel);
    setTimeout(() => {
      showToast("🎉 Level Up!", `Congratulations! You are now Level ${newLevel}: ${rankName}`, "success");
    }, 1200);
  }
}

function updateGamifiedDashboard() {
  if (!userProgress) return;
  
  updateCalendarAndStreakUI();
  
  const level = Math.floor((userProgress.xp || 0) / 1000) + 1;
  const currentXp = (userProgress.xp || 0) % 1000;
  
  userProgress.level = level;

  // Update Rank & Level Labels
  const rankNameEl = document.getElementById('user-rank-name');
  if (rankNameEl) {
    rankNameEl.textContent = `Lvl ${level}: ${getRankName(level)}`;
  }
  
  const xpFillEl = document.getElementById('xp-bar-fill');
  if (xpFillEl) {
    const pct = (currentXp / 1000) * 100;
    xpFillEl.style.width = `${pct}%`;
  }
  
  const xpCurrentEl = document.getElementById('xp-current-val');
  if (xpCurrentEl) {
    xpCurrentEl.textContent = `${currentXp} / 1000 XP`;
  }
  
  const xpTargetEl = document.getElementById('xp-target-val');
  if (xpTargetEl) {
    xpTargetEl.textContent = `${1000 - currentXp} XP to next level`;
  }

  // Update Quests Board
  // 1. DSA Solved Count
  let todayDsaSolvedCount = 0;
  const dayOffset = getDayOfYear();
  
  const dsaQuestions = [];
  Object.keys(dsaDatabase).forEach(topic => {
    dsaDatabase[topic].questions.forEach((q, idx) => {
      dsaQuestions.push({ ...q, topicKey: topic, originalIndex: idx });
    });
  });
  
  const totalDsaQs = dsaQuestions.length;
  const startIdx = (dayOffset * 3) % totalDsaQs;
  const todayQuestions = [];
  for (let i = 0; i < 3; i++) {
    todayQuestions.push(dsaQuestions[(startIdx + i) % totalDsaQs]);
  }
  
  todayQuestions.forEach(q => {
    const isSolved = userProgress.dsaSolved[q.topicKey] && userProgress.dsaSolved[q.topicKey][q.originalIndex];
    if (isSolved) todayDsaSolvedCount++;
  });

  const questDsaStatus = document.getElementById('quest-dsa-status');
  const questDsaEl = document.getElementById('quest-dsa');
  if (questDsaStatus && questDsaEl) {
    questDsaStatus.textContent = `${todayDsaSolvedCount} / 3`;
    if (todayDsaSolvedCount === 3) {
      questDsaEl.style.color = 'var(--success)';
      questDsaStatus.innerHTML = `3 / 3 ✅`;
    } else {
      questDsaEl.style.color = 'var(--text-secondary)';
    }
  }

  // 2. Aptitude Completed
  const questAptitudeStatus = document.getElementById('quest-aptitude-status');
  const questAptitudeEl = document.getElementById('quest-aptitude');
  if (questAptitudeStatus && questAptitudeEl) {
    const done = userProgress.todayCompletion.aptitude;
    questAptitudeStatus.innerHTML = done ? `1 / 1 ✅` : `0 / 1`;
    questAptitudeEl.style.color = done ? 'var(--success)' : 'var(--text-secondary)';
  }

  // 3. Writing Completed
  const questWritingStatus = document.getElementById('quest-writing-status');
  const questWritingEl = document.getElementById('quest-writing');
  if (questWritingStatus && questWritingEl) {
    const done = userProgress.todayCompletion.writing;
    questWritingStatus.innerHTML = done ? `1 / 1 ✅` : `0 / 1`;
    questWritingEl.style.color = done ? 'var(--success)' : 'var(--text-secondary)';
  }

  // 4. CS Core Theory Completed
  const questTheoryStatus = document.getElementById('quest-theory-status');
  const questTheoryEl = document.getElementById('quest-theory');
  if (questTheoryStatus && questTheoryEl) {
    const done = userProgress.todayCompletion.theory;
    questTheoryStatus.innerHTML = done ? `1 / 1 ✅` : `0 / 1`;
    questTheoryEl.style.color = done ? 'var(--success)' : 'var(--text-secondary)';
  }
}

function getRankName(level) {
  const ranks = [
    "SDE Apprentice",       // Level 1
    "Junior Engineer",      // Level 2
    "System Architect",     // Level 3
    "Full-Stack Developer", // Level 4
    "Technical Lead",       // Level 5
    "Staff Engineer",       // Level 6
    "Senior Architect",     // Level 7
    "Principal Engineer",   // Level 8
    "VP of Engineering",    // Level 9
    "Distinguished Fellow"  // Level 10+
  ];
  if (level <= 0) return ranks[0];
  if (level > ranks.length) return ranks[ranks.length - 1];
  return ranks[level - 1];
}

// ==================== WORKSPACE SETTINGS MODAL LOGIC ====================

function setupSettingsModal() {
  const toggleBtn = document.getElementById('settings-toggle-btn');
  const modal = document.getElementById('modal-settings');
  const closeBtn = document.getElementById('settings-close-btn');
  const saveBtn = document.getElementById('settings-save-btn');
  const usernameInput = document.getElementById('settings-username-input');
  
  const themeBtnDark = document.getElementById('theme-btn-dark');
  const themeBtnLight = document.getElementById('theme-btn-light');

  if (!toggleBtn || !modal || !closeBtn || !saveBtn || !usernameInput) return;

  let chosenTheme = userProgress.theme || 'dark';

  // Toggle Modal open
  toggleBtn.onclick = () => {
    usernameInput.value = activeUser.username;
    chosenTheme = userProgress.theme || 'dark';
    
    // Select theme UI buttons
    if (chosenTheme === 'light') {
      themeBtnLight.classList.add('active-theme');
      themeBtnDark.classList.remove('active-theme');
    } else {
      themeBtnDark.classList.add('active-theme');
      themeBtnLight.classList.remove('active-theme');
    }
    
    modal.classList.remove('hidden');
  };

  // Close modal
  closeBtn.onclick = () => {
    modal.classList.add('hidden');
  };

  // Theme Toggles
  themeBtnDark.onclick = () => {
    chosenTheme = 'dark';
    themeBtnDark.classList.add('active-theme');
    themeBtnLight.classList.remove('active-theme');
  };

  themeBtnLight.onclick = () => {
    chosenTheme = 'light';
    themeBtnLight.classList.add('active-theme');
    themeBtnDark.classList.remove('active-theme');
  };

  // Save click
  saveBtn.onclick = () => {
    const newUsername = usernameInput.value.trim();
    if (!newUsername) {
      alert("Username cannot be empty.");
      return;
    }

    const oldUsername = activeUser.username;
    
    // Save theme configuration
    userProgress.theme = chosenTheme;
    if (chosenTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    // Save username details if changed
    if (newUsername !== oldUsername) {
      activeUser.username = newUsername;
      localStorage.setItem('dailyprep_active_user', JSON.stringify(activeUser));

      // Migrate storage keys
      localStorage.removeItem(`dailyprep_progress_${oldUsername}`);
      localStorage.setItem(`dailyprep_progress_${newUsername}`, JSON.stringify(userProgress));

      // Update UI components
      const displayUsername = document.getElementById('display-username');
      const displayAvatar = document.getElementById('display-avatar');
      if (displayUsername) displayUsername.textContent = newUsername;
      if (displayAvatar && !activeUser.avatarUrl) {
        displayAvatar.textContent = newUsername.charAt(0).toUpperCase();
      }
    }

    saveProgressToStorage();
    updateGamifiedDashboard();
    modal.classList.add('hidden');
    showToast("Settings Saved", "Workspace settings updated successfully!", "success");
  };
}

function updateCalendarAndStreakUI() {
  const d = new Date();
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  
  const monthEl = document.getElementById('cal-month');
  const dayEl = document.getElementById('cal-day');
  const yearEl = document.getElementById('cal-year');
  const streakCountEl = document.getElementById('streak-count');
  const streakIconEl = document.getElementById('streak-fire-icon');
  const streakMsgEl = document.getElementById('streak-message');

  if (monthEl) monthEl.textContent = months[d.getMonth()];
  if (dayEl) dayEl.textContent = d.getDate();
  if (yearEl) yearEl.textContent = d.getFullYear();

  if (userProgress) {
    const streak = userProgress.streak || 0;
    if (streakCountEl) {
      streakCountEl.textContent = `${streak} Day${streak !== 1 ? 's' : ''}`;
    }
    
    let emoji = "🔥";
    let message = "Start your daily quest to build consistency!";
    
    if (streak === 0) {
      emoji = "❄️";
      message = "Start a daily quest to ignite your streak!";
    } else if (streak <= 3) {
      emoji = "🔥";
      message = "Streak ignited! Keep up the daily practice.";
    } else if (streak <= 7) {
      emoji = "⚡🔥";
      message = "Hot streak! You're building solid SDE habits.";
    } else {
      emoji = "👑🔥";
      message = "Legendary consistency! Placement ready status!";
    }
    
    if (streakIconEl) streakIconEl.textContent = emoji;
    if (streakMsgEl) streakMsgEl.textContent = message;
  }
}
