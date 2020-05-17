import { Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";
import LoginUi from "../Content/LoginUi";
import { createUserProfileDatabase } from "../../Scripts/userProfileFunctions";

const LoginPage: React.FunctionComponent<PageProps> = ({
  setNotification,
  setPageKey,
  setLoadingMessage,
  forceReloadUserData,
  handleLoadUserData,
  currentUser,
  classes,
}) => {
  const newUserCallback = (authResult: firebase.auth.UserCredential) => {
    if (authResult.user) {
      const user = authResult.user;
      setLoadingMessage("Creating Account...");
      createUserProfileDatabase({
        userId: user.uid,
        displayName: user.displayName ? user.displayName : "",
        email: user.email ? user.email : "",
        photoUrl: user.photoURL ? user.photoURL : "",
      })
        .then((value) => {
          if (value) {
            setPageKey("profile");
            setNotification({
              type: "info",
              message:
                "Almost there! Please complete the form below to finish creating your account.",
              open: true,
            });
            handleLoadUserData(user.uid);
            forceReloadUserData();
            setLoadingMessage("");
          } else {
            setNotification({
              type: "error",
              message:
                "Unable to finish creating your account. Please try again later.",
              open: true,
            });
            setPageKey("logout");
            setLoadingMessage("");
          }
        })
        .catch((err) => {
          console.log(err);
          setNotification({
            type: "error",
            message:
              "Unable to finish creating your account. Please try again later.",
            open: true,
          });
          setPageKey("logout");
          setLoadingMessage("");
        });
    } else {
      setNotification({
        type: "error",
        message:
          "Unable to finish creating your account. Please try again later.",
        open: true,
      });
    }
  };

  const existingUserCallback = (authResult: firebase.auth.UserCredential) => {
    handleLoadUserData(authResult.user?.uid ? authResult.user.uid : "");
    forceReloadUserData();
    setPageKey("home");
    setNotification({
      type: "success",
      message: "Successfully Signed In",
      open: true,
    });
  };

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Join or Login</Typography>
      </Container>
      {!currentUser ? (
        <LoginUi
          allowEmailAuth={true}
          allowPhoneAuth={false}
          allowAnonymousAuth={false}
          newUserCallback={newUserCallback}
          existingUserCallback={existingUserCallback}
          classes={classes}
        />
      ) : (
        setPageKey("logout")
      )}
    </Fragment>
  );
};

export default LoginPage;
