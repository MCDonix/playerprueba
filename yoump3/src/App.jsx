import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './App.css';

const API_KEY = 'AIzaSyDA1HbnHGxWpVSdTkYaK0r0Ka-ye0pmdFQ'; // Reemplaza con tu API Key
const API_URL = 'https://www.googleapis.com/youtube/v3/search';


function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [query, setQuery] = useState('');
  const [pageToken, setPageToken] = useState('');

  const fetchVideos = async (searchQuery, token = '') => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: searchQuery,
          key: API_KEY,
          pageToken: token,
          type: 'video',
        },
      });
      setVideos(response.data.items);
      setPageToken(response.data.nextPageToken || '');
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(query);
  };

  const handleNextPage = () => {
    fetchVideos(query, pageToken);
  };

  return (
    <div className="app">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar videos..."
        />
        <button type="submit">Buscar</button>
      </form>

      {selectedVideo && (
        <div className="video-player">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${selectedVideo.id.videoId}`}
            playing={true}
            controls={true}
            width="100%"
            height="400px"
          />
        </div>
      )}

      <div className="video-list">
        {videos.map((video) => (
          <div key={video.id.videoId} className="video-item">
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
            />
            <div className="video-info">
              <p>{video.snippet.title}</p>
              <button onClick={() => setSelectedVideo(video)}>Reproducir</button>
            </div>
          </div>
        ))}
      </div>

      {pageToken && (
        <button onClick={handleNextPage} className="load-more">
          Cargar más
        </button>
      )}
    </div>
  );
}

export default App;