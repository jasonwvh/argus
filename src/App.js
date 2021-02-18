import React from "react";
import "./App.css";

const ComputerVisionClient = require("@azure/cognitiveservices-computervision")
    .ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({
        inHeader: { "Ocp-Apim-Subscription-Key": process.env.REACT_APP_CV_KEY },
    }),
    process.env.REACT_APP_CV_ENDPOINT
);

const fpsInterval = 5000;
var now, then, elapsed;

class App extends React.Component {
    videoRef = React.createRef();
    canvasRef = React.createRef();

    componentDidMount() {
        // Load webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: false,
                    video: {
                        facingMode: "environment",
                        width: { ideal: 500 },
                        height: { ideal: 600 },
                    },
                })
                .then((stream) => {
                    this.videoRef.current.srcObject = stream;
                });
        }

        // Start loop
        then = Date.now();
        this.update();
    }

    // Function to grab frame from video
    grabFrame = (video) => {
        if (typeof video === "string") {
            video = document.getElementById(video);
        }

        var format = "jpeg";
        var quality = 0.92;

        if (!video || (format !== "png" && format !== "jpeg")) {
            return false;
        }

        var canvas = document.createElement("CANVAS");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext("2d").drawImage(video, 0, 0);

        var dataUri = canvas.toDataURL("image/" + format, quality);
        var data = dataUri.split(",")[1];
        var mimeType = dataUri.split(";")[0].slice(5);

        var bytes = window.atob(data);
        var buf = new ArrayBuffer(bytes.length);
        var arr = new Uint8Array(buf);

        for (var i = 0; i < bytes.length; i++) {
            arr[i] = bytes.charCodeAt(i);
        }

        var blob = new Blob([arr], { type: mimeType });
        return { blob: blob, dataUri: dataUri, format: format };
    };

    // Main loop
    update = () => {
        requestAnimationFrame(() => {
            this.update();
        });

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            // Put your drawing code here
            this.detectFrame();
        }
    };

    // Object detection
    detectFrame = async () => {
        const frame = await this.grabFrame(this.videoRef.current);
        let predictions = [];

        if (frame) {
            predictions = await this.getPredictions(frame.blob);
        } else {
            predictions = [
                {
                    rectangle: {
                        x: 0,
                        y: 0,
                        w: 135,
                        h: 85,
                    },
                    object: "kitchen appliance",
                    confidence: 0.501,
                },
                {
                    rectangle: {
                        x: 2,
                        y: 377,
                        w: 185,
                        h: 46,
                    },
                    object: "computer keyboard",
                    confidence: 0.51,
                },
            ];
        }

        console.log(predictions);

        this.renderPredictions(predictions);
    };

    // Retrieve predictions from Azure Computer Vision
    getPredictions = async (frame) => {
        const objects = (
            await computerVisionClient.analyzeImageInStream(frame, {
                visualFeatures: ["Objects"],
            })
        ).objects;

        return objects;
    };

    // Draw bounding box
    renderPredictions = (predictions) => {
        const ctx = this.canvasRef.current.getContext("2d");
        console.log(ctx.canvas.width, ctx.canvas.height);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Font options.
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        predictions.forEach((prediction) => {
            const x = prediction.rectangle.x;
            const y = prediction.rectangle.y;
            const width = prediction.rectangle.w;
            const height = prediction.rectangle.h;
            // Draw the bounding box.
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            // Draw the label background.
            ctx.fillStyle = "#00FFFF";
            const textWidth = ctx.measureText(prediction.object).width;
            const textHeight = parseInt(font, 10); // base 10
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
        });

        predictions.forEach((prediction) => {
            const x = prediction.rectangle.x;
            const y = prediction.rectangle.y;
            // Draw the text last to ensure it's on top.
            ctx.fillStyle = "#000000";
            ctx.fillText(prediction.object, x, y);
        });
    };

    render() {
        return (
            <div className="video-container">
                <video
                    height="600"
                    width="500"
                    autoPlay
                    playsInline
                    muted
                    ref={this.videoRef}
                />
                <canvas height="600" width="500" ref={this.canvasRef} />
            </div>
        );
    }
}

export default App;
