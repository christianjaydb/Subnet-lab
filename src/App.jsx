import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Calculator from "./components/Calculator";
import PracticeQuiz from "./components/PracticeQuiz";
import Basics from "./components/Basics";
import CIDRTable from "./components/CIDRTable";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Calculator />
        <PracticeQuiz />
        <Basics />
        <CIDRTable />
      </main>
      <Footer />
    </>
  );
}
