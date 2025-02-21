import { Metadata } from "next";
import Hero from "./components/Hero";
import WhyCreateThis from "./components/WhyCreateThis";
import Footer from "./components/Footer";
import Features from "./components/Features";

export const metadata: Metadata = {
    title: "Athletix",
    description: "Your all-in-one workout companion",
};

export default function Home() {
    return (
        <div>
            <Hero />
            <Features />
            <WhyCreateThis />
            <Footer />
        </div>
    );
}
