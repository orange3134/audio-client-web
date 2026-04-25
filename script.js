const releaseRepo = {
  owner: "orange3134",
  name: "ResoniteAudioClient",
};

const fallbackReleaseUrl = `https://github.com/${releaseRepo.owner}/${releaseRepo.name}/releases/latest`;
const apiUrl = `https://api.github.com/repos/${releaseRepo.owner}/${releaseRepo.name}/releases/latest`;

const primaryDownload = document.getElementById("primary-download");
const releaseVersion = document.getElementById("release-version");
const releaseNotes = document.getElementById("release-notes");
const assetLinks = document.getElementById("asset-links");

function formatDate(dateText) {
  if (!dateText) {
    return "";
  }

  const date = new Date(dateText);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function setFallback(message) {
  releaseVersion.textContent = "リリースページから入手できます";
  releaseNotes.textContent = message;
  primaryDownload.href = fallbackReleaseUrl;
}

function createAssetLink(asset) {
  const link = document.createElement("a");
  link.className = "asset-link";
  link.href = asset.browser_download_url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = asset.name;
  return link;
}

async function loadLatestRelease() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const release = await response.json();
    const assets = Array.isArray(release.assets) ? release.assets : [];
    const publishedLabel = formatDate(release.published_at);

    releaseVersion.textContent = `${release.name || release.tag_name || "Latest Release"}${publishedLabel ? ` / ${publishedLabel}` : ""}`;

    if (assets.length > 0) {
      primaryDownload.href = assets[0].browser_download_url;
      primaryDownload.textContent = `${assets[0].name} をダウンロード`;
      releaseNotes.textContent = `最新版 ${release.tag_name || ""} の配布ファイルです。必要なファイルを下から直接選ぶこともできます。`.trim();

      assets.slice(0, 6).forEach((asset) => {
        assetLinks.appendChild(createAssetLink(asset));
      });
    } else {
      primaryDownload.href = release.html_url || fallbackReleaseUrl;
      primaryDownload.textContent = "最新リリースページを開く";
      releaseNotes.textContent = "配布アセットが見つからなかったため、GitHub Releases ページを開きます。";
    }
  } catch (error) {
    console.warn("Failed to load latest release:", error);
    setFallback("リポジトリがまだ非公開、または最新リリースを取得できない状態です。公開後は自動で最新版を表示します。");
  }
}

setFallback("公開後は GitHub Releases から最新バージョン情報を自動取得します。");
loadLatestRelease();
