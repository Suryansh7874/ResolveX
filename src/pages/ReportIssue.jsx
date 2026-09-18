import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  Send,
  X,
  Sparkles,
  FileText,
  Video,
} from "lucide-react";

function ReportIssue() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // FORM STATE
  // --------------------------------------------------

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  // --------------------------------------------------
  // LOCATION
  // --------------------------------------------------

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [locationStatus, setLocationStatus] = useState(
    "Fetching your location..."
  );

  // --------------------------------------------------
  // VOICE
  // --------------------------------------------------

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);

  // --------------------------------------------------
  // SUBMISSION
  // --------------------------------------------------

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // GET LOCATION
  // --------------------------------------------------

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        setLocationStatus("Location captured successfully.");
      },
      (error) => {
        console.error("Location error:", error);

        setLocationStatus(
          "Unable to get location. Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // --------------------------------------------------
  // SPEECH RECOGNITION
  // --------------------------------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setDescription((previous) => {
          const separator = previous.trim() ? " " : "";

          return (
            previous +
            separator +
            finalTranscript.trim()
          );
        });
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (event.error === "no-speech") {
        setError(
          "No speech detected. Please try again."
        );
      } else {
        setError(
          "Could not recognize your speech. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.error(
          "Speech cleanup error:",
          error
        );
      }
    };
  }, []);

  // --------------------------------------------------
  // VOICE INPUT
  // --------------------------------------------------

  const handleVoiceInput = () => {
    if (!speechSupported) {
      setError(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (!recognitionRef.current) {
      setError(
        "Voice recognition could not be initialized."
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error(
          "Voice stop error:",
          error
        );
      }

      setIsListening(false);
      return;
    }

    setError("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error(
        "Voice start error:",
        error
      );

      setError(
        "Voice recognition could not be started. Please try again."
      );
    }
  };

  // --------------------------------------------------
  // IMAGE SELECTION
  // --------------------------------------------------

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));

    // Clear video if image is selected
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideo(null);
    setVideoPreview("");

    setError("");
  };

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  // --------------------------------------------------
  // VIDEO SELECTION
  // --------------------------------------------------

  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));

    // Clear image if video is selected
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");

    setError("");
  };

  // --------------------------------------------------
  // REMOVE VIDEO
  // --------------------------------------------------

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideo(null);
    setVideoPreview("");
  };

  // --------------------------------------------------
  // SUBMIT CHALLENGE
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!title.trim()) {
      setError(
        "Please enter a title for the challenge."
      );
      return;
    }

    if (title.trim().length < 5) {
      setError(
        "Challenge title should contain at least 5 characters."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please describe the societal challenge."
      );
      return;
    }

    if (description.trim().length < 20) {
      setError(
        "Please provide a more detailed description of the challenge."
      );
      return;
    }

    // New backend requires media.
    // At least one image is required by the current
    // challenge controller.
    if (!image) {
      setError(
        "Please upload an image related to the challenge."
      );
      return;
    }

    if (
      location.latitude === null ||
      location.longitude === null
    ) {
      setError(
        "Location is required. Please allow location access and try again."
      );
      return;
    }

    // ----------------------------------------------
    // AUTHENTICATION
    // ----------------------------------------------

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // --------------------------------------------
      // FORM DATA
      // --------------------------------------------

      const formData = new FormData();

formData.append("title", title);
formData.append("description", description);
formData.append("location", JSON.stringify(location));

const user = JSON.parse(localStorage.getItem("user"));

const submittedBy = user?._id || user?.id || user?.userId;

if (!submittedBy) {
  setError("User ID not found. Please login again.");
  return;
}

formData.append("submittedBy", submittedBy);

formData.append("image", image);

