export type FileNameDominance = "folder" | "file";

export interface Config {
  server: Server;
  desktop: Desktop;
  users: User[];
  collections: Collection[];
}

export interface Desktop {
  homePage: HomePage;
}

export interface Collection {
  id: string;
  name: string;
  path: string;
  mediaType: string;
  isAdult: boolean;
  passwordProtected: boolean;
  password: string;
  userAccessIds: string[];
}

export interface AllowedExtensions {
  video: string[];
  image: string[];
  subtitle: string[];
}

export interface Server {
  name: string;
  fileNameDominance: FileNameDominance;
  allowedExtensions: AllowedExtensions;
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
