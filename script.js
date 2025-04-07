let playlistContent = "";

document.getElementById("fileInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      playlistContent = event.target.result;
      localStorage.setItem("modifiedM3U", playlistContent);
      displayPlaylist(playlistContent);
    };
    reader.readAsText(file);
  }
});

function displayPlaylist(content) {
  const lines = content.split("\n");
  const resultBox = document.getElementById("result");
  resultBox.innerHTML = "";

  let editorHTML = "<h3>🎛️ Playlist Editor</h3><ul>";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() !== "") {
      editorHTML += `
        <li>
          <textarea rows="2" style="width: 100%;" data-index="${i}">${line}</textarea>
        </li>`;
    }
  }
  editorHTML += "</ul><button onclick='saveEdits()'>💾 Save Changes</button>";
  resultBox.innerHTML = editorHTML;
}

function saveEdits() {
  const textareas = document.querySelectorAll("#result textarea");
  let updatedContent = "";
  textareas.forEach(area => {
    updatedContent += area.value + "\n";
  });
  playlistContent = updatedContent.trim();
  localStorage.setItem("modifiedM3U", playlistContent);
  alert("✅ Playlist updated and saved!");
}

function uploadToGitHub() {
  const m3uData = localStorage.getItem("modifiedM3U");
  const username = prompt("Enter username (e.g. user_123)");
  if (!username || !m3uData) return alert("Missing data or username!");

  const filename = `playlists/${username}.m3u`;
  const payload = {
    filename: filename,
    content: m3uData
  };

  fetch("https://api.github.com/repos/Jatin-0-7/07YGX/dispatches", {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event_type: "upload-m3u",
      client_payload: payload
    })
  }).then(res => {
    if (res.ok) {
      const githubUrl = `https://raw.githubusercontent.com/Jatin-0-7/07YGX/main/${filename}`;
      shortenURL(githubUrl);
    } else {
      alert("❌ Upload failed. Check GitHub Action or repo name.");
    }
  });
}

function shortenURL(githubUrl) {
  fetch("https://spoo.me/api", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `url=${encodeURIComponent(githubUrl)}`
  })
    .then(res => res.text())
    .then(shortUrl => {
      const resultBox = document.getElementById("result");
      resultBox.innerHTML += `
        <p><strong>✅ Playlist Uploaded!</strong></p>
        <p><strong>GitHub Link:</strong> <a href="${githubUrl}" target="_blank">${githubUrl}</a></p>
        <p><strong>✅ Short Link:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
      `;
    })
    .catch(err => {
      alert("❌ Failed to shorten link.");
      console.error(err);
    });
}
