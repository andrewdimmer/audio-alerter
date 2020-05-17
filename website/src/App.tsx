import { Fab } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";
import React from "react";
import "./App.css";
import { startRecording, stopRecording } from "./Scripts/liveMicrophone";

function App() {
  const [recording, setRecording] = React.useState<boolean>(false);

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      // stopRecordingMicStream();
      stopRecording();
    } else {
      setRecording(true);
      // startRecordingMicStream();
      // startStream();
      startRecording();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Fab
          color="primary"
          aria-label={!recording ? "record" : "stop-recording"}
          onClick={toggleRecording}
        >
          {!recording ? <MicIcon /> : <StopIcon />}
        </Fab>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
