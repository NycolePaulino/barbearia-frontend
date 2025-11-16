"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SearchInput = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/barbershops?search=${encodeURIComponent(search)}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex-grow">
            <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full items-center rounded-lg h-full border border-border bg-card-light dark:bg-card-dark overflow-hidden">
                    <div className="flex items-center justify-center h-full px-4 border-r border-border text-muted-light dark:text-muted-dark bg-card-light dark:bg-card-dark">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por serviços..."
                        className="flex-1 h-full bg-transparent px-3 outline-none border-none focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </label>
        </form>
    );
};

export default SearchInput;
