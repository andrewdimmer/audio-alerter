import {
  Button,
  Chip,
  Container,
  Fab,
  TextField,
  Typography,
} from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";
import React, { Fragment } from "react";
import { startRecording, stopRecording } from "../../Scripts/liveMicrophone";
import {
  addTag,
  doNotify,
  removeTag,
  resetTriggered,
  sendSystemNotification,
  triggerTag,
} from "../../Scripts/notificationHelper";
import {
  TranscriptionItemWithFinal,
  TranscriptItem,
} from "../../Scripts/transcriptTypes";
import { NotificationMessage } from "../Misc/Notifications";

declare interface LiveStreamAndSearchProps {
  setTranscript: (transcript: TranscriptItem[]) => void;
  setNotification: (notification: NotificationMessage) => void;
  classes: any;
}

const LiveStreamAndSearch: React.FunctionComponent<LiveStreamAndSearchProps> = ({
  setTranscript,
  setNotification,
  classes,
}) => {
  const [videoTitle, setVideoTitle] = React.useState<string>("");
  const [recording, setRecording] = React.useState<boolean>(false);
  const [mostRecentTranscipt, setMostRecentTranscript] = React.useState<string>(
    ""
  );
  const [tags, setTags] = React.useState<string[]>([]);
  const [tempTags, setTempTags] = React.useState<string>("");
  const [triggeredTags, setTriggeredTags] = React.useState<boolean[]>([]);

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

  const handleTempTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (text.indexOf(",") >= 0) {
      const newTag = text
        .substring(0, text.indexOf(","))
        .trim()
        .toLowerCase()
        .replace(/[^a-z ]/g, "");
      const remaining = text.substring(text.indexOf(",") + 1).trim();
      if (!tags.includes(newTag)) {
        setTags(tags.concat([newTag]));
        setTriggeredTags(triggeredTags.concat([false]));
        addTag();
      }
      setTempTags(remaining);
    } else {
      setTempTags(text);
    }
  };

  const handleTagDelete = (target: number) => {
    const newTags = tags.reduce((currentTags, currentValue, index) => {
      if (target !== index) {
        currentTags.push(currentValue);
      }
      return currentTags;
    }, [] as string[]);
    setTags(newTags);
    const newTriggeredTags = triggeredTags.reduce(
      (currentTags, currentValue, index) => {
        if (target !== index) {
          currentTags.push(currentValue);
        }
        return currentTags;
      },
      [] as boolean[]
    );
    setTriggeredTags(newTriggeredTags);
    removeTag(target);
  };

  const checkTriggeredTags = (text: string) => {
    setTriggeredTags(
      tags.map((value, index) => {
        if (
          text
            .toLowerCase()
            .replace(/[^a-z ]/g, "")
            .indexOf(value) >= 0
        ) {
          if (doNotify(index)) {
            triggerTag(index);
            setNotification({
              type: "info",
              message: `Audio Alerter just heard the tag \"${value}\".`,
              open: true,
            });
            sendSystemNotification(
              `Audio Alerter just heard the tag \"${value}\".`
            );
          }
          return true;
        } else {
          return false;
        }
      })
    );
  };

  const resetTriggeredTags = () => {
    setTriggeredTags(tags.map(() => false));
    resetTriggered();
  };

  const handleDataReturned = (data: TranscriptionItemWithFinal) => {
    setMostRecentTranscript(data.text);
    checkTriggeredTags(data.text);
    if (data.isFinal && data.text) {
      transcript.push({ text: data.text, time: data.time });
      setTranscript(transcript.concat([]));
      resetTriggeredTags();
    }
  };

  return (
    <Fragment>
      <Container className={classes.centerText}>
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
        <hr className={classes.marginedTopBottom} />
        <Typography variant="h5" className={classes.marginedTopBottom}>
          Audio Alerts
        </Typography>
        {"Notification" in window && Notification.permission === "default" && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => Notification.requestPermission()}
          >
            Update Notification Settings
          </Button>
        )}
        <TextField
          fullWidth
          label="Enter Words of Phrases to Alert On:"
          value={tempTags}
          onChange={handleTempTagsChange}
          helperText="Seperate tags with commas."
          variant="outlined"
          className={classes.marginedTopBottom}
        />
        {tags.map((value, index) => {
          return (
            <Chip
              key={value}
              label={value}
              onDelete={() => handleTagDelete(index)}
              color="primary"
              variant={triggeredTags[index] ? "default" : "outlined"}
              style={{
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          );
        })}
      </Container>
    </Fragment>
  );
};

export default LiveStreamAndSearch;
