import * as React from "react"
import { AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface ErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
  onRetry?: () => void
  showRetryButton?: boolean
}

export function ErrorDialog({
  open,
  onOpenChange,
  title = "An error occurred",
  message,
  onRetry,
  showRetryButton = false,
}: ErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          "border border-destructive/50 bg-white shadow-lg",
          "dark:bg-card dark:border-destructive/60"
        )}
      >
        <AlertDialogHeader className="gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-destructive">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-foreground text-sm leading-relaxed ml-14 -mt-2">
          {message}
        </AlertDialogDescription>

        <div className="flex gap-3 justify-end pt-2">
          <AlertDialogCancel className="border border-border hover:bg-muted">
            Close
          </AlertDialogCancel>
          {showRetryButton && onRetry && (
            <AlertDialogAction
              onClick={() => {
                onRetry()
                onOpenChange(false)
              }}
              className="!bg-[rgb(242,178,62)] !hover:bg-[rgb(242,178,62)]/90 !text-black font-medium"
            >
              Retry
            </AlertDialogAction>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
