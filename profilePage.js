function renderProfilePage() {
  currentTab = "profile";
  const app = document.getElementById("app");

  const savedCount = newsData.filter(n => n.saved).length;
  const likedCount = newsData.filter(n => n.liked).length;

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
          <div class="profile-avatar">
            ${currentUser.name.charAt(0).toUpperCase()}
          </div>
          <h2>${currentUser.name}</h2>
          <p>${currentUser.email}</p>

          <div class="stats-row">
            <div class="meta-pill">Saved: ${savedCount}</div>
            <div class="meta-pill">Liked: ${likedCount}</div>
            <div class="meta-pill">${isAdmin ? "Admin Access" : "Viewer"}</div>
          </div>
        </div>

        <div class="controls-row">
          <h3>Update Profile</h3>
          <input type="text" id="profileName" value="${currentUser.name}" placeholder="Your name" />
          <input type="email" id="profileEmail" value="${currentUser.email}" placeholder="Your email" />
          <button class="primary-btn" onclick="updateProfile()">Update Profile</button>
          <button class="secondary-btn" onclick="renderSavedPage()">View Saved News</button>
          ${isAdmin ? `<button class="secondary-btn" onclick="renderAdminPage()">Open Admin Panel</button>` : ""}
        </div>
      </div>

      ${renderBottomNav("profile")}
    </div>
  `;
}

function updateProfile() {
  const name = document.getElementById("profileName").value.trim();
  const email = document.getElementById("profileEmail").value.trim();

  if (!name || !email) {
    alert("Please fill all fields");
    return;
  }

  currentUser = { name, email };
  isAdmin = email.toLowerCase() === "admin@newsbyte.ai";
  saveUserProfile();
  alert("Profile updated successfully!");
  renderProfilePage();
}