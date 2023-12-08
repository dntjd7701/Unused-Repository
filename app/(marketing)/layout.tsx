const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-slate-100">
      {/* 네비게이션 바 */}
      <main className="pt-40 pb-20">{children}</main>
      {/* Footer */}
    </div>
  );
};

export default MarketingLayout;
