export default function ProgressBar({
  current,
  total,
  className = ''
}) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#fd297b] to-[#ff655b] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
