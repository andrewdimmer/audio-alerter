export declare interface UserPublicProfile {
  userId: string;
  displayName: string;
  email: string;
  photoUrl: string;
}

export declare interface UserProfile extends UserPublicProfile {}

export declare interface UserProfileUpdateObject {
  userId: string;
  updateObject: { displayName?: string; email?: string; photoUrl?: string };
}
