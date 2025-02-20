import { Metadata } from "next";
import Hero from "./components/Hero";
import WhyCreateThis from "./components/pages/WhyCreateThis";

export const metadata: Metadata = {
    title: "Athletix",
    description: "Your all-in-one workout companion",
};

export default function Home() {
    return (
        <section>
            <Hero />
            <WhyCreateThis />
        </section>
    );
}
