import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";

export const metadata = {
  title: "IGR AUTO SALES",
  description: "Modern MVP for Florida Independent Auto Dealership",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AIChat />
      </body>
    </html>
  );
}
