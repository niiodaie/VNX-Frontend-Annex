import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "board", label: "Board View" },
    { id: "list", label: "To-Do List" },
    { id: "prompts", label: "AI Prompts" },
    { id: "ai-insights", label: "AI Insights" },
  ];

  return (
    <div className="bg-white border-b border-vnx-gray-200">
      <nav className="px-6 -mb-px flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.id
                ? "border-vnx-blue text-vnx-blue"
                : "border-transparent text-vnx-gray-500 hover:text-vnx-gray-700 hover:border-vnx-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
