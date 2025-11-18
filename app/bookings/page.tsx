"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "../_components/ui/button";
import { Icon } from "@iconify/react";
import Header from "../_components/header";
import BookingItem from "../_components/booking-item";
import { useQuery } from "@tanstack/react-query";

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

export interface BookingResponse {
    id: string;
    date: string;
    cancelled: boolean;
    service: BarbershopService;
    barbershop: Barbershop;
}

const fetchMyBookings = async (token: string): Promise<BookingResponse[]> => {
    const response = await fetch("http://localhost:8080/api/bookings/my-bookings", {
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error("Falha ao buscar agendamentos.");
    }
    return response.json();
};

const BookingsPage = () => {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'confirmed' | 'finished'>('confirmed');
    
    useEffect(() => {
        if (!isAuthLoading && !token) {
            router.push("/");
        }
    }, [isAuthLoading, token, router]);

    const { data: bookings, isLoading: isBookingsLoading, isError } = useQuery<BookingResponse[]>({
        queryKey: ["my-bookings"],
        queryFn: () => fetchMyBookings(token!),
        enabled: !!token,
    });

    const now = new Date();
    const confirmedBookings =
        bookings?.filter(
            (b) => !b.cancelled && new Date(b.date) >= now
        ) ?? [];
    const finishedBookings =
        bookings?.filter(
            (b) => b.cancelled || new Date(b.date) < now
        ) ?? [];

    if (isAuthLoading || (token && isBookingsLoading)) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2Icon className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p className="text-muted-foreground text-center text-sm">
                    Erro ao carregar agendamentos. Tente novamente mais tarde.
                </p>
            </div>
        );
    }

    return (
        <main className="flex h-full grow flex-col pb-24">
            <Header />

            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <main className="w-full">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <p className="text-4xl font-black font-display leading-tight tracking-tight text-foreground">
                            Meus Agendamentos
                        </p>
                    </div>
                    <div className="flex mb-6">
                        <div className="flex h-12 w-full sm:w-auto items-center justify-center rounded-lg bg-surface-light dark:bg-surface-dark p-1.5 border border-border">
                            <Button
                                onClick={() => setActiveTab('confirmed')}
                                variant={activeTab === 'confirmed' ? 'default' : 'ghost'}
                                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-4 sm:px-6 text-sm font-semibold leading-normal
                                    ${activeTab !== 'confirmed' ? "text-text-primary-light dark:text-text-primary-dark" : "bg-primary text-white hover:bg-primary-darker"}`}
                            >
                                <span className="truncate">Confirmados</span>
                            </Button>
                            <Button
                                onClick={() => setActiveTab('finished')}
                                variant={activeTab === 'finished' ? 'default' : 'ghost'}
                                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-4 sm:px-6 text-sm font-semibold leading-normal
                                    ${activeTab !== 'finished' ? "text-text-primary-light dark:text-text-primary-dark" : "bg-primary text-white hover:bg-primary-darker"}`}
                            >
                                <span className="truncate">Finalizados</span>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">                   
                        {activeTab === 'confirmed' && (
                            <>
                                {confirmedBookings.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                        {confirmedBookings.map((booking) => (
                                            <BookingItem key={booking.id} booking={booking} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-subtle-light dark:text-subtle-dark text-center py-10">
                                        Você não tem agendamentos confirmados.
                                    </p>
                                )}
                            </>
                        )}
                        {activeTab === 'finished' && (
                            <>
                                {finishedBookings.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                        {finishedBookings.map((booking) => (
                                            <BookingItem key={booking.id} booking={booking} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-subtle-light dark:text-subtle-dark text-center py-10">
                                        Você não tem agendamentos finalizados.
                                    </p>
                                )}
                            </>
                        )}

                    </div>
                </main>
            </div>
            <div className="fixed bottom-0 left-0 w-full p-5 bg-background-light dark:bg-background-dark border-t border-border z-10">
                <div className="container mx-auto max-w-7xl flex justify-center">
                    <Button
                        asChild
                        className="flex min-w-[250px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary-darker"
                    >
                        <Link href="/">
                            <Icon icon="material-symbols:add" />
                            <span className="truncate">Agendar Novo Serviço</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default BookingsPage;