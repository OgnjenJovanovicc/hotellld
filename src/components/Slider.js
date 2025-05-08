import React from 'react';

const Slider = ({ backgroundImages, currentIndex, handleNext, handlePrev, goToSlide }) => (
  <div className="slider">
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${backgroundImages[currentIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        position: "relative",
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
