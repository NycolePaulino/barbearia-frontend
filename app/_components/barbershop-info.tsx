"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";

interface Barbershop {
    id: string;
    name: string;
    address: string;
    description: string;
    imageUrl: string;
    phones: string[];
}

interface BarbershopInfoProps {
    barbershop: Barbershop;
}

const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
    return (
        <div className="mb-8 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
                <div className="flex flex-1 items-center gap-6">
                    <div className="relative w-24 h-24 aspect-square rounded-lg flex-shrink-0">
                        <Image
                            src={barbershop.imageUrl}
                            alt={barbershop.name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-2xl font-bold leading-tight text-text-primary-light dark:text-text-primary-dark">
                            {barbershop.name}
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="text-primary text-sm font-bold">4.8 ★</span>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal">
                                (312 avaliações)
                            </p>
                        </div>

                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal mt-1">
                            {barbershop.address}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarbershopInfo;
