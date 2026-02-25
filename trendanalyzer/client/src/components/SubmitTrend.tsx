import { useState } from 'react';
import { useSubmitTrend } from '@/hooks/useTrends';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function SubmitTrend() {
  const [formData, setFormData] = useState({
    topic: '',
    category: '',
    region: '',
    description: '',
  });

  const submitMutation = useSubmitTrend();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic || !formData.category || !formData.region) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      toast({
        title: "Success!",
        description: "Trend submitted successfully and is being analyzed by AI",
      });
      setFormData({ topic: '', category: '', region: '', description: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit trend. Please try again.",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'viral', label: '🔥 Viral' },
    { value: 'news', label: '📰 News' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'finance', label: '💼 Finance' },
    { value: 'culture', label: '🎮 Pop Culture' },
  ];

  const regions = [
    { value: '', label: 'Select Region' },
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'uk', label: '🇬🇧 United Kingdom' },
    { value: 'jp', label: '🇯🇵 Japan' },
    { value: 'de', label: '🇩🇪 Germany' },
    { value: 'global', label: '🌍 Global' },
  ];

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📤 Submit a Trend Idea</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Notice something trending that we missed? Help us improve our AI by submitting new trends.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter trending topic or keyword..."
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
            
            <textarea
              placeholder="Why do you think this is trending? (Optional)"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              {submitMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Trend
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
