"use client";

import { Button } from "./ui/button";
import { Icon } from "@iconify/react";

interface Service {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    barbershopId: string;
    imageUrl: string;
}

interface ServiceItemProps {
    service: Service;
    onAddService: () => void;
    onRemoveService: () => void;
    isSelected: boolean;
}

const ServiceItem = ({
    service,
    onAddService,
    onRemoveService,
    isSelected,
}: ServiceItemProps) => {
    const duration = "45 min";

    const price = (service.priceInCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const handleToggleService = () => {
        if (isSelected) {
            onRemoveService();
        } else {
            onAddService();
        }
    };

    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-lg bg-surface-light dark:bg-surface-dark p-4 shadow-sm border ${
                isSelected ? "border-primary" : "border-transparent"
            } hover:border-primary/50 transition-all duration-200`}
        >
            <div className="flex flex-col gap-1">
                <p className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
                    {service.name}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Aprox. {duration}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <p className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {price}
                </p>

                <Button
                    onClick={handleToggleService}
                    className={`flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold transition-colors ${
                        isSelected
                            ? "bg-primary text-white hover:bg-primary-darker"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                >
                    {isSelected ? (
                        <>
                            <Icon icon="material-symbols:check" className="text-lg mr-1" />
                            <span className="truncate">Adicionado</span>
                        </>
                    ) : (
                        <span className="truncate">Adicionar</span>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ServiceItem;
