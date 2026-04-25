const releaseRepo = {
  owner: "orange3134",
  name: "ResoniteAudioClient",
};

const fallbackReleaseUrl = `https://github.com/${releaseRepo.owner}/${releaseRepo.name}/releases/latest`;
const apiUrl = `https://api.github.com/repos/${releaseRepo.owner}/${releaseRepo.name}/releases/latest`;

const primaryDownload = document.getElementById("primary-download");

async function loadLatestRelease() {
  if (!primaryDownload) {
    return;
  }

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

    if (assets.length > 0) {
      primaryDownload.href = assets[0].browser_download_url;
    } else {
      primaryDownload.href = release.html_url || fallbackReleaseUrl;
    }
  } catch (error) {
    console.warn("Failed to load latest release:", error);
    primaryDownload.href = fallbackReleaseUrl;
  }
}

loadLatestRelease();
