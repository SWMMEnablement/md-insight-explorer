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
    let tableCounter = 1;
    let figureCounter = 1;

    // Extract tables
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect markdown tables (lines with |)
      if (line.includes('|') && line.split('|').length > 2) {
        // Check if it's a header row by looking at next line for separator
        if (i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
          const headers = line.split('|').filter(h => h.trim()).map(h => h.trim());
          const title = headers.length > 0 ? headers.join(', ').substring(0, 60) : 'Untitled Table';
          
          extractedTables.push({
            id: `table-${tableCounter}`,
            title: `Table ${tableCounter}: ${title}`,
            lineNumber: i,
            preview: line.substring(0, 100)
          });
          tableCounter++;
        }
      }

      // Extract figures (images)
      if (line.includes('![') || line.toLowerCase().includes('figure')) {
        const figureMatch = line.match(/!\[(.*?)\]/);
        const title = figureMatch ? figureMatch[1] : `Figure ${figureCounter}`;
        
        extractedFigures.push({
          id: `figure-${figureCounter}`,
          title: title || `Figure ${figureCounter}`,
          lineNumber: i,
          type: line.includes('![') ? 'image' : 'chart'
        });
        figureCounter++;
      }

      // Look for "Table X:" or "Figure X:" patterns in text
      const tablePattern = /Table\s+(\d+)[:\s]+(.+)/i;
      const figurePattern = /Figure\s+(\d+)[:\s]+(.+)/i;
      
      const tableMatch = line.match(tablePattern);
      if (tableMatch && !extractedTables.some(t => t.lineNumber === i)) {
        extractedTables.push({
          id: `table-${tableMatch[1]}`,
          title: `Table ${tableMatch[1]}: ${tableMatch[2].substring(0, 60)}`,
          lineNumber: i,
          preview: tableMatch[2].substring(0, 100)
        });
      }

      const figureMatch = line.match(figurePattern);
      if (figureMatch && !extractedFigures.some(f => f.lineNumber === i)) {
        extractedFigures.push({
          id: `figure-${figureMatch[1]}`,
          title: `Figure ${figureMatch[1]}: ${figureMatch[2].substring(0, 60)}`,
          lineNumber: i,
          type: 'chart'
        });
      }
    }

    setTables(extractedTables);
    setFigures(extractedFigures);
  }, [content]);

  const scrollToLine = (lineNumber: number) => {
    // This is a simplified approach - in production you'd want more sophisticated scrolling
    const element = document.querySelector('.prose');
    if (element) {
      element.scrollTop = lineNumber * 20; // Approximate line height
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
