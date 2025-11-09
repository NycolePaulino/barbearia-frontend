"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns"; 
import { Loader2Icon } from "lucide-react"; 


interface BarbershopService {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    priceInCents: number;
    barbershopId: string;
}

interface ServiceItemProps {
    service: BarbershopService;
    barbershopName: string;
}


const fetchAvailableTimeSlots = async (
    token: string,
    barbershopId: string,
    selectedDate: Date
) => {
    const dateParam = format(selectedDate, "yyyy-MM-dd");

    const response = await fetch(
        `http://localhost:8080/api/barbershops/${barbershopId}/available-times?date=${dateParam}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Falha ao buscar horários livres.");
    }
    return response.json();
};

export function ServiceItem({ service, barbershopName }: ServiceItemProps) {
    const { user, token } = useAuth();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [sheetIsOpen, setSheetIsOpen] = useState(false);
    const [isBookingPending, setIsBookingPending] = useState(false);

    const { data: availableTimeSlots, isLoading: isLoadingTimeSlots } =
        useQuery<string[]>({
        queryKey: ["available-time-slots", service.barbershopId, selectedDate],
        queryFn: () =>
            fetchAvailableTimeSlots(token!, service.barbershopId, selectedDate!),
        enabled: !!selectedDate && !!token,
        });

    const priceInReais = (service.priceInCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const priceInReaisInteger = Math.floor(service.priceInCents / 100);
    const formattedDate = selectedDate
        ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
        : "";

    const isConfirmDisabled =
        !selectedDate || !selectedTime || isBookingPending || isLoadingTimeSlots;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(undefined);
    };

    const handleConfirm = async () => {
        if (!user || !token) {
            toast.error("Você precisa estar logado para fazer um agendamento.");
            return;
        }
        if (!selectedTime || !selectedDate) return;

        setIsBookingPending(true);

        const [hours, minutes] = selectedTime.split(":").map(Number);
        const date = new Date(selectedDate);
        date.setHours(hours, minutes);

        try {
            const response = await fetch("http://localhost:8080/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId: service.id,
                    date: date.toISOString(),
                }),
            });

            if (response.status === 201) {
                toast.success("Agendamento criado com sucesso!");
                setSelectedDate(undefined);
                setSelectedTime(undefined);
                setSheetIsOpen(false);
            } else if (response.status === 409) {
                const errorBody = await response.text();
                toast.error(errorBody || "Este horário já está reservado.");
            } else if (response.status === 401) {
                toast.error("Sua sessão expirou. Faça login novamente.");
            } else {
                toast.error("Falha ao criar o agendamento.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            toast.error("Erro ao conectar com o servidor.");
        } finally {
            setIsBookingPending(false);
        }
    };

    return (
        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
            <div className="border-border bg-card flex items-center justify-center gap-3 rounded-2xl border border-solid p-3">
                <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
                <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover"
                />
                </div>
                <div className="flex grow basis-0 flex-row items-center self-stretch">
                <div className="relative flex h-full min-h-0 min-w-0 grow basis-0 flex-col items-start justify-between">
                    <div className="flex h-[67.5px] w-full flex-col items-start gap-1 text-sm leading-[1.4]">
                        <p className="text-card-foreground w-full font-bold">
                            {service.name}
                        </p>
                        <p className="text-muted-foreground w-full font-normal">
                            {service.description}
                        </p>
                    </div>
                    <div className="flex w-full items-center justify-between">
                        <p className="text-card-foreground text-sm leading-[1.4] font-bold whitespace-pre">
                            {priceInReais}
                        </p>
                        <SheetTrigger asChild>
                            <Button className="rounded-full px-4 py-2">Reservar</Button>
                        </SheetTrigger>
                    </div>
                </div>
                </div>
            </div>

            <SheetContent className="w-[370px] overflow-y-auto p-0">
                <div className="flex h-full flex-col gap-6">
                    <SheetHeader className="px-5 pt-6">
                        <SheetTitle className="text-lg font-bold">Fazer Reserva</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-4 px-5">
                        <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={{ before: today }}
                        className="w-full p-0"
                        locale={ptBR}
                        />
                    </div>
                    {selectedDate && (
                        <>
                        <Separator />
                        <div className="flex gap-3 flex-wrap px-5 py-2">
                            {isLoadingTimeSlots && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2Icon className="h-5 w-5 animate-spin" />
                                Carregando horários...
                            </div>
                            )}

                            {availableTimeSlots?.map((time) => (
                            <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                className="shrink-0 rounded-full px-4 py-2"
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </Button>
                            ))}

                            {!isLoadingTimeSlots &&
                            availableTimeSlots?.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                Nenhum horário livre para este dia.
                                </p>
                            )}
                        </div>

                        <Separator />
                        <div className="flex flex-col gap-3 px-5">
                            <div className="border-border bg-card flex w-full flex-col gap-3 rounded-[10px] border border-solid p-3">
                            <div className="flex items-center justify-between">
                                <p className="text-card-foreground text-base font-bold">
                                {service.name}
                                </p>
                                <p className="text-card-foreground text-sm font-bold">
                                R${priceInReaisInteger},00
                                </p>
                            </div>

                            <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <p>Data</p>
                                <p>{formattedDate}</p>
                            </div>

                            {selectedTime && (
                                <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <p>Horário</p>
                                <p>{selectedTime}</p>
                                </div>
                            )}

                            <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <p>Barbearia</p>
                                <p>{barbershopName}</p>
                            </div>
                            </div>
                        </div>
                        <div className="px-5 pb-6">
                            <Button
                                className="w-full rounded-full"
                                disabled={isConfirmDisabled}
                                onClick={handleConfirm}
                            >
                                {isBookingPending ? (
                                    <Loader2Icon className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Confirmar"
                                )}
                            </Button>
                        </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}