import React, { Fragment } from "react";
import {
  Box,
  Grid,
  Container,
  Card,
  Typography,
  TextField,
  InputAdornment,
  BoxProps,
} from "@material-ui/core";
import transcript from "../transcript";
import SearchIcon from "@material-ui/icons/Search";

const TranscriptPage: React.FunctionComponent = () => {
  const [search, setSearch] = React.useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const setVideoTime = (time: string) => {
    let setTime: number = 0;

    let hours = parseInt(time.slice(0, 2));
    let minutes = parseInt(time.slice(3, 5));
    let seconds = parseInt(time.slice(6, 8));

    setTime += hours * 360;
    setTime += minutes * 60;
    setTime += seconds;

    try {
      let video = document.getElementById("video") as HTMLVideoElement;
      if (video) {
        video.currentTime = setTime;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Fragment>
      <Box style={{ width: "95%", marginLeft: "2.5%", height: "100vh" }}>
        <Grid
          container
          alignItems="center"
          direction="row"
          style={{ height: "100%" }}
        >
          <Grid item md={8}>
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
              style={{ marginBottom: "2%" }}
              onChange={handleSearchChange}
            ></TextField>
            <video controls style={{ width: "100%" }} id="video">
              <source
                src="../../Assets/Hacklarious Video.mp4"
                type="video/mp4;"
              />
            </video>
          </Grid>
          <Grid
            item
            md={4}
            style={{ height: "90%", overflow: "hidden scroll", width: "100%" }}
          >
            {transcript.reduce((list, item, index, array) => {
              if (item.text.includes(search)) {
                list.push(
                  <Box
                    style={{ marginLeft: "5%" }}
                    onClick={() => {
                      setVideoTime(item.time);
                    }}
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
      </Box>
    </Fragment>
  );
};

export default TranscriptPage;
