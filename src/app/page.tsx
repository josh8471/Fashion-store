import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ValuesStrip from "@/components/home/ValuesStrip";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Editorial from "@/components/home/Editorial";
import Testimonials from "@/components/home/Testimonials";
import NewsletterCTA from "@/components/home/NewsletterCTA";
import type { Collection, Product } from "@/types";

async function getHomeData() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [colRes, prodRes] = await Promise.all([
      fetch(`${base}/api/collections?limit=3`, { next: { revalidate: 60 } }),
      fetch(`${base}/api/products?featured=true&limit=4`, { next: { revalidate: 60 } }),
    ]);
    const collections: Collection[] = colRes.ok ? (await colRes.json()).data : [];
    const products: Product[] = prodRes.ok ? (await prodRes.json()).data : [];
    return { collections, products };
  } catch {
    return { collections: [], products: [] };
  }
}

export default async function HomePage() {
  const { collections, products } = await getHomeData();
  return (
    <>
      <Hero />
      <Marquee />
      <ValuesStrip />
      <FeaturedCollections collections={collections} />
      <FeaturedProducts products={products} />
      <Editorial />
      <Testimonials />
      <NewsletterCTA />
    </>
  );
}
