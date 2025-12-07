"use client";

import { Icon } from "@iconify/react";
import { Button } from "./ui/button";


interface Service {
    id: string;
    name: string;
    priceInCents: number;
}

interface BookingSummaryCardProps {
    selectedServices: Service[];
    totalPriceInReais: string;
    totalTimeInMinutes: number;
    onRemoveService: (serviceId: string) => void;
    onNextStep: () => void; 
}

const BookingSummaryCard = ({
    selectedServices,
    totalPriceInReais,
    totalTimeInMinutes,
    onRemoveService,
    onNextStep,
}: BookingSummaryCardProps) => {

    return (
        <div className="rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm p-6">
        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Seu Agendamento
        </h3>
        <div className="space-y-4 mb-6">
            {selectedServices.length > 0 ? (
            selectedServices.map((service) => (
                <div key={service.id} className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                            {service.name}
                        </p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {(service.priceInCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                    </div>
                    <button
                        onClick={() => onRemoveService(service.id)}
                        className="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400"
                    >
                        <Icon icon="material-symbols:close" className="text-lg" />
                    </button>
                </div>
            ))
            ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-center">
                Adicione serviços para começar
            </p>
            )}
        </div>
        {selectedServices.length > 0 && (
            <div className="border-t border-border-light dark:border-border-dark pt-4 space-y-2">
                <div className="flex justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <span>Tempo estimado:</span>
                    <span>{Math.floor(totalTimeInMinutes / 60)}h {totalTimeInMinutes % 60}min</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                    <span>Total:</span>
                    <span>{totalPriceInReais}</span>
                </div>
            </div>
        )}
        <Button
            onClick={onNextStep}
            disabled={selectedServices.length === 0}
            className="mt-6 flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary-darker transition-all"
        >
            <span>Escolher Horário</span>
            <Icon icon="material-symbols:arrow-forward" className="text-xl ml-2" />
        </Button>
        
        <div className="mt-4 flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
            <Icon icon="material-symbols:credit-card" className="text-base" />
            <p className="text-xs">Pagamento seguro via Stripe.</p>
        </div>
        </div>
    );
};

export default BookingSummaryCard;