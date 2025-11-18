import { SearchUrl } from "@/hooks/useChatStream";
import { ExternalLink, Globe } from "lucide-react";

interface SearchUrlsProps {
  urls: SearchUrl[];
}

export const SearchUrls = ({ urls }: SearchUrlsProps) => {
  if (!urls || urls.length === 0) return null;

  // Extract domain name from URL
  const getDomainName = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Truncate URL for display
  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/20">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-primary" />
        <div className="text-xs font-medium text-muted-foreground">Sources Used</div>
      </div>
      
      <div className="space-y-2">
        {urls.map((url, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer border border-border/20 hover:border-primary/30 group"
            onClick={() => window.open(url.url, '_blank', 'noopener,noreferrer')}
            title={url.url}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-xs font-semibold text-primary">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {url.title || getDomainName(url.url)}
                  </p>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {getDomainName(url.url)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
