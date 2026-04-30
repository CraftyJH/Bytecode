export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Wordmark */}
      <a
        href="/"
        className="text-prose font-semibold text-lg mb-10 hover:text-accent transition-colors duration-100"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Bytecode
      </a>
      {children}
    </div>
  );
}
