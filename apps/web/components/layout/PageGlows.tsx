export function PageGlows() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Hero / top — warm accent bloom from upper-left */}
      <div
        style={{
          position: "absolute",
          top: "-8vh",
          left: "-5%",
          width: "65%",
          height: "60vh",
          background:
            "radial-gradient(ellipse at 30% 10%, rgba(199,123,58,0.11) 0%, transparent 62%)",
          filter: "blur(36px)",
        }}
      />

      {/* Top-right counter-glow — slightly cooler tint for contrast */}
      <div
        style={{
          position: "absolute",
          top: "2vh",
          right: "-10%",
          width: "50%",
          height: "45vh",
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(199,123,58,0.06) 0%, transparent 60%)",
          filter: "blur(48px)",
        }}
      />

      {/* Mid-page — drifts to the right */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          right: "-8%",
          width: "55%",
          height: "50vh",
          background:
            "radial-gradient(ellipse at 75% 50%, rgba(199,123,58,0.07) 0%, transparent 65%)",
          filter: "blur(56px)",
        }}
      />

      {/* Lower-left — anchors the bottom third */}
      <div
        style={{
          position: "absolute",
          bottom: "8vh",
          left: "-5%",
          width: "50%",
          height: "45vh",
          background:
            "radial-gradient(ellipse at 20% 80%, rgba(199,123,58,0.08) 0%, transparent 62%)",
          filter: "blur(48px)",
        }}
      />

      {/* Footer bloom — bottom-center */}
      <div
        style={{
          position: "absolute",
          bottom: "-6vh",
          left: "15%",
          right: "15%",
          height: "38vh",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(199,123,58,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
