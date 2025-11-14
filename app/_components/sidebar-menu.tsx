"use client";

import { useAuth } from "../../lib/auth";
import {
    CalendarDaysIcon,
    Eye, 
    Footprints, 
    HomeIcon,
    LogInIcon,
    LogOutIcon,
    Scissors, 
    Sparkles, 
    User, 
    Waves, 
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SheetClose } from "./ui/sheet";

const SidebarMenu = () => {
    const { user, logout } = useAuth(); 

    // definindo a URL de login do back end
    const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

    return (
        <div className="flex h-full flex-col gap-6 py-6">
            <div className="px-5">
                {user ? (
                    <div className="flex items-center gap-3">
                        <Avatar className="size-12">
                            <AvatarImage src={user.picture} alt={user.name} /> 
                            <AvatarFallback>
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                            <p className="text-base font-semibold">{user.name ?? user.email}</p>
                            <p className="text-muted-foreground text-xs">
                                {user.email}
                            </p>
                        </div>
                    </div>
                ) : (
                <div className="flex items-center justify-between">
                    <div className="flex h-12 items-center">
                        <p className="text-base font-semibold">Olá. Faça seu login!</p>
                    </div>
                    <Button
                        asChild 
                        className="gap-3 rounded-full px-6 py-3"
                        >
                        <Link href={googleLoginUrl}>
                            <span className="text-sm font-semibold">Login</span>
                            <LogInIcon className="size-4" />
                        </Link>
                    </Button>
                </div>
                )}
            </div>
        <div className="flex flex-col">
            <SheetClose asChild>
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                        >
                        <HomeIcon className="size-4" />
                        <span className="text-sm font-medium">Início</span>
                    </Button>
                </Link>
            </SheetClose>

            {user && (
            <SheetClose asChild>
                <Link href="/bookings">
                    <Button
                        variant="ghost"
                        className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                    >
                        <CalendarDaysIcon className="size-4" />
                        <span className="text-sm font-medium">Agendamentos</span>
                    </Button>
                </Link>
            </SheetClose>
            )}
        </div>

        <Separator />
        <div className="flex flex-col gap-1">
            <SheetClose asChild>
                <Link href="/barbershops?search=cabelo">
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                >
                    <Scissors className="size-4" />
                    <span className="text-sm font-medium">Cabelo</span>
                </Button>
                </Link>
            </SheetClose>

            <SheetClose asChild>
                <Link href="/barbershops?search=barba">
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                >
                    <User className="size-4" />
                    <span className="text-sm font-medium">Barba</span>
                </Button>
                </Link>
            </SheetClose>

            <SheetClose asChild>
                <Link href="/barbershops?search=acabamento">
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                >
                    <Sparkles className="size-4" />
                    <span className="text-sm font-medium">Acabamento</span>
                </Button>
                </Link>
            </SheetClose>

            <SheetClose asChild>
                <Link href="/barbershops?search=sobrancelha">
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                >
                    <Eye className="size-4" />
                    <span className="text-sm font-medium">Sobrancelha</span>
                </Button>
                </Link>
            </SheetClose>

            <SheetClose asChild>
                <Link href="/barbershops?search=pézinho">
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                >
                    <Footprints className="size-4" />
                    <span className="text-sm font-medium">Pézinho</span>
                </Button>
                </Link>
            </SheetClose>

            <SheetClose asChild>
                <Link href="/barbershops?search=progressiva">
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-full px-5 py-3"
                >
                    <Waves className="size-4" />
                    <span className="text-sm font-medium">Progressiva</span>
                </Button>
                </Link>
            </SheetClose>
        </div>

        <Separator />

        {user && (
            <SheetClose asChild>
                <Button
                    onClick={logout} 
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-full px-5 py-3"
                >
                    <LogOutIcon className="size-4" />
                    <span className="text-muted-foreground text-sm font-medium">
                        Sair da conta
                    </span>
                </Button>
            </SheetClose>
        )}
        </div>
    );
};

export default SidebarMenu;