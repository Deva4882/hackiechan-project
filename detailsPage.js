function openDetails(newsId) {
  currentNews = newsData.find(news => news.id === newsId);
  renderDetailsPage();
}

function renderDetailsPage() {
  const app = document.getElementById("app");

  const aiData = generateAISummary(currentNews);

  app.innerHTML = `
    <div class="details-page">
      <button class="back-btn" onclick="renderHomePage()">⬅ Back to Feed</button>

      <div class="details-container">
        <video controls autoplay>
          <source src="${currentNews.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>

        <div class="details-meta">
          <div class="meta-pill">${currentNews.category}</div>
          <div class="meta-pill">${currentNews.publishedAt}</div>
          <div class="meta-pill">${currentNews.source}</div>
          ${currentNews.trending ? `<div class="meta-pill">🔥 Trending</div>` : ""}
        </div>

        <h2>${currentNews.title}</h2>

        <div class="controls-row">
          <label>Choose Language</label>
          <select id="languageSelect" onchange="changeLanguage()">
            <option>English</option>
            <option>Hindi</option>
            <option>Telugu</option>
            <option>Gujarati</option>
          </select>
        </div>

        <h3>AI Summary</h3>
        <div class="summary-box" id="summaryBox">
          ${currentNews.summary}
        </div>

        <div class="controls-row">
          <h3>AI Deep Insights</h3>
          <div class="card-box">
            <p><strong>Simple Explanation:</strong><br>${aiData.simpleExplanation}</p>
            <br>
            <p><strong>Why Important:</strong><br>${aiData.importance}</p>
            <br>
            <p><strong>Likely Impact:</strong><br>${aiData.impact}</p>
          </div>
        </div>

        <div class="controls-row">
          <h3>Quick AI Prompts</h3>
          <div class="prompt-chip-row">
            <button class="prompt-chip" onclick="fillPrompt('What happened?')">What happened?</button>
            <button class="prompt-chip" onclick="fillPrompt('Explain simply')">Explain simply</button>
            <button class="prompt-chip" onclick="fillPrompt('Why is this important?')">Why is this important?</button>
            <button class="prompt-chip" onclick="fillPrompt('What is the impact?')">Impact</button>
            <button class="prompt-chip" onclick="fillPrompt('What may happen next?')">What next?</button>
          </div>
        </div>

        <div class="controls-row">
          <h3>Ask AI About This News</h3>
          <input type="text" id="questionInput" placeholder="Ask anything... e.g. why is this important?" />
          <button class="ask-btn" onclick="askAI()">Ask AI</button>
        </div>

        <div class="ai-box" id="aiBox">
          Try asking:
          <br>• What happened?
          <br>• Explain simply
          <br>• Why is this important?
          <br>• What is the impact?
          <br>• Who benefits?
          <br>• What may happen next?
        </div>
      </div>
    </div>
  `;
}

function fillPrompt(text) {
  document.getElementById("questionInput").value = text;
}

function changeLanguage() {
  const selectedLanguage = document.getElementById("languageSelect").value;
  const translated = translateSummary(currentNews.summary, selectedLanguage);
  document.getElementById("summaryBox").innerText = translated;
}

function askAI() {
  const question = document.getElementById("questionInput").value.trim();
  const aiBox = document.getElementById("aiBox");

  if (!question) {
    aiBox.innerText = "Please type a question first.";
    return;
  }

  const answer = askSmartAI(currentNews, question);
  aiBox.innerText = answer;
}