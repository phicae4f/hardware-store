import { useState } from "react";
import { IoIosStarOutline, IoMdClose } from "react-icons/io";

interface LeaveReviewModalProps {
  applicationId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientName: string, rating: number, comment: string) => void;
  isLoading?: boolean;
  error?: string 
}

export const LeaveReviewModal = ({
  applicationId,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error
}: LeaveReviewModalProps) => {
  const [clientName, setClientName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const resetForm = () => {
    setClientName("");
    setRating(0);
    setComment("");
    setHoverRating(0);
  };

  const handleSubmit = () => {
    if(!clientName.trim() || rating === 0 || !comment.trim()) {
      return
    }
    onSubmit(clientName, rating, comment)
  }

  const handleClose = () => {
    resetForm()
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if(e.target === e.currentTarget) {
      onClose()
    }
  }

  if(!isOpen) {
    return null
  }

  return (
    <div className="review-modal" onClick={handleOverlayClick}>
      <div className="review-modal__wrapper">
        <div className="review-modal__header">
          <h2 className="review-modal__title">Оставить отзыв</h2>
          <button
            className="review-modal__close-btn"
            type="button"
            onClick={handleClose}
          >
            <IoMdClose size={34} />
          </button>
        </div>
        <div className="review-modal__content">
          <div className="review-modal__group">
            <span className="review-modal__group-name">{`Заявка #${applicationId}`}</span>
          </div>
          <div className="review-modal__group">
            <div className="review-modal__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  className={`review-modal__star ${star <= (hoverRating || rating) ? "review-modal__star--active": ""}`}
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <IoIosStarOutline size={32} />
                </button>
              ))}
            </div>
          </div>
          <div className="review-modal__group">
            <input
              className="review-modal__input"
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ваше имя..."
            />
          </div>
          <div className="review-modal__group">
            <textarea
              className="review-modal__textarea"
              id="comment"
              placeholder="Расскажите о своих впечатлениях..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <div className="review-modal__footer">
          <button className="review-modal__btn" type="button" onClick={handleClose} disabled={isLoading}>
            Отмена
          </button>
          <button className="review-modal__btn review-modal__btn--color" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Отправка...": "Отправить отзыв"}
          </button>
        </div>
        {error && (
          <span className="review-modal__error">{error}</span>
        )}
      </div>
    </div>
  );
};
