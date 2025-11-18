import { SearchUrl } from "@/hooks/useChatStream";
import { Globe2, Link2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourcesPanelProps {
  urls: SearchUrl[];
  className?: string;
}

export const ResourcesPanel = ({ urls, className }: ResourcesPanelProps) => {
  if (!urls || urls.length === 0) return null;

  const uniqueUrls = Array.from(new Map(urls.map((item) => [item.url, item])).values());

  const getDomainName = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/40 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl shadow-lg overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20">
              <Globe2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Resources & Sources</h3>
              <p className="text-xs text-muted-foreground">Web pages used in this response</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs font-semibold text-primary">
              {uniqueUrls.length} {uniqueUrls.length === 1 ? "source" : "sources"}
            </span>
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="px-6 py-4 space-y-3 max-h-80 overflow-y-auto">
        {uniqueUrls.map((item, index) => (
          <button
            type="button"
            key={item.url + index}
            onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
            className={cn(
              "w-full text-left rounded-xl border transition-all duration-200 px-4 py-3 flex items-start gap-3",
              "bg-muted/20 border-border/30 hover:bg-muted/40 hover:border-primary/40",
              "group cursor-pointer"
            )}
          >
            {/* Number Badge */}
            <div className="mt-0.5 flex-shrink-0">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary border border-primary/30 group-hover:border-primary/60 transition-colors">
                {index + 1}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {item.title || getDomainName(item.url)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                🔗 {getDomainName(item.url)}
              </p>
              {item.content && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {item.content}
                </p>
              )}
            </div>

            {/* External Link Icon */}
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
};
