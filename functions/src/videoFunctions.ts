import * as functions from "firebase-functions";
import firebaseApp from "./firebaseConfig";
import { SaveVideoData, VideoData } from "./transcriptTypes";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const saveVideoTranscript = functions.https.onRequest(
  (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    console.log(typeof request.body);
    console.log(request.body);
    const saveVideoData = request.body as SaveVideoData;

    return firebaseApp
      .firestore()
      .collection("users")
      .doc(saveVideoData.userId)
      .collection("videos")
      .doc(saveVideoData.videoData.videoId)
      .set(saveVideoData.videoData)
      .then(() => response.status(200).send(true))
      .catch((err) => {
        console.log(err);
        response.status(200).send(false);
      });
  }
);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getVideoTranscripts = functions.https.onRequest(
  (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    const userId = request.body as string;

    return firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("videos")
      .get()
      .then((value) => {
        const videos = value.docs.reduce((array, docValue) => {
          const data = docValue.data();
          if (data) {
            array.push(data as VideoData);
          }
          return array;
        }, [] as VideoData[]);
        response.status(200).send(JSON.stringify({ videos }));
      })
      .catch((err) => {
        console.log(err);
        response.status(500).send("Error getting videos collection");
      });
  }
);
