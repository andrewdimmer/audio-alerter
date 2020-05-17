import { Container, Typography, Button } from "@material-ui/core";
import React from "react";
import { styles } from "../../Styles";
import { PageProps } from ".";
import transcript from "../../transcript";
import { DropzoneArea } from "material-ui-dropzone";

const UploadPage: React.FunctionComponent<PageProps> = ({
  setNotification,
  setVideo,
  setLoadingMessage,
}) => {
  const classes = styles();

  const [newProfilePicture, setNewProfilePicture] = React.useState<any>(null);

  const handleImageChange = (file: any) => {
    setNewProfilePicture(file);
  };

  return (
    <Container>
      <Typography variant="h3" style={{ marginBottom: "1rem" }}>
        Upload a video
      </Typography>
      <DropzoneArea
        acceptedFiles={["video/*"]}
        filesLimit={1}
        maxFileSize={1000000000}
        dropzoneText="Either drag and drop an image file here or click here to upload an image from your device."
        showAlerts={false}
        onDrop={(files) => {
          handleImageChange(files[0]);
          setNotification({
            type: "success",
            message: `File ${files[0].name} successfully added.`,
            open: true,
          });
        }}
        onDropRejected={(files, evt) => {
          setNotification({
            type: "error",
            message: `File ${files[0].name} was rejected. The file may not be supported or may be too big.`,
            open: true,
          });
        }}
        onDelete={(files) => {
          handleImageChange(null);
          setNotification({
            type: "info",
            message: `File ${files.name} removed.`,
            open: true,
          });
        }}
      ></DropzoneArea>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setVideo({
            videoId: "Test",
            videoTitle: "Hacklarious Demo Video",
            videoSource: "../..//Assets/HacklariousVideo.mp4",
            videoType: "video/mp4",
            transcript,
          });
          setLoadingMessage("Processing");
          setTimeout(() => {
            setLoadingMessage("");
          }, 3000);
        }}
        style={{ marginTop: "1rem", float: "right" }}
      >
        Submit
      </Button>
    </Container>
  );
};

export default UploadPage;
