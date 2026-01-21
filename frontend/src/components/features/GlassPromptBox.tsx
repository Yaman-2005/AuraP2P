import { Mic } from "lucide-react";

interface GlassPromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const GlassPromptBox = ({ value, onChange, onSubmit, disabled, placeholder = "Ask anything..." }: GlassPromptBoxProps) => {
  // local focus state no longer needed after removing ring glow

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && value.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={
          `glass rounded-2xl p-4 transition-all duration-300 border border-white/10 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-white/15`
        }
      >
        {/* Input Row */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            // suppress external focus ring via CSS override
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-white placeholder:text-white/40 text-base outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
          />
        </div>

        {/* Bottom Row: mic only, no divider */}
        <div className="flex items-center justify-end mt-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            aria-label="Voice input"
            disabled={disabled}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default GlassPromptBox;
