import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function UserProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1 pt-20 transition-all duration-300">
        <p className="text-3xl font-bold text-center text-button py-10">User Profile Page</p>
      </main>
      <Footer />
    </div>
  );
}
