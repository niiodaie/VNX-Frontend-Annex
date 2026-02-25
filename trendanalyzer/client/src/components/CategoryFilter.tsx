import { getCategoryEmoji } from '@/lib/utils';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', name: 'All Categories', icon: 'fas fa-globe', color: 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600' },
    { id: 'viral', name: 'Viral', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50' },
    { id: 'news', name: 'News', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50' },
    { id: 'sports', name: 'Sports', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50' },
    { id: 'finance', name: 'Finance', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50' },
    { id: 'culture', name: 'Pop Culture', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50' },
  ];

  return (
    <section className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full transition-colors text-sm font-medium ${category.color} ${
              activeCategory === category.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {category.id === 'all' ? (
              <><i className={category.icon + ' mr-2'}></i>{category.name}</>
            ) : (
              <>{getCategoryEmoji(category.id)} {category.name}</>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
