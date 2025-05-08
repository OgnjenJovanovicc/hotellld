import React from 'react';

const AboutSection = ({ images }) => (
  <section id="about" className="about-section">
    <div className="about-part reverse" data-aos="fade-left">
      <div className="image">
        <img src={images[0]} alt="Hotel slika 2" />
      </div>
      <div className="text">
        <h2>O nama</h2>
        <p>Dobrodošli u naš hotel, savršen spoj luksuza i komfora. Naš hotel nudi
      prelepe sobe, vrhunsku uslugu i nezaboravne trenutke. Bilo da dolazite na
      odmor, poslovni put ili porodično okupljanje, obezbedićemo vam prijatan
      boravak. Vaše zadovoljstvo nam je najvažnije!.Ovo je projekat koji kida koliko ce biti dobar
      , ovo pisem da vidim da li ce ce naslov pokolopiti sa visinom slike koja stoji
      u datoj sekciji.Moram jos da pisem jer nemam jos dovoljni teksta koji mi je potreban
      za porveru, klizim znas!!! Moj otac kaze ovsene pahulje </p>
      </div>
    </div>
    <div className="about-part" data-aos="fade-right">
      <div className="text">
        <h2>Naša misija</h2>
        <p>Ovaj bices je najmanje od dizanja tegova on je od udranja malem u traktorsku gumu, trcanja, 
       od milonoa sklokova ne noh vise hiljade i hiljade, klizim znas, tezak sam na knt, imam jake
       butne misice, moj otac kaze ovsene pahulje to jedu ptice, ja sam nabacio stomak jer sam znao
       sta me ovde ceka, ja sam ceo yivot u treningu, ispod ovog sala i vode se nalaze plocice, trenirao
       sam sve borilacke sportove. Zamisli 200 000 Kristijana da vuku kamen od 200 tona, pa popeli bi 
       boing 747 a ne kamen. Ja samo poceo da treniram da bijem ljde po ulic sto je bilo totalno pogresno
       ali mi je donelo neku titulu nepopedivog
</p>
      </div>
      <div className="image">
        <img src={images[1]} alt="Hotel slika 2" />
      </div>
    </div>
  </section>
);

export default AboutSection;
