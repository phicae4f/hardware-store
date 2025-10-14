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
            Предоставляем слуги строительства для Ваших задумок и&nbsp;воплощаем
            их&nbsp;в&nbsp;реальность с&nbsp;высокой точностью и&nbsp;качеством
            изготовления.
          </p>
          <div className="hero__links">
            <a className="hero__link hero__link--color" href="#contact-us">Заказать консультацию</a>
            <a className="hero__link" href="#about-us">Подробнее</a>
          </div>
        </div>
      </div>
    </section>
  );
};
