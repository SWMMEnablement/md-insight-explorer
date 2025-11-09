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

  // Monitoring stations in Giralang catchment
  const stations = [
    {
      name: 'Outlet Flow Monitoring Station',
      type: 'Flow Meter',
      coordinates: [149.0833, -35.2167],
      description: 'Main catchment outlet with continuous flow monitoring'
    },
    {
      name: 'Rainfall Station A',
      type: 'Rain Gauge',
      coordinates: [149.0820, -35.2160],
      description: 'Upstream rainfall monitoring (5-minute intervals)'
    },
    {
      name: 'Rainfall Station B',
      type: 'Rain Gauge',
      coordinates: [149.0845, -35.2172],
      description: 'Downstream rainfall monitoring (5-minute intervals)'
    },
    {
      name: 'Roof Runoff Station R1',
      type: 'Flow Meter',
      coordinates: [149.0828, -35.2155],
      description: 'Individual allotment roof runoff measurement'
    },
    {
      name: 'Roof Runoff Station R2',
      type: 'Flow Meter',
      coordinates: [149.0838, -35.2165],
      description: 'Individual allotment roof runoff measurement'
    },
    {
      name: 'Surface Flow Station S1',
      type: 'Flow Meter',
      coordinates: [149.0825, -35.2170],
      description: 'Paired surface runoff monitoring'
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
      // Add catchment boundary (approximate polygon)
      map.current?.addSource('catchment', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [149.0810, -35.2150],
              [149.0860, -35.2150],
              [149.0860, -35.2185],
              [149.0810, -35.2185],
              [149.0810, -35.2150]
            ]]
          }
        }
      });

      map.current?.addLayer({
        id: 'catchment-fill',
        type: 'fill',
        source: 'catchment',
        paint: {
          'fill-color': 'hsl(var(--primary))',
          'fill-opacity': 0.2
        }
      });

      map.current?.addLayer({
        id: 'catchment-outline',
        type: 'line',
        source: 'catchment',
        paint: {
          'line-color': 'hsl(var(--primary))',
          'line-width': 3,
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
          <Badge variant="secondary" className="text-xs">
            Area: 62.9 ha
          </Badge>
        </div>

        <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" />

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="h-4 w-4 text-accent" />
              <h4 className="font-semibold text-sm">Rain Gauges</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• 5-minute rainfall intensity recording</li>
              <li>• Spatial distribution analysis</li>
              <li>• Total depth and peak intensity measurement</li>
            </ul>
          </Card>
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">Flow Monitoring</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Continuous flow hydrographs</li>
              <li>• Individual allotment measurements</li>
              <li>• Paired roof and surface runoff data</li>
            </ul>
          </Card>
        </div>
      </Card>

      <Card className="p-4 shadow-card bg-muted/30">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
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
            <span>Catchment Boundary</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
