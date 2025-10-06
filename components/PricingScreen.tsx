import React, { useState } from 'react';

const CheckIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const CreditCardIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
    </svg>
);


interface PricingScreenProps {
    onBack: () => void;
    onUpgradeSuccess: () => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ onBack, onUpgradeSuccess }) => {
    const [showPayment, setShowPayment] = useState(false);

    const handleUpgrade = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Payment successful! Welcome to Manajer Pro. (This is a prototype, no actual payment was processed).");
        onUpgradeSuccess();
    };

    if (showPayment) {
        return (
            <div className="animate-fade-in-1">
                <button onClick={() => setShowPayment(false)} className="mb-4 text-sm font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-white flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    <span>Back to Plans</span>
                </button>
                <div className="max-w-md mx-auto bg-white dark:bg-stone-800 rounded-xl shadow-lg p-8">
                     <h2 className="text-2xl font-bold text-center text-amber-950 dark:text-white mb-2">Upgrade to Manajer Pro</h2>
                     <p className="text-center text-amber-600 dark:text-amber-400 mb-6">Enter your payment details below.</p>
                     <form onSubmit={handleUpgrade} className="space-y-4">
                        <div>
                            <label htmlFor="card-name" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Cardholder Name</label>
                            <input type="text" id="card-name" className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500" placeholder="e.g. Petani Cerdas" required />
                        </div>
                        <div>
                            <label htmlFor="card-number" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Card Number</label>
                            <div className="relative mt-1">
                                <input type="text" id="card-number" className="block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500 pl-10" placeholder="4242 4242 4242 4242" required />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CreditCardIcon className="h-5 w-5 text-amber-400 dark:text-stone-500" />
                                </div>
                            </div>
                             <p className="mt-1 text-xs text-amber-500 dark:text-stone-400">Hint: Use a test card number.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiry" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Expiry Date</label>
                                <input type="text" id="expiry" className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500" placeholder="MM / YY" required />
                            </div>
                             <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-amber-800 dark:text-amber-200">CVC</label>
                                <input type="text" id="cvc" className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500" placeholder="e.g. 123" required />
                            </div>
                        </div>
                         <button type="submit" className="w-full mt-4 px-4 py-3 text-md font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-md">
                            Pay & Upgrade
                        </button>
                     </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-1">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-amber-950 dark:text-white">Choose Your Plan</h1>
                <p className="text-amber-700 dark:text-amber-300 mt-2">Unlock the full potential of AquaCrop.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Tier 1 */}
                <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-8 border-2 border-amber-200 dark:border-stone-700">
                    <h2 className="text-2xl font-bold text-amber-950 dark:text-white">Tani Dasar</h2>
                    <p className="text-amber-600 dark:text-amber-400 mb-4">Basic Farmer</p>
                    <p className="text-4xl font-extrabold text-amber-950 dark:text-white mb-6">Free</p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Management of 1-2 fields</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Basic weather forecast data</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Manual irrigation logging</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Limited Sprout AI (3 questions/month)</span></li>
                    </ul>
                    <button className="w-full px-4 py-3 text-md font-semibold text-amber-800 bg-amber-100 rounded-full cursor-default dark:bg-stone-700 dark:text-amber-200">
                        Your Current Plan
                    </button>
                </div>

                {/* Tier 2 */}
                <div className="bg-white dark:bg-stone-800 rounded-xl shadow-2xl p-8 border-2 border-green-500">
                     <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Manajer Pro</h2>
                    <p className="text-amber-600 dark:text-amber-400 mb-4">Professional Manager</p>
                    <p className="text-4xl font-extrabold text-amber-950 dark:text-white mb-1">$10 <span className="text-lg font-normal text-amber-600 dark:text-amber-400">/ hectare / year</span></p>
                    <p className="text-sm text-amber-500 dark:text-stone-400 mb-6">Scales with your farm.</p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200"><strong>AI Irrigation Scheduler</strong></span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Up to 20 fields</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Satellite NDVI Analysis</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Analytics Dashboard</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200"><strong>Unlimited</strong> Sprout AI Access</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span className="text-amber-800 dark:text-amber-200">Smart Alerts & Notifications</span></li>
                    </ul>
                     <button onClick={() => setShowPayment(true)} className="w-full px-4 py-3 text-md font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-md">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
             <div className="text-center mt-6">
                <button onClick={onBack} className="text-sm font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-white">
                    Maybe later
                </button>
            </div>
        </div>
    );
};

export default PricingScreen;