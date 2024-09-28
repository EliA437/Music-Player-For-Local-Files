import React, { useState, useEffect, useRef } from 'react';
import { deleteObject } from 'firebase/storage';
import './App.css';
import { storage } from './firebaseConfig';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import Note from './assets/note.png';
import DieLitAlbumCover from './assets/die_lit_album_cover.png';
import Arrow from './assets/arrow.png';
import Remove from './assets/minus.png';
import AudioPlayer from './components/AudioPlayer';


function App() {
  const [fileUploads, setFileUploads] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filesList, setFilesList] = useState([]);
  const [currentTrackName, setCurrentTrackName] = useState('');
  const [shufflePlay, toggleShufflePlay] = useState(false);
  const [isPlaying, toggleIsPlaying] = useState(false); // Add isPlaying state
  const audioRef = useRef(null);

  const uploadFiles = async () => {
    if (fileUploads.length === 0) return;

    try {
      await Promise.all(
        fileUploads.map(file => {
          const fileRef = ref(storage, `files/${file.name}`);
          return uploadBytes(fileRef, file);
        })
      );
      console.log('All files uploaded successfully');
      listFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const listFiles = async () => {
    try {
      const listRef = ref(storage, 'files/');
      const res = await listAll(listRef);

      const files = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        })
      );
      setFilesList(files);
    } catch (error) {
      console.error('Error listing files:', error);
    }
  };

  const playFile = (index) => {
    if (index < 0 || index >= filesList.length) return;
    if (shufflePlay) {
      // Shuffle logic
    } else {
      const selectedTrack = filesList[index];
      setCurrentTrack(selectedTrack.url);
      setCurrentTrackName(selectedTrack.name);
      setCurrentIndex(index);
      toggleIsPlaying(true); // Set to playing when a file is played
    }
  };

  const removeFile = async (index) => {
    if (index < 0 || index >= filesList.length) return;

    const fileToDelete = filesList[index];

    try {
      const fileRef = ref(storage, `files/${fileToDelete.name}`);
      await deleteObject(fileRef);
      console.log(`${fileToDelete.name} deleted successfully`);

      const updatedFilesList = filesList.filter((_, i) => i !== index);
      setFilesList(updatedFilesList);

      if (fileToDelete.url === currentTrack) {
        audioRef.current.pause();
        setCurrentTrack(null);
        setCurrentTrackName('');
        toggleIsPlaying(false); // Stop playback if current track is deleted
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const playNextFile = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < filesList.length) {
      playFile(nextIndex);
    }
  };

  const playPrevFile = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      playFile(prevIndex);
    }
  };

  useEffect(() => {
    listFiles();
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load();
      audioRef.current.play();
      toggleIsPlaying(true); // Ensure playback is toggled on when the track changes
    }
  }, [currentTrack]);

  return (
    <>
      <div className="outer-container">
        <div className="music-container">
          <div className="album-cover">
            <img className='album-cover-image' src={DieLitAlbumCover} alt="Album Cover" />
          </div>
          <div className="title">
            {currentTrackName}
          </div>
          <AudioPlayer 
            currentTrack={currentTrack} 
            audioRef={audioRef} 
            playNextFile={playNextFile}
            playPrevFile={playPrevFile}
            isPlaying={isPlaying}
            toggleIsPlaying={toggleIsPlaying}
          />
        </div>
        <div className="music-files-container">
          <div className="files-list">
            <ul>
              {filesList.map((file, index) => (
                <li className='songs' key={index}>
                  <button className='song-buttons' onClick={() => playFile(index)}>{file.name}</button>
                  <button className='remove-buttons' onClick={() => removeFile(index)}><img src={Remove}/></button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="file-uploader">
          <input
            type="file"
            accept=".mp3, .wav"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files);
              setFileUploads(files);
            }}
          />
          <button className='file-buttons'onClick={uploadFiles}>Upload Files</button>
        </div>
      </div>
    </>
  );
}

export default App;
