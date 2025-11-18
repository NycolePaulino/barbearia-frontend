"use client";

import { useState } from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BookingResponse } from "../bookings/page";
import { ptBR } from "date-fns/locale";
import { format, isPast } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Icon } from "@iconify/react";

interface BookingItemProps {
    booking: BookingResponse;
}

const BookingItem = ({ booking }: BookingItemProps) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const handleCancelBooking = async () => {
        if (!token) return;
        setIsCancelling(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/bookings/${booking.id}/cancel`,
                { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.ok) {
                toast.success("Reserva cancelada com sucesso!");
                queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            } else {
                const errorData = await response.text();
                toast.error(errorData || "Erro ao cancelar reserva.");
            }
        } catch (error) {
            toast.error("Erro ao conectar com o servidor.");
        } finally {
            setIsCancelling(false);
        }
    };

    if (!booking.service || !booking.barbershop) {
        return null;
    }

    const bookingDate = new Date(booking.date);
    const dateIsPast = isPast(bookingDate);
    const price = (booking.service.priceInCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return (
        <div className="flex flex-col bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark">
            <div className="relative w-full aspect-[4/3] bg-cover">
                <Image
                    src={booking.barbershop.imageUrl}
                    alt={booking.barbershop.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-5 flex flex-col flex-1 gap-3">
                <Badge
                    className={
                        booking.cancelled
                            ? "bg-danger text-white hover:bg-danger"
                            : dateIsPast
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/90 text-primary-foreground hover:bg-primary/90"
                    }
                >
                    {booking.cancelled ? "Cancelado" : dateIsPast ? "Finalizado" : "Confirmado"}
                </Badge>

                <h3 className="text-xl font-bold">{booking.service.name}</h3>

                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={booking.barbershop.imageUrl} />
                        <AvatarFallback>{booking.barbershop.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-light dark:text-muted-dark">{booking.barbershop.name}</p>
                </div>

                <div className="flex items-center gap-2 text-subtle-light dark:text-subtle-dark text-sm mt-1">
                    <Icon icon="material-symbols:calendar-month" className="text-base" />
                    <span>{format(bookingDate, "dd 'de' MMMM", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2 text-subtle-light dark:text-subtle-dark text-sm">
                    <Icon icon="material-symbols:schedule" className="text-base" />
                    <span>{format(bookingDate, "HH:mm")}</span>
                </div>
                <div className="flex items-center gap-2 text-subtle-light dark:text-subtle-dark text-sm">
                    <Icon icon="material-symbols:attach-money" className="text-base" />
                    <span>{price}</span>
                </div>

                {!dateIsPast && !booking.cancelled && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full mt-3 rounded-lg text-sm font-medium"
                            >
                                Cancelar Reserva
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancelar reserva</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja cancelar esta reserva?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Voltar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancelBooking}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? <Loader2Icon className="animate-spin" /> : "Confirmar"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    );
};

export default BookingItem;
