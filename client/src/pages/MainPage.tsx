import { AboutUsSection } from "../components/AboutUsSection"
import { CarouselSection } from "../components/CarouselSection"
import { ContactUsSection } from "../components/ContactUsSection"
import { HeroSection } from "../components/HeroSection"
import { ReviewsSection } from "../components/ReviewsSection"
import { constructionData, designData, repairData } from "../mocks/carouselData"

export const MainPage = () => {
    return (
        <>
        <HeroSection />
        <AboutUsSection />
        <CarouselSection data={repairData} sectionTitle="Ремонт квартир и домов" type="repair"/>
        <CarouselSection data={constructionData} sectionTitle="Строительство" type="building"/>
        <CarouselSection data={designData} sectionTitle="Дизайн интерьеров" type="design"/>
        <ContactUsSection />
        <ReviewsSection />
        </>
    )
}