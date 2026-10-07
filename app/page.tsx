import Hero          from "@/components/sections/Hero";
import Proof         from "@/components/sections/Proof";
import Story         from "@/components/sections/Story";
import Learn         from "@/components/sections/Learn";
import Community     from "@/components/sections/Community";
import Challenge     from "@/components/sections/Challenge";
import WhoShouldJoin from "@/components/sections/WhoShouldJoin";
import FAQ           from "@/components/sections/FAQ";
import FinalCTA      from "@/components/sections/FinalCTA";
import Footer        from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Proof />
      <Story />
      <Learn />
      <Community />
      <Challenge />
      <WhoShouldJoin />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
