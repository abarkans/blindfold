export default function StepNames({ names, setNames, onSubmit, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading text-white mb-2">
          Who are you doing this with?
        </h2>
        <p className="text-[#b0b0b0] font-body">
          Let's set up your duo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-8">
        <input
          type="text"
          value={names.yourName}
          onChange={(e) => setNames({ ...names, yourName: e.target.value })}
          placeholder="Your name"
          required
          className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder-[#6e6e6e] focus:outline-none focus:border-[#fd297b] transition-colors"
        />
        <input
          type="text"
          value={names.partnerName}
          onChange={(e) => setNames({ ...names, partnerName: e.target.value })}
          placeholder="Partner's name"
          required
          className="w-full px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder-[#6e6e6e] focus:outline-none focus:border-[#fd297b] transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !names.yourName.trim() || !names.partnerName.trim()}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
