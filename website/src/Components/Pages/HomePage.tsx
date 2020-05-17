import { Container, Typography, Button } from "@material-ui/core";
import React from "react";
import { styles } from "../../Styles";
import { PageProps } from ".";

const HomePage: React.FunctionComponent<PageProps> = ({
  currentUser,
  setPageKey,
}) => {
  const classes = styles();

  return (
    <Container>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Audio Alerter!</Typography>
      </Container>
      {!currentUser && (
        <Button
          color={currentUser ? "inherit" : "primary"}
          fullWidth
          variant="contained"
          size="large"
          className={classes.margined}
          disabled={currentUser ? true : false}
          onClick={() => {
            setPageKey("login");
          }}
        >
          <Typography variant="h4">
            {currentUser ? "Already Logged In." : "Login"}
          </Typography>
        </Button>
      )}
      <Button
        color={currentUser ? "primary" : "inherit"}
        fullWidth
        variant="contained"
        size="large"
        className={classes.margined}
        disabled={currentUser ? false : true}
        onClick={() => {
          setPageKey("events");
        }}
      >
        <Typography variant="h4">
          {currentUser
            ? "Real Time Alerts (Live Audio)"
            : "Please Login to Sign Up to Use Real Time Alerts"}
        </Typography>
      </Button>
      <Button
        color={currentUser ? "primary" : "inherit"}
        fullWidth
        variant="contained"
        size="large"
        className={classes.margined}
        disabled={currentUser ? false : true}
        onClick={() => {
          setPageKey("events");
        }}
      >
        <Typography variant="h4">
          {currentUser
            ? "Video Search (Pre-Recorded Videos)"
            : "Please Login to Sign Up to Use Video Search"}
        </Typography>
      </Button>
      <Button
        color={currentUser ? "primary" : "inherit"}
        fullWidth
        variant="contained"
        size="large"
        className={classes.margined}
        disabled={currentUser ? false : true}
        onClick={() => {
          setPageKey("events");
        }}
      >
        <Typography variant="h4">
          {currentUser
            ? "Past Transcripts"
            : "Please Login to Sign Up to Access Past Transcripts"}
        </Typography>
      </Button>
    </Container>
  );
};

export default HomePage;
