export interface ITwoFactorStepProps
{
    showError: (message: string) => void;
    nextStep: (next: TwoFactorStep) => void;
}

export type TwoFactorStep = 'init' | 'setup' | 'verify' | 'disable' | 'disabled';