import { Container, Fab, TextField, Typography } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";
import React, { Fragment } from "react";
import { startRecording, stopRecording } from "../../Scripts/liveMicrophone";
import {
  TranscriptionItemWithFinal,
  TranscriptItem,
} from "../../Scripts/transcriptTypes";

declare interface LiveStreamAndSearchProps {
  setTranscript: (transcript: TranscriptItem[]) => void;
  classes: any;
}

const LiveStreamAndSearch: React.FunctionComponent<LiveStreamAndSearchProps> = ({
  setTranscript,
  classes,
}) => {
  const [videoTitle, setVideoTitle] = React.useState<string>("");
  const [recording, setRecording] = React.useState<boolean>(false);
  const [mostRecentTranscipt, setMostRecentTranscript] = React.useState<string>(
    ""
  );

  let transcript: TranscriptItem[] = [];

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      stopRecording();
      setVideoTitle("");
      setMostRecentTranscript("");
    } else {
      setRecording(true);
      startRecording(handleDataReturned);
      transcript = [];
      setTranscript(transcript);
    }
  };

  const handleVideoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVideoTitle(event.target.value);
  };

  const handleDataReturned = (data: TranscriptionItemWithFinal) => {
    setMostRecentTranscript(data.text);
    if (data.isFinal && data.text) {
      transcript.push({ text: data.text, time: data.time });
      setTranscript(transcript.concat([]));
    }
  };

  return (
    <Fragment>
      {recording ? (
        <Typography variant="h4" className={classes.marginedTopBottom}>
          {videoTitle}
        </Typography>
      ) : (
        <TextField
          fullWidth
          label="Enter a Video Title:"
          value={videoTitle}
          onChange={handleVideoTitleChange}
          variant="outlined"
          className={classes.marginedTopBottom}
        />
      )}
      <Container className={classes.centerText}>
        <Fab
          color="primary"
          aria-label={!recording ? "record" : "stop-recording"}
          onClick={toggleRecording}
          disabled={!videoTitle}
          variant="extended"
        >
          {!recording ? <MicIcon /> : <StopIcon />}
          {!recording ? "Start Listening" : "Stop Listening"}
        </Fab>
        <Typography variant="body1" className={classes.marginedTopBottom}>
          {mostRecentTranscipt}
        </Typography>
      </Container>
    </Fragment>
  );
};

export default LiveStreamAndSearch;
