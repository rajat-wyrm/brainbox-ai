import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef(performance.now());
  const metrics = useRef<PerformanceMetrics[]>([]);

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    const metric = {
      componentName,
      renderTime,
      timestamp: Date.now()
    };

    metrics.current.push(metric);

    // Log slow renders (> 100ms)
    if (renderTime > 100) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/v1/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      }).catch(console.error);
    }

    return () => {
      // Cleanup if needed
    };
  }, [componentName]);

  const getAverageRenderTime = () => {
    if (metrics.current.length === 0) return 0;
    const sum = metrics.current.reduce((acc, m) => acc + m.renderTime, 0);
    return sum / metrics.current.length;
  };

  return {
    getAverageRenderTime
  };
};
