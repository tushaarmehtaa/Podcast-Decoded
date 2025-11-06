import React from 'react';

const Newsletter: React.FC = () => {
    return (
        <section className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4">
                <div className="relative bg-gradient-to-r from-primary to-secondary p-8 md:p-16 rounded-2xl text-center overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full" aria-hidden="true"></div>
                    <div className="absolute -bottom-16 -right-5 w-52 h-52 bg-white/10 rounded-full" aria-hidden="true"></div>
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Join 10,000+ readers getting weekly insights</h2>
                        <p className="mt-4 text-white/80 max-w-xl mx-auto">Get the best podcast summaries delivered to your inbox every Tuesday. No spam, ever.</p>
                        <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input type="email" placeholder="Your best email" className="w-full px-5 py-3.5 bg-white/20 border border-white/30 rounded-md focus:ring-2 focus:ring-white focus:outline-none transition-shadow text-white placeholder-white/70"/>
                            <button type="submit" className="px-8 py-3.5 font-semibold text-primary bg-white rounded-md hover:bg-gray-100 transition-colors flex-shrink-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
