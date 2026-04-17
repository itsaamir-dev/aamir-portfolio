import Hero       from "@/components/sections/Hero";
import About      from "@/components/sections/About";
import Skills     from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects   from "@/components/sections/Projects";
import Freelance  from "@/components/sections/Freelance";
import Contact    from "@/components/sections/Contact";
import Footer     from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Freelance />
      <Contact />
      <Footer />
    </main>
  );
}
