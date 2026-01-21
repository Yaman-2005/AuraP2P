import { Sparkles } from "lucide-react";

interface GreetingProps {
  name?: string;
}

const Greeting = ({ name = "Sumit" }: GreetingProps) => {
  return (
    <div className="text-center mb-8 animate-float">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="relative">
          <Sparkles className="w-5 h-5 text-cosmic-glow" />
          <div className="absolute inset-0 blur-sm">
            <Sparkles className="w-5 h-5 text-cosmic-glow" />
          </div>
        </div>
        <span className="text-lg font-medium bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
          Hi {name}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold text-white text-glow">
        Your AI. Your Network. Your Power.
      </h1>
    </div>
  );
};

export default Greeting;
