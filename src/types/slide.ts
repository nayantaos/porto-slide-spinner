
export type SlideType = "3d" | "video";

export interface SlideConfig {
  file: string;
  rotation_time: number;
  type: SlideType;
}

export interface SlidePlayerConfig {
  files: SlideConfig[];
}
