import { useEffect } from 'react';

// Core Web Vitals monitoring hook
export function usePerformanceMonitor() {
  useEffect(() => {
    // Only run in browser and production
    if (typeof window === 'undefined') return;

    // Comprehensive Web Vitals monitoring - all observers in single lifecycle
    if ('PerformanceObserver' in window) {
      const observers: PerformanceObserver[] = [];
      
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('LCP:', entry.startTime);
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        observers.push(lcpObserver);

        // First Contentful Paint  
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              console.log('FCP:', entry.startTime);
            }
          }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
        observers.push(fcpObserver);

        // Monitor long tasks that block the main thread
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', entry.duration + 'ms');
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        observers.push(longTaskObserver);

        // Monitor layout shifts for CLS (aggregate scoring)
        let clsScore = 0;
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsScore += layoutShiftEntry.value;
              console.log('Layout shift (CLS):', layoutShiftEntry.value, 'Total CLS:', clsScore);
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        observers.push(layoutShiftObserver);

        // Monitor First Input Delay (FID) and Interaction to Next Paint (INP)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const firstInput = entry as any;
            const fid = firstInput.processingStart - firstInput.startTime;
            console.log('First Input Delay (FID):', fid + 'ms');
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'], buffered: true });
        observers.push(fidObserver);

        // Monitor all event timing for INP calculation
        const eventObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const eventEntry = entry as any;
            const duration = eventEntry.duration;
            if (duration > 40) { // INP threshold
              console.log('Slow interaction (INP):', eventEntry.name, duration + 'ms');
            }
          }
        });
        eventObserver.observe({ entryTypes: ['event'] });
        observers.push(eventObserver);

        // Monitor navigation timing
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation timing - DOMContentLoaded:', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
            console.log('Navigation timing - Load Complete:', navEntry.loadEventEnd - navEntry.loadEventStart);
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        observers.push(navigationObserver);

        // Cleanup function for all observers
        return () => {
          observers.forEach(observer => observer.disconnect());
          console.log('Performance monitoring stopped');
        };
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
        // Disconnect any partially created observers
        observers.forEach(observer => observer.disconnect());
      }
    } else {
      console.warn('PerformanceObserver not supported');
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