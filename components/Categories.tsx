import React from 'react';

const categories = [
    { name: 'Tech', count: 431, color: 'from-blue-400 to-cyan-400' },
    { name: 'Business', count: 312, color: 'from-purple-500 to-indigo-500' },
    { name: 'Health', count: 256, color: 'from-green-400 to-emerald-500' },
    { name: 'Philosophy', count: 189, color: 'from-yellow-400 to-amber-500' },
    { name: 'Science', count: 154, color: 'from-rose-400 to-pink-500' },
    { name: 'Culture', count: 98, color: 'from-orange-400 to-red-500' },
];

const CategoryCard: React.FC<{category: typeof categories[0]}> = ({ category }) => (
    <a href="#" className="group relative block p-6 rounded-xl bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden text-white">
      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} transition-opacity duration-300 group-hover:opacity-90`}></div>
      <div className="relative">
        <h3 className="font-bold text-xl">{category.name}</h3>
        <p className="text-sm opacity-80 mt-1">{category.count} episodes</p>
      </div>
    </a>
);

const Categories: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-richblack">Explore by Category</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Dive into topics that matter to you. Find curated summaries in everything from AI to longevity.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
                    {categories.map((cat, index) => (
                        <div key={cat.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <CategoryCard category={cat} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
