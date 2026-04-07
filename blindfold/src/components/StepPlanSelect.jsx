import PlanCard from './PlanCard';

const freeFeatures = [
  'Up to 5 date ideas per month',
  'Basic date categories',
  'Email support',
  'Track completed dates'
];

const freeLimitations = [
  'Limited personalization',
  'No priority support',
  'No custom budgets'
];

const proFeatures = [
  'Unlimited date ideas',
  'All premium categories',
  'Personalized recommendations',
  'Priority support',
  'Custom budget limits',
  'Anniversary reminders'
];

export default function StepPlanSelect({ plan, setPlan, onBack, onConfirm, loading }) {
  console.log('StepPlanSelect - plan:', plan, 'loading:', loading);

  const handlePlanSelect = (selectedPlan) => {
    console.log('Plan selected:', selectedPlan);
    setPlan(selectedPlan);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-white mb-2">Choose your plan</h2>
        <p className="text-[#b0b0b0] font-body">Select the plan that works best for you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <PlanCard
          name="Free"
          price={null}
          features={freeFeatures}
          limitations={freeLimitations}
          selected={plan === 'free'}
          onClick={() => handlePlanSelect('free')}
          highlighted={false}
        />

        <PlanCard
          name="Pro"
          price="$9"
          features={proFeatures}
          limitations={null}
          selected={plan === 'pro'}
          onClick={() => handlePlanSelect('pro')}
          highlighted={true}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-full border-2 border-[#2a2a2a] text-white font-semibold hover:border-[#fd297b] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading || !plan}
          className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </>
          ) : (
            plan ? `Continue with ${plan === 'free' ? 'Free' : 'Pro'} Plan` : 'Select a Plan'
          )}
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-[#b0b0b0] font-body text-sm">
          Already have an account?{' '}
          <a href="/auth" className="text-white hover:text-[#fd297b] transition-colors cursor-pointer">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
