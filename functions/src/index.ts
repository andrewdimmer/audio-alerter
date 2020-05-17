import * as functions from "firebase-functions";
import {
  createUserProfileDatabase,
  getUserProfileDatabase,
  updateUserProfileDatabase,
} from "./userProfileFunctions";
import { getVideoTranscripts, saveVideoTranscript } from "./videoFunctions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const create_user_profile_database = createUserProfileDatabase;
export const get_user_profile_database = getUserProfileDatabase;
export const update_user_profile_database = updateUserProfileDatabase;
export const save_video_transcript = saveVideoTranscript;
export const get_video_transcripts = getVideoTranscripts;
