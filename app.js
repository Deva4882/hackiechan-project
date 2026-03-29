/* =========================
   DATA INIT
========================= */
let newsData = JSON.parse(localStorage.getItem("newsData")) || [...defaultNewsData];
let isAdmin = JSON.parse(localStorage.getItem("isAdmin")) || false;

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
  name: "Guest User",
  email: "guest@newsbyte.ai",
  bio: "AI-powered news explorer",
  avatar: "🧑"
};

let currentTheme = localStorage.getItem("theme") || "light";
let currentNews = null;
let currentTab = "home";
let currentCategory = "All";
let currentSearch = "";
let activeCommentNewsId = null;
let selectedLanguage = localStorage.getItem("selectedLanguage") || "English";

/* =========================
   SAVE HELPERS
========================= */
function saveNews() {
  localStorage.setItem("newsData", JSON.stringify(newsData));
}

function saveUserProfile() {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function saveAdminState() {
  localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
}

/* =========================
   THEME
========================= */
function applyTheme() {
  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme();
  rerenderCurrentPage();
}

function rerenderCurrentPage() {
  if (currentTab === "home") renderHomePage();
  else if (currentTab === "news") renderNewsPage();
  else if (currentTab === "explore") renderExplorePage();
  else if (currentTab === "profile") renderProfilePage();
  else if (currentTab === "admin") renderAdminPage();
  else if (currentTab === "saved") renderSavedPage();
  else if (currentTab === "notifications") renderNotificationsPage();
  else if (currentTab === "details" && currentNews) openDetails(currentNews.id);
  else renderHomePage();
}

/* =========================
   LOGIN / SPLASH
========================= */
function showSplashThenLogin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="splash-screen">
      <div class="splash-logo">News<span>Byte AI</span></div>
      <div class="loader-ring"></div>
      <p class="splash-text">Loading your AI-native news experience...</p>
    </div>
  `;

  setTimeout(() => {
    renderLoginPage();
  }, 2000);
}

function renderLoginPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="login-page fade-in-page">
      <div class="login-box">
        <h1>News<span>Byte AI</span></h1>
        <p>Login to explore AI-powered short news videos.</p>

        <input id="loginName" type="text" placeholder="Enter your name" />
        <input id="loginEmail" type="email" placeholder="Enter your email" />

        <button onclick="loginUser()">Login</button>
        <button class="guest-btn" onclick="continueAsGuest()">Continue as Guest</button>

        <div style="margin-top:18px;">
          <button class="secondary-btn" onclick="renderAdminLoginPage()">Admin Login</button>
        </div>
      </div>
    </div>
  `;
}

function loginUser() {
  const name = document.getElementById("loginName").value.trim();
  const email = document.getElementById("loginEmail").value.trim();

  currentUser.name = name || "User";
  currentUser.email = email || "user@newsbyte.ai";
  saveUserProfile();

  renderHomePage();
}

function continueAsGuest() {
  currentUser = {
    name: "Guest User",
    email: "guest@newsbyte.ai",
    bio: "AI-powered news explorer",
    avatar: "🧑"
  };
  saveUserProfile();
  renderHomePage();
}

/* =========================
   ADMIN LOGIN
========================= */
function renderAdminLoginPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="login-page fade-in-page">
      <div class="login-box">
        <h1>Admin<span>Panel</span></h1>
        <p>Only admins can upload, edit, or delete news.</p>

        <input id="adminUser" type="text" placeholder="Admin username" />
        <input id="adminPass" type="password" placeholder="Admin password" />

        <button onclick="adminLogin()">Login as Admin</button>
        <button class="guest-btn" onclick="renderLoginPage()">Back</button>
      </div>
    </div>
  `;
}

function adminLogin() {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (user === "admin" && pass === "1234") {
    isAdmin = true;
    saveAdminState();
    alert("Admin login successful!");
    renderAdminPage();
  } else {
    alert("Invalid admin credentials.\nUse:\nUsername: admin\nPassword: 1234");
  }
}

function adminLogout() {
  isAdmin = false;
  saveAdminState();
  alert("Admin logged out.");
  renderHomePage();
}

/* =========================
   AI ENGINE
========================= */
function detectCategory(title, summary) {
  const text = (title + " " + summary).toLowerCase();

  if (
    text.includes("cricket") ||
    text.includes("football") ||
    text.includes("match") ||
    text.includes("series") ||
    text.includes("sports")
  ) return "Sports";

  if (
    text.includes("ai") ||
    text.includes("tech") ||
    text.includes("software") ||
    text.includes("startup") ||
    text.includes("robot") ||
    text.includes("digital")
  ) return "Technology";

  if (
    text.includes("market") ||
    text.includes("policy") ||
    text.includes("business") ||
    text.includes("investment") ||
    text.includes("company") ||
    text.includes("economy") ||
    text.includes("ev")
  ) return "Business";

  return "General";
}

function generateAISummary(news) {
  return {
    shortSummary: `In short: ${news.summary}`,
    simpleExplanation: `${news.title} means that ${news.summary.toLowerCase()}`,
    importance: `This is important because it may affect people, decisions, and future developments related to ${news.category.toLowerCase()}.`,
    impact: `The likely impact is increased public attention, discussion, and possible changes in the ${news.category.toLowerCase()} sector.`,
    whoBenefits: `People interested in ${news.category.toLowerCase()}, policymakers, businesses, students, and the general public may benefit from understanding this news.`,
    futurePrediction: `If this trend continues, we may see more updates and deeper impact in the coming days or weeks.`,
    keyPoints: `
