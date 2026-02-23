const contentAlbums = null || document.getElementById("content_albums");
const contentVideos = null || document.getElementById("content_videos");

const titleAlbums = null || document.getElementById("albums_title");
const titleVideos = null || document.getElementById("videos_title");
const content_songCard= null || document.getElementById("song-card")

const pseudoClass =
  "before:content-['⚠️'] before:text-3xl after:content-['⚠️'] after:text-3xl hover:cursor-help";

const API_YOUTUBE =
'https://youtube-v31.p.rapidapi.com/search?channelId=UC34wpCgr3l9cG0RtFdTTS-Q&part=snippet%2Cid&order=date&maxResults=12';
const API_SPOTIFY =
'https://spotify23.p.rapidapi.com/artist_albums/?id=0GDGKpJFhVpcjIGF8N6Ewt&offset=0&limit=20';
const APY_PLAYLIST='https://spotify23.p.rapidapi.com/tracks/?ids=4WNcduiCmDNfmTEz7JvmLv'

const API_BASE_URL = 'https://corsproxy.io/?https://api.deezer.com';
const id = '6110057324'

const searchTracks = async () => {
    try {
        const responde = await fetch(`${API_BASE_URL}/playlist/${id}`);
        const json = await responde.json();
        const data = json.tracks.data;
        return data;
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
    }
}

const optionsYoutube = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "6406f93a86mshef8138252eb8ca8p1b0d94jsnbf0e8f74e41d",
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  },
};

const optionsSpotify = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '296a043d0emsh0dbde482fbc99ddp1ce419jsn530d82cea9a9',
		'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
	}
};

const optionsPlaylist= {
  method:"GET",
  headers:{
    'X-RapidAPI-Key': 'b89c50b6e3mshff71f485c9cb1d2p130d27jsn5cdc3763839d',
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
  },
}

async function fetchData(urlApi, options) {
  const response = await fetch(urlApi, options);
  const data = await response.json();
  return data;
}

async function getVideos() {
  try {
    const videos = await fetchData(API_YOUTUBE, optionsYoutube);
    let view = `${videos.items
      .map(
        (video) => `
        <div>
        <div class="w-full bg-gray-500 aspect-w-2 aspect-h-2 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none" style="border-radius:3.375rem">
          <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.description}" class="w-full">
        </div>
        <div class="mt-4 flex flex-col items-center justify-center">
          <h3 class="text-sm text-gray-500">
            <span aria-hidden="true" class="absolute inset-0"></span>
            ${video.snippet.title}
          </h3>
          <a href="https://youtube.com/watch?v=${video.id.videoId}">
          <i class="fab fa-youtube text-3xl text-gray-500 hover:text-gray-700"></i>
          </a>
        </div>
      </div>
      `,
      )
      .slice(0, 20)
      .join("")}`;
    contentVideos.innerHTML = view;
  } catch (error) {
    console.log(error);
  }
} 

async function getAlbums() {
  try {
    const albums = await fetchData(API_SPOTIFY, optionsSpotify);
    let view = `${albums.data.artist.discography.albums.items
      .map(
        (album) => `
        <div class="bg-black-100 rounded-lg p-4">
        <img class="w-full mb-4 rounded-lg" src="${album.releases.items[0].coverArt.sources[0].url}"
          alt="Portada ${album.releases.items[0].name}">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-500 mb-2">${album.releases.items[0].name}</h3>
          <p class="text-base font-medium text-gray-500">
            Año: ${album.releases.items[0].date.year} <br>
            Canciones: ${album.releases.items[0].tracks.totalCount}
          </p>
          <a href="${album.releases.items[0].sharingInfo.shareUrl}" class="text-gray-700 hover:text-gray-800">
            <i class="fa-brands fa-spotify hover:shadow-md" style="font-size: 36px;"></i>
          </a>
        </div>
      </div>
      `,
      )
      .slice(0)
      .join("")}`;
    contentAlbums.innerHTML = view;
  } catch (error) {
    console.log(error);
  }
}

// ── REPRODUCTOR PERSONALIZADO ──────────────────────────────
let currentAudio = null;
let currentBtn = null;

function togglePlay(btn) {
  const container = btn.closest('.custom-audio');
  const src = container.dataset.src;
  const progressBar = container.querySelector('.progress-bar');
  const timeEl = container.querySelector('.time');

  // Si hay audio sonando, lo pausamos
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    if (currentBtn) currentBtn.textContent = '▶';
    // Si era el mismo, solo pausar
    if (currentAudio.dataset && currentAudio.dataset.src === src) {
      currentAudio = null;
      currentBtn = null;
      return;
    }
  }

  // Crear nuevo audio
  const audio = new Audio(src);
  audio.dataset = { src };
  currentAudio = audio;
  currentBtn = btn;
  btn.textContent = '⏸';

  audio.ontimeupdate = () => {
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    progressBar.style.width = pct + '%';
    const secs = Math.floor(audio.currentTime);
    timeEl.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  };

  audio.onended = () => {
    btn.textContent = '▶';
    progressBar.style.width = '0%';
    timeEl.textContent = '0:00';
    currentAudio = null;
    currentBtn = null;
  };

  audio.onerror = () => {
    btn.textContent = '✕';
    btn.title = 'Preview no disponible';
  };

  audio.play();
}

function seek(event, bar) {
  if (!currentAudio || !currentAudio.duration) return;
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  currentAudio.currentTime = pct * currentAudio.duration;
}
// ──────────────────────────────────────────────────────────

async function GetPlaylist() {
  try {
    const tracks = await searchTracks();
    console.log(tracks);

    tracks.slice(0, 32).forEach((Item) => {
      const track = Item;
      const songCard = document.createElement('div');
      songCard.classList.add('song-card');

      songCard.innerHTML = `
        <div class="audio-player">
          <div class="song-image-container">
            <img src="${track.album.cover}" alt="${track.title}" class="song-image">
          </div>
          <div class="song-details">
            <p class="song-name">${track.title}</p>

            <div class="custom-audio" data-src="${track.preview}">
              <button class="play-btn" onclick="togglePlay(this)">▶</button>
              <div class="progress-bar-container" onclick="seek(event, this)">
                <div class="progress-bar"></div>
              </div>
              <span class="time">0:00</span>
            </div>

            <a href="${track.link}" target="_blank" class="deezer-link">
              <i class="fa-brands fa-deezer" style="font-size: 28px;"></i>
            </a>
          </div>
        </div>
      `;

      content_songCard.appendChild(songCard);
    });
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  getVideos();
  getAlbums();
  GetPlaylist();
})();