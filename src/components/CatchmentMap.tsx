import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Droplets, Radio } from 'lucide-react';

export const CatchmentMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('pk.eyJ1IjoiZGlja2luc29ucmUiLCJhIjoiY21oczd6eDllMWdoNDJpcTZ5dW9wN2J3aiJ9.Hwy-aXZytiY9I4q1WLnMmA');
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Initialize map on mount if token exists
  useEffect(() => {
    if (mapboxToken && !isTokenSet && mapContainer.current) {
      setIsTokenSet(true);
      initializeMap(mapboxToken);
    }
  }, []);

  // Monitoring stations in Giralang catchment based on dissertation research
  const stations = [
    {
      name: 'Catchment Outlet Gauge',
      type: 'Flow Meter',
      coordinates: [149.0865, -35.2190],
      description: 'Main 1800mm pipe outlet - Total catchment flow monitoring (operated by ACTEW since 1976)'
    },
    {
      name: 'Rainfall Gauge - Gundulu Place',
      type: 'Rain Gauge',
      coordinates: [149.0835, -35.2165],
      description: 'Lot 1 Gundulu Place - HS tipping bucket (0.2mm resolution, 30-second intervals)'
    },
    {
      name: 'Rainfall Gauge - Chuculba Crescent',
      type: 'Rain Gauge',
      coordinates: [149.0845, -35.2170],
      description: 'Lot 3 Chuculba Crescent - HS tipping bucket raingauge'
    },
    {
      name: '12 Roof Micro-Catchment',
      type: 'Flow Meter',
      coordinates: [149.0840, -35.2167],
      description: '300mm pipe gauge - 12 residential roof allotments (0.93 ha) - Roof runoff only'
    },
    {
      name: '14 Lot Micro-Catchment',
      type: 'Flow Meter',
      coordinates: [149.0838, -35.2173],
      description: '450mm pipe gauge - 14 allotments (1.54 ha) - Roofs, yards and roadway runoff'
    },
    {
      name: 'Rural/Urban Interface',
      type: 'Flow Meter',
      coordinates: [149.0820, -35.2145],
      description: '900mm pipe gauge - Rural area runoff (19.6 ha pasture)'
    }
  ];

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
      initializeMap(mapboxToken.trim());
    }
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [149.0833, -35.2167], // Giralang, Canberra
      zoom: 14.5,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add scale control
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }),
      'bottom-left'
    );

    map.current.on('load', () => {
      // Add urban catchment boundary (62.9 ha)
      map.current?.addSource('catchment-urban', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Urban Area (62.9 ha)', allotments: 526 },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [149.0810, -35.2145],
              [149.0875, -35.2145],
              [149.0875, -35.2195],
              [149.0810, -35.2195],
              [149.0810, -35.2145]
            ]]
          }
        }
      });

      // Add rural catchment boundary (19.6 ha at top)
      map.current?.addSource('catchment-rural', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Rural Area (19.6 ha)' },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [149.0810, -35.2120],
              [149.0850, -35.2120],
              [149.0850, -35.2145],
              [149.0810, -35.2145],
              [149.0810, -35.2120]
            ]]
          }
        }
      });

      // Urban catchment layers
      map.current?.addLayer({
        id: 'catchment-urban-fill',
        type: 'fill',
        source: 'catchment-urban',
        paint: {
          'fill-color': 'hsl(var(--primary))',
          'fill-opacity': 0.25
        }
      });

      map.current?.addLayer({
        id: 'catchment-urban-outline',
        type: 'line',
        source: 'catchment-urban',
        paint: {
          'line-color': 'hsl(var(--primary))',
          'line-width': 3,
          'line-dasharray': [3, 2]
        }
      });

      // Rural catchment layers
      map.current?.addLayer({
        id: 'catchment-rural-fill',
        type: 'fill',
        source: 'catchment-rural',
        paint: {
          'fill-color': 'hsl(var(--accent))',
          'fill-opacity': 0.15
        }
      });

      map.current?.addLayer({
        id: 'catchment-rural-outline',
        type: 'line',
        source: 'catchment-rural',
        paint: {
          'line-color': 'hsl(var(--accent))',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });

      // Add monitoring stations
      stations.forEach((station) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        
        if (station.type === 'Rain Gauge') {
          el.style.backgroundColor = 'hsl(var(--accent))';
          el.innerHTML = '💧';
        } else {
          el.style.backgroundColor = 'hsl(var(--primary))';
          el.innerHTML = '📊';
        }

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; color: hsl(var(--foreground));">${station.name}</h3>
            <p style="color: hsl(var(--primary)); font-size: 12px; margin-bottom: 4px;"><strong>Type:</strong> ${station.type}</p>
            <p style="color: hsl(var(--muted-foreground)); font-size: 12px;">${station.description}</p>
          </div>`
        );

        new mapboxgl.Marker(el)
          .setLngLat(station.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenSet) {
    return (
      <Card className="p-8 shadow-card">
        <div className="max-w-md mx-auto text-center space-y-4">
          <MapPin className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Interactive Catchment Map</h3>
          <p className="text-muted-foreground text-sm">
            To view the Giralang catchment location and monitoring stations, please enter your Mapbox access token.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-3">
            <Input
              type="text"
              placeholder="Enter Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="text-center"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Load Map
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            Get your free token at{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Giralang Catchment Location
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Belconnen District, Canberra, ACT, Australia
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              Urban: 62.9 ha (526 allotments)
            </Badge>
            <Badge variant="outline" className="text-xs">
              Rural: 19.6 ha
            </Badge>
          </div>
        </div>

        <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" />

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="h-4 w-4 text-accent" />
              <h4 className="font-semibold text-sm">Rainfall Monitoring</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• HS tipping bucket raingauges (0.2mm resolution)</li>
              <li>• 30-second to 5-minute intervals</li>
              <li>• Spatial distribution across catchment</li>
            </ul>
          </Card>
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">Micro-Catchments</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• 12 roof allotments (300mm pipe)</li>
              <li>• 14 lot mixed (450mm pipe)</li>
              <li>• Paired nested monitoring</li>
            </ul>
          </Card>
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">Catchment Scale</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Total outlet (1800mm pipe)</li>
              <li>• Rural/urban interface (900mm)</li>
              <li>• Continuous monitoring since 1976</li>
            </ul>
          </Card>
        </div>
      </Card>

      <Card className="p-4 shadow-card bg-muted/30">
        <h4 className="font-semibold text-sm mb-2">Legend & Research Details</h4>
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(var(--accent))' }}>💧</div>
              <span>Rain Gauge Stations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }}>📊</div>
              <span>Flow Monitoring Stations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5" style={{ backgroundColor: 'hsl(var(--primary))', opacity: 0.6 }}></div>
              <span>Urban Catchment (62.9 ha)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5" style={{ backgroundColor: 'hsl(var(--accent))', opacity: 0.6 }}></div>
              <span>Rural Catchment (19.6 ha)</span>
            </div>
          </div>
          <div className="text-muted-foreground space-y-1">
            <p><strong>Location:</strong> Giralang, Belconnen District</p>
            <p><strong>Monitoring Period:</strong> 1993-1996 (3 years)</p>
            <p><strong>Streets:</strong> Chuculba Crescent, Gundulu Place, Spica Street</p>
            <p><strong>Outlet:</strong> Ginninderra Creek & Lake</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
