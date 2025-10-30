import { useState } from "react";
import type { CarouselItem } from "../mocks/carouselData";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GoDash } from "react-icons/go";

interface CarouselSectionProps {
  data: CarouselItem[];
  sectionTitle: string;
  type: string;
}

export const CarouselSection = ({
  data,
  sectionTitle,
  type
}: CarouselSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const currentItem = data[currentIndex];

  return (
    <section className="carousel" id={type}>
      <div className="container">
        <div className="carousel__wrapper">
          <h2 className="carousel__title">{sectionTitle}</h2>
          <div className="carousel__block">
            <div className="carousel__img-container">
              <img
              width={500}
              height={400}
                className="carousel__img"
                src={currentItem.image}
                alt={currentItem.description}
                loading="lazy"
              />
            </div>
            <div className="carousel__info">
              <h3 className="carousel__item-title">{currentItem.title}</h3>
              <h3 className="carousel__description">
                {currentItem.description}
              </h3>
              <ul className="carousel__list">
                {currentItem.features.map((feature, index) => (
                  <li className="carousel__item" key={index}>
                    <span className="carousel__item-icon"><GoDash size={15} /></span>{feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
            <div className="carousel__navigation">
              <button
                className="carousel__arrow carousel__arrow--prev"
                type="button"
                onClick={prevSlide}
                aria-label="Предыдущий слайд"
              >
                <FaArrowLeft size={40} />
              </button>
              <div className="carousel__indicators">
                {data.map((_, index) => (
                  <button
                    className={`carousel__indicator ${
                      index === currentIndex
                        ? "carousel__indicator--active"
                        : ""
                    }`}
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    type="button"
                    aria-label={`Перейти к отзыву ${index + 1}`}
                  />
                ))}
              </div>
              <button
                className="carousel__arrow carousel__arrow--next"
                type="button"
                onClick={nextSlide}
                aria-label="Следующий отзыв"
              >
                <FaArrowRight size={40} />
              </button>
            </div>
        </div>
      </div>
    </section>
  );
};