if (video) {
  formData.append("video", video);
}
      // --------------------------------------------
      // DEBUG
      // --------------------------------------------

      console.log(
        "----------------------------------------"
      );

      console.log(
        "Submitting ResolveX Challenge..."
      );

      console.log(
        "Title:",
        title.trim()
      );

      console.log(
        "Description:",
        description.trim()
      );

      console.log(
        "Location:",
        {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      );

      console.log(
        "Image:",
        image?.name
      );

      console.log(
        "Video:",
        video?.name || "None"
      );

      console.log(
        "----------------------------------------"
      );

      // --------------------------------------------
      // NEW CHALLENGE API
      // --------------------------------------------

      const response = await fetch(
        "http://localhost:5000/api/challenges",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      // --------------------------------------------
      // READ SERVER RESPONSE
      // --------------------------------------------

      const responseText =
        await response.text();

      console.log(
        "Server status:",
        response.status
      );

      console.log(
        "Raw server response:",
        responseText
      );

      let data = null;

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "JSON parsing failed:",
            parseError
          );
        }
      }

      // --------------------------------------------
      // HANDLE SERVER ERROR
      // --------------------------------------------

      if (!response.ok) {
        const serverMessage =
          data?.message ||
          data?.error ||
          data?.msg;

        if (serverMessage) {
          throw new Error(serverMessage);
        }

        if (responseText.trim()) {
          throw new Error(
            `Server error (${response.status}): ${responseText.trim()}`
          );
        }

        throw new Error(
          `Failed to submit challenge. Status: ${response.status}`
        );
      }

      // --------------------------------------------
      // SUCCESS
      // --------------------------------------------

      console.log(
        "Challenge created successfully:",
        data
      );

      setMessage(
        "Your societal challenge has been submitted successfully."
      );

      // Clear form
      setTitle("");
      setDescription("");

      setImage(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview("");

      setVideo(null);

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setVideoPreview("");

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
    } catch (error) {
      console.error(
        "Submit challenge error:",
        error
      );

      if (error?.message) {
        setError(error.message);
      } else {
        setError(
          "Something went wrong while submitting the challenge."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .challenge-page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at top left,
              rgba(37, 99, 235, 0.08),
              transparent 30%
            ),
            #f8fafc;

          color: #1f2937;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* ================= HEADER ================= */

        .challenge-header {
          height: 72px;

          background: rgba(255, 255, 255, 0.94);

          border-bottom:
            1px solid #e5e7eb;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 7%;

          position: sticky;
          top: 0;

          z-index: 10;

          backdrop-filter: blur(12px);
        }

        .back-button {
          border: none;
          background: transparent;

          display: flex;
          align-items: center;
          gap: 8px;

          color: #374151;

          font-size: 15px;
          font-weight: 600;

          cursor: pointer;

          padding: 8px 0;
        }

        .back-button:hover {
          color: #2563eb;
        }

        .challenge-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .challenge-logo {
          width: 40px;
          height: 40px;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 20px;
          font-weight: 700;

          box-shadow:
            0 5px 15px
            rgba(37, 99, 235, 0.2);
        }

        .challenge-brand h2 {
          margin: 0;

          font-size: 19px;

          color: #111827;
        }

        .challenge-brand span {
          display: block;

          margin-top: 2px;

          color: #6b7280;

          font-size: 11px;
        }

        /* ================= MAIN ================= */

        .challenge-container {
          width: min(900px, 92%);

          margin: 0 auto;

          padding: 50px 0 70px;
        }

        .challenge-heading {
          margin-bottom: 32px;
        }

        .challenge-label {
          margin: 0 0 8px;

          color: #2563eb;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: 1.5px;
        }

        .challenge-heading h1 {
          margin: 0;

          font-size: 38px;

          color: #111827;

          letter-spacing: -0.8px;
        }

        .challenge-heading > p:last-child {
          margin-top: 10px;

          color: #6b7280;

          font-size: 16px;

          line-height: 1.6;

          max-width: 650px;
        }

        /* ================= WORKFLOW ================= */

        .workflow-info {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 28px;

          padding: 14px 16px;

          background: #eff6ff;

          border:
            1px solid #dbeafe;

          border-radius: 12px;

          color: #1d4ed8;

          font-size: 13px;
        }

        .workflow-info strong {
          color: #1e40af;
        }

        /* ================= FORM ================= */

        .challenge-form {
          display: flex;
          flex-direction: column;

          gap: 20px;
        }

        .challenge-card {
          background:
            rgba(255, 255, 255, 0.96);

          border:
            1px solid #e5e7eb;

          border-radius: 16px;

          padding: 26px;

          box-shadow:
            0 5px 20px
            rgba(15, 23, 42, 0.045);
        }

        .card-heading {
          display: flex;
          align-items: flex-start;

          gap: 13px;

          margin-bottom: 21px;
        }

        .heading-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          border-radius: 10px;

          background: #eff6ff;

          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-heading h2 {
          margin: 0;

          font-size: 18px;

          color: #111827;
        }

        .card-heading p {
          margin: 5px 0 0;

          color: #6b7280;

          font-size: 13px;

          line-height: 1.5;
        }

        /* ================= INPUT ================= */

        .field-group {
          margin-bottom: 18px;
        }

        .field-group:last-child {
          margin-bottom: 0;
        }

        .field-label {
          display: block;

          margin-bottom: 8px;

          font-size: 13px;

          font-weight: 700;

          color: #374151;
        }

        .required {
          color: #dc2626;
        }

        .text-input {
          width: 100%;

          height: 48px;

          border:
            1px solid #d1d5db;

          border-radius: 10px;

          padding: 0 14px;

          font-family: inherit;

          font-size: 14px;

          color: #1f2937;

          background: white;

          outline: none;

          transition: 0.2s ease;
        }

        .text-input:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.1);
        }

        .text-input::placeholder {
          color: #9ca3af;
        }

        /* ================= DESCRIPTION ================= */

        .voice-area textarea {
          width: 100%;

          min-height: 145px;

          resize: vertical;

          border:
            1px solid #d1d5db;

          border-radius: 10px;

          padding: 14px;

          font-family: inherit;

          font-size: 14px;

          color: #1f2937;

          outline: none;

          transition: 0.2s ease;
        }

        .voice-area textarea:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.1);
        }

        .voice-area textarea::placeholder {
          color: #9ca3af;
        }

        .voice-controls {
          margin-top: 12px;

          display: flex;

          align-items: center;

          gap: 15px;

          flex-wrap: wrap;
        }

        .voice-button {
          border: none;

          border-radius: 9px;

          background: #2563eb;

          color: white;

          padding: 10px 16px;

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .voice-button:hover {
          background: #1d4ed8;
        }

        .voice-button:disabled {
          background: #9ca3af;

          cursor: not-allowed;
        }

        .voice-button.recording {
          background: #dc2626;
        }

        .recording-indicator {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #dc2626;

          font-size: 13px;

          font-weight: 600;
        }

        .pulse-dot {
          width: 9px;
          height: 9px;

          background: #dc2626;

          border-radius: 50%;

          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .voice-help {
          margin: 10px 0 0;

          color: #9ca3af;

          font-size: 12px;

          line-height: 1.5;
        }

        /* ================= MEDIA ================= */

        .media-note {
          margin-bottom: 14px;

          padding: 11px 13px;

          background: #f8fafc;

          border:
            1px solid #e5e7eb;

          border-radius: 9px;

          color: #6b7280;

          font-size: 12px;

          line-height: 1.5;
        }

        .media-note strong {
          color: #374151;
        }

        .upload-box {
          min-height: 190px;

          border:
            2px dashed #cbd5e1;

          border-radius: 12px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          cursor: pointer;

          transition: 0.2s ease;

          background: #fafcff;
        }

        .upload-box:hover {
          border-color: #2563eb;

          background: #f8fbff;
        }

        .upload-icon {
          width: 55px;
          height: 55px;

          border-radius: 50%;

          background: #eff6ff;

          color: #2563eb;

          display: flex;

          align-items: center;

          justify-content: center;

          margin-bottom: 12px;
        }

        .upload-box strong {
          font-size: 15px;

          color: #1f2937;
        }

        .upload-box span {
          margin-top: 5px;

          font-size: 13px;

          color: #9ca3af;
        }

        .image-preview-wrapper,
        .video-preview-wrapper {
          position: relative;

          width: 100%;

          height: 300px;

          overflow: hidden;

          border-radius: 12px;

          background: #f3f4f6;
        }

        .issue-preview,
        .video-preview {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .remove-image,
        .remove-video {
          position: absolute;

          top: 12px;
          right: 12px;

          width: 36px;
          height: 36px;

          border: none;

          border-radius: 50%;

          background:
            rgba(17, 24, 39, 0.75);

          color: white;

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;
        }

        .remove-image:hover,
        .remove-video:hover {
          background: #dc2626;
        }

        /* ================= LOCATION ================= */

        .location-box {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 17px;

          border-radius: 10px;

          background: #f9fafb;

          border:
            1px solid #e5e7eb;

          color: #6b7280;
        }

        .location-success {
          background: #f0fdf4;

          border-color: #bbf7d0;

          color: #16a34a;
        }

        .location-box strong {
          display: block;

          font-size: 14px;

          color: #374151;
        }

        .location-success strong {
          color: #15803d;
        }

        .location-box span {
          display: block;

          margin-top: 4px;

          font-size: 12px;

          color: #6b7280;
        }

        .location-loader {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ================= AI ================= */

        .ai-card {
          background:
            linear-gradient(
              135deg,
              #f5f3ff,
              #eff6ff
            );

          border:
            1px solid #ddd6fe;
        }

        .ai-content {
          display: flex;

          gap: 15px;

          align-items: flex-start;
        }

        .ai-icon {
          width: 44px;
          height: 44px;

          flex-shrink: 0;

          border-radius: 11px;

          background: #ffffff;

          color: #7c3aed;

          display: flex;

          align-items: center;

          justify-content: center;

          box-shadow:
            0 3px 10px
            rgba(124, 58, 237, 0.1);
        }

        .ai-content h3 {
          margin: 0;

          font-size: 15px;

          color: #312e81;
        }

        .ai-content p {
          margin: 6px 0 0;

          color: #5b21b6;

          font-size: 13px;

          line-height: 1.6;
        }

        .ai-points {
          margin-top: 12px;

          display: flex;

          flex-wrap: wrap;

          gap: 8px;
        }

        .ai-tag {
          background:
            rgba(255, 255, 255, 0.8);

          border:
            1px solid #ddd6fe;

          border-radius: 20px;

          padding: 6px 10px;

          color: #5b21b6;

          font-size: 11px;

          font-weight: 600;
        }

        /* ================= MESSAGES ================= */

        .form-message {
          display: flex;

          align-items: center;

          gap: 9px;

          padding: 13px 15px;

          border-radius: 9px;

          font-size: 14px;
        }

        .error-message {
          color: #b91c1c;

          background: #fef2f2;

          border:
            1px solid #fecaca;
        }

        .success-message {
          color: #15803d;

          background: #f0fdf4;

          border:
            1px solid #bbf7d0;
        }

        /* ================= SUBMIT ================= */

        .submit-challenge-button {
          width: 100%;

          border: none;

          border-radius: 11px;

          padding: 15px 20px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: white;

          font-size: 15px;

          font-weight: 700;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          cursor: pointer;

          transition: 0.2s ease;

          box-shadow:
            0 7px 18px
            rgba(37, 99, 235, 0.18);
        }

        .submit-challenge-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 10px 22px
            rgba(37, 99, 235, 0.23);
        }

        .submit-challenge-button:disabled {
          background: #93a3c9;

          cursor: not-allowed;

          transform: none;

          box-shadow: none;
        }

        .submit-loader {
          animation: spin 1s linear infinite;
        }

        /* ================= MOBILE ================= */

        @media (max-width: 700px) {
          .challenge-header {
            padding: 0 5%;
          }

          .challenge-container {
            width: 92%;

            padding-top: 35px;
          }

          .challenge-heading h1 {
            font-size: 30px;
          }

          .challenge-card {
            padding: 20px;
          }

          .image-preview-wrapper,
          .video-preview-wrapper {
            height: 230px;
          }
        }

      `}</style>

      <div className="challenge-page">

        {/* ================= HEADER ================= */}

        <header className="challenge-header">

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={19} />
            Back
          </button>

          <div className="challenge-brand">

            <div className="challenge-logo">
              R
            </div>

            <div>
              <h2>ResolveX</h2>

              <span>
                From Challenge to Real-World Impact
              </span>
            </div>

          </div>

        </header>

        {/* ================= MAIN ================= */}

        <main className="challenge-container">

          <div className="challenge-heading">

            <p className="challenge-label">
              CHALLENGE CREATION
            </p>

            <h1>
              Submit a Societal Challenge
            </h1>

            <p>
              Help identify a real-world problem that
              can be transformed into a meaningful
              solution through collaboration.
            </p>

          </div>

          {/* ================= WORKFLOW ================= */}

          <div className="workflow-info">

            <Sparkles size={18} />

            <span>
              <strong>What happens next?</strong>{" "}
              Your challenge will be analyzed by AI,
              reviewed by the government, and matched
              with suitable institutions.
            </span>

          </div>

          <form
            className="challenge-form"
            onSubmit={handleSubmit}
          >

            {/* ================= BASIC INFORMATION ================= */}

            <section className="challenge-card">

              <div className="card-heading">

                <div className="heading-icon">
                  <FileText size={20} />
                </div>

                <div>
                  <h2>
                    Challenge Information
                  </h2>

                  <p>
                    Give us a clear understanding of
                    the problem you want to highlight.
                  </p>
                </div>

              </div>

              <div className="field-group">

                <label className="field-label">
                  Challenge Title{" "}
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  className="text-input"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Water shortage in rural communities"
                  maxLength={150}
                />

              </div>

            </section>

            {/* ================= DESCRIPTION ================= */}

            <section className="challenge-card">

              <div className="card-heading">

                <div className="heading-icon">
                  <Mic size={20} />
                </div>

                <div>
                  <h2>
                    Describe the Challenge
                  </h2>

                  <p>
                    Explain the problem, its location,
                    affected people, and why it matters.
                  </p>
                </div>

              </div>

              <div className="voice-area">

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the societal problem here..."
                  rows={6}
                  maxLength={3000}
                />

                <div className="voice-controls">

                  <button
                    type="button"
                    className={`voice-button ${
                      isListening
                        ? "recording"
                        : ""
                    }`}
                    onClick={handleVoiceInput}
                    disabled={!speechSupported}
                  >

                    {isListening ? (
                      <>
                        <MicOff size={20} />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic size={20} />
                        Speak Description
                      </>
                    )}

                  </button>

                  {isListening && (
                    <div className="recording-indicator">
                      <span className="pulse-dot"></span>
                      Listening...
                    </div>
                  )}

                </div>

                <p className="voice-help">
                  You can type your description or use
                  the microphone to describe the challenge
                  naturally.
                </p>

              </div>

            </section>

            {/* ================= MEDIA ================= */}

            <section className="challenge-card">

              <div className="card-heading">

                <div className="heading-icon">
                  <Camera size={20} />
                </div>

                <div>
                  <h2>
                    Supporting Media
                  </h2>

                  <p>
                    Add visual evidence that helps explain
                    the real-world problem.
                  </p>
                </div>

              </div>

              <div className="media-note">
                <strong>Image required:</strong>{" "}
                Upload a clear image related to the
                challenge. You can also optionally add
                a video.
              </div>

              {/* IMAGE */}

              <div className="field-group">

                <label className="field-label">
                  Challenge Image{" "}
                  <span className="required">
                    *
                  </span>
                </label>

                {!imagePreview ? (

                  <label className="upload-box">

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      hidden
                    />

                    <div className="upload-icon">
                      <Camera size={28} />
                    </div>

                    <strong>
                      Upload an image
                    </strong>

                    <span>
                      JPG, JPEG, PNG or WEBP
                    </span>

                  </label>

                ) : (

                  <div className="image-preview-wrapper">

                    <img
                      src={imagePreview}
                      alt="Selected challenge"
                      className="issue-preview"
                    />

                    <button
                      type="button"
                      className="remove-image"
                      onClick={removeImage}
                    >
                      <X size={18} />
                    </button>

                  </div>

                )}

              </div>

              {/* OPTIONAL VIDEO */}

              <div className="field-group">

                <label className="field-label">
                  Optional Challenge Video
                </label>

                {!videoPreview ? (

                  <label className="upload-box">

                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoChange}
                      hidden
                    />

                    <div className="upload-icon">
                      <Video size={28} />
                    </div>

                    <strong>
                      Upload a video
                    </strong>

                    <span>
                      MP4, WEBM or MOV
                    </span>

                  </label>

                ) : (

                  <div className="video-preview-wrapper">

                    <video
                      src={videoPreview}
                      controls
                      className="video-preview"
                    />

                    <button
                      type="button"
                      className="remove-video"
                      onClick={removeVideo}
                    >
                      <X size={18} />
                    </button>

                  </div>

                )}

              </div>

            </section>

            {/* ================= LOCATION ================= */}

            <section className="challenge-card">

              <div className="card-heading">

                <div className="heading-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2>
                    Challenge Location
                  </h2>

                  <p>
                    The location helps ResolveX understand
                    where the problem exists.
                  </p>
                </div>

              </div>

              <div
                className={`location-box ${
                  location.latitude !== null
                    ? "location-success"
                    : ""
                }`}
              >

                {location.latitude !== null ? (
                  <CheckCircle size={20} />
                ) : (
                  <Loader2
                    size={20}
                    className="location-loader"
                  />
                )}

                <div>

                  <strong>
                    {locationStatus}
                  </strong>

                  {location.latitude !== null && (
                    <span>
                      {location.latitude.toFixed(6)},{" "}
                      {location.longitude.toFixed(6)}
                    </span>
                  )}

                </div>

              </div>

            </section>

            {/* ================= AI ================= */}

            <section className="challenge-card ai-card">

              <div className="ai-content">

                <div className="ai-icon">
                  <Sparkles size={22} />
                </div>

                <div>

                  <h3>
                    AI-Powered Challenge Analysis
                  </h3>

                  <p>
                    After submission, ResolveX automatically
                    analyzes the challenge to identify its
                    domain, priority, required expertise,
                    technologies, keywords, impact level
                    and innovation potential.
                  </p>

                  <div className="ai-points">

                    <span className="ai-tag">
                      Domain Classification
                    </span>

                    <span className="ai-tag">
                      Priority
                    </span>

                    <span className="ai-tag">
                      Required Expertise
                    </span>

                    <span className="ai-tag">
                      Technologies
                    </span>

                    <span className="ai-tag">
                      Impact Level
                    </span>

                    <span className="ai-tag">
                      Innovation Potential
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="form-message error-message">

                <X size={18} />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* ================= SUCCESS ================= */}

            {message && (
              <div className="form-message success-message">

                <CheckCircle size={18} />

                <span>
                  {message}
                </span>

              </div>
            )}

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              className="submit-challenge-button"
              disabled={isSubmitting}
            >

              {isSubmitting ? (
                <>
                  <Loader2
                    size={20}
                    className="submit-loader"
                  />

                  Submitting Challenge...
                </>
              ) : (
                <>
                  <Send size={19} />

                  Submit Challenge
                </>
              )}

            </button>

          </form>

        </main>

      </div>
    </>
  );
}

export default ReportIssue;