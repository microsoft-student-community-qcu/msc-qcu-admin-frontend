import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-size160 bg-muted overflow-hidden">
      {/* Stock Photo Background */}
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* Auth Card Content */}
      {children}
    </div>
  );
};

export default AuthLayout;
