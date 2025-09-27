"use client";
import ForgotPasswordForm from "@/components/common/auth/form/ForgotPasswordForm";
import AuthHeader from "../AuthHeader";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("AUTH.PASSWORD_RESET");
  
  return (
    <div className="flex flex-col space-y-2">
      <AuthHeader
        title={t("TITLE")}
        description={t("DESC")}
      />
      <div className="my-2" />
      <ForgotPasswordForm />
    </div>
  );
}