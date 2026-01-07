import { Zap } from "lucide-react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative flex items-center gap-1">
        {/* Logo Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <Zap className="h-5 w-5 text-white fill-white" />
        </div>
        {/* Logo Text */}
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Despacha
            </span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
              Zap
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wide -mt-1 ml-auto">
            despachamente online
          </span>
        </div>
      </div>
    </a>
  );
};

export default Logo;
