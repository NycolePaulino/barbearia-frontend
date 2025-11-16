"use client";

import { Button } from "./ui/button";
import { Icon } from "@iconify/react";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { Loader2Icon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

interface BookingCalendarCardProps {
    selectedDate: Date | undefined;
    onDateSelect: (date: Date | undefined) => void;
    availableTimeSlots: string[] | undefined;
    isLoadingTimeSlots: boolean;
    selectedTime: string | undefined;
    onTimeSelect: (time: string) => void;
    totalPriceInReais: string;
    isConfirmDisabled: boolean;
    isBookingPending: boolean;
    onConfirmBooking: () => void;
    onBackStep: () => void;
}

const BookingCalendarCard = ({
    selectedDate,
    onDateSelect,
    availableTimeSlots,
    isLoadingTimeSlots,
    selectedTime,
    onTimeSelect,
    totalPriceInReais,
    isConfirmDisabled,
    isBookingPending,
    onConfirmBooking,
    onBackStep
}: BookingCalendarCardProps) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formattedDate = selectedDate
        ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
        : "";

    return (
        <div className="rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm p-6 relative">
            <Button
                variant="outline"
                size="icon"
                className="absolute top-4 left-4"
                onClick={onBackStep}
            >
                <Icon icon="material-symbols:arrow-back-ios-new" />
            </Button>

            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 text-center">
                Escolha a Data e Hora
            </h3>

            <div className="flex flex-col gap-4">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateSelect}
                    disabled={{ before: today }}
                    className="w-full p-0"
                    locale={ptBR}
                />
            </div>

            {selectedDate && (
                <>
                    <Separator className="my-6" />
                    <div className="flex gap-3 flex-wrap py-2">
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
                                onClick={() => onTimeSelect(time)}
                            >
                                {time}
                            </Button>
                        ))}
                        {!isLoadingTimeSlots && availableTimeSlots?.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Nenhum horário livre.
                            </p>
                        )}
                    </div>
                    <Separator className="my-6" />

                    <div className="border-border bg-card-light dark:bg-card-dark rounded-lg border border-solid p-3 space-y-2">
                        <div className="flex justify-between text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                            <span>Total:</span>
                            <span>{totalPriceInReais}</span>
                        </div>
                        <div className="flex justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            <span>Data:</span>
                            <span>{formattedDate}</span>
                        </div>
                        {selectedTime && (
                            <div className="flex justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                <span>Horário:</span>
                                <span>{selectedTime}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-6">
                        <Button
                            className="w-full rounded-lg h-12 text-base font-bold bg-primary text-white hover:bg-primary-darker"
                            disabled={isConfirmDisabled}
                            onClick={onConfirmBooking}
                        >
                            {isBookingPending ? (
                                <Loader2Icon className="animate-spin" />
                            ) : (
                                "Confirmar e Pagar"
                            )}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BookingCalendarCard;
