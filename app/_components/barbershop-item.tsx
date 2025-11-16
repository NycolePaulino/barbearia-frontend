"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";

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

interface ServiceSearchResponse {
    service: BarbershopService;
    barbershop: Barbershop;
}

interface SearchResultItemProps {
    data: ServiceSearchResponse;
}

const SearchResultItem = ({ data }: SearchResultItemProps) => {
    const { service, barbershop } = data;

    const priceInReais = (service.priceInCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    return (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3">
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
                    <div className="flex h-full w-full flex-col items-start gap-1 text-sm leading-[1.4]">
                        <p className="text-text-primary-light dark:text-text-primary-dark w-full font-bold">
                            {service.name}
                        </p>

                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={barbershop.imageUrl} />
                            </Avatar>
                            <p className="text-muted-light dark:text-muted-dark text-sm">
                                {barbershop.name}
                            </p>
                        </div>

                        <p className="text-muted-light dark:text-muted-dark w-full font-normal">
                            {service.description}
                        </p>
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <p className="text-primary text-sm leading-[1.4] font-bold whitespace-pre">
                            {priceInReais}
                        </p>

                        <Button className="rounded-full px-4 py-2" asChild>
                            <Link href={`/barbershops/${barbershop.id}`}>
                                Agendar
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultItem;
