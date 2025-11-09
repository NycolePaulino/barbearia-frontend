"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useAuth } from "../../lib/auth";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import SidebarMenu from "./sidebar-menu"; 

const Header = () => {
    const { user, logout } = useAuth();
    const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

    return (
        <header className="flex items-center justify-between bg-white px-5 py-6">
        <Link href="/">
            <Image src="/logo.svg" alt="Aparatus" width={100} height={26.09} />
        </Link>
        
        <div className="flex items-center gap-2">
            {user ? (
            <div className="flex items-center gap-2">
                <span className="text-sm">Olá, {user.email.split('@')[0]}</span> 
                <Button variant="outline" size="icon" onClick={logout}>
                    <LogOutIcon />
                </Button>
            </div>
            ) : (
            <Button variant="outline" size="icon" asChild>
                <Link href={googleLoginUrl}>
                    <LogInIcon />
                </Link>
            </Button>
            )}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MenuIcon />
                    </Button>
                </SheetTrigger>

                <SheetContent className="w-[370px] p-0">
                    <SheetHeader className="px-5 pt-6">
                        <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
                    </SheetHeader>
                    <SidebarMenu />
                </SheetContent>
            </Sheet>
        </div>
        </header>
    );
};

export default Header;