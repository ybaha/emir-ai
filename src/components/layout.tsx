import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-2">
      <section className="container grid max-w-[640px] gap-4">{children}</section>
    </main>
  );
};

export default Layout;
