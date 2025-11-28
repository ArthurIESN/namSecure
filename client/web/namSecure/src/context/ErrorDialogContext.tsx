import { createContext, useContext, useState, ReactNode } from "react"
import { ErrorDialog } from "@/components/ui/error-dialog"

interface ErrorDialogContextType {
  showError: (message: string, title?: string, statusCode?: number, onRetry?: () => void) => void
  hideError: () => void
}

const ErrorDialogContext = createContext<ErrorDialogContextType | undefined>(
  undefined
)

export function ErrorDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [title, setTitle] = useState("An error occurred")
  const [showRetryButton, setShowRetryButton] = useState(false)
  const [retryCallback, setRetryCallback] = useState<(() => void) | null>(null)

  const showError = (msg: string, customTitle?: string, statusCode?: number, onRetry?: () => void) => {
    setMessage(msg)
    if (customTitle) {
      setTitle(customTitle)
    } else {
      setTitle("An error occurred")
    }

    // Afficher le bouton "Réessayer" si c'est une erreur 500
    if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
      setShowRetryButton(true)
      if (onRetry) {
        setRetryCallback(() => onRetry)
      }
    } else {
      setShowRetryButton(false)
      setRetryCallback(null)
    }

    setOpen(true)
  }

  const hideError = () => {
    setOpen(false)
  }

  return (
    <ErrorDialogContext.Provider value={{ showError, hideError }}>
      {children}
      <ErrorDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        message={message}
        showRetryButton={showRetryButton}
        onRetry={retryCallback || undefined}
      />
    </ErrorDialogContext.Provider>
  )
}

export function useErrorDialog() {
  const context = useContext(ErrorDialogContext)
  if (context === undefined) {
    throw new Error(
      "useErrorDialog must be used within an ErrorDialogProvider"
    )
  }
  return context
}
