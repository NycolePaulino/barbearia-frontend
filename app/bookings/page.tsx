"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import Header from "../_components/header";
import BookingItem from "../_components/booking-item";


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

const BookingsPage = () => {
    const { user, token } = useAuth();
    const router = useRouter();
    
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (token === null) {
            router.push("/");
            return;
        }

        // Função para buscar os dados
        const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/bookings/my-bookings", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                console.error("Falha ao buscar agendamentos");
            }
        } catch (error) {
            console.error("Erro no fetch:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchBookings();
    }, [token, router]); 

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2Icon className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="flex flex-col gap-6 p-5">
                <h1 className="text-xl font-bold">Meus Agendamentos</h1>
                
                {bookings.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {bookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                    ))}
                </div>
                ) : (
                <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
                )}
            </div>
        </>
    );
};

export default BookingsPage;