import { useState } from "react";
import type { Project } from "../data/projectsData";

export const ProjectCard = ({
  project,
  isHovered,
  onHover,
  onLeave,
}: {
  project: Project;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1,
    );
  };

  return (
    <div
      className="projects__card"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="projects__card-image">
        <img src={project.images[currentImageIndex]} alt={project.title} />

        {isHovered && project.images.length > 1 && (
          <>
            <button className="projects__card-prev" onClick={prevImage}>
              ‹
            </button>
            <button className="projects__card-next" onClick={nextImage}>
              ›
            </button>
            <div className="projects__card-dots">
              {project.images.map((_, idx) => (
                <button
                  key={idx}
                  className={`projects__card-dot ${currentImageIndex === idx ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className="projects__card-count">
          {currentImageIndex + 1} / {project.images.length}
        </div>
      </div>

      <div className="projects__card-info">
        <h3 className="projects__card-title">{project.title}</h3>
        {project.address && (
          <p className="projects__card-address">{project.address}</p>
        )}
      </div>
    </div>
  );
};