1. ${news.title}
2. ${news.summary}
3. This may influence the ${news.category.toLowerCase()} sector.
    `
  };
}

function translateSummary(text, language) {
  const translations = {
    Hindi: `हिंदी सारांश: ${text}`,
    Telugu: `తెలుగు సారాంశం: ${text}`,
    Gujarati: `ગુજરાતી સારાંશ: ${text}`,
    Tamil: `தமிழ் சுருக்கம்: ${text}`,
    Kannada: `ಕನ್ನಡ ಸಾರಾಂಶ: ${text}`,
    English: text
  };

  return translations[language] || text;
}

function askSmartAI(news, question) {
  const q = question.toLowerCase();
  const ai = generateAISummary(news);

  if (q.includes("what happened") || q.includes("what is this") || q.includes("news about")) {
    return ai.shortSummary;
  }

  if (q.includes("explain") || q.includes("simple") || q.includes("easy")) {
    return ai.simpleExplanation;
  }

  if (q.includes("why important") || q.includes("importance") || q.includes("why does it matter")) {
    return ai.importance;
  }

  if (q.includes("impact") || q.includes("effect") || q.includes("result")) {
    return ai.impact;
  }

  if (q.includes("who benefits") || q.includes("who is affected") || q.includes("who involved")) {
    return ai.whoBenefits;
  }

  if (q.includes("future") || q.includes("prediction") || q.includes("next")) {
    return ai.futurePrediction;
  }

  if (q.includes("key points") || q.includes("3 points") || q.includes("main points")) {
    return ai.keyPoints;
  }

  if (q.includes("summary") || q.includes("short")) {
    return ai.shortSummary;
  }

  return `
AI Answer:
"${news.title}" is about ${news.category.toLowerCase()}.

Main idea:
${news.summary}

Why it matters:
${ai.importance}

Likely impact:
${ai.impact}
  `;
}

/* =========================
   EXPLORE RANK
========================= */
function getExploreRankedNews() {
  return [...newsData].sort((a, b) => {
    const scoreA = a.likes + (a.saved ? 500 : 0) + a.shares * 2 + (a.comments * 2);
    const scoreB = b.likes + (b.saved ? 500 : 0) + b.shares * 2 + (b.comments * 2);
    return scoreB - scoreA;
  });
}

/* =========================
   DETAILS PAGE
========================= */
function openDetails(newsId) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  currentNews = news;
  currentTab = "details";

  const ai = generateAISummary(news);
  const translated = translateSummary(ai.shortSummary, selectedLanguage);

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="details-page fade-in-page">
      <button class="back-btn" onclick="renderNewsPage()">← Back</button>

      <div class="details-container">
        <video controls autoplay playsinline>
          <source src="${news.video}" type="video/mp4">
        </video>

        <div class="details-meta">
          <div class="meta-pill">${news.category}</div>
          <div class="meta-pill">${news.likes} Likes</div>
          <div class="meta-pill">${news.comments} Comments</div>
          <div class="meta-pill">${news.shares} Shares</div>
        </div>

        <h2>${news.title}</h2>

        <div class="summary-box">
          <strong>Summary:</strong><br><br>
          ${translated}
        </div>

        <div class="controls-row">
          <label>Select Language</label>
          <select onchange="changeLanguage(this.value)">
            ${["English", "Hindi", "Telugu", "Gujarati", "Tamil", "Kannada"].map(lang => `
              <option value="${lang}" ${selectedLanguage === lang ? "selected" : ""}>${lang}</option>
            `).join("")}
          </select>
        </div>

        <div class="controls-row">
          <h3>Ask AI About This News</h3>
          <div class="prompt-chip-row">
            <button class="prompt-chip" onclick="fillAIQuestion('Explain in simple words')">Explain Simply</button>
            <button class="prompt-chip" onclick="fillAIQuestion('Give 3 key points')">3 Key Points</button>
            <button class="prompt-chip" onclick="fillAIQuestion('Why is this important?')">Why Important?</button>
            <button class="prompt-chip" onclick="fillAIQuestion('Who is affected?')">Who is Affected?</button>
            <button class="prompt-chip" onclick="fillAIQuestion('Future impact')">Future Impact</button>
          </div>

          <input id="aiQuestion" type="text" placeholder="Ask AI anything about this news..." />
          <button class="ask-btn" onclick="askAIOnCurrentNews()">Ask AI</button>
        </div>

        <div id="aiAnswerBox" class="ai-box">
          <strong>AI Summary:</strong><br><br>
          ${translated}
        </div>
      </div>
    </div>
  `;
}

