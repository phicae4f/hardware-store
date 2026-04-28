export const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__wrapper">
          <h1 className="hero__title">
            Создание Совершенства,{" "}
            <span className="hero__title hero__title--highlight">
              Воплощение мечты
            </span>
          </h1>
          <p className="hero__text">
            Ваш надёжный партнёр в&nbsp;строительстве. Проектируем, строим,
            сдаём&nbsp;&mdash; от&nbsp;нулевого цикла до&nbsp;чистовой отделки.
          </p>
          <div className="hero__links">
            <a className="hero__link hero__link--color" href="#contact-us">
              Заказать консультацию
            </a>
            <a className="hero__link" href="#about-us">
              Подробнее
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
