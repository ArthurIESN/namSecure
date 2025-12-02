import type { ReactElement } from "react";

export function PageLoader(): ReactElement {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-gray-600 text-sm">Loading...</p>
            </div>
        </div>
    );
}
