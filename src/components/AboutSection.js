import React from 'react';

const AboutSection = ({ images }) => (
  <section id="about" className="about-section">
    <div className="about-header" data-aos="fade-up">
      <span className="about-kicker">Hotel Tisina</span>
      <h2>Mesto gde odmor stvarno pocinje</h2>
      <p>
        Dizajnirali smo prostor koji kombinuje prirodu, privatnost i moderan komfor
        kako bi svaki trenutak boravka bio opusten i inspirativan.
      </p>
    </div>

    <div className="about-part reverse" data-aos="fade-left">
      <div className="image">
        <img src={images[0]} alt="Eksterijer hotela Tisina" />
      </div>
      <div className="text">
        <h2>O nama</h2>
        <p>
          Hotel Tisina je mirna oaza udaljena od gradske guzve, stvorena za goste koji
          zele kvalitetan odmor i tempo bez stresa. Enterijer je inspirisan prirodnim
          materijalima i toplim tonovima, dok svaki apartman pruza otvoren pogled i
          osecaj potpune privatnosti.
        </p>
        <ul className="about-highlights">
          <li>Prostrane sobe sa panoramskim pogledom</li>
          <li>Smiren ambijent i diskretna usluga</li>
          <li>Prirodni materijali i premium udobnost</li>
        </ul>
      </div>
    </div>

    <div className="about-part" data-aos="fade-right">
      <div className="text">
        <h2>Nasa misija</h2>
        <p>
          Verujemo da luksuz nije samo izgled prostora, vec i nacin na koji se gost
          oseca. Zato gradimo iskustvo koje spaja odmor, wellness i lokalnu gastronomiju
          kako biste se kuci vratili sa vise energije, fokusa i balansa.
        </p>
        <div className="about-stats" aria-label="Kljucevi kvaliteta hotela">
          <div className="about-stat">
            <strong>24/7</strong>
            <span>podrska gosta</span>
          </div>
          <div className="about-stat">
            <strong>100%</strong>
            <span>fokus na komfor</span>
          </div>
          <div className="about-stat">
            <strong>Top</strong>
            <span>wellness iskustvo</span>
          </div>
        </div>
      </div>
      <div className="image">
        <img src={images[1]} alt="Relax zona i pogled iz hotela" />
      </div>
    </div>
  </section>
);

export default AboutSection;
