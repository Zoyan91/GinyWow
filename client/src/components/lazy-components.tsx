import { lazy, Suspense, ComponentType, ReactNode, useState, useRef, useEffect } from 'react';
import { Skeleton, CardSkeleton } from './loading-skeleton';

// Generic lazy wrapper with error boundary
interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  error?: ReactNode;
}

export function LazyWrapper({ 
  children, 
  fallback = <Skeleton height="200px" />,
  error = <div className="text-red-500">Failed to load component</div>
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<T extends ComponentType<any>>(
  LazyComponent: T,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: any) {
    return (
      <Suspense fallback={fallback || <Skeleton height="200px" />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Pre-configured lazy components with appropriate fallbacks
export const LazyFooter = lazy(() => import('./footer'));
export const LazyHeader = lazy(() => import('./header'));

// Lazy tool components with skeletons  
// Note: tool-card component would be created when needed

// Utility for preloading components
export function preloadComponent(importFn: () => Promise<any>) {
  return {
    preload: () => importFn(),
    component: lazy(importFn)
  };
}

// Critical component preloader
export function useCriticalComponentPreloader() {
  // Preload critical components after initial render
  setTimeout(() => {
    // Preload footer and other non-critical components
    import('./footer');
  }, 100);
}

// Intersection Observer based lazy loading for components
interface LazyOnViewProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export function LazyOnView({ 
  children, 
  fallback = <Skeleton height="200px" />,
  rootMargin = '100px',
  threshold = 0.1
}: LazyOnViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}