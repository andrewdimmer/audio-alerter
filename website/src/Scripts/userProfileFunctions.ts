import ky from "ky";
import { UserProfile, UserProfileUpdateObject } from "./userTypes";

/**
 * createUserProfileDatabase
 * @description Creates a profile in the database for a new user after account creation.
 * @param userData The data to save to the database.
 * @returns true if there were no errors creating the database object; false otherwise.
 */
export const createUserProfileDatabase = (
  userData: UserProfile
): Promise<boolean> => {
  return ky
    .post(
      "https://us-central1-ruhacks2020-gcp.cloudfunctions.net/create_user_profile_database",
      {
        body: JSON.stringify(userData),
      }
    )
    .then((results) =>
      results
        .text()
        .then(
          (text) => text.length === "true".length && text.indexOf("true") === 0
        )
        .catch((err) => {
          console.log(err);
          return false;
        })
    )
    .catch((err) => {
      console.log(err);
      return false;
    });
};

/**
 * getUserProfileDatabase
 * @description Gets the user profile in the database.
 * @param userId The userId of the user to get the profile of from the database.
 * @returns The UserProfile  of the user if there were no errors getting the database object; null otherwise.
 */
export const getUserProfileDatabase = (
  userId: string
): Promise<UserProfile | null> => {
  return ky
    .post(
      "https://us-central1-ruhacks2020-gcp.cloudfunctions.net/get_user_profile_database",
      {
        body: userId,
      }
    )
    .then((results) =>
      results
        .json()
        .then((json) => json)
        .catch((err) => {
          console.log(err);
          return null;
        })
    )
    .catch((err) => {
      console.log(err);
      return null;
    });
};

/**
 * updateDisplayNameDatabase
 * @description Updates the user profile in the database.
 * @param userProfileUpdateInformation The data to update in the database.
 * @returns true if there were no errors updating the database object; false otherwise.
 */
export const updateUserProfileDatabase = (
  userProfileUpdateInformation: UserProfileUpdateObject
): Promise<boolean> => {
  return ky
    .post(
      "https://us-central1-ruhacks2020-gcp.cloudfunctions.net/update_user_profile_database",
      {
        body: JSON.stringify(userProfileUpdateInformation),
      }
    )
    .then((results) =>
      results
        .text()
        .then(
          (text) => text.length === "true".length && text.indexOf("true") === 0
        )
        .catch((err) => {
          console.log(err);
          return false;
        })
    )
    .catch((err) => {
      console.log(err);
      return false;
    });
};
