import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
import ProductCategories from '@/components/home/ProductCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ClientLogos from '@/components/home/ClientLogos';
import CTASection from '@/components/home/CTASection';
import { getProducts, getClients } from '@/lib/data';

export default async function Home() {
  const products = await getProducts();
  const clients = await getClients();

  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProductCategories />
      <FeaturedProducts products={products} />
      <WhyChooseUs />
      <ClientLogos clients={clients} />
      <CTASection />
    </>
  );
}
