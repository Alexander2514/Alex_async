// // import axios from 'axios';

// const API_BASE_URL = 'https://corsproxy.io/?https://api.deezer.com';
// const id = '6110057324'

// const searchTracks = async (query) => {
//     try{ 

//     const responde = await axios.get(`${API_BASE_URL}/playlist/${id}`) 
//     const data = responde.data.tracks.data;
//     return data
//     }catch (error) {
//         console.error('Error fetching tracks:', error);
//         throw error;
//     }
// }

// // Al final del archivo
// (async () => {
//     const resultado = await searchTracks("rock");
//     console.log(resultado);
// })();