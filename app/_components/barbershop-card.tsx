"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

interface Barbershop {
    id: string;
    name: string;
    address: string;
    description: string;
    imageUrl: string;
    phones: string[];
}

const BarbershopCard = ({ barbershop }: { barbershop: Barbershop }) => {
    return (
        <div className="flex flex-col bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <Link href={`/barbershops/${barbershop.id}`}>
                <div className="relative bg-center bg-no-repeat aspect-[4/3] bg-cover">
                    <Image
                        src={barbershop.imageUrl}
                        alt={barbershop.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">
                        {barbershop.name}
                    </h3>
                    <div className="flex items-center gap-1 text-primary">
                        <Icon
                            icon="material-symbols:star"
                            className="text-lg"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        />
                        <span className="text-sm font-bold">4.9</span>
                    </div>
                </div>

                <p className="text-sm text-muted-light dark:text-muted-dark mb-4">
                    {barbershop.address}
                </p>

                <Button
                    asChild
                    className="mt-auto w-full text-center rounded-lg bg-primary text-white h-10 text-sm font-bold hover:bg-primary-darker transition-opacity"
                >
                    <Link href={`/barbershops/${barbershop.id}`}>Agendar</Link>
                </Button>
            </div>
        </div>
    );
};

export default BarbershopCard;
