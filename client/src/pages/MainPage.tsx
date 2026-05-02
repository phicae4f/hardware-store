import { AboutUsSection } from "../components/AboutUsSection";
import { ContactUsSection } from "../components/ContactUsSection";
import { EquipmentSection } from "../components/EquipmentSection";
import { HeroSection } from "../components/HeroSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { ServicesSection } from "../components/ServicesSection";


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
