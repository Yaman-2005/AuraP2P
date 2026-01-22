import { useRef, useState } from "react";
import { Mic, Paperclip, X } from "lucide-react";

interface GlassPromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const GlassPromptBox = ({ value, onChange, onSubmit, disabled, placeholder = "Ask anything..." }: GlassPromptBoxProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && (value.trim() || attachedFiles.length > 0)) {
      onSubmit();
      setAttachedFiles([]); // Clear files after submit
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={
          `glass rounded-2xl p-4 transition-all duration-300 border border-white/10 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-white/15 focus-within:border-white/10 focus-within:outline-none focus-within:ring-0`
        }
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.md"
          multiple
        />

        {/* Attached files preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/10 text-sm text-white/80"
              >
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-0.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

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

        {/* Bottom Row: attachment and mic buttons */}
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={handleAttachClick}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            aria-label="Attach file"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5" />
          </button>
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
