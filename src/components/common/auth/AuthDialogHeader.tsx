import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AuthDialogHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <DialogHeader className="my-1 text-left">
      <DialogTitle className="text-xl leading-none">{title}</DialogTitle>
      <DialogDescription className="font-semibold">
        {description}
      </DialogDescription>
    </DialogHeader>
  );
}
