import Hero from "./components/Hero";
import Why from "./components/Why";
import UseCases from "./components/UseCases";
import IntegrationsLite from "./components/IntegrationsLite";
import CaseStudies from "./components/CaseStudies";
import HowWeWork from "./components/HowWeWork";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <main>
      <Hero imageUrl="/imagenes/macbook-grafico.png" />
      <Why embedUrl="https://www.youtube.com/embed/aircAruvnKk?si=wwItx5OLJZk3Rbp0" />
      <UseCases />
      <IntegrationsLite moreCount={500} />
      <CaseStudies />
      <HowWeWork />
      <CTA href="#contacto" />
      <Footer />

    </main>
  );
}
