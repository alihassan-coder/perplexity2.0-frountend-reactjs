import { Search, Globe, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { SearchUrl } from "@/hooks/useChatStream";

interface SearchTrailProps {
  searchUrls: SearchUrl[];
  searchQuery?: string;
  timestamp?: Date;
}

export const SearchTrail = ({ searchUrls, searchQuery, timestamp }: SearchTrailProps) => {
  if (!searchUrls || searchUrls.length === 0) return null;

  // Extract domain name from URL
  const getDomainName = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm search-trail-enter">
      {/* Search Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">🔍 Search Trail</h3>
            {searchQuery && (
              <p className="text-xs text-muted-foreground">Query: "<span className="text-primary font-medium">{searchQuery}</span>"</p>
            )}
          </div>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{timestamp?.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>Found <span className="text-primary font-semibold">{searchUrls.length}</span> relevant sources:</span>
        </div>
        
        <div className="grid gap-2">
          {searchUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-all duration-200 group cursor-pointer"
              onClick={() => window.open(url.url, '_blank', 'noopener,noreferrer')}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-semibold text-primary">{index + 1}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {url.title || getDomainName(url.url)}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-mono">📍 {getDomainName(url.url)}</span>
                </p>
                {url.content && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {url.content}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <ExternalLink className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Complete Indicator */}
      <div className="mt-4 pt-3 border-t border-border/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>✓ Search completed • Generating response...</span>
        </div>
      </div>
    </div>
  );
};
