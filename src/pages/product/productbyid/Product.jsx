import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
export default function Product() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 transition-all duration-300 pt-20">
        <p className="text-3xl font-bold text-center text-primary py-10">Product by Id Page</p>
      </main>
      <Footer />
    </div>
  );
}
