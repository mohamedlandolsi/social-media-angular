export interface User {
  _id: string; // User ID
  username: string; // Username
  email: string; // Email
  password: string; // Password
  description: string; // Description
  city: string; // City
  homeTown: string; // From
  relationship: string; // Relationship
  createdAt: string; // Account creation date
  updatedAt: string; // Account update date
  profilePicture: string; // Profile picture URL
  coverPicture: string; // Cover picture URL
  followers: string[]; // Followers' IDs
  followings: string[]; // Followings' IDs
  isAdmin: boolean; // Admin status
  __v: number; // Version number
}
