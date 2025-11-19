"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StepHeaderWizardProps {
    step: number;
    totalSteps: number;
    title: string;
    guide: string;
    theme: 'red' | 'slate' | 'green' | 'gray' | 'dark-red';
}

const themeClasses = {
    red: "from-red-500 to-rose-700",
    slate: "from-slate-600 to-slate-800",
    green: "from-green-500 to-teal-700",
    gray: "from-gray-500 to-gray-700",
    "dark-red": "from-red-800 to-red-900",
};


export function StepHeaderWizard({ step, totalSteps, title, guide, theme }: StepHeaderWizardProps) {
    const progress = (step / totalSteps) * 100;
    const gradientClass = themeClasses[theme] || themeClasses.slate;

    return (
        <div className={cn("bg-gradient-to-r p-6 text-white", gradientClass)}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{title}</h2>
                <span className="text-sm font-medium">Paso {step} de {totalSteps}</span>
            </div>
            <p className="text-sm opacity-90 mb-4">{guide}</p>
            <Progress value={progress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
        </div>
    );
}

// Small hack to allow custom classes for indicator in Progress component
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      indicatorClassName?: string;
    }
}
