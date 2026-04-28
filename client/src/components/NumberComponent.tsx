import { FaPhoneAlt } from "react-icons/fa";

export const NumberComponent = () => {
  return (
    <div className="number">
      <div className="number__icon">
        <FaPhoneAlt size={30} />
      </div>
      <a
        href="tel:+79776056356"
        className="number__phone"
        aria-label="Позвонить по номеру +7 977 605-63-56"
      >
        +7 977 605-63-56 (Никита)
      </a>
    </div>
  );
};
