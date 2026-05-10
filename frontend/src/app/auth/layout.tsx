export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#0a0f1e] min-h-screen">
      {children}
    </div>
  )
}