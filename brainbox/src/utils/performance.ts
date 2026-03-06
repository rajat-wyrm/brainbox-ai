// Lazy load images
export const lazyLoadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Debounce function for search/input
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle for scroll/resize events
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<F>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Cache API responses
export const cache = {
  set: (key: string, data: any, ttl: number = 300000) => {
    const item = {
      data,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  },
  
  clear: () => {
    localStorage.clear();
  }
};

// Performance marks
export const mark = (name: string) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(name);
  }
};

export const measure = (name: string, startMark: string, endMark: string) => {
  if (process.env.NODE_ENV === 'development') {
    performance.measure(name, startMark, endMark);
  }
};
