export type Dominance = "folder" | "filename";

export interface Config {
  server: Server;
  users: User[];
  fileSettings: FileSettings;
  collections: Collection[];
}

export interface Collection {
  name: string;
  path: string;
  mediaType: string;
  isAdult: boolean;
  passwordProtected: boolean;
  password: string;
  userAccessIds: string[];
}

export interface FileSettings {
  fileNameDominance: Dominance;
  allowedExtensions: AllowedExtensions;
}

export interface AllowedExtensions {
  video: string[];
  image: string[];
  subtitle: string[];
}

export interface Server {
  name: string;
  homePage: HomePage;
}

export interface HomePage {
  carouselEnabled: boolean;
  categorySliderEnabled: boolean;
  genreSliderEnabled: boolean;
  collectionSliderEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  passwordProtected: boolean;
  password: string;
  isChildUser: boolean;
  profileImage: string;
}
