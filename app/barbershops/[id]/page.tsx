"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "../../../lib/auth";

import ServiceItem from "../../_components/service-item";
import BarbershopInfo from "../../_components/barbershop-info";
import BookingSummaryCard from "../../_components/booking-summary-card";
import BookingCalendarCard from "../../_components/booking-calendar-card";
import Header from "../../_components/header";

interface Service {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    barbershopId: string;
    imageUrl: string;
}

interface Barbershop {
    id: string;
    name: string;
    address: string;
    description: string;
    imageUrl: string;
    phones: string[];
    services: Service[];
}

const getBarbershopDetails = async (id: string): Promise<Barbershop | null> => {
    try {
        const response = await fetch(`http://localhost:8080/api/barbershops/${id}`);
        if (!response.ok) return null;
        return response.json();
    } catch {
        return null;
    }
};

const fetchAvailableTimeSlots = async (
    token: string,
    barbershopId: string,
    selectedDate: Date
) => {
    const dateParam = format(selectedDate, "yyyy-MM-dd");
    const response = await fetch(
        `http://localhost:8080/api/barbershops/${barbershopId}/available-times?date=${dateParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Falha ao buscar horários.");
    return response.json();
};

const BarbershopDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const barbershopId = params.id as string;
    const { user, token } = useAuth();

    const [step, setStep] = useState<"services" | "calendar">("services");
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [isBookingPending, setIsBookingPending] = useState(false);

    const { data: barbershop, isLoading: isLoadingBarbershop } = useQuery<Barbershop | null>({
        queryKey: ["barbershop", barbershopId],
        queryFn: () => getBarbershopDetails(barbershopId),
        enabled: !!barbershopId,
    });

    const services = barbershop?.services ?? [];

    const { data: availableTimeSlots, isLoading: isLoadingTimeSlots } = useQuery<string[]>({
        queryKey: ["available-time-slots", barbershopId, selectedDate],
        queryFn: () => fetchAvailableTimeSlots(token!, barbershopId, selectedDate!),
        enabled: !!selectedDate && !!token,
    });

    const handleAddService = (serviceToAdd: Service) => {
        setSelectedServices((prev) => [...prev, serviceToAdd]);
    };

    const handleRemoveService = (serviceId: string) => {
        setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    };

    const filteredServices = services.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPrice = selectedServices.reduce((acc, s) => acc + s.priceInCents, 0);
    const totalPriceInReais = (totalPrice / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const totalTimeInMinutes = selectedServices.length * 45;

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(undefined);
    };

    const isConfirmDisabled = !selectedTime || isBookingPending || isLoadingTimeSlots;

    const handleBookingSubmit = async () => {
        if (!user || !token || !selectedTime || !selectedDate || selectedServices.length === 0) {
            toast.error("Por favor, selecione data, hora e faça login.");
            return;
        }

        setIsBookingPending(true);
        const [hours, minutes] = selectedTime.split(":").map(Number);
        const date = new Date(selectedDate);
        date.setHours(hours, minutes);
        const serviceToBook = selectedServices[0];

        try {
            const bookingResponse = await fetch("http://localhost:8080/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    barbershopId: barbershopId,
                    serviceId: serviceToBook.id,
                    date: date.toISOString(),
                    status: "PENDING"
                })
            });

            if (!bookingResponse.ok) throw new Error("Erro ao criar reserva");
            const bookingData = await bookingResponse.json();
            const bookingId = bookingData.id;

            const paymentResponse = await fetch("http://localhost:8080/api/payments/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    serviceName: serviceToBook.name,
                    price: Number(serviceToBook.priceInCents) / 100 
                })
            });

            if (!paymentResponse.ok) throw new Error("Erro ao criar pagamento");
            const paymentData = await paymentResponse.json();

            if (paymentData.url) {
                window.location.href = paymentData.url;
            }

        } catch (error) {
        } finally {
            setIsBookingPending(false);
        }
    }

    if (isLoadingBarbershop) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2Icon className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!barbershop) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold">Barbearia não encontrada.</h1>
                <Link href="/" className="text-primary hover:underline">
                    Voltar para o início
                </Link>
            </div>
        );
    }

    return (
        <main className="layout-container flex h-full grow flex-col">
            <Header/>
            <div className="container mx-auto flex flex-1 flex-col px-6 py-8">
                <div className="flex items-center gap-2 mb-6">
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                    >
                        <Icon icon="material-symbols:arrow-back-ios-new" className="text-base" />
                        <span>Voltar para barbearias</span>
                    </Link>
                </div>

                <BarbershopInfo barbershop={barbershop} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <p className="text-text-primary-light dark:text-text-primary-dark text-3xl font-extrabold tracking-tight">
                                Escolha os serviços
                            </p>

                            <div className="flex-grow max-w-sm">
                                <label className="flex flex-col min-w-40 h-12 w-full">
                                    <div className="flex w-full items-center rounded-lg h-full border border-border bg-card-light dark:bg-card-dark overflow-hidden">
                                    <div className="flex items-center justify-center h-full px-4 border-r border-border text-muted-light dark:text-muted-dark bg-card-light dark:bg-card-dark">
                                        <Icon icon="material-symbols:search" className="text-lg" />
                                    </div>
                                    <input
                                        type="text"
                                        className="flex-1 h-full bg-transparent px-3 outline-none border-none focus:ring-0 text-base font-normal placeholder:text-muted-light dark:placeholder:text-muted-dark text-text-primary-light dark:text-text-primary-dark"
                                        placeholder="Pesquisar por um serviço..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <ServiceItem
                                        key={service.id}
                                        service={service}
                                        onAddService={() => handleAddService(service)}
                                        onRemoveService={() => handleRemoveService(service.id)}
                                        isSelected={selectedServices.some((s) => s.id === service.id)}
                                    />
                                ))
                            ) : (
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-center py-4">
                                    Nenhum serviço encontrado.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 sticky top-28">
                        {step === "services" ? (
                            <BookingSummaryCard
                                selectedServices={selectedServices}
                                totalPriceInReais={totalPriceInReais}
                                totalTimeInMinutes={totalTimeInMinutes}
                                onRemoveService={handleRemoveService}
                                onNextStep={() => setStep("calendar")}
                            />
                        ) : (
                            <BookingCalendarCard
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                availableTimeSlots={availableTimeSlots}
                                isLoadingTimeSlots={isLoadingTimeSlots}
                                selectedTime={selectedTime}
                                onTimeSelect={setSelectedTime}
                                totalPriceInReais={totalPriceInReais}
                                isConfirmDisabled={isConfirmDisabled}
                                isBookingPending={isBookingPending}
                                onConfirmBooking={handleBookingSubmit}
                                onBackStep={() => setStep("services")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BarbershopDetailsPage;
