import { v1p1beta1 as speech } from "@google-cloud/speech/";
import { GoogleAuth } from "google-auth-library";
/* import Pumpify from "pumpify"; // For Type Defs

// Note: Used for Infinite Stream Transcription
const encoding: any = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";
const streamingLimit = 10000; // ms - set to low number for demo purposes */

export const speechToTextClient = new speech.SpeechClient({
  auth: new GoogleAuth({ keyFilename: "./credentials.json" }),
});

// Note: Used for Infinite Stream Transcription
/*
const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};

const request = {
  config,
  interimResults: true,
};

let recognizeStream: Pumpify | null = null;
let restartCounter = 0;
let audioInput: any[] = [];
let lastAudioInput: any[] = [];
let resultEndTime = 0;
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;

export function startStream() {
  console.log("Start");
  // Clear current audioInput
  audioInput = [];
  // Initiate (Reinitiate) a recognize stream
  recognizeStream = speechToTextClient
    .streamingRecognize(request)
    .on("error", (err: any) => {
      console.log(err);
      if (err.code === 11) {
        restartStream();
      } else {
        console.error("API request error " + err);
      }
    })
    .on("data", (data) => {
      console.log("data: " + data);
      speechCallback(data);
    });

  // Restart stream when streamingLimit expires
  setTimeout(restartStream, streamingLimit);
}

const speechCallback = (stream: any) => {
  console.log("Callback");
  // Convert API result end time from seconds + nanoseconds to milliseconds
  resultEndTime =
    stream.results[0].resultEndTime.seconds * 1000 +
    Math.round(stream.results[0].resultEndTime.nanos / 1000000);

  // Calculate correct time based on offset from audio sent twice
  const correctedTime =
    resultEndTime - bridgingOffset + streamingLimit * restartCounter;

  //process.stdout.clearLine();
  process.stdout.cursorTo(0);
  let stdoutText = "";
  if (stream.results[0] && stream.results[0].alternatives[0]) {
    stdoutText =
      correctedTime + ": " + stream.results[0].alternatives[0].transcript;
  }

  if (stream.results[0].isFinal) {
    console.log(stdoutText);
    // process.stdout.write(chalk.green(`${stdoutText}\n`));

    isFinalEndTime = resultEndTime;
    lastTranscriptWasFinal = true;
  } else {
    // Make sure transcript does not exceed console character length
    if (stdoutText.length > process.stdout.columns) {
      stdoutText = stdoutText.substring(0, process.stdout.columns - 4) + "...";
    }
    console.log(stdoutText);
    // process.stdout.write(chalk.red(`${stdoutText}`));

    lastTranscriptWasFinal = false;
  }
};

export const audioInputStreamTransform = (chunk: any) => {
  console.log("Transform");
  if (newStream && lastAudioInput.length !== 0) {
    // Approximate math to calculate time of chunks
    const chunkTime = streamingLimit / lastAudioInput.length;
    if (chunkTime !== 0) {
      if (bridgingOffset < 0) {
        bridgingOffset = 0;
      }
      if (bridgingOffset > finalRequestEndTime) {
        bridgingOffset = finalRequestEndTime;
      }
      const chunksFromMS = Math.floor(
        (finalRequestEndTime - bridgingOffset) / chunkTime
      );
      bridgingOffset = Math.floor(
        (lastAudioInput.length - chunksFromMS) * chunkTime
      );

      for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
        if (recognizeStream) {
          recognizeStream.write(lastAudioInput[i]);
          console.log("Writing Data...");
        }
      }
    }
    newStream = false;
  }

  audioInput.push(chunk);

  if (recognizeStream) {
    console.log("Writing Data...");
    recognizeStream.write(chunk);
  }
};

function restartStream() {
  console.log("Restart");
  if (recognizeStream) {
    recognizeStream.removeListener("data", speechCallback);
    recognizeStream = null;
  }
  if (resultEndTime > 0) {
    finalRequestEndTime = isFinalEndTime;
  }
  resultEndTime = 0;

  lastAudioInput = [];
  lastAudioInput = audioInput;

  restartCounter++;

  if (!lastTranscriptWasFinal) {
    process.stdout.write("\n");
  }

  console.log(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`);
  // process.stdout.write(
  //   chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
  // );

  newStream = true;

  startStream();
} */
