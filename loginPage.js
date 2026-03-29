function renderLoginPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="login-page">
      <div class="login-box">
        <h1>News<span>Byte AI</span></h1>
        <p>Short-form AI-powered news reels for the next generation.</p>

        <input type="text" id="loginName" placeholder="Enter your name" />
        <input type="email" id="loginEmail" placeholder="Enter your email" />

        <button onclick="loginUser()">Login</button>
        <button class="guest-btn" onclick="continueAsGuest()">Continue as Guest</button>

        <p style="margin-top:18px;font-size:13px;color:var(--subtext);">
          Admin Login: use email <b>admin@newsbyte.ai</b>
        </p>
      </div>
    </div>
  `;
}

function loginUser() {
  const name = document.getElementById("loginName").value.trim();
  const email = document.getElementById("loginEmail").value.trim();

  if (!name || !email) {
    alert("Please enter name and email");
    return;
  }

  currentUser = { name, email };
  isAdmin = email.toLowerCase() === "admin@newsbyte.ai";
  saveUserProfile();
  renderHomePage();
}

function continueAsGuest() {
  currentUser = {
    name: "Guest User",
    email: "guest@newsbyte.ai"
  };
  isAdmin = false;
  saveUserProfile();
  renderHomePage();
}