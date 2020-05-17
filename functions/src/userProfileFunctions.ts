import * as functions from "firebase-functions";
import firebaseApp from "./firebaseConfig";
import { UserProfile, UserProfileUpdateObject } from "./userTypes";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const createUserProfileDatabase = functions.https.onRequest(
  (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    const userProfile = JSON.parse(request.body) as UserProfile;

    return firebaseApp
      .firestore()
      .collection("users")
      .doc(userProfile.userId)
      .set(userProfile)
      .then(() => response.status(200).send(true))
      .catch((err) => {
        console.log(err);
        response.status(200).send(false);
      });
  }
);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getUserProfileDatabase = functions.https.onRequest(
  (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    const userId = request.body;

    return firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data) {
          response.status(200).send(JSON.stringify(data));
        } else {
          response.status(500).send(`No Data Found for ${userId}`);
        }
      })
      .catch((err) => {
        console.log(err);
        response.status(500).send(`Error Getting Profile for ${userId}`);
      });
  }
);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const updateUserProfileDatabase = functions.https.onRequest(
  (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    const { userId, updateObject } = JSON.parse(
      request.body
    ) as UserProfileUpdateObject;

    return firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .update(updateObject)
      .then(() => response.status(200).send(true))
      .catch((err) => {
        console.log(err);
        response.status(200).send(false);
      });
  }
);
