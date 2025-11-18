import React from 'react';

const AboutSection = ({ images }) => (
  <section id="about" className="about-section">
    <div className="about-part reverse" data-aos="fade-left">
      <div className="image">
        <img src={images[0]} alt="Hotel slika 2" />
      </div>
      <div className="text">
        <h2>O nama</h2>
        <p>Hotel Tišina predstavlja utočište savremenog čoveka u žurbi, oaza mira 
          skrivena u naručju prirode. Smešten daleko od gradske buke, ovaj hotel 
          nudi gostima jedinstvenu priliku da se potpuno odvoje i prepuste blagodetima
          tišine. Prostrane sobe opremljene su u zemljanim tonovima i prirodnim 
          materijalima, stvarajući atmosferu topline i jednostavnosti, dok se sa svakog
          balkona pruža pogled na more i netaknutu prirodu. Ovde je 
          glavna prednost upravo odsustvo zvuka – samo zvuk talsa koji neprekidno zapljsuk
          uju obalu plaže. </p>
      </div>
    </div>
    <div className="about-part" data-aos="fade-right">
      <div className="text">
        <h2>Naša misija</h2>
        <p>Uživanje u Hotelu Tišina ne završava se na smeštaju, već se nastavlja kroz
          pažljivo osmišljene doživljaje koji neguju dušu i telo. Gosti se mogu 
          prepustiti meditaciji u specijalno dizajniranom vrtu, uživati u tretmanima sa
          lokalnim biljnim uljima u wellness centru, ili istraživati obližnje staze 
          uz pratnju vodiča za posmatranje ptica. Gastronomska ponada ističe se
          organskim proizvodima iz sopstvenog vrta i domaćim specijalitetima, 
          serviranim u restoranu sa panoramskim prozorima. Boravak u Hotelu Tišina je 
          više od odmora – to je transformativno iskustvo koje vraća ravnotežu i 
          energiju.
</p>
      </div>
      <div className="image">
        <img src={images[1]} alt="Hotel slika 2" />
      </div>
    </div>
  </section>
);

export default AboutSection;
