import { useState, useEffect } from 'react';
import {
  servicesService,
  portfolioService,
  testimonialsService,
  settingsService
} from '../firebase/service';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = servicesService.subscribe((data) => {
      setServices(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { services, loading };
};

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = portfolioService.subscribe((data) => {
      setPortfolio(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { portfolio, loading };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = testimonialsService.subscribe((data) => {
      // Only show visible testimonials
      setTestimonials(data.filter(t => t.visible));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { testimonials, loading };
};

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.get();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Optional: real-time subscription
    // const unsubscribe = settingsService.subscribe(setSettings);
    // return unsubscribe;
  }, []);

  return { settings, loading };
};

// Combined hook for all website data
export const useWebsiteData = () => {
  const [data, setData] = useState({
    services: [],
    portfolio: [],
    testimonials: [],
    settings: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [services, portfolio, testimonials, settings] = await Promise.all([
          servicesService.getAll(),
          portfolioService.getAll(),
          testimonialsService.getAll().then(ts => ts.filter(t => t.visible)),
          settingsService.get()
        ]);

        setData({ services, portfolio, testimonials, settings });
      } catch (error) {
        console.error('Error fetching website data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return data;
};