import socketio from "socket.io-client";
import { TranscriptionItemWithFinal } from "./transcriptTypes";

let audioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let audioStream: MediaStream | null = null;
let socketConnection: SocketIOClient.Socket | null = null;
let callback: (data: TranscriptionItemWithFinal) => void = () => {};

const getCallback = () => callback;

export const startRecording = (newCallback: (data: any) => void) => {
  callback = newCallback;

  // Initialize Socket
  socketConnection = socketio("http://localhost:8080");
  socketConnection.on("transcript", (data: any) => {
    getCallback()(data);
  });

  // Activate Server Connection to Google Speech-to-Text
  socketConnection.emit("start");

  // Initialize Microphone
  socketConnection.on("ready", () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(startRecordingHelper)
      .catch((e) => {
        console.log(e);
      });
  });
};

function startRecordingHelper(stream: MediaStream) {
  audioContext = audioContext || new AudioContext();
  audioStream = stream;
  if (!audioContext) {
    return;
  }

  console.log(stream);

  // AudioNode used to control the overall gain (or volume) of the audio graph
  const inputPoint = audioContext.createGain();
  const microphone = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  scriptProcessor = inputPoint.context.createScriptProcessor(2048, 2, 2);

  microphone.connect(inputPoint);
  inputPoint.connect(analyser);
  inputPoint.connect(scriptProcessor);
  scriptProcessor.connect(inputPoint.context.destination);
  // This is for registering to the “data” event of audio stream, without overwriting the default scriptProcessor.onAudioProcess function if there is one.
  scriptProcessor.addEventListener("audioprocess", streamAudioData);
}

const streamAudioData = (e: AudioProcessingEvent) => {
  // HERE GOES THE CODE TO SEND THE CHUNKED DATA FROM STREAM
  const linear16 = floatTo16BitPCM(e.inputBuffer.getChannelData(0));
  socketConnection?.emit("audio", linear16);
};

export const stopRecording = () => {
  // Stop Using Microphone
  audioStream?.getTracks().forEach((track) => track.stop());
  audioStream = null;

  // Stop Processing
  scriptProcessor?.removeEventListener("audioprocess", streamAudioData);

  // Activate Server Connection to Google Speech-to-Text
  socketConnection?.emit("stop");

  // Disconnect from the server
  // socketConnection?.disconnect();
  socketConnection = null;
};

/**
 * Accepts a Float32Array of audio data and converts it to a Buffer of l16 audio data (raw wav)
 *
 * Explanation for the math: The raw values captured from the Web Audio API are
 * in 32-bit Floating Point, between -1 and 1 (per the specification).
 * The values for 16-bit PCM range between -32768 and +32767 (16-bit signed integer).
 * Filter & combine samples to reduce frequency, then multiply to by 0x7FFF (32767) to convert.
 * Store in little endian.
 *
 * @param {Float32Array} input
 * @return {Buffer}
 */
const floatTo16BitPCM = (input: Float32Array) => {
  var output = new DataView(new ArrayBuffer(input.length * 2)); // length is in bytes (8-bit), so *2 to get 16-bit length
  for (var i = 0; i < input.length; i++) {
    var multiplier = input[i] < 0 ? 0x8000 : 0x7fff; // 16-bit signed range is -32768 to 32767
    output.setInt16(i * 2, (input[i] * multiplier) | 0, true); // index, value, little edian
  }
  return Buffer.from(output.buffer);
};
