import Hero from "./components/Hero";
import Why from "./components/Why";
import UseCases from "./components/UseCases";
import IntegrationsLite from "./components/IntegrationsLite";
import CaseStudies from "./components/CaseStudies";
import HowWeWork from "./components/HowWeWork";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import FloatingCalendar from "./components/FloatingCalendar";

export default function Page() {
  return (
    <main>
      <Hero />
      <Why />
      <UseCases />
      <IntegrationsLite moreCount={500} />
      <CaseStudies />
      <HowWeWork />
      <CTA href="#contacto" />
      <FloatingCalendar />
      <Footer />

    </main>
  );
}
