import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  children?: ReactNode;
}

export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = false,
  children 
}: SkeletonProps) {
  return (
    <div 
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// Component skeleton for cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="text-center space-y-4">
        <Skeleton width={80} height={80} className="mx-auto" rounded />
        <div className="space-y-2">
          <Skeleton width="60%" height="1.5rem" className="mx-auto" />
          <Skeleton width="80%" height="1rem" className="mx-auto" />
          <Skeleton width="70%" height="1rem" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Tool showcase skeleton
export function ToolShowcaseSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {Array.from({ length: 4 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height="3rem" />
      <div className="flex gap-2">
        <Skeleton height="2.5rem" className="flex-1" />
        <Skeleton width={100} height="2.5rem" />
      </div>
    </div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <Skeleton height="3rem" width="80%" className="mx-auto" />
        <Skeleton height="1.5rem" width="60%" className="mx-auto" />
        <Skeleton height="1.5rem" width="70%" className="mx-auto" />
      </div>
      <FormSkeleton />
    </div>
  );
}