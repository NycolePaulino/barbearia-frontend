"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useAuth } from "../../lib/auth";

const Header = () => {
    const { user, logout } = useAuth();
    const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-text-light/10 dark:border-text-dark/10 px-6 md:px-10 lg:px-14 py-4">
            <Link href="/" className="flex items-center">
                <div className="flex items-center justify-center">
                    <Image
                        src="/logo.svg"
                        alt="AparatuƧ"
                        width={92}
                        height={24}
                    />
                </div>
            </Link>

            <div className="hidden md:flex flex-1 justify-center gap-10">
                <Link className="text-sm font-bold text-primary" href="/">Início</Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors" href="/bookings">
                    Meus Agendamentos
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <button className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-card-light dark:bg-card-dark text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">
                    <Icon icon="material-symbols:notifications" />
                </button>

                {user ? (
                    <div className="relative group">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-10 cursor-pointer"
                            style={{ backgroundImage: `url("${user.picture}")` }}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-card-light dark:bg-card-dark rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible z-10">
                            <Link className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark" href="/profile">
                                Perfil
                            </Link>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark"
                                onClick={logout}
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                ) : (
                    <button className="bg-primary text-white h-10 text-sm font-bold hover:bg-primary-darker transition-opacity rounded-lg px-5">
                        <Link href={googleLoginUrl}>Login</Link>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;