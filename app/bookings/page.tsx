"use client";

import { useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import Header from "../_components/header";
import Footer from "../_components/footer";
import BookingItem from "../_components/booking-item";
import { PageContainer, PageSection, PageSectionTitle } from "../_components/ui/page";
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
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error("Falha ao buscar agendamentos.");
    }
    return response.json();
};

const BookingsPage = () => {
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token === null) {
            router.push("/");
        }
    }, [token, router]);

    const { data: bookings, isLoading, isError } = useQuery<BookingResponse[]>({
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

    if (!token || isLoading) {
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
        <main>
            <Header />
            <PageContainer>
                <h1 className="text-foreground text-xl font-bold">Agendamentos</h1>

                {confirmedBookings.length > 0 && (
                    <PageSection>
                        <PageSectionTitle>Confirmados</PageSectionTitle>
                        <div className="space-y-3">
                            {confirmedBookings.map((booking) => (
                                <BookingItem key={booking.id} booking={booking} />
                            ))}
                        </div>
                    </PageSection>
                )}

                {finishedBookings.length > 0 && (
                    <PageSection>
                        <PageSectionTitle>Finalizados</PageSectionTitle>
                        <div className="space-y-3">
                            {finishedBookings.map((booking) => (
                                <BookingItem key={booking.id} booking={booking} />
                            ))}
                        </div>
                    </PageSection>
                )}

                {bookings?.length === 0 && (
                    <p className="text-muted-foreground text-center text-sm">
                        Você ainda não tem agendamentos.
                    </p>
                )}
            </PageContainer>
            <Footer />
        </main>
    );
};

export default BookingsPage;