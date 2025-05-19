'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { refineSearchQuery } from '@/ai/flows/search-refinement';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchInput({ onSearch, initialQuery = '' }: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync input with URL query param 'q'
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery !== null && urlQuery !== query) {
      setQuery(urlQuery);
      onSearch(urlQuery); // Ensure parent component is also aware of URL-driven search
    }
  }, [searchParams, query, onSearch]);


  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Update URL immediately with current query
    const newSearchParams = new URLSearchParams(window.location.search);
    if (query.trim()) {
      newSearchParams.set('q', query.trim());
    } else {
      newSearchParams.delete('q');
    }
    // Using router.replace to avoid adding to history stack for every typed char if we were doing live search
    // For submit-based search, push or replace is fine. Replace is often better for search filters.
    router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
    
    onSearch(query.trim()); // Notify parent component
  };
  
  const handleRefineAndSearch = async () => {
    if (!query.trim()) {
      onSearch('');
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.delete('q');
      router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
      return;
    }

    setIsLoading(true);
    try {
      const { refinedQuery } = await refineSearchQuery({ query });
      let finalQuery = refinedQuery;
      if (refinedQuery !== query) {
        toast({
          title: "Search Refined",
          description: `Using enhanced query: "${refinedQuery}"`,
          action: <Button variant="ghost" size="sm" onClick={() => {
            setQuery(query); // Revert to original
            onSearch(query);
            const newSearchParams = new URLSearchParams(window.location.search);
            newSearchParams.set('q', query);
            router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
            toast({ title: "Using original query", description: `Searching for: "${query}"`});
          }}>Use original: "{query}"</Button>
        });
        setQuery(refinedQuery); // Update input field with refined query
      } else {
         toast({
          title: "Searching...",
          description: `Looking for: "${query}"`,
        });
      }
      onSearch(finalQuery);
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set('q', finalQuery);
      router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);

    } catch (error) {
      console.error('Error refining search query:', error);
      toast({
        title: "Search Error",
        description: "Could not refine search. Using original query.",
        variant: "destructive",
      });
      onSearch(query); // Fallback to original query on error
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set('q', query);
      router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSearchSubmit} className="flex w-full max-w-2xl items-center space-x-2 md:space-x-3 mb-10">
      <div className="relative flex-grow">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search products, categories, or features..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-4 py-3 text-base h-12 rounded-lg shadow-sm focus:border-primary"
          aria-label="Search products"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="px-5 py-3 text-base h-12 rounded-lg shadow-sm hidden sm:inline-flex">
        {isLoading && query ? ( // Show loader only if loading and there's a query
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Search className="mr-0 sm:mr-2 h-5 w-5" />
        )}
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
