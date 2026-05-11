import React from 'react';
import { DemoStep } from '@/types/demo';
import { Check } from 'lucide-react';

interface DemoStepperProps {
  steps: DemoStep[];
}

export default function DemoStepper({ steps }: DemoStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step.isCompleted
                    ? 'bg-green-500 text-white'
                    : step.isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  step.isActive ? 'text-primary' : step.isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 mt-1 max-w-[120px]">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                  step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
