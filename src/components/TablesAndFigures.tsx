import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table2, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TableItem {
  id: string;
  title: string;
  lineNumber: number;
  preview: string;
}

interface FigureItem {
  id: string;
  title: string;
  lineNumber: number;
  type: 'image' | 'chart';
}

interface TablesAndFiguresProps {
  content: string;
  compact?: boolean;
}

export const TablesAndFigures = ({ content, compact = false }: TablesAndFiguresProps) => {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [figures, setFigures] = useState<FigureItem[]>([]);

  useEffect(() => {
    if (!content) return;

    const lines = content.split('\n');
    const extractedTables: TableItem[] = [];
    const extractedFigures: FigureItem[] = [];

    // Extract tables and figures
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for bold figure patterns: **Figure X.X.X**
      const boldFigurePattern = /\*\*Figure\s+([\d\.]+)\*\*\s+(.+)/;
      const figureMatch = line.match(boldFigurePattern);
      
      if (figureMatch) {
        const figureNumber = figureMatch[1];
        const figureTitle = figureMatch[2].trim();
        
        extractedFigures.push({
          id: `figure-${figureNumber}`,
          title: `Figure ${figureNumber}: ${figureTitle}`,
          lineNumber: i,
          type: 'chart'
        });
      }

      // Look for bold table patterns: **Table X.X.X**
      const boldTablePattern = /\*\*Table\s+([\d\.]+)\*\*\s+(.+)/;
      const tableMatch = line.match(boldTablePattern);
      
      if (tableMatch) {
        const tableNumber = tableMatch[1];
        const tableTitle = tableMatch[2].trim();
        
        extractedTables.push({
          id: `table-${tableNumber}`,
          title: `Table ${tableNumber}: ${tableTitle}`,
          lineNumber: i,
          preview: tableTitle.substring(0, 100)
        });
      }

      // Also detect markdown tables (lines with |) for embedded tables
      if (line.includes('|') && line.split('|').length > 2) {
        if (i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
          const headers = line.split('|').filter(h => h.trim()).map(h => h.trim());
          const title = headers.length > 0 ? headers.join(', ').substring(0, 60) : 'Untitled Table';
          
          // Only add if not already added
          if (!extractedTables.some(t => Math.abs(t.lineNumber - i) < 3)) {
            extractedTables.push({
              id: `table-embedded-${i}`,
              title: `Embedded Table: ${title}`,
              lineNumber: i,
              preview: line.substring(0, 100)
            });
          }
        }
      }
    }

    setTables(extractedTables);
    setFigures(extractedFigures);
  }, [content]);

  const scrollToLine = (lineNumber: number) => {
    // Find the scroll area containing the markdown content
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      // Estimate scroll position (approximate 24px per line)
      const estimatedPosition = lineNumber * 24;
      scrollArea.scrollTo({
        top: estimatedPosition,
        behavior: 'smooth'
      });
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Table2 className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Tables</h4>
            <Badge variant="secondary" className="text-xs">{tables.length}</Badge>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="space-y-1">
              {tables.slice(0, 10).map((table) => (
                <button
                  key={table.id}
                  onClick={() => scrollToLine(table.lineNumber)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  <span className="truncate">{table.title}</span>
                </button>
              ))}
              {tables.length === 0 && (
                <p className="text-xs text-muted-foreground px-2">No tables detected</p>
              )}
            </div>
          </ScrollArea>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Figures</h4>
            <Badge variant="secondary" className="text-xs">{figures.length}</Badge>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="space-y-1">
              {figures.slice(0, 10).map((figure) => (
                <button
                  key={figure.id}
                  onClick={() => scrollToLine(figure.lineNumber)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  <span className="truncate">{figure.title}</span>
                </button>
              ))}
              {figures.length === 0 && (
                <p className="text-xs text-muted-foreground px-2">No figures detected</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 shadow-card">
      <h2 className="text-2xl font-bold mb-4">Tables & Figures</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Quick navigation to all tables and figures referenced in the dissertation.
      </p>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tables" className="flex items-center gap-2">
            <Table2 className="h-4 w-4" />
            Tables ({tables.length})
          </TabsTrigger>
          <TabsTrigger value="figures" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Figures ({figures.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {tables.map((table) => (
                <Card
                  key={table.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => scrollToLine(table.lineNumber)}
                >
                  <div className="flex items-start gap-3">
                    <Table2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 text-sm">{table.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {table.preview}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        Line {table.lineNumber}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              ))}
              {tables.length === 0 && (
                <div className="text-center py-12">
                  <Table2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No tables detected in the document</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="figures" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {figures.map((figure) => (
                <Card
                  key={figure.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => scrollToLine(figure.lineNumber)}
                >
                  <div className="flex items-start gap-3">
                    <ImageIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 text-sm">{figure.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Line {figure.lineNumber}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {figure.type}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              ))}
              {figures.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No figures detected in the document</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
