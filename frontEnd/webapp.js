 
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [resultText, setResultText] = useState("Results will appear here after image processing.");
  const [resultImage, setResultImage] = useState(null); // Menyimpan URL gambar hasil inferensi

  // Handle file upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setResultText(data.resultText || "No result text received.");
      setResultImage(data.resultImage || null); // URL atau base64 string gambar hasil inferensi
    } catch (error) {
      console.error("Error uploading image:", error);
      setResultText("An error occurred. Please try again.");
      setResultImage(null);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            YourBrand
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse pe-5 me-5 justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold">Medical Image Analysis</h1>
          <p className="lead text-muted">
            Upload your medical image to get AI-driven insights instantly.
          </p>
        </div>
      </section>

      {/* Image Upload Section */}
      <section className="text-center py-5 bg-light">
        <div className="container">
          <h2 className="fw-semibold">Upload Your Image</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="file"
                className="form-control mt-3"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Result Section */}
      <section className="text-center py-5">
        <div className="container">
          <h2 className="fw-semibold">Inference Results</h2>
          <div className="mt-3 p-3 bg-light border rounded">
            <p>{resultText}</p>
            {/* Tampilkan gambar hasil inferensi jika ada */}
            {resultImage && (
              <div className="mt-4">
                <img
                  src={resultImage}
                  alt="Inference Result"
                  className="img-fluid border rounded"
                  style={{ maxWidth: "100%", maxHeight: "500px" }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
