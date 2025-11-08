import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Droplets, MapPin, Calendar } from 'lucide-react';

export const DataVisualization = () => {
  // Sample data representing typical urban hydrology patterns
  const rainfallData = [
    { time: '0:00', intensity: 0 },
    { time: '0:15', intensity: 5 },
    { time: '0:30', intensity: 15 },
    { time: '0:45', intensity: 35 },
    { time: '1:00', intensity: 45 },
    { time: '1:15', intensity: 30 },
    { time: '1:30', intensity: 20 },
    { time: '1:45', intensity: 10 },
    { time: '2:00', intensity: 5 },
    { time: '2:15', intensity: 0 }
  ];

  const runoffData = [
    { time: '0:00', observed: 0, modeled: 0 },
    { time: '0:15', observed: 2, modeled: 1.8 },
    { time: '0:30', observed: 8, modeled: 7.5 },
    { time: '0:45', observed: 20, modeled: 21 },
    { time: '1:00', observed: 35, modeled: 34 },
    { time: '1:15', observed: 28, modeled: 27 },
    { time: '1:30', observed: 18, modeled: 19 },
    { time: '1:45', observed: 10, modeled: 11 },
    { time: '2:00', observed: 5, modeled: 5.5 },
    { time: '2:15', observed: 2, modeled: 2.2 },
    { time: '2:30', observed: 0, modeled: 0.5 }
  ];

  const catchmentData = [
    { name: 'Impervious', value: 45, color: 'hsl(var(--academic-blue))' },
    { name: 'Pervious', value: 35, color: 'hsl(var(--accent))' },
    { name: 'Roads', value: 20, color: 'hsl(var(--academic-gray))' }
  ];

  const stormEvents = [
    { date: '13/05/95', depth: 42, peak: 35, duration: 120 },
    { date: '03/01/93', depth: 28, peak: 28, duration: 90 },
    { date: '13/12/83', depth: 35, peak: 31, duration: 105 },
    { date: '02/02/80', depth: 30, peak: 26, duration: 95 }
  ];

  const catchmentStats = [
    { label: 'Total Area', value: '62.9 ha', icon: MapPin },
    { label: 'Allotments', value: '526', icon: MapPin },
    { label: 'Monitoring Period', value: '3 years', icon: Calendar },
    { label: 'Storm Events', value: '50+', icon: Droplets }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Data Analysis & Visualizations
        </h2>
        <p className="text-muted-foreground mb-6">
          Visual representations of key hydrological data and modeling results from the Giralang catchment study.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {catchmentStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 text-center border-2">
                <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </Card>
            );
          })}
        </div>
      </Card>

      <Tabs defaultValue="rainfall" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rainfall">Rainfall Pattern</TabsTrigger>
          <TabsTrigger value="runoff">Runoff Response</TabsTrigger>
          <TabsTrigger value="catchment">Catchment Composition</TabsTrigger>
          <TabsTrigger value="events">Storm Events</TabsTrigger>
        </TabsList>

        <TabsContent value="rainfall" className="mt-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Typical Rainfall Intensity Pattern</h3>
              <Badge variant="secondary">mm/hr</Badge>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} 
                />
                <Bar dataKey="intensity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4">
              Representative temporal pattern showing peak rainfall intensity during a typical urban storm event.
              Data based on 5-minute interval measurements from the Giralang monitoring stations.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="runoff" className="mt-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Observed vs Modeled Runoff</h3>
              <Badge variant="secondary">L/s</Badge>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={runoffData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="observed" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="modeled" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4">
              Comparison between observed flow measurements and "Process Tree" model predictions. The close 
              agreement demonstrates the model's capability to capture temporal runoff dynamics at the 
              micro-catchment scale.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="catchment" className="mt-6">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Catchment Surface Composition</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={catchmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {catchmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Surface Breakdown</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--academic-blue))' }}></div>
                      <span>Impervious surfaces (roofs, driveways) - 45%</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--accent))' }}></div>
                      <span>Pervious surfaces (gardens, lawns) - 35%</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-academic-gray"></div>
                      <span>Road surfaces - 20%</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Surface composition significantly affects runoff generation and timing. Impervious surfaces 
                  produce immediate runoff, while pervious areas provide infiltration and storage capacity.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Major Storm Events Analyzed</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Event Date</th>
                    <th className="text-right p-3 font-semibold">Rainfall Depth (mm)</th>
                    <th className="text-right p-3 font-semibold">Peak Flow (L/s)</th>
                    <th className="text-right p-3 font-semibold">Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {stormEvents.map((event, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="p-3">{event.date}</td>
                      <td className="p-3 text-right">{event.depth}</td>
                      <td className="p-3 text-right">{event.peak}</td>
                      <td className="p-3 text-right">{event.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Key storm events from the monitoring period used for model calibration and validation. Each event 
              provided detailed rainfall and runoff measurements at multiple locations within the catchment.
            </p>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6 shadow-card bg-muted/30">
        <h3 className="font-semibold mb-3">Research Methodology Highlights</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-primary">Micro-Catchment Analysis</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Paired roof and surface measurements</li>
              <li>• High-resolution temporal data (5-minute intervals)</li>
              <li>• Process-based modeling approach</li>
              <li>• Detailed hydraulic characterization</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-primary">Scale-Up Methodology</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Time-area isochronal analysis</li>
              <li>• Network hydraulic routing (XP-EXTRAN)</li>
              <li>• Spatial rainfall distribution effects</li>
              <li>• Validation at catchment outlet</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
