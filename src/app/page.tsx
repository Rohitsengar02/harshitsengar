import { Header, Skills, Projects, Services, Testimonials, Contact } from '@/components/home';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Header />
      <Skills />
      <Projects />
      <Services />
      <Testimonials />
      <Contact />
    </main>
  );
}