function fillAIQuestion(text) {
  const input = document.getElementById("aiQuestion");
  if (input) input.value = text;
}

function askAIOnCurrentNews() {
  if (!currentNews) return;

  const input = document.getElementById("aiQuestion");
  const answerBox = document.getElementById("aiAnswerBox");
  if (!input || !answerBox) return;

  const question = input.value.trim();
  if (!question) {
    alert("Please type a question for AI.");
    return;
  }

  const answer = askSmartAI(currentNews, question);
  answerBox.innerHTML = `<strong>AI Answer:</strong><br><br>${translateSummary(answer, selectedLanguage).replace(/\n/g, "<br>")}`;
}

function changeLanguage(language) {
  selectedLanguage = language;
  localStorage.setItem("selectedLanguage", language);

  if (currentTab === "details" && currentNews) {
    openDetails(currentNews.id);
  } else {
    rerenderCurrentPage();
  }
}

/* =========================
   PROFILE PAGE
========================= */
function renderProfilePage() {
  currentTab = "profile";
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="details-page fade-in-page">
      <div class="top-header">
        <div class="logo">Profile</div>
        <div class="header-icons">
          <button onclick="toggleTheme()" class="theme-toggle">🌗</button>
        </div>
      </div>

      <div class="details-container" style="margin-top:100px;">
        <div class="profile-header-card">
          <div class="profile-avatar">${currentUser.avatar || "🧑"}</div>
          <h2>${currentUser.name}</h2>
          <p style="color:var(--subtext);">${currentUser.email}</p>
          <p style="margin-top:10px; color:var(--subtext);">${currentUser.bio || ""}</p>

          <div class="stats-row">
            <div class="stat-card">
              <h3>${newsData.filter(n => n.saved).length}</h3>
              <p>Saved</p>
            </div>
            <div class="stat-card">
              <h3>${newsData.reduce((a, b) => a + b.likes, 0)}</h3>
              <p>Likes</p>
            </div>
          </div>
        </div>

        <div class="controls-row">
          <h3>Edit Profile</h3>
          <input id="profileName" type="text" value="${currentUser.name}" placeholder="Name" />
          <input id="profileEmail" type="email" value="${currentUser.email}" placeholder="Email" />
          <input id="profileAvatar" type="text" value="${currentUser.avatar}" placeholder="Avatar Emoji (e.g. 😎)" />
          <textarea id="profileBio" placeholder="Bio">${currentUser.bio || ""}</textarea>

          <button class="primary-btn" onclick="updateProfile()">Save Profile</button>
        </div>

        ${
          isAdmin
            ? `<button class="secondary-btn" onclick="renderAdminPage()">Go to Admin Panel</button>
               <button class="danger-btn" onclick="adminLogout()">Logout Admin</button>`
            : `<button class="secondary-btn" onclick="renderAdminLoginPage()">Admin Login</button>`
        }
      </div>

      ${renderBottomNav("profile")}
    </div>
  `;
}

function updateProfile() {
  currentUser.name = document.getElementById("profileName").value.trim() || "User";
  currentUser.email = document.getElementById("profileEmail").value.trim() || "user@newsbyte.ai";
  currentUser.avatar = document.getElementById("profileAvatar").value.trim() || "🧑";
  currentUser.bio = document.getElementById("profileBio").value.trim() || "AI-powered news explorer";

  saveUserProfile();
  alert("Profile updated successfully!");
  renderProfilePage();
}

/* =========================
   ADMIN PAGE
========================= */
function renderAdminPage() {
  if (!isAdmin) {
    alert("Only admin can access this page.");
    return renderAdminLoginPage();
  }

  currentTab = "admin";
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="details-page fade-in-page">
      <div class="top-header">
        <div class="logo">Admin Panel</div>
        <div class="header-icons">
          <button onclick="toggleTheme()" class="theme-toggle">🌗</button>
        </div>
      </div>

      <div class="details-container" style="margin-top:100px;">
        <h2>Manage News Videos</h2>
        <p style="color:var(--subtext); margin-bottom:18px;">
          Upload, update, and remove news reels.
        </p>

        <div class="card-box">
          <h3>Add / Update News</h3>

          <input id="adminNewsId" type="hidden" />
          <input id="adminTitle" type="text" placeholder="News Title" />
          <textarea id="adminSummary" placeholder="News Summary"></textarea>
          <input id="adminVideo" type="text" placeholder="Video URL (mp4 link)" />

          <select id="adminCategory">
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Sports">Sports</option>
            <option value="General">General</option>
          </select>

          <label style="display:flex; gap:10px; align-items:center; margin-top:12px;">
            <input id="adminTrending" type="checkbox" />
            Mark as Trending
          </label>

          <button class="primary-btn" onclick="saveAdminNews()">Save News</button>
          <button class="secondary-btn" onclick="clearAdminForm()">Clear</button>
        </div>

        <div class="admin-list">
          ${newsData.map(news => `
            <div class="admin-item">
              <h3>${news.title}</h3>
              <p style="color:var(--subtext); margin-top:8px;">${news.summary}</p>
              <div class="details-meta" style="margin-top:14px;">
                <div class="meta-pill">${news.category}</div>
                <div class="meta-pill">${news.trending ? "Trending" : "Normal"}</div>
              </div>
              <div class="admin-actions">
                <button class="secondary-btn" onclick="editNews(${news.id})">Edit</button>
                <button class="danger-btn" onclick="deleteNews(${news.id})">Delete</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      ${renderBottomNav("profile")}
    </div>
  `;
}

function clearAdminForm() {
  document.getElementById("adminNewsId").value = "";
  document.getElementById("adminTitle").value = "";
  document.getElementById("adminSummary").value = "";
  document.getElementById("adminVideo").value = "";
  document.getElementById("adminCategory").value = "Technology";
  document.getElementById("adminTrending").checked = false;
}

function saveAdminNews() {
  const id = document.getElementById("adminNewsId").value;
  const title = document.getElementById("adminTitle").value.trim();
  const summary = document.getElementById("adminSummary").value.trim();
  const video = document.getElementById("adminVideo").value.trim();
  const category = document.getElementById("adminCategory").value;
  const trending = document.getElementById("adminTrending").checked;

  if (!title || !summary || !video) {
    alert("Please fill all fields.");
    return;
  }

  if (id) {
    const news = newsData.find(n => n.id == id);
    if (!news) return;

    news.title = title;
    news.summary = summary;
    news.video = video;
    news.category = category;
    news.trending = trending;
    news.subtitle = summary;
  } else {
    const newNews = {
      id: Date.now(),
      title,
      summary,
      video,
      category,
      trending,
      subtitle: summary,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      saved: false
    };

    newsData.unshift(newNews);
  }

  saveNews();
  alert("News saved successfully!");
  renderAdminPage();
}

function editNews(newsId) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  document.getElementById("adminNewsId").value = news.id;
  document.getElementById("adminTitle").value = news.title;
  document.getElementById("adminSummary").value = news.summary;
  document.getElementById("adminVideo").value = news.video;
  document.getElementById("adminCategory").value = news.category;
  document.getElementById("adminTrending").checked = news.trending || false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteNews(newsId) {
  const confirmDelete = confirm("Delete this news?");
  if (!confirmDelete) return;

  newsData = newsData.filter(n => n.id !== newsId);
  saveNews();
  renderAdminPage();
}

/* =========================
   START APP
========================= */
applyTheme();
showSplashThenLogin();