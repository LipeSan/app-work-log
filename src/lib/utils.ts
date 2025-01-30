import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showToast(type:string, message:string) {
  return toast(type, {
    description: message,
    action: {
      label: "Undo",
      onClick: () => {
        console.log("Undo")
      }
    },
  })
}
