import React from 'react';

const Slider = ({ backgroundImages, currentIndex, handleNext, handlePrev, goToSlide }) => (
  <div className="slider">
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${backgroundImages[currentIndex]})`,
        backgroundSize: "cover",
        width: "88%",
        backgroundPosition: "center",
        height: "75vh",
        margin: "auto",
        position: "relative",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)",
        transition: "background-image 0.5s ease-in-out",
        marginTop: "14px",
      }}
    >
      <div className="slider-controls">
        <button className="arrow left-arrow" onClick={handlePrev}> &#10094; </button>
        <button className="arrow right-arrow" onClick={handleNext}> &#10095; </button>
      </div>

      <div className="dots">
        {backgroundImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  </div>
);

export default Slider;
