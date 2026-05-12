export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {children}
    </div>
  )
}