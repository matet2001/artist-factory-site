"use client"
import {createContext} from "react";
import type {AuthMode} from "@/types/AuthTypes";

type AuthDialogContextType = {
    open: boolean;
    setOpen: (value: boolean) => void;
    openAuthDialog: (mode: AuthMode) => void;
    closeAuthDialog: () => void;
    mode: AuthMode
    setMode: (mode: AuthMode) => void;
};

export const AuthDialogContext = createContext<AuthDialogContextType | undefined>(undefined);
