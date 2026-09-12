export default function MascotVideo() {
  return (
    <div className="relative w-64 h-64 z-20 drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] pointer-events-none">
      {/* Ensure your video is named mascot.webm and is in the public folder */}
      <video 
        src="/mascot.webm" 
        autoPlay 
        loop 
        muted 
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  );
}