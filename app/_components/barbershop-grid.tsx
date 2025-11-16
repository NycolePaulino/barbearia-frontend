"use client";

import { useEffect, useState } from "react";
import BarbershopCard from "./barbershop-card";

interface Barbershop {
    id: string;
    name: string;
    address: string;
    description: string;
    imageUrl: string;
    phones: string[];
}

export default function BarbershopGrid() {
    const [barbershops, setBarbershops] = useState<Barbershop[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/barbershops/recommended");
                if (response.ok) {
                    setBarbershops(await response.json());
                }
            } catch (e) {
                console.error("Erro ao carregar barbearias", e);
            }
        };
        load();
    }, []);

    return (
        <>
            {barbershops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {barbershops.map(shop => (
                        <BarbershopCard key={shop.id} barbershop={shop} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-light dark:text-muted-dark">
                    Nenhuma barbearia encontrada.
                </p>
            )}
        </>
    );
}
