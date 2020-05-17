import http from "http";
import socketIO from "socket.io";
import { speechToTextClient } from "./speechToText";
import Pumpify from "pumpify"; // For Type Defs
import { google } from "@google-cloud/speech/build/protos/protos";

console.log("Started Server");

const encoding: any = "LINEAR16";
const sampleRateHertz = 48000;
const languageCode = "en-US";
const config: google.cloud.speech.v1.IRecognitionConfig = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  enableAutomaticPunctuation: true,
  model: "video",
};
const request = {
  config,
  interimResults: true,
};

const server = http.createServer();
const io = socketIO(server);
io.on("connection", (client) => {
  // On New Connection:
  console.log("New Connection: " + client.id);
  let recognizer: Pumpify | null = null;
  const speechCallback = (data: any) => {
    console.log("Callback");
    console.log("data: " + data);
    client.emit("transcript", data);
  };

  // Initialize Audio Streaming
  client.on("start", () => {
    console.log("Start Streaming Audio Data.");
    recognizer = speechToTextClient
      .streamingRecognize(request)
      .on("error", (err: any) => {
        console.log(err);
      })
      .on("data", speechCallback);

    // Let the front end know that the server is set and connected, and is ready for data.
    client.emit("ready");
    console.log("ready");
  });

  // Stream Audio Data for Transcription
  client.on("audio", (data) => {
    if (recognizer) {
      console.log("audio");
      recognizer.write(data);
    } else {
      console.log("No recongizer for the audio!");
    }
  });

  // Stop Streaming Audio Data
  client.on("stop", () => {
    if (recognizer) {
      console.log("Stop Streaming Audio Data.");
      recognizer?.end();
      recognizer?.removeListener("data", speechCallback);
      recognizer = null;
    } else {
      console.log("No recongizer to disconnect!");
    }
  });

  // Disconnnect the Client
  client.on("disconnect", () => {
    console.log("disconnected " + client.id);
  });
});

// Start the Server
server.listen(8080);
