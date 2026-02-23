// Performance monitoring and analytics system
// Type declarations for Performance API extensions
interface LargestContentfulPaint extends PerformanceEntry {
    element?: Element;
    url?: string;
}

interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, any>;
}

interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  maxMetrics: number;
  reportInterval: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private config: PerformanceConfig = {
    enabled: true,
    sampleRate: 0.1, // 10% of users
    maxMetrics: 1000,
    reportInterval: 60000 // 1 minute
  };
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupPerformanceObservers();
    this.startReporting();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private setupPerformanceObservers(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Track Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as LargestContentfulPaint;
          this.trackMetric('lcp', lastEntry.startTime, 'ms', {
            element: lastEntry.element?.tagName,
            url: lastEntry.url
          });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Track First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            const firstInputEntry = entry as PerformanceEventTiming;
            this.trackMetric('fid', firstInputEntry.processingStart - firstInputEntry.startTime, 'ms', {
              name: firstInputEntry.name,
              interactionType: firstInputEntry.entryType
            });
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Track Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            const layoutShiftEntry = entry as LayoutShift;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
              this.trackMetric('cls', clsValue, 'score', {
                sessionValue: clsValue
              });
            }
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  trackMetric(name: string, value: number, unit: string, context?: Record<string, any>): void {
    if (!this.config.enabled || Math.random() > this.config.sampleRate) {
      return;
    }

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      context
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }
  }

  trackCustomMetric(name: string, value: number, unit: string, context?: Record<string, any>): void {
    this.trackMetric(name, value, unit, context);
  }

  trackLoadTime(name: string, startTime: number, context?: Record<string, any>): void {
    const loadTime = performance.now() - startTime;
    this.trackMetric(`${name}_load_time`, loadTime, 'ms', context);
  }

  trackComponentRender(componentName: string, renderTime: number): void {
    this.trackMetric(`component_render_${componentName}`, renderTime, 'ms', {
      component: componentName
    });
  }

  trackAudioPerformance(event: string, value: number, context?: Record<string, any>): void {
    this.trackMetric(`audio_${event}`, value, 'ms', context);
  }

  private startReporting(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.reportMetrics();
      }, this.config.reportInterval);
    }
  }

  private reportMetrics(): void {
    if (this.metrics.length === 0) {
      return;
    }

    // In a real implementation, this would send metrics to your analytics service
    console.log('[Performance Metrics]', {
      sessionId: this.sessionId,
      metrics: this.metrics,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    // Clear reported metrics
    this.metrics = [];
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  setConfig(config: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Convenience functions
export const trackPerformanceMetric = (
  name: string,
  value: number,
  unit: string,
  context?: Record<string, any>
) => performanceMonitor.trackMetric(name, value, unit, context);

export const trackComponentPerformance = (componentName: string, renderTime: number) =>
  performanceMonitor.trackComponentRender(componentName, renderTime);

export const trackAudioPerformance = (event: string, value: number, context?: Record<string, any>) =>
  performanceMonitor.trackAudioPerformance(event, value, context);