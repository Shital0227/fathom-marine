export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-60 mt-16 bg-[#f8fafc] min-h-screen">
      <main className="p-10">
        {children}
      </main>
    </div>
  );
}
