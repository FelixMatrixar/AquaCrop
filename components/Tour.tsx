import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { TourStep } from '../types';

interface TourProps {
    isOpen: boolean;
    steps: TourStep[];
    stepIndex: number;
    onClose: () => void;
    onNext: () => void;
}

const Tour: React.FC<TourProps> = ({ isOpen, steps, stepIndex, onClose, onNext }) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [tooltipPlacement, setTooltipPlacement] = useState<'top' | 'bottom' | 'center'>('center');


    const currentStep = steps[stepIndex];

    useEffect(() => {
        if (!isOpen || !currentStep) return;

        currentStep.onBefore?.();

        const targetElement = document.querySelector(currentStep.target);
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const rect = entry.target.getBoundingClientRect();
                    setTargetRect(rect);
                    targetElement?.classList.add('tour-highlight');
                }
            },
            { threshold: 0.5 } 
        );

        if (targetElement) {
            observer.observe(targetElement);
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return () => {
            if (targetElement) {
                observer.unobserve(targetElement);
                targetElement.classList.remove('tour-highlight');
            }
            setTargetRect(null); // Reset rect on step change
        };
    }, [isOpen, currentStep]);

    useLayoutEffect(() => {
        if (!targetRect || !tooltipRef.current) return;

        const tooltipHeight = tooltipRef.current.offsetHeight;
        const tooltipWidth = tooltipRef.current.offsetWidth;
        const gap = 12; // Gap between target and tooltip

        const spaceBelow = window.innerHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;

        let top = 0;
        let placement: 'top' | 'bottom' | 'center' = 'center';

        if (spaceBelow > tooltipHeight + gap + 10) {
            // Position below
            top = targetRect.bottom + gap;
            placement = 'bottom';
        } else if (spaceAbove > tooltipHeight + gap + 10) {
            // Position above
            top = targetRect.top - tooltipHeight - gap;
            placement = 'top';
        } else {
            // Position in middle if no space
            top = window.innerHeight / 2 - tooltipHeight / 2;
            placement = 'center';
        }
        
        setTooltipPlacement(placement);

        let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

        // Keep tooltip within viewport horizontally
        const viewportPadding = 10;
        if (left < viewportPadding) left = viewportPadding;
        if (left + tooltipWidth > window.innerWidth - viewportPadding) {
            left = window.innerWidth - tooltipWidth - viewportPadding;
        }

        setTooltipPosition({ top, left });
        
        // Calculate arrow's horizontal position relative to the tooltip
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const arrowLeft = targetCenterX - left;
        
        // Clamp the arrow's position to keep it within the tooltip's bounds
        const arrowPadding = 16;
        const clampedArrowLeft = Math.max(arrowPadding, Math.min(arrowLeft, tooltipWidth - arrowPadding));

        tooltipRef.current.style.setProperty('--arrow-left', `${clampedArrowLeft}px`);

    }, [targetRect]);


    if (!isOpen || !currentStep) {
        return null;
    }

    const isLastStep = stepIndex === steps.length - 1;

    const handleNext = () => {
        const targetElement = document.querySelector(currentStep.target);
        targetElement?.classList.remove('tour-highlight');
        if (isLastStep) {
            onClose();
        } else {
            onNext();
        }
    };

    const handleClose = () => {
         const targetElement = document.querySelector(currentStep.target);
         targetElement?.classList.remove('tour-highlight');
         onClose();
    }

    return ReactDOM.createPortal(
        <div className="tour-overlay" onClick={handleClose}>
            <div
                ref={tooltipRef}
                onClick={e => e.stopPropagation()}
                className="tour-tooltip"
                style={{ 
                    top: `${tooltipPosition.top}px`, 
                    left: `${tooltipPosition.left}px`,
                    // Hide until positioned to prevent flicker
                    visibility: targetRect ? 'visible' : 'hidden' 
                }}
                data-placement={tooltipPlacement}
            >
                <p className="text-sm mb-4">{currentStep.content}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {stepIndex + 1} / {steps.length}
                    </span>
                    <div className="space-x-2">
                         <button onClick={handleClose} className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 rounded-full hover:bg-amber-200 dark:bg-stone-700 dark:text-amber-200 dark:hover:bg-stone-600">
                           Skip
                        </button>
                        <button onClick={handleNext} className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-full hover:bg-green-700">
                           {isLastStep ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Tour;