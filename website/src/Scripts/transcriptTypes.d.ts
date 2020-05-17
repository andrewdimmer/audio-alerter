export declare interface TranscriptItem {
  text: string;
  time: string;
}

export declare interface TranscriptionItemWithFinal extends TranscriptItem {
  isFinal: boolean;
}

export declare interface VideoData {
  videoTitle: string;
  videoSource: string;
  videoType: string;
  transcript: TranscriptItem[];
}
