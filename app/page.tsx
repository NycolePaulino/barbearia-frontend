"use client";

import { Icon } from "@iconify/react";
import { useAuth } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import BarbershopCard from "./_components/barbershop-card";
import { Button } from "./_components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./_components/dropdown-menu";
import { Loader2Icon } from "lucide-react";

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
        console.error("Falha ao buscar barbearias:", error);
        return [];
    }
};

const BarbershopGrid = () => {
    const { data: barbershops, isLoading } = useQuery<Barbershop[]>({
        queryKey: ["recommended-barbershops"],
        queryFn: getRecommendedBarbershops,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center mt-6">
                <Loader2Icon className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            {barbershops && barbershops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {barbershops.map((shop) => (
                        <BarbershopCard key={shop.id} barbershop={shop} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-light dark:text-muted-dark">Nenhuma barbearia encontrada.</p>
            )}
        </>
    );
};

const HomePage = () => {
    const { user } = useAuth();

    return (
        <>
            <Header />
            <main className="flex-1 px-4 md:px-6 lg:px-10 py-8">
                <div className="flex flex-wrap justify-between gap-3 mb-8">
                    <div className="flex min-w-72 flex-col gap-2">
                        <p className="text-4xl lg:text-5xl font-bold font-display tracking-tight">
                            {user ? `Olá, ${user.name.split(' ')[0]}!` : 'Encontre'}
                        </p>
                        <p className="text-base font-normal text-muted-light dark:text-muted-dark">
                            A barbearia perfeita para você.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-grow">
                        <SearchInput />
                    </div>
                    <div className="flex gap-3 items-center">
                        <Button variant="ghost" className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-light dark:bg-card-dark px-4 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                            <p className="text-sm font-medium">Melhor Avaliados</p>
                        </Button>
                        <Button variant="ghost" className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-light dark:bg-card-dark px-4 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                            <p className="text-sm font-medium">Mais Próximos</p>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-light dark:bg-card-dark px-4 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                                    <p className="text-sm font-medium">Serviços</p>
                                    <Icon icon="material-symbols:expand-more" className="!text-xl" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark">
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/barbershops?search=cabelo">Cabelo</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/barbershops?search=barba">Barba</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/barbershops?search=acabamento">Acabamento</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/barbershops?search=sobrancelha">Sobrancelha</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/barbershops?search=pézinho">Pézinho</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/barbershops?search=progressiva">Progressiva</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold font-display tracking-tight pb-6">
                    Recomendadas para Você
                </h2>
                <BarbershopGrid />
            </main>
        </>
    );
};

export default HomePage;
