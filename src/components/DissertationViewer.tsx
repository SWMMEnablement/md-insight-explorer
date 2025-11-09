import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Info, 
  FileText, 
  BarChart3,
  Download,
  ChevronRight,
  Table2
} from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import { BackgroundInfo } from './BackgroundInfo';
import { DataVisualization } from './DataVisualization';
import { TablesAndFigures } from './TablesAndFigures';

export const DissertationViewer = () => {
  const [content, setContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('document');
  const [isLoading, setIsLoading] = useState(true);
  const [targetLine, setTargetLine] = useState<number | null>(null);

  useEffect(() => {
    fetch('/dissertation.md')
      .then(response => response.text())
      .then(text => {
        setContent(text);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading dissertation:', error);
        setIsLoading(false);
      });
  }, []);

  const highlightedContent = searchTerm
    ? content.replace(
        new RegExp(searchTerm, 'gi'),
        match => `<mark class="bg-accent/30 px-0.5">${match}</mark>`
      )
    : content;

  const handleNavigateToLine = (lineNumber: number) => {
    // Switch to document tab
    setActiveTab('document');
    setTargetLine(lineNumber);
  };

  useEffect(() => {
    if (targetLine !== null && activeTab === 'document') {
      // Wait for tab to render then scroll
      setTimeout(() => {
        const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollArea) {
          // Estimate scroll position (approximate 24px per line)
          const estimatedPosition = targetLine * 24;
          scrollArea.scrollTo({
            top: estimatedPosition,
            behavior: 'smooth'
          });
        }
        setTargetLine(null);
      }, 100);
    }
  }, [targetLine, activeTab]);

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Urban-Rainfall-Runoff-Modelling-Allan-Goyen.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Urban Rainfall/Runoff Modelling - Allan Goyen
                </h1>
                <p className="text-sm text-muted-foreground">
                  PhD Thesis, University of Technology Sydney, 2000
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex">
                <FileText className="h-3 w-3 mr-1" />
                22,703 lines
              </Badge>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search within document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5 mx-auto">
            <TabsTrigger value="document" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Document</span>
            </TabsTrigger>
            <TabsTrigger value="contents" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Contents</span>
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              <span className="hidden sm:inline">Tables</span>
            </TabsTrigger>
            <TabsTrigger value="visualizations" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="background" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Background</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="document" className="mt-0">
              <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                <aside className="hidden lg:block">
                  <Card className="sticky top-24 p-4 shadow-card">
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                      Quick Navigation
                    </h3>
                    <Tabs defaultValue="toc" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-3">
                        <TabsTrigger value="toc" className="text-xs">Contents</TabsTrigger>
                        <TabsTrigger value="tables" className="text-xs">Tables</TabsTrigger>
                      </TabsList>
                      <TabsContent value="toc" className="mt-0">
                        <TableOfContents content={content} compact />
                      </TabsContent>
                      <TabsContent value="tables" className="mt-0">
                        <TablesAndFigures content={content} compact onNavigate={handleNavigateToLine} />
                      </TabsContent>
                    </Tabs>
                  </Card>
                </aside>

                <Card className="p-8 shadow-card">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {highlightedContent}
                        </ReactMarkdown>
                      </div>
                    </ScrollArea>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contents" className="mt-0">
              <Card className="p-6 shadow-card">
                <TableOfContents content={content} />
              </Card>
            </TabsContent>

            <TabsContent value="tables" className="mt-0">
              <TablesAndFigures content={content} onNavigate={handleNavigateToLine} />
            </TabsContent>

            <TabsContent value="visualizations" className="mt-0">
              <DataVisualization />
            </TabsContent>

            <TabsContent value="background" className="mt-0">
              <BackgroundInfo />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
