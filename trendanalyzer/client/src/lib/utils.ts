import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    viral: "🔥",
    news: "📰", 
    sports: "⚽",
    finance: "💼",
    culture: "🎮"
  };
  return emojis[category] || "🌐";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    viral: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    news: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    sports: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300", 
    finance: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    culture: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
  };
  return colors[category] || "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function shareContent(title: string, text: string, url?: string): void {
  if (navigator.share) {
    navigator.share({
      title,
      text,
      url: url || window.location.href
    });
  } else {
    // Fallback to copying URL to clipboard
    copyToClipboard(url || window.location.href);
  }
}
