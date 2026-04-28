import { AboutUsSection } from "../components/AboutUsSection";
import { CarouselSection } from "../components/CarouselSection";
import { ContactUsSection } from "../components/ContactUsSection";
import { EquipmentSection } from "../components/EquipmentSection";
import { HeroSection } from "../components/HeroSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { ServicesSection } from "../components/ServicesSection";
import {
  constructionData,
  designData,
  repairData,
} from "../mocks/carouselData";

export const MainPage = () => {
  return (
    <>
      <HeroSection />
      <AboutUsSection />
      <ServicesSection />
      <EquipmentSection />
      <ProjectsSection />
      <ContactUsSection />
      <ReviewsSection />
    </>
  );
};
