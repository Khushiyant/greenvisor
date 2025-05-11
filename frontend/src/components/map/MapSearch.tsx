import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Loader2, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define the search result type
interface SearchResult {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
}

interface MapSearchProps {
  onSelectLocation: (lat: number, lng: number, name: string) => void;
  placeholder?: string;
  className?: string;
}

export function MapSearch({
  onSelectLocation,
  placeholder,
  className,
}: MapSearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  // Search function with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsDropdownOpen(true);

    // Clear previous timeout
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    // Don't search for empty queries
    if (!value.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Set searching state immediately
    setIsSearching(true);

    // Debounce the search
    searchTimeout.current = setTimeout(async () => {
      try {
        // Nominatim search API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&limit=8`
        );

        const data = await response.json();

        // Transform the data into our format
        const formattedResults: SearchResult[] = data.map((item: any) => ({
          id: item.place_id,
          name: item.display_name.split(",")[0],
          description: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));

        setResults(formattedResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce
  };

  // Clear the search
  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      {/* Search input with icon */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={
            placeholder ||
            t("map.searchPlaceholder", "Search for a location...")
          }
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {/* Search results dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-[2000] w-full bg-background rounded-md border border-border shadow-lg mt-1 overflow-hidden max-h-[300px] overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                {t("map.searching", "Searching...")}
              </span>
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("map.noResults", "No locations found.")}
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="py-1">
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => {
                    onSelectLocation(result.lat, result.lng, result.name);
                    setQuery(result.name);
                    setIsDropdownOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-accent cursor-pointer flex"
                >
                  <div className="flex w-full items-start">
                    <MapPin className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{result.name}</div>
                      {result.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {result.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && !query && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("map.startTyping", "Start typing to search...")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
