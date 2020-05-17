export declare interface TranscriptItem {
  text: string;
  time: string;
}

export declare interface TranscriptionItemWithFinal extends TranscriptItem {
  isFinal: boolean;
}

export declare interface VideoData {
  videoId: string;
  videoTitle: string;
  videoSource: string;
  videoType: string;
  transcript: TranscriptItem[];
}

export declare interface SaveVideoData {
  userId: string;
  videoData: VideoData;
}
