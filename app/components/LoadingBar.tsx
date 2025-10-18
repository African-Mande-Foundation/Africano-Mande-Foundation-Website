"use client";

interface LoadingBarProps {
  className?: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ className }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`border-2 border-[#C1DDCE] text-sm hover:underline ml-1"
      > border-t-transparent rounded-full animate-spin ${className || "w-4 h-4"}`}
      ></div>
    </div>
  );
};

export default LoadingBar;
