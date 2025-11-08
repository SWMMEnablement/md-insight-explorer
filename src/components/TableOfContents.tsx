import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  title: string;
  level: number;
  page?: string;
  children?: TOCItem[];
}

interface TableOfContentsProps {
  content: string;
  compact?: boolean;
}

export const TableOfContents = ({ content, compact = false }: TableOfContentsProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['chapter-1']));

  const tocItems = useMemo(() => {
    const items: TOCItem[] = [];
    const lines = content.split('\n');
    let currentChapter: TOCItem | null = null;
    let inTable = false;

    lines.forEach((line, index) => {
      // Detect table start
      if (line.includes('<table') || line.includes('<thead')) {
        inTable = true;
      }
      if (line.includes('</table>') || line.includes('</tbody>')) {
        inTable = false;
      }

      // Parse table rows for TOC
      if (inTable && line.includes('<strong>') && line.includes('</strong>')) {
        const match = line.match(/<strong>(\d+\..*?)<\/strong>/);
        const titleMatch = line.match(/<p><strong>(.*?)<\/strong><\/p>/);
        const pageMatch = line.match(/<strong>(\d+)<\/strong>/g);
        
        if (match) {
          const chapterNum = match[1].trim();
          const title = titleMatch ? titleMatch[1] : '';
          const page = pageMatch && pageMatch.length > 1 ? pageMatch[pageMatch.length - 1].replace(/<\/?strong>/g, '') : '';
          
          if (chapterNum.match(/^\d+\.$/)) {
            currentChapter = {
              id: `chapter-${chapterNum.replace('.', '')}`,
              title: title || chapterNum,
              level: 1,
              page,
              children: []
            };
            items.push(currentChapter);
          } else if (currentChapter && chapterNum.match(/^\d+\.\d+$/)) {
            currentChapter.children = currentChapter.children || [];
            currentChapter.children.push({
              id: `section-${chapterNum.replace(/\./g, '-')}`,
              title: title || chapterNum,
              level: 2,
              page
            });
          }
        }
      }

      // Also parse markdown headers
      if (line.startsWith('#') && !inTable) {
        const level = line.match(/^#+/)?.[0].length || 0;
        const title = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
        
        if (title && level <= 2) {
          const item: TOCItem = {
            id: `heading-${index}`,
            title,
            level
          };
          
          if (level === 1) {
            items.push(item);
          } else if (level === 2 && items.length > 0) {
            const lastItem = items[items.length - 1];
            lastItem.children = lastItem.children || [];
            lastItem.children.push(item);
          }
        }
      }
    });

    return items;
  }, [content]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderItem = (item: TOCItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.has(item.id);

    return (
      <div key={item.id} className={cn("mb-1", compact && "mb-0.5")}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal hover:bg-accent/50",
            item.level === 1 ? "font-semibold" : "text-sm pl-6",
            compact && "h-8 px-2 text-xs"
          )}
          onClick={() => hasChildren && toggleSection(item.id)}
        >
          {hasChildren && (
            <span className="mr-1">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}
          {!hasChildren && <span className="w-4 mr-1" />}
          <span className="flex-1 truncate">{item.title}</span>
          {item.page && (
            <span className="text-muted-foreground ml-2 text-xs">{item.page}</span>
          )}
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="ml-2 mt-0.5">
            {item.children?.map((child, childIndex) => renderItem(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {tocItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading table of contents...</p>
      ) : (
        tocItems.map((item, index) => renderItem(item, index))
      )}
    </div>
  );
};
