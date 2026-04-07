export default function StepVerifyEmail({ email }) {
  return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#fd297b] to-[#ff655b] flex items-center justify-center">
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-heading text-white mb-2">Check your inbox</h2>
        <p className="text-[#b0b0b0] font-body">
          We've sent a confirmation link to
          <br />
          <span className="text-white font-medium">{email}</span>
        </p>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
        <p className="text-sm text-[#b0b0b0]">
          Click the link in the email to verify your account and get started.
        </p>
      </div>

      <div className="pt-4">
        <p className="text-sm text-[#6e6e6e]">
          Didn't receive the email? Check your spam folder or{' '}
          <button className="text-[#fd297b] hover:underline font-medium">
            click here to resend
          </button>
        </p>
      </div>
    </div>
  );
}
