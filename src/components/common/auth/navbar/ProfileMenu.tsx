"use client";

import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileMenu() {
  const t = useTranslations("USER");

  const handleSignOut = () => {
    // TODO: Implement actual sign out logic
    console.log("Sign out clicked");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex rounded-full text-sm cursor-pointer outline-none">
        <span className="sr-only">Open user menu</span>
        <CgProfile size={25} className="text-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            {t("PROFILE")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            {t("SETTINGS")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          {t("LOGOUT")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
