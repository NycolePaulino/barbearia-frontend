"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth";

import Footer from "../_components/footer";
import Header from "../_components/header";
import QuickSearchButtons from "../_components/quick-search-buttons";
import SearchInput from "../_components/search-input";
import { PageContainer } from "../_components/ui/page";
import { Loader2Icon } from "lucide-react";
import ServiceItem from "../_components/service-item";
import SearchResultItem from "../_components/barbershop-item";

interface BarbershopService {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    priceInCents: number;
    barbershopId: string;
}

interface Barbershop {
    id: string;
    name: string;
    address: string;
    description: string;
    imageUrl: string;
    phones: string[];
}

interface ServiceSearchResponse {
    service: BarbershopService;
    barbershop: Barbershop;
}

const searchServices = async (token: string, searchTerm: string): Promise<ServiceSearchResponse[]> => {
    const response = await fetch(`http://localhost:8080/api/barbershops/search?q=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error("Falha ao buscar serviços.");
    }
    return response.json();
};

const BarbershopsPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const { token } = useAuth();

    const { data: searchData, isLoading } = useQuery<ServiceSearchResponse[]>({
        queryKey: ["service-search", search],
        queryFn: () => searchServices(token!, search!),
        enabled: !!search && !!token
    });

    return (
        <main>
            <Header />
            <PageContainer>
                <SearchInput />
                <QuickSearchButtons />

                {isLoading && (
                    <div className="mt-6 flex justify-center">
                        <Loader2Icon className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {!isLoading && search && (
                    <div className="mt-6">
                        <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase">
                            Resultados para &quot;{search}&quot;
                        </h2>

                        {searchData && searchData.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {searchData.map((data) => (
                                    <SearchResultItem
                                        key={data.service.id}
                                        data={data}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center">
                                Nenhum serviço encontrado.
                            </p>
                        )}
                    </div>
                )}
            </PageContainer>
            <Footer />
        </main>
    );
};

export default BarbershopsPage;
