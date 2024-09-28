import React, { useState, useEffect } from 'react';
import './AudioPlayer.css';
import Arrow from '../assets/arrow.png';
import Pause from '../assets/pause.png';
import Play from '../assets/play.png';

function AudioPlayer({ currentTrack, audioRef, playNextFile, playPrevFile, isPlaying, toggleIsPlaying }) {
    
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleTimeUpdate = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        setProgress((currentTime / duration) * 100);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (event) => {
        const progressBar = event.target;
        const seekTime = (event.nativeEvent.offsetX / progressBar.clientWidth) * duration;
        audioRef.current.currentTime = seekTime;
    };

    const handleButtonPress = () => {
        if (isPlaying) {
            audioRef.current.pause();
            toggleIsPlaying(false);
        } else {
            audioRef.current.play();
            toggleIsPlaying(true);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [currentTrack]);

    return (
        <>
            <div className="progress-bar-container">
                <div className="progress-bar" onClick={handleSeek}>
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="custom-audio-player">
                <audio ref={audioRef}>
                    <source src={currentTrack} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                <button className='back-button' onClick={playPrevFile}>
                    <img src={Arrow} alt="Previous" />
                </button>
                <button className='toggle-button' onClick={handleButtonPress}>
                    {isPlaying ? <img className='button-img' src={Pause} alt="Pause" /> : <img className='button-img' src={Play} alt="Play" />}
                </button>
                <button className='next-button' onClick={playNextFile}>
                    <img src={Arrow} alt="Next" />
                </button>
            </div>
        </>
    );
}

export default AudioPlayer;
