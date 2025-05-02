function AudioPlayer({ audioUrl }) {
    return (
      <audio controls style={{ width: "50%", marginTop: "20em", display: "block", marginLeft: "auto", marginRight: "auto" }}>
        <source src={audioUrl} type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>
    );
  }
  
  export default AudioPlayer;
  