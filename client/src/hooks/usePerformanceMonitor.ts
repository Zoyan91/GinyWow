import { useEffect } from 'react';

// Core Web Vitals monitoring hook
export function usePerformanceMonitor() {
  useEffect(() => {
    // Only run in browser and production
    if (typeof window === 'undefined') return;

    // Custom Web Vitals monitoring (since web-vitals package not available)
    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('LCP:', entry.startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Contentful Paint  
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      return () => {
        lcpObserver.disconnect();
        fcpObserver.disconnect();
      };
    } catch (error) {
      console.warn('Performance monitoring not supported');
    }

    // Performance observer for additional metrics
    if ('PerformanceObserver' in window) {
      try {
        // Monitor long tasks that block the main thread
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', entry.duration + 'ms');
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });

        // Monitor layout shifts
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              console.log('Layout shift:', layoutShiftEntry.value);
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          longTaskObserver.disconnect();
          layoutShiftObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance Observer not supported');
      }
    }
  }, []);
}

// Resource loading performance hook
export function useResourcePerformance() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Log slow loading resources
          if (resourceEntry.duration > 1000) {
            console.warn('Slow resource:', resourceEntry.name, resourceEntry.duration + 'ms');
          }

          // Log failed resources
          if (resourceEntry.transferSize === 0 && resourceEntry.decodedBodySize === 0) {
            console.error('Failed to load resource:', resourceEntry.name);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);
}

// Page visibility API for performance optimization
export function usePageVisibility(callback?: (visible: boolean) => void) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      callback?.(isVisible);
      
      if (isVisible) {
        console.log('Page became visible');
      } else {
        console.log('Page became hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [callback]);
}