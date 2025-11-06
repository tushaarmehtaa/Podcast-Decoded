import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-white pt-24 pb-32 animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-white to-orange-100/20 animate-gradient-bg bg-[length:200%_200%]" aria-hidden="true"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-richblack tracking-tight max-w-4xl mx-auto">
                    Never Miss Key Insights From Your Favorite Podcasts
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Expert-curated summaries of the world's best podcast episodes. Save hours every week.
                </p>
                <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input type="email" placeholder="Enter your email..." className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"/>
                    <button type="submit" className="px-8 py-3.5 font-semibold text-white bg-primary rounded-md hover:bg-purple-700 transition-colors flex-shrink-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Get Weekly Digest
                    </button>
                </form>
                <div className="mt-8 text-sm text-gray-500">
                    Live counter: <span className="font-semibold text-primary">2,847</span> podcasts decoded this month
                </div>
            </div>
        </section>
    );
};

export default Hero;
