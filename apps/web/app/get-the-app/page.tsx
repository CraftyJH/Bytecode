import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppDownload } from "@/components/home/AppDownload";

export const metadata = { title: "Get the App — Bytecode" };

export default function GetTheAppPage() {
  return (
    <>
      <Navbar />
      <main>
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}
