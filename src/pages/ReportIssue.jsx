
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
} from "lucide-react";

function ReportIssue() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [description, setDescription] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [locationStatus, setLocationStatus] = useState(
    "Fetching your location..."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  // --------------------------------------------------
  // GET USER LOCATION
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
      recognition.stop();
    };
  }, []);

  // --------------------------------------------------
  // IMAGE SELECTION
  // --------------------------------------------------
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------
  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

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
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setError("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Voice start error:", error);
    }
  };

  // --------------------------------------------------
  // SUBMIT ISSUE
  // --------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    // Check image
    if (!image) {
      setError("Please upload an image of the issue.");
      return;
    }

    // Check description
    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    // Check location
    if (
      location.latitude === null ||
      location.longitude === null
    ) {
      setError(
        "Location is required. Please allow location access and try again."
      );
      return;
    }

    // Check authentication
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // -----------------------------------------------
      // TITLE
      // Backend requires title.
      // We generate a short title from the description.
      // -----------------------------------------------
      const title =
        description.trim().length > 60
          ? description.trim().substring(0, 60)
          : description.trim();

      formData.append("title", title);

      // -----------------------------------------------
      // DESCRIPTION
      // -----------------------------------------------
      formData.append(
        "description",
        description.trim()
      );

      // -----------------------------------------------
      // LOCATION
      // Backend expects:
      // JSON.parse(location)
      // -----------------------------------------------
      formData.append(
        "location",
        JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        })
      );

      // -----------------------------------------------
      // IMAGE
      // Backend expects req.files.image
      // -----------------------------------------------
      formData.append("image", image);

      console.log("Submitting issue...");
      console.log("Title:", title);
      console.log("Description:", description.trim());
      console.log("Location:", {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      console.log("Image:", image.name);

      // -----------------------------------------------
      // API REQUEST
      // -----------------------------------------------
      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // Read response safely
      const responseText = await response.text();

      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "Response JSON parse error:",
            parseError
          );

          throw new Error(
            `Server returned an invalid response. Status: ${response.status}`
          );
        }
      }

      // -----------------------------------------------
      // HANDLE BACKEND ERROR
      // -----------------------------------------------
      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to submit issue. Status: ${response.status}`
        );
      }

      // -----------------------------------------------
      // SUCCESS
      // -----------------------------------------------
      console.log("Issue created:", data);

      setMessage(
        "Your issue has been reported successfully."
      );

      // Clear form
      setImage(null);
      setImagePreview("");
      setDescription("");

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(
        "Submit issue error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while submitting the issue."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .report-page {
          min-height: 100vh;
          background: #f5f7fa;
          color: #1f2937;
          font-family: Arial, Helvetica, sans-serif;
        }

        .report-header {
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7%;
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

        .report-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .report-logo {
          width: 40px;
          height: 40px;
          border-radius: 9px;
          background: #1d4ed8;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
        }

        .report-brand h2 {
          margin: 0;
          font-size: 19px;
          color: #111827;
        }

        .report-brand span {
          display: block;
          margin-top: 2px;
          color: #6b7280;
          font-size: 11px;
        }

        .report-container {
          width: min(850px, 92%);
          margin: 0 auto;
          padding: 55px 0 70px;
        }

        .report-heading {
          margin-bottom: 35px;
        }

        .report-label {
          margin: 0 0 8px;
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .report-heading h1 {
          margin: 0;
          font-size: 36px;
          color: #111827;
        }

        .report-heading > p:last-child {
          margin-top: 10px;
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
        }

        .report-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .report-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 26px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
        }

        .card-heading {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-bottom: 22px;
        }

        .heading-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 9px;
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

        .upload-box {
          min-height: 190px;
          border: 2px dashed #cbd5e1;
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

        .image-preview-wrapper {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
          border-radius: 12px;
          background: #f3f4f6;
        }

        .issue-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: rgba(17, 24, 39, 0.75);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .remove-image:hover {
          background: #dc2626;
        }

        .location-box {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 17px;
          border-radius: 10px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
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

        .voice-area textarea {
          width: 100%;
          min-height: 130px;
          resize: vertical;
          border: 1px solid #d1d5db;
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
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .voice-area textarea::placeholder {
          color: #9ca3af;
        }

        .voice-controls {
          margin-top: 14px;
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
          padding: 11px 17px;
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 14px;
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
          margin: 12px 0 0;
          color: #9ca3af;
          font-size: 12px;
          line-height: 1.5;
        }

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
          border: 1px solid #fecaca;
        }

        .success-message {
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .submit-report-button {
          width: 100%;
          border: none;
          border-radius: 10px;
          padding: 14px 20px;
          background: #1d4ed8;
          color: white;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .submit-report-button:hover {
          background: #1e40af;
        }

        .submit-report-button:disabled {
          background: #93a3c9;
          cursor: not-allowed;
        }

        .submit-loader {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 700px) {
          .report-header {
            padding: 0 5%;
          }

          .report-container {
            width: 92%;
            padding-top: 35px;
          }

          .report-heading h1 {
            font-size: 30px;
          }

          .report-card {
            padding: 20px;
          }

          .image-preview-wrapper {
            height: 230px;
          }
        }
      `}</style>

      <div className="report-page">

        {/* HEADER */}
        <header className="report-header">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={19} />
            Back
          </button>

          <div className="report-brand">
            <div className="report-logo">R</div>

            <div>
              <h2>ResolveX</h2>
              <span>Report • Track • Resolve</span>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="report-container">

          <div className="report-heading">
            <p className="report-label">
              CITIZEN REPORT
            </p>

            <h1>Report an Issue</h1>

            <p>
              Help us identify and resolve civic problems
              in your area.
            </p>
          </div>

          <form
            className="report-form"
            onSubmit={handleSubmit}
          >

            {/* IMAGE */}
            <section className="report-card">

              <div className="card-heading">
                <div className="heading-icon">
                  <Camera size={20} />
                </div>

                <div>
                  <h2>Upload Issue Image</h2>
                  <p>
                    Add a clear photo of the civic issue.
                  </p>
                </div>
              </div>

              {!imagePreview ? (
                <label className="upload-box">

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
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
                    Click here to select a photo
                  </span>

                </label>
              ) : (
                <div className="image-preview-wrapper">

                  <img
                    src={imagePreview}
                    alt="Selected issue"
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

            </section>

            {/* LOCATION */}
            <section className="report-card">

              <div className="card-heading">
                <div className="heading-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2>Issue Location</h2>
                  <p>
                    Your current location will be
                    attached to the report.
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

            {/* DESCRIPTION */}
            <section className="report-card">

              <div className="card-heading">
                <div className="heading-icon">
                  <Mic size={20} />
                </div>

                <div>
                  <h2>Describe the Issue</h2>
                  <p>
                    Tell us what is wrong using your voice.
                  </p>
                </div>
              </div>

              <div className="voice-area">

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the civic issue here..."
                  rows={5}
                />

                <div className="voice-controls">

                  <button
                    type="button"
                    className={`voice-button ${
                      isListening ? "recording" : ""
                    }`}
                    onClick={handleVoiceInput}
                    disabled={!speechSupported}
                  >

                    {isListening ? (
                      <>
                        <MicOff size={21} />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic size={21} />
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
                  Tap the microphone and describe the
                  issue naturally. Your speech will be
                  converted into text automatically.
                </p>

              </div>

            </section>

            {/* ERROR */}
            {error && (
              <div className="form-message error-message">
                <X size={18} />
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="form-message success-message">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="submit-report-button"
              disabled={isSubmitting}
            >

              {isSubmitting ? (
                <>
                  <Loader2
                    size={20}
                    className="submit-loader"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={19} />
                  Submit Issue
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

