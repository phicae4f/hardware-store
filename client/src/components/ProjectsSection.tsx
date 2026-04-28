import { useState } from "react";
import { projectsData } from "../data/projectsData";
import { ProjectCard } from "./ProjectCard";

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Все");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const categories = ["Все", ...new Set(projectsData.map((p) => p.category))];

  const filteredProjects =
    activeCategory === "Все"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section className="projects" id="projects">
      <div className="container">
        <h2 className="projects__title">Наши работы</h2>

        <div className="projects__filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`projects__filter-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects__grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isHovered={hoveredProject === project.id}
              onHover={() => setHoveredProject(project.id)}
              onLeave={() => setHoveredProject(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
