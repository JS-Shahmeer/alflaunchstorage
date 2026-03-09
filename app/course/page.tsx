import Header from "../components/Header";
import Footer from "../components/Footer";
import CoursePageHeroSection from "./components/CoursePageHeroSection";
import CourseCommunitySection from "./components/CourseCommunitySection";
import CourseStatsSection from "./components/CourseStatsSection";
import CourseCurriculumSection from "./components/CourseCurriculumSection";
import CTA from "../components/CTA";

export default function CoursePage() {
  return (
    <>
      <Header />
      <CoursePageHeroSection />
      <CourseStatsSection />
      <CourseCommunitySection />
      <CourseCurriculumSection />
      <CTA />
      <Footer />
    </>
  );
}
