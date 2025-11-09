import Image from "next/image";
import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import banner from "@/../public/banner.png"; 
import BarbershopItem from "./_components/barbershop-item";
import Footer from "./_components/footer";
import { PageContainer, PageSection, PageSectionScroller, PageSectionTitle } from "./_components/ui/page";

interface Barbershop {
    id: string;
    name: string;
    address: string;
    description: string;
    imageUrl: string;
    phones: string[];
}


const getRecommendedBarbershops = async (): Promise<Barbershop[]> => {
    try {
        const response = await fetch('http://localhost:8080/api/barbershops/recommended', {
        cache: 'no-store',
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error("Falha ao buscar barbearias recomendadas:", error);
        return [];
    }
};

const getPopularBarbershops = async (): Promise<Barbershop[]> => {
    try {
        const response = await fetch('http://localhost:8080/api/barbershops/popular', {
        cache: 'no-store',
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error("Falha ao buscar barbearias populares:", error);
        return [];
    }
};


const Home = async () => {
    const recommendedBarbershops = await getRecommendedBarbershops();
    const popularBarbershops = await getPopularBarbershops();

    return (
        <main>
        <Header />
        <PageContainer>
            <SearchInput />
            <Image
            src={banner}
            alt="Agende agora!"
            sizes="100vw"
            className="h-auto w-full"
            />

            <PageSection>
            <PageSectionTitle>Recomendados</PageSectionTitle>
            <PageSectionScroller>
                {recommendedBarbershops.map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))}
            </PageSectionScroller>
            </PageSection>

            <PageSection>
            <PageSectionTitle>Populares</PageSectionTitle>
            <PageSectionScroller>
                {popularBarbershops.map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                ))}
            </PageSectionScroller>
            </PageSection>
        </PageContainer>
        <Footer />
        </main>
    );
};

export default Home;