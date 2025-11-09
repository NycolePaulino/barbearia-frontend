"use client";

import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { BookingResponse } from "../bookings/page";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";


interface BookingItemProps {
    booking: BookingResponse;
}

const BookingItem = ({ booking }: BookingItemProps) => {
    if (!booking.service || !booking.barbershop) {
        return null;
    }

    const bookingDate = new Date(booking.date);

    const month = format(bookingDate, "MMMM", { locale: ptBR });
    const day = format(bookingDate, "dd");
    const time = format(bookingDate, "HH:mm");

    return (
        <Card className="flex h-full w-full min-w-full flex-row items-center justify-between p-0">
            {/* ESQUERDA */}
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Badge>{booking.cancelled ? "Cancelado" : "Confirmado"}</Badge>

                <div className="flex flex-col gap-2">
                    <p className="font-bold">{booking.service.name}</p>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={booking.barbershop.imageUrl} />
                        </Avatar>
                        <p className="text-muted-foreground text-sm">{booking.barbershop.name}</p>
                    </div>
                </div>
            </div>

            {/* DIREITA */}
            <div className="flex h-full flex-col items-center justify-center border-l p-4 py-3">
                <p className="text-xs capitalize">{month}</p>
                <p className="text-2xl font-bold">{day}</p>
                <p className="text-xs capitalize">{time}</p>
            </div>
        </Card>
    );
};

export default BookingItem;