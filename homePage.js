function renderBreakingTicker() {
  const breakingItems = newsData.slice(0, 8).map(news => news.title);

  return `
    <div class="breaking-ticker">
      <div class="breaking-label">🔴 BREAKING</div>
      <div class="breaking-track">
        <div class="breaking-content">
          ${breakingItems.map(item => `<span class="breaking-item">${item}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function getFilteredNews() {
  return newsData.filter(news => {
    const matchesCategory = currentCategory === "All" || news.category === currentCategory;
    const matchesSearch =
      news.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      news.summary.toLowerCase().includes(currentSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}

function renderBottomNav(activeTab) {
  return `
    <div class="bottom-nav">
      <div class="nav-item ${activeTab === "home" ? "active" : ""}" onclick="renderHomePage()">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </div>

      <div class="nav-item ${activeTab === "news" ? "active" : ""}" onclick="renderNewsPage()">
        <i class="fa-solid fa-circle-play"></i>
        <span>News</span>
      </div>

      <div class="nav-item ${activeTab === "explore" ? "active" : ""}" onclick="renderExplorePage()">
        <i class="fa-solid fa-compass"></i>
        <span>Explore</span>
      </div>

      <div class="nav-item ${activeTab === "saved" ? "active" : ""}" onclick="renderSavedPage()">
        <i class="fa-solid fa-bookmark"></i>
        <span>Saved</span>
      </div>

      <div class="nav-item ${activeTab === "profile" ? "active" : ""}" onclick="renderProfilePage()">
        <i class="fa-solid fa-user"></i>
        <span>Profile</span>
      </div>
    </div>
  `;
}

/* =========================
   HOME PAGE
========================= */
function renderHomePage() {
  currentTab = "home";
  const app = document.getElementById("app");
  const featured = newsData[0];
  const topNews = newsData.slice(0, 6);

  app.innerHTML = `
    <div class="details-page fade-in-page">
      <div class="top-header">
        <div class="logo">News<span>Byte AI</span></div>
        <div class="header-icons">
          <button onclick="renderNotificationsPage()" class="theme-toggle">🔔</button>
          <button onclick="toggleTheme()" class="theme-toggle">🌗</button>
        </div>
      </div>

      ${renderBreakingTicker()}

      <div class="details-container" style="margin-top:170px;">

        <div class="hero-banner">
          <video autoplay muted loop playsinline>
            <source src="${featured.video}" type="video/mp4">
          </video>
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <div class="hero-tag">🔥 Featured Story</div>
            <h1>${featured.title}</h1>
            <p>${featured.summary}</p>
            <div class="hero-buttons">
              <button class="primary-btn" style="width:auto;" onclick="renderNewsPage()">▶ Watch Reels</button>
              <button class="secondary-btn" style="width:auto;" onclick="openDetails(${featured.id})">Read More</button>
            </div>
          </div>
        </div>

        <div class="story-bubbles">
          <div class="story-bubble" onclick="currentCategory='Technology'; renderNewsPage()">
            <div class="story-circle">💻</div>
            <span>Tech</span>
          </div>
          <div class="story-bubble" onclick="currentCategory='Business'; renderNewsPage()">
            <div class="story-circle">📈</div>
            <span>Business</span>
          </div>
          <div class="story-bubble" onclick="currentCategory='Sports'; renderNewsPage()">
            <div class="story-circle">🏏</div>
            <span>Sports</span>
          </div>
          <div class="story-bubble" onclick="currentCategory='General'; renderNewsPage()">
            <div class="story-circle">🌍</div>
            <span>World</span>
          </div>
          <div class="story-bubble" onclick="renderExplorePage()">
            <div class="story-circle">✨</div>
            <span>Explore</span>
          </div>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <h3>${newsData.length}</h3>
            <p>Total News</p>
          </div>
          <div class="stat-card">
            <h3>${newsData.reduce((a, b) => a + b.likes, 0)}</h3>
            <p>Total Likes</p>
          </div>
          <div class="stat-card">
            <h3>${newsData.filter(n => n.saved).length}</h3>
            <p>Saved News</p>
          </div>
        </div>

        <div class="controls-row">
          <h3>Trending Headlines</h3>
          <div class="explore-grid">
            ${topNews.map(news => `
              <div class="explore-card" onclick="openDetails(${news.id})">
                <video muted playsinline>
                  <source src="${news.video}" type="video/mp4">
                </video>
                <div class="explore-card-content">
                  ${news.trending ? `<div class="trending-badge small">🔥 Trending</div>` : ""}
                  <div class="meta-pill" style="display:inline-block; margin-bottom:10px;">${news.category}</div>
                  <h3>${news.title}</h3>
                  <p>${news.summary}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      ${renderBottomNav("home")}
    </div>
  `;
}

/* =========================
   NEWS PAGE (REELS)
========================= */
function renderNewsPage() {
  currentTab = "news";
  const app = document.getElementById("app");
  const filteredNews = getFilteredNews();

  app.innerHTML = `
    <div class="home-page fade-in-page" id="reelsFeed">
      <div class="top-header">
        <div class="logo">News<span>Reels</span></div>
        <div class="header-icons">
          <button onclick="toggleTheme()" class="theme-toggle">🌗</button>
        </div>
      </div>

      ${renderBreakingTicker()}

      <div class="category-bar category-news-only">
        ${["All", "Technology", "Business", "Sports", "General"].map(cat => `
          <div class="category-chip ${currentCategory === cat ? "active" : ""}" onclick="setCategory('${cat}')">
            ${cat}
          </div>
        `).join("")}
      </div>

      ${
        filteredNews.length === 0
          ? `
            <div class="empty-state">
              <div class="empty-state-box">
                <h2>No news found</h2>
                <p style="margin-top:12px;color:var(--subtext);">Try another category.</p>
              </div>
            </div>
          `
          : filteredNews.map(news => `
            <div class="reel-card" ondblclick="doubleLike(${news.id}, this)">
              <video class="reel-video auto-reel-video" muted loop playsinline onclick="togglePlayPause(this)">
                <source src="${news.video}" type="video/mp4">
              </video>

              <div class="reel-overlay"></div>
              <div class="heart-burst"><i class="fa-solid fa-heart"></i></div>

              <button class="mute-toggle" onclick="toggleMute(this)">
                <i class="fa-solid fa-volume-xmark"></i>
              </button>

              <div class="reel-actions">
                <div class="action-btn" onclick="toggleLike(${news.id})">
                  <i class="fa-solid fa-heart ${news.liked ? "liked" : ""}"></i>
                  <span>${news.likes}</span>
                </div>

                <div class="action-btn" onclick="openComments(${news.id})">
                  <i class="fa-solid fa-comment"></i>
                  <span>${news.comments}</span>
                </div>

                <div class="action-btn" onclick="shareNews(${news.id})">
                  <i class="fa-solid fa-share"></i>
                  <span>${news.shares}</span>
                </div>

                <div class="action-btn" onclick="toggleSave(${news.id})">
                  <i class="fa-solid fa-bookmark ${news.saved ? "saved" : ""}"></i>
                  <span>${news.saved ? "Saved" : "Save"}</span>
                </div>
              </div>

              <div class="reel-info">
                ${news.trending ? `<div class="trending-badge">🔥 Trending</div>` : ""}
                <div class="reel-category">${news.category}</div>
                <div class="reel-title">${news.title}</div>
                <div class="reel-summary">${news.summary}</div>
                <div class="subtitle-chip">🎙 ${news.subtitle || news.summary}</div>
                <button class="watch-more-btn" onclick="openDetails(${news.id})">Watch More</button>
              </div>
            </div>
          `).join("")
      }

      ${renderBottomNav("news")}
      ${renderCommentsModal()}
    </div>
  `;

  setupAutoPlayReels();
}

/* =========================
   EXPLORE PAGE
========================= */
function renderExplorePage() {
  currentTab = "explore";
  const app = document.getElementById("app");
  const rankedNews = getExploreRankedNews();

  app.innerHTML = `
    <div class="details-page fade-in-page">
      <div class="top-header">
        <div class="logo">Explore</div>
        <div class="header-icons">
          <button onclick="toggleTheme()" class="theme-toggle">🌗</button>
        </div>
      </div>

      ${renderBreakingTicker()}

      <div class="details-container" style="margin-top:170px;">
        <h2>Explore News</h2>
        <p style="color:var(--subtext); margin-bottom: 20px;">
          AI-ranked discovery feed based on popularity, saves, and engagement.
        </p>

        <div class="search-bar-wrap search-explore-static">
          <input 
            type="text" 
            class="search-bar" 
            placeholder="Search in explore..." 
            value="${currentSearch}"
            oninput="handleExploreSearch(this.value)"
          />
        </div>

        <div class="explore-grid" style="margin-top:30px;">
          ${rankedNews
            .filter(news =>
              news.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
              news.summary.toLowerCase().includes(currentSearch.toLowerCase())
            )
            .map(news => `
              <div class="explore-card" onclick="openDetails(${news.id})">
                <video muted playsinline>
                  <source src="${news.video}" type="video/mp4">
                </video>
                <div class="explore-card-content">
                  ${news.trending ? `<div class="trending-badge small">🔥 Trending</div>` : ""}
                  <div class="meta-pill" style="display:inline-block; margin-bottom:10px;">${news.category}</div>
                  <h3>${news.title}</h3>
                  <p>${news.summary}</p>
                </div>
              </div>
            `).join("")}
        </div>
      </div>

      ${renderBottomNav("explore")}
    </div>
  `;
}

/* =========================
   SAVED PAGE
========================= */
function renderSavedPage() {
  currentTab = "saved";
  const app = document.getElementById("app");
  const savedNews = newsData.filter(news => news.saved);

  app.innerHTML = `
    <div class="details-page fade-in-page">
      <div class="top-header">
        <div class="logo">Saved</div>
        <div class="header-icons">
          <button onclick="toggleTheme()" class="theme-toggle">🌗</button>
        </div>
      </div>

      <div class="details-container" style="margin-top:100px;">
        <h2>Your Saved News</h2>
        <p style="color:var(--subtext); margin-bottom:20px;">
          All your bookmarked videos in one place.
        </p>

        ${
          savedNews.length === 0
            ? `<div class="card-box">No saved news yet.</div>`
            : `
              <div class="explore-grid">
                ${savedNews.map(news => `
                  <div class="explore-card" onclick="openDetails(${news.id})">
                    <video muted playsinline>
                      <source src="${news.video}" type="video/mp4">
                    </video>
                    <div class="explore-card-content">
                      <div class="meta-pill" style="display:inline-block; margin-bottom:10px;">${news.category}</div>
                      <h3>${news.title}</h3>
                      <p>${news.summary}</p>
                    </div>
                  </div>
                `).join("")}
              </div>
            `
        }
      </div>

      ${renderBottomNav("saved")}
    </div>
  `;
}

/* =========================
   NOTIFICATIONS PAGE
========================= */
function renderNotificationsPage() {
  currentTab = "notifications";
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="details-page fade-in-page">
      <div class="top-header">
        <div class="logo">Notifications</div>
        <div class="header-icons">
          <button onclick="toggleTheme()" class="theme-toggle">🌗</button>
        </div>
      </div>

      <div class="details-container" style="margin-top:100px;">
        <h2>Latest Updates</h2>
        <div class="admin-list">
          <div class="admin-item">
            <h3>🔥 Breaking: ${newsData[0]?.title || "New update available"}</h3>
            <p style="color:var(--subtext);">A new trending story has been added.</p>
          </div>
          <div class="admin-item">
            <h3>📌 Saved Reminder</h3>
            <p style="color:var(--subtext);">Check your bookmarked news for quick updates.</p>
          </div>
          <div class="admin-item">
            <h3>🤖 AI Insight Ready</h3>
            <p style="color:var(--subtext);">Ask AI to simplify or explain any news in your language.</p>
          </div>
        </div>
      </div>

      ${renderBottomNav("home")}
    </div>
  `;
}

/* =========================
   COMMENTS + ACTIONS
========================= */
function renderCommentsModal() {
  if (!activeCommentNewsId) return "";

  const news = newsData.find(n => n.id === activeCommentNewsId);
  if (!news) return "";

  return `
    <div class="comment-modal-overlay" onclick="closeComments()">
      <div class="comment-modal" onclick="event.stopPropagation()">
        <div class="comment-modal-header">
          <h3>Comments</h3>
          <button onclick="closeComments()">✖</button>
        </div>

        <div class="comment-list">
          <div class="comment-item"><strong>Aarav:</strong> Very informative update 🔥</div>
          <div class="comment-item"><strong>Priya:</strong> This should be in trending.</div>
          <div class="comment-item"><strong>Rahul:</strong> Explain this in simple language please.</div>
        </div>

        <div class="comment-input-row">
          <input id="commentInput" type="text" placeholder="Write a comment..." />
          <button onclick="postComment(${news.id})">Post</button>
        </div>
      </div>
    </div>
  `;
}

function openComments(newsId) {
  activeCommentNewsId = newsId;
  renderNewsPage();
}

function closeComments() {
  activeCommentNewsId = null;
  renderNewsPage();
}

function postComment(newsId) {
  const input = document.getElementById("commentInput");
  if (!input || !input.value.trim()) return;

  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  news.comments += 1;
  saveNews();
  alert("Comment posted!");
  activeCommentNewsId = null;
  renderNewsPage();
}

function handleExploreSearch(value) {
  currentSearch = value;
  renderExplorePage();
}

function setCategory(category) {
  currentCategory = category;
  renderNewsPage();
}

function toggleLike(newsId) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  news.liked = !news.liked;
  news.likes += news.liked ? 1 : -1;
  saveNews();
  renderNewsPage();
}

function doubleLike(newsId, card) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  if (!news.liked) {
    news.liked = true;
    news.likes += 1;
    saveNews();
  }

  const heart = card.querySelector(".heart-burst");
  if (heart) {
    heart.classList.remove("show");
    void heart.offsetWidth;
    heart.classList.add("show");
  }

  renderNewsPage();
}

function toggleSave(newsId) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  news.saved = !news.saved;
  saveNews();
  renderNewsPage();
}

function shareNews(newsId) {
  const news = newsData.find(n => n.id === newsId);
  if (!news) return;

  news.shares += 1;
  saveNews();
  alert(`Shared: ${news.title}`);
  renderNewsPage();
}

function toggleMute(button) {
  event.stopPropagation();
  const reelCard = button.closest(".reel-card");
  const video = reelCard.querySelector("video");
  const icon = button.querySelector("i");

  video.muted = !video.muted;

  if (video.muted) {
    icon.className = "fa-solid fa-volume-xmark";
  } else {
    icon.className = "fa-solid fa-volume-high";
  }
}

function togglePlayPause(video) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

/* =========================
   AUTO PLAY CURRENT REEL
========================= */
function setupAutoPlayReels() {
  const videos = document.querySelectorAll(".auto-reel-video");

  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;

      if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, {
    threshold: [0.7]
  });

  videos.forEach(video => observer.observe(video));
}