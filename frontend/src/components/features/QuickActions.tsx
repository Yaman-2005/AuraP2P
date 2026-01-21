import { Image, Sparkles, Video, GraduationCap, Zap } from "lucide-react";

const actions = [
  { icon: Image, label: "Create image", color: "text-pink-400" },
  { icon: Sparkles, label: "Write anything", color: "text-blue-400" },
  { icon: Video, label: "Create a video", color: "text-violet-400" },
  { icon: GraduationCap, label: "Help me learn", color: "text-cyan-400" },
  { icon: Zap, label: "Boost my day", color: "text-yellow-400" },
];

const QuickActions = () => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {actions.map((action) => (
        <button
          key={action.label}
          className="glass-pill flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
        >
          <action.icon className={`w-4 h-4 ${action.color}`} />
          <span className="text-white/80">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
