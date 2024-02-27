const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="h-full bg-slate-100">
         {/* Nav bar */}
         <main className="pt-40 pb-20">{children}</main>

         {/* Footer */}
      </div>
   );
};

export default MarketingLayout;
