import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface flex-col justify-center items-center p-12 border-r border-border relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

        <div className="z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-heading">Employee Task Management System</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-body">
            Enterprise-grade workflow management
          </h2>
          <p className="text-subtle leading-relaxed">
            Streamline your team's productivity with our modern SaaS platform designed for high-performing organizations.
          </p>
        </div>
      </div>

      {/* Right panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
