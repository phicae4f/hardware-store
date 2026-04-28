export const ServicesSection = () => {
  const services = [
    "Производство земельных работ, благоустройство",
    "Строительство фундаментов любой сложности",
    "Производство бетонных и железобетонных работ",
    "Производство общестроительных работ",
    "Изготовление и монтаж металлоконструкций",
    "Возведение зданий и сооружений",
    "Строительство инженерных сетей и коммуникаций",
    "Демонтажные работы, снос зданий и сооружений",
  ];

  const partners = [
    "Управление кап. строительства г.о.Воскресенск МО",
    "Администрация г.о. Воскресенск МО",
    "ПАО Банк Возрождение",
    "МБУК «ДК» Воскресенск",
    "АО «Трест Гидромонтаж»",
    "Филиал «БМУ» АО «ОХК «ГРАЛЛИМ»",
    "ООО «СерПласт»",
    "ФГУП «Почта России»",
    "МБУ «СК «Фетр»",
    "ФГБУ «Канал имени Москвы»",
    "ФГУП ДК «Металлург» Воскресенск",
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services__wrapper">
          <div className="services__left">
            <h2 className="services__title">Виды работ</h2>
            <ul className="services__list">
              {services.map((service, index) => (
                <li className="services__item" key={index}>
                  <span className="services__item-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="services__item-text">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="services__right">
            <h2 className="services__title">Нам доверяют</h2>
            <div className="services__partners">
              {partners.map((partner, index) => (
                <div className="services__partner" key={index}>
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
