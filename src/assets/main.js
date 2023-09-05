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
const APY_PLAYLIST='https://spotify23.p.rapidapi.com/playlist_tracks/?id=37i9dQZF1DZ06evO0lb5gk&offset=0&limit=100'

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
              'X-RapidAPI-Key': '296a043d0emsh0dbde482fbc99ddp1ce419jsn530d82cea9a9',
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

async function GetPlaylist() {
  try {
    const tracks = await fetchData(APY_PLAYLIST, optionsPlaylist);

    tracks.items.slice(0, 32).forEach((Item) => {
      const track = Item.track;
      const songCard = document.createElement('div');
      songCard.classList.add('song-card'); // Agrega la clase 'song-card' al div principal

      // Crea el reproductor de audio personalizado
      const audioPlayer = document.createElement('div');
      audioPlayer.classList.add('audio-player');

      audioPlayer.innerHTML = `
      <div class="audio-player" >
        <div class="song-image-container" >
          <img src="${track.album.images[1].url}" alt="Song Preview" class="song-image">
        </div>
        <div class="song-details">
          <p class="song-name">${track.name}</p>
          <audio controls>
            <source src="${track.preview_url}" type="audio/mpeg">
            Tu navegador no soporta la reproducción de audio.
          </audio>
          <a href="${track.external_urls.spotify}" class="hover:text-gray-800">
            <i class="fa-brands fa-spotify" style="font-size: 36px;"></i>
          </a>
        </div>
        </div>
      `;

      songCard.appendChild(audioPlayer);
      content_songCard.appendChild(songCard);
    });
  } catch (error) {
    console.log(error);
  }
}

// Selecciona todos los elementos de audio
const audioElements = document.querySelectorAll('audio');

// Itera sobre cada elemento de audio
audioElements.forEach((audio) => {
  // Modifica los estilos de los controles
  const controls = audio.controls;
  controls.style.color = 'white'; // Cambia el color de los botones a blanco
  controls.style.border = 'none'; // Elimina cualquier borde
});




(async () => {
  getVideos();
  getAlbums();
  GetPlaylist();
})();