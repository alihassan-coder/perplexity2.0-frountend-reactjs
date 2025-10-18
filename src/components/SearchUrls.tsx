import { SearchUrl } from "@/hooks/useChatStream";

interface SearchUrlsProps {
  urls: SearchUrl[];
}

export const SearchUrls = ({ urls }: SearchUrlsProps) => {
  if (!urls || urls.length === 0) return null;

  // Truncate URL for display
  const truncateUrl = (url: string, maxLength: number = 35) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="mt-4">
      <div className="text-sm font-medium text-foreground mb-3">Reading</div>
      
      <div className="grid grid-cols-2 gap-2">
        {urls.map((url, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => window.open(url.url, '_blank', 'noopener,noreferrer')}
            title={url.url}
          >
            <div className="text-sm text-gray-700 dark:text-gray-300 font-mono">
              {truncateUrl(url.url)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
