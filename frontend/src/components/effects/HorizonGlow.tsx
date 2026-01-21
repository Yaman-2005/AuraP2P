const HorizonGlow = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none">
      {/* Main horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-full horizon-glow" />
      
      {/* Earth curve simulation */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[300px]"
        style={{
          background: "radial-gradient(ellipse 50% 100% at 50% 100%, hsl(217 91% 60% / 0.15) 0%, transparent 70%)",
        }}
      />
      
      {/* Bright center point */}
      <div 
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[200px]"
        style={{
          background: "radial-gradient(ellipse at center bottom, hsl(199 89% 70% / 0.6) 0%, hsl(217 91% 60% / 0.3) 30%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      
      {/* Secondary glow ring */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[150px]"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 100%, hsl(217 91% 60% / 0.2) 0%, transparent 60%)",
        }}
      />
    </div>
  );
};

export default HorizonGlow;
