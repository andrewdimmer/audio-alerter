import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { Fragment } from "react";
import { TranscriptItem, VideoData } from "../../Scripts/transcriptTypes";
import { UserProfile } from "../../Scripts/userTypes";
import { NotificationMessage } from "../Misc/Notifications";
import LiveStreamAndSearch from "./liveStreamAndAlerts";

declare interface TranscriptPageProps {
  video?: VideoData;
  live?: boolean;
  setNotification: (notification: NotificationMessage) => void;
  currentUserProfile: UserProfile | null;
  classes: any;
}

const TranscriptPage: React.FunctionComponent<TranscriptPageProps> = ({
  video,
  live,
  setNotification,
  currentUserProfile,
  classes,
}) => {
  const [search, setSearch] = React.useState<string>("");
  const screenHeight = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number>(0);
  const [transcript, setTranscript] = React.useState<TranscriptItem[]>(
    video ? video.transcript : []
  );

  const computeHeight = () => {
    if (screenHeight.current && height !== screenHeight.current.clientHeight) {
      setHeight(screenHeight.current.clientHeight - 100);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const setVideoTime = (time: string) => {
    if (video) {
      let setTime: number = 0;

      let hours = parseInt(time.slice(0, 2));
      let minutes = parseInt(time.slice(3, 5));
      let seconds = parseInt(time.slice(6, 8));

      setTime += hours * 360;
      setTime += minutes * 60;
      setTime += seconds;

      // FIXME: Use Refs in the Future (For Safety)
      try {
        let video = document.getElementById("video") as HTMLVideoElement;
        if (video) {
          video.currentTime = setTime;
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const initializeSize = () => {
    computeHeight();
    window.addEventListener("resize", () => {
      setTimeout(computeHeight, 1);
    });
  };

  return (
    <Fragment>
      <div
        ref={screenHeight}
        style={{
          width: 0,
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <Box
        style={{ width: "95%", marginLeft: "2.5%", marginTop: "40px", height }}
      >
        <Grid container direction="row" style={{ height }} spacing={4}>
          <Grid item md={8}>
            <Fragment>
              {video && (
                <Fragment>
                  <video controls style={{ width: "100%" }} id="video">
                    <source src={video.videoSource} type={video.videoType} />
                  </video>
                  <Typography variant="h4">{video.videoTitle}</Typography>
                </Fragment>
              )}
              {live && (
                <LiveStreamAndSearch
                  setTranscript={setTranscript}
                  setNotification={setNotification}
                  currentUserProfile={currentUserProfile}
                  classes={classes}
                />
              )}
            </Fragment>
          </Grid>
          <Grid item md={4} style={{ height: "100%" }}>
            <Grid
              container
              direction="column"
              spacing={4}
              style={{ height: "100%" }}
            >
              {video && (
                <Grid item>
                  <TextField
                    variant="outlined"
                    label="Search"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon></SearchIcon>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    onChange={handleSearchChange}
                  ></TextField>
                </Grid>
              )}
              <Grid
                item
                style={{
                  height: video ? height - 120 : height,
                  overflow: "auto",
                }}
              >
                {transcript.reduce((list, item, index) => {
                  if (
                    item.text
                      .toLowerCase()
                      .replace(/[^a-z ]/g, "")
                      .includes(search.toLowerCase().replace(/[^a-z ]/g, ""))
                  ) {
                    list.push(
                      <Box
                        onClick={() => {
                          setVideoTime(item.time);
                        }}
                        key={`Transcript_Item_${index}`}
                      >
                        <Typography variant="body1">
                          {item.time.slice(0, 8)}
                        </Typography>
                        <Typography variant="h6">{item.text}</Typography>
                        <hr
                          color="#cfcfcf"
                          style={{
                            marginTop: "0px",
                            marginBottom: "15px",
                          }}
                        />
                      </Box>
                    );
                  }
                  return list;
                }, [] as JSX.Element[])}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {setTimeout(initializeSize, 1) && <Fragment />}
    </Fragment>
  );
};

export default TranscriptPage;
