import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from './icons';
import { getEpisodeStats } from '@/lib/api';

const AnimatedCounter = ({ target, className, duration = 2000 }: { target: number, className?: string, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(easedProgress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span className={className}>{count.toLocaleString()}</span>;
};

const BentoCard: React.FC<{children: React.ReactNode, className?: string, isInteractive?: boolean}> = ({ children, className, isInteractive }) => (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 ${isInteractive ? 'hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
        {children}
    </div>
);

const ValueProps: React.FC = () => {
  const [stats, setStats] = useState([
    { value: 0, label: 'Episodes Decoded' },
    { value: 0, label: 'Hours Saved This Week' },
    { value: 98, label: 'Reader Satisfaction', unit: '%' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEpisodeStats();
        const hoursSaved = Math.max(
          data.totalDurationMinutes - data.totalReadTimeMinutes,
          0
        );
        setStats([
          { value: data.totalEpisodes, label: 'Episodes Decoded' },
          { value: Math.round(hoursSaved / 60), label: 'Hours Saved This Week' },
          { value: 98, label: 'Reader Satisfaction', unit: '%' },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats.');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <BentoCard className="md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-between" isInteractive>
              <div>
                <h3 className="font-display text-2xl font-bold text-richblack">Curated Daily</h3>
                <p className="mt-2 text-gray-600 max-w-md">Our team selects and summarizes the best podcast episodes so you don't have to. We cut through the noise to bring you pure signal.</p>
              </div>
              <Link to="/browse" className="font-semibold text-primary group flex items-center mt-4">
                Learn more <ChevronRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
          </BentoCard>
          <BentoCard isInteractive>
             <h3 className="font-display text-xl font-bold text-richblack">Save 95% Time</h3>
             <p className="mt-2 text-gray-600">Get key insights in 5 minutes instead of listening to 2-hour episodes.</p>
          </BentoCard>
          <BentoCard isInteractive>
             <h3 className="font-display text-xl font-bold text-richblack">Smart Search</h3>
             <p className="mt-2 text-gray-600">Find exactly what you're looking for across thousands of summaries.</p>
          </BentoCard>
           {stats.map(stat => (
              <BentoCard key={stat.label}>
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                    <AnimatedCounter target={isLoading ? 0 : stat.value} />
                    {stat.unit}
                </p>
                <p className="mt-1 text-gray-500">{stat.label}</p>
              </BentoCard>
           ))}
           {error && (
            <BentoCard>
              <p className="text-base text-red-600 font-semibold">Unable to refresh stats</p>
              <p className="mt-1 text-sm text-red-500">{error}</p>
            </BentoCard>
           )}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
