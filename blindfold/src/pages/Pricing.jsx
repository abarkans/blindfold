import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for trying out blindfold',
      features: [
        '3 date ideas per month',
        'Basic date categories',
        'Email support',
        'Mobile app access',
        'Track completed dates'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Premium',
      price: '9.99',
      description: 'For couples who want unlimited adventures',
      features: [
        'Unlimited date ideas',
        'All premium categories',
        'Personalized recommendations',
        'Priority support',
        'Custom budget limits',
        'Date night scheduler',
        'Anniversary reminders',
        'Export date memories'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a] hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </button>
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="text-[#b0b0b0] hover:text-white transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="/pricing"
              className="text-white font-medium"
            >
              Pricing
            </a>
            <button
              onClick={() => navigate('/auth?mode=signin')}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-semibold text-white">blindfold</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-24 lg:pb-12">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading bg-gradient-to-r from-[#fd297b] to-[#ff655b] bg-clip-text text-transparent mb-4">
            Simple Pricing for Every Couple
          </h1>
          <p className="text-lg text-[#b0b0b0] font-body">
            Start free, upgrade when you're ready. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                rounded-3xl p-8 border
                ${plan.highlighted
                  ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#fd297b] relative'
                  : 'bg-[#1a1a1a] border-[#2a2a2a]'
                }
              `}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-heading text-white mb-2">{plan.name}</h3>
                <p className="text-[#b0b0b0] font-body text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-heading text-white">${plan.price}</span>
                  {plan.price !== '0' && (
                    <span className="text-[#6e6e6e] font-body">/month</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate('/auth?mode=signup')}
                className={`
                  w-full py-4 rounded-full font-semibold text-lg mb-8 transition-opacity
                  ${plan.highlighted
                    ? 'bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white hover:opacity-90'
                    : 'bg-[#2a2a2a] text-white border border-[#2a2a2a] hover:border-[#fd297b]'
                  }
                `}
              >
                {plan.cta}
              </button>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#fd297b] flex-shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-[#b0b0b0] font-body">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading text-white text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <FAQItem
              question="Can I switch plans later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
            />
            <FAQItem
              question="Is there a free trial for Premium?"
              answer="Yes, Premium comes with a 7-day free trial. No credit card required to start."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and Apple Pay."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Absolutely. You can cancel your subscription at any time with no questions asked."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer, delay = 0 }) {
  return (
    <div
      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-lg font-heading text-white mb-2">{question}</h3>
      <p className="text-[#b0b0b0] font-body">{answer}</p>
    </div>
  );
}
