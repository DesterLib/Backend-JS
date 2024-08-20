export type Dominance = "folder" | "filename";

export interface Directory {
  path: string;
  type: string;
}

export interface HomePage {
  carousel: boolean;
  categorySlider: boolean;
  genreSlider: boolean;
  collectionSlider: boolean;
}

export interface Config {
  homePage: HomePage;
  fileNameDominance: Dominance;
  allowedVideoExtensions: string[];
  allowedImageExtensions: string[];
  allowedSubtitleExtensions: string[];
  directories: Directory[];
}
