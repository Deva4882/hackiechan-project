function renderAdminPage() {
  if (!isAdmin) {
    alert("Access denied. Admin only.");
    renderHomePage();
    return;
  }

  const app = document.getElementById("app");
  const totalLikes = newsData.reduce((sum, item) => sum + item.likes, 0);
  const totalShares = newsData.reduce((sum, item) => sum + item.shares, 0);

  app.innerHTML = `
    <div class="details-page">
      <div class="details-container">
        <h2>Admin Dashboard</h2>
        <p style="color:var(--subtext); margin-bottom:20px;">
          Upload, edit, and delete news videos.
        </p>

        <div class="stats-row" style="margin-bottom:24px;">
          <div class="meta-pill">Total News: ${newsData.length}</div>
          <div class="meta-pill">Total Likes: ${totalLikes}</div>
          <div class="meta-pill">Total Shares: ${totalShares}</div>
        </div>

        <div class="card-box">
          <input type="hidden" id="editNewsId" />

          <div class="controls-row">
            <label>News Title</label>
            <input type="text" id="adminTitle" placeholder="Enter title" />
          </div>

          <div class="controls-row">
            <label>Category (optional - AI will detect if empty)</label>
            <input type="text" id="adminCategory" placeholder="Technology / Business / Sports / General" />
          </div>

          <div class="controls-row">
            <label>Video Path</label>
            <input type="text" id="adminVideo" placeholder="assets/videos/yourvideo.mp4" />
          </div>

          <div class="controls-row">
            <label>Source</label>
            <input type="text" id="adminSource" placeholder="Source name" />
          </div>

          <div class="controls-row">
            <label>Subtitle Caption</label>
            <input type="text" id="adminSubtitle" placeholder="Short subtitle for reel..." />
          </div>

          <div class="controls-row">
            <label>Summary</label>
            <textarea id="adminSummary" placeholder="Write news summary..."></textarea>
          </div>

          <button class="primary-btn" onclick="saveAdminNews()">Save News</button>
          <button class="secondary-btn" onclick="clearAdminForm()">Clear</button>
        </div>

        <h3 style="margin-top:30px;">All News</h3>

        <div class="admin-list">
          ${newsData.map(news => `
            <div class="admin-item">
              <h3>${news.title}</h3>
              <p style="color:var(--subtext); margin-bottom:10px;">${news.category} • ${news.source}</p>
              <p style="color:var(--subtext);">${news.summary}</p>

              <div class="admin-actions">
                <button class="primary-btn" onclick="editNews(${news.id})">Edit</button>
                <button class="danger-btn" onclick="deleteNews(${news.id})">Delete</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      ${renderBottomNav("admin")}
    </div>
  `;
}

function saveAdminNews() {
  const editId = document.getElementById("editNewsId").value;
  const title = document.getElementById("adminTitle").value.trim();
  const manualCategory = document.getElementById("adminCategory").value.trim();
  const video = document.getElementById("adminVideo").value.trim();
  const source = document.getElementById("adminSource").value.trim();
  const subtitle = document.getElementById("adminSubtitle").value.trim();
  const summary = document.getElementById("adminSummary").value.trim();

  if (!title || !video || !source || !summary) {
    alert("Please fill required fields");
    return;
  }

  const detectedCategory = manualCategory || detectCategory(title, summary);

  const newItem = {
    id: editId ? Number(editId) : Date.now(),
    title,
    category: detectedCategory,
    video,
    subtitle: subtitle || summary,
    summary,
    likes: 0,
    comments: 0,
    shares: 0,
    saved: false,
    liked: false,
    trending: true,
    publishedAt: "Just now",
    source
  };

  if (editId) {
    const index = newsData.findIndex(n => n.id === Number(editId));
    if (index !== -1) {
      newItem.likes = newsData[index].likes;
      newItem.comments = newsData[index].comments;
      newItem.shares = newsData[index].shares;
      newItem.saved = newsData[index].saved;
      newItem.liked = newsData[index].liked;
      newsData[index] = newItem;
    }
  } else {
    newsData.unshift(newItem);
  }

  saveNews();
  clearAdminForm();
  alert(`News saved successfully! AI detected category: ${detectedCategory}`);
  renderAdminPage();
}

function editNews(newsId) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  document.getElementById("editNewsId").value = news.id;
  document.getElementById("adminTitle").value = news.title;
  document.getElementById("adminCategory").value = news.category;
  document.getElementById("adminVideo").value = news.video;
  document.getElementById("adminSource").value = news.source;
  document.getElementById("adminSubtitle").value = news.subtitle || "";
  document.getElementById("adminSummary").value = news.summary;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteNews(newsId) {
  const confirmDelete = confirm("Are you sure you want to delete this news?");
  if (!confirmDelete) return;

  newsData = newsData.filter(n => n.id !== newsId);
  saveNews();
  renderAdminPage();
}

function clearAdminForm() {
  document.getElementById("editNewsId").value = "";
  document.getElementById("adminTitle").value = "";
  document.getElementById("adminCategory").value = "";
  document.getElementById("adminVideo").value = "";
  document.getElementById("adminSource").value = "";
  document.getElementById("adminSubtitle").value = "";
  document.getElementById("adminSummary").value = "";
}