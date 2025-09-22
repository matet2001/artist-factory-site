"use client"
import * as React from "react";
import {useState, useEffect} from "react";
import {usePathname} from "next/navigation";
import {AuthDialogContext} from "./AuthDialogContext";
import type {AuthMode} from "@/types/AuthTypes.ts";


export function AuthDialogProvider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<AuthMode>("register");
    const pathname = usePathname();

    // Check if we're on an auth route and open modal accordingly
    useEffect(() => {
        if (pathname.includes('/login')) {
            setMode('login');
            setOpen(true);
        } else if (pathname.includes('/register')) {
            setMode('register');
            setOpen(true);
        }
    }, [pathname]);

    const openAuthDialog = (mode: AuthMode) => {
        setMode(mode);
        setOpen(true)
        console.log("Dialog setted open with ", mode)
    };
    const closeAuthDialog = () => setOpen(false);

    return (
        <AuthDialogContext.Provider value={{open, setOpen, openAuthDialog, closeAuthDialog, setMode, mode}}>
            {children}
        </AuthDialogContext.Provider>
    );
}


