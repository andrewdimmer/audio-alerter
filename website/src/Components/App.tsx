import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { firebaseApp } from "../Scripts/firebaseConfig";
import { VideoData } from "../Scripts/transcriptTypes";
import { getUserProfileDatabase } from "../Scripts/userProfileFunctions";
import { UserProfile } from "../Scripts/userTypes";
import { styles } from "../Styles";
import NavBar from "./Layouts/NavBar";
import TranscriptPage from "./Layouts/TranscriptSearchAndDisplay";
import LoadingScreen from "./Misc/LoadingScreen";
import NotificationBar, { NotificationMessage } from "./Misc/Notifications";
import { getPageComponent, getPageTitle } from "./Pages";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const App: React.FunctionComponent<AppProps> = ({ theme, toggleTheme }) => {
  const [notification, setNotification] = React.useState<NotificationMessage>({
    type: "info",
    message: "",
    open: false,
  });
  const [loadingMessage, setLoadingMessage] = React.useState<string>("");
  const [pageKey, setPageKey] = React.useState<string>("home");
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(
    null
  );
  const [
    currentUserProfile,
    setCurrentUserProfile,
  ] = React.useState<UserProfile | null>(null);
  const [reloadUserData, setReloadUserData] = React.useState<boolean>(true);
  const [video, setVideo] = React.useState<VideoData | undefined>(undefined);
  const [live, setLive] = React.useState<boolean>(false);

  const PageContent = getPageComponent(pageKey);
  const classes = styles();

  const forceReloadUserData = () => {
    setReloadUserData(true);
  };

  const handleLoadUserData = (userId: string) => {
    if (userId) {
      getUserProfileDatabase(userId)
        .then((data) => {
          setCurrentUserProfile(data);
        })
        .catch(() => {
          setCurrentUserProfile(null);
        });
    }
  };

  const loadUserData = () => {
    if (reloadUserData) {
      const oneTimeLoadListener = firebaseApp
        .auth()
        .onAuthStateChanged((user) => {
          if (user) {
            setCurrentUser(user);
            handleLoadUserData(user?.uid);
          } else {
            setCurrentUser(null);
            setCurrentUserProfile(null);
          }
          oneTimeLoadListener(); // Removes the listener after it runs
        });
      setReloadUserData(false);
    }
  };

  setTimeout(loadUserData, 1);

  return (
    <Fragment>
      <NavBar
        pageTitle={getPageTitle(pageKey)}
        setPageKey={setPageKey}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUserProfile={currentUserProfile}
        backFunction={
          video
            ? () => setVideo(undefined)
            : live
            ? () => setLive(false)
            : undefined
        }
      />
      {video || live ? (
        <TranscriptPage
          video={video}
          live={live}
          setNotification={setNotification}
          classes={classes}
        />
      ) : (
        <Container className={classes.marginedTopBottom}>
          <PageContent
            setPageKey={setPageKey}
            setLoadingMessage={setLoadingMessage}
            setNotification={setNotification}
            forceReloadUserData={forceReloadUserData}
            handleLoadUserData={handleLoadUserData}
            setVideo={setVideo}
            setLive={setLive}
            currentUser={currentUser}
            currentUserProfile={currentUserProfile}
            classes={classes}
          />
          {pageKey !== "home" && (
            <Button
              color="primary"
              fullWidth
              variant="outlined"
              size="large"
              className={classes.marginedTopBottom}
              onClick={() => {
                setPageKey("home");
              }}
            >
              <Typography variant="h4">Return to Home</Typography>
            </Button>
          )}
        </Container>
      )}
      <LoadingScreen loadingMessage={loadingMessage} />
      <NotificationBar
        notification={notification}
        setNotification={setNotification}
      />
    </Fragment>
  );
};

export default App;
