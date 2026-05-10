export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-60 mt-16 bg-[#0a0f1e] min-h-screen">
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
