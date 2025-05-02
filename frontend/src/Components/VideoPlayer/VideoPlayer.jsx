function VideoPlayer({ videoUrl }) {
    return (
      <video controls width="100%">
        <source src={videoUrl} type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>
    );
  }
  
  export default VideoPlayer;
  