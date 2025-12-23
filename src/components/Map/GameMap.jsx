import React, { useEffect, useRef, useState, memo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCoords } from '../../utils';

const GameMap = memo(({ activities, activeIndex, isToday, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [userPos, setUserPos] = useState(null);

  // 史萊姆 SVG (玩家位置)
  const heroSprite = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%233b82f6' d='M8 16h16v8H8z'/%3E%3Cpath fill='%233b82f6' d='M10 10h12v6H10z'/%3E%3Cpath fill='%233b82f6' d='M6 20h2v4h2v2h12v-2h2v-4h2v-6h-2v-4h-2v-2h-8v2h-2v4H6v6z'/%3E%3Cpath fill='%23000' d='M12 16h2v2h-2zM20 16h-2v2h2z'/%3E%3C/svg%3E";

  const mapStyles = `
    .leaflet-div-icon {
      background: transparent !important;
      border: none !important;
      overflow: visible !important; 
    }
    
    /* 玩家 (史萊姆) 樣式 */
    .hero-wrapper {
      position: relative; margin-top: -40px; margin-left: -16px; width: 32px; height: 32px;
    }
    .hero-body {
      width: 100%; height: 100%; background-image: url("${heroSprite}");
      background-repeat: no-repeat; image-rendering: pixelated;
      animation: bounce 1.2s infinite ease-in-out; filter: drop-shadow(0px 0px 1px white); 
    }
    .hero-shadow {
      position: absolute; bottom: -10px; left: 4px; width: 24px; height: 6px;
      background: black; border-radius: 50%; animation: shadow-scale 1.2s infinite ease-in-out;
    }

    /* 🔴 紅色精緻大頭針樣式 */
    .pin-wrapper {
      position: relative;
      width: 30px; height: 40px;
      margin-top: -40px; margin-left: -15px; /* 校正中心點：讓針尖對準座標 */
      transition: all 0.2s ease-out;
    }
    .pin-wrapper:hover {
      transform: scale(1.2) translateY(-5px);
      z-index: 999;
    }
    /* 針頭 (紅色水滴) */
    .pin-head {
      width: 30px; height: 30px;
      background: #ef4444; /* red-500 */
      border: 2px solid #7f1d1d; /* red-900 */
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    }
    /* 數字 (轉回來) */
    .pin-number {
      transform: rotate(45deg);
      color: white; font-weight: 900; font-family: monospace; font-size: 14px;
      text-shadow: 0 1px 0 rgba(0,0,0,0.5);
    }
    /* 針尖陰影 */
    .pin-shadow {
      position: absolute; bottom: -5px; left: 8px;
      width: 14px; height: 4px; background: rgba(0,0,0,0.3);
      border-radius: 50%; z-index: -1;
    }

    /* 動畫定義 */
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes shadow-scale { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(0.8); opacity: 0.1; } }
  `;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView(
      [34.6937, 135.5023],
      13
    );
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '© OpenStreetMap, © CartoDB',
      }
    ).addTo(map);
    mapInstanceRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log(err),
        { enableHighAccuracy: true }
      );
    } else {
      setUserPos([34.6937, 135.5023]);
    }

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userPos) return;
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
    const icon = L.divIcon({
      className: 'rpg-hero-icon',
      html: `<div class="hero-wrapper"><div class="hero-shadow"></div><div class="hero-body"></div></div>`,
    });
    userMarkerRef.current = L.marker(userPos, {
      icon,
      zIndexOffset: 9999,
    }).addTo(map);
  }, [userPos]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // 🟢 繪製帶數字的紅色大頭針
    activities.forEach((act, index) => {
      const coords = getCoords(act.location);
      if (coords) {
        // HTML 結構：Pin Head (包含數字) + Pin Shadow
        const html = `
           <div class="pin-wrapper">
             <div class="pin-head">
               <span class="pin-number">${index + 1}</span>
             </div>
             <div class="pin-shadow"></div>
           </div>
         `;
        const icon = L.divIcon({ className: 'custom-pin-icon', html: html });
        const m = L.marker(coords, { icon }).addTo(map);

        m.on('click', () => onMarkerClick(act.id));
        markersRef.current.push(m);
      }
    });

    // 🟢 自動連線 (Polyline)：讓使用者看到路徑
    // 過濾出有座標的點
    const routePoints = activities
      .map((a) => getCoords(a.location))
      .filter((c) => c !== null);

    if (routePoints.length > 1) {
      // 繪製虛線路徑
      const polyline = L.polyline(routePoints, {
        color: '#8b4513', // 深咖啡色
        weight: 3,
        opacity: 0.6,
        dashArray: '5, 10', // 虛線效果
        lineCap: 'round',
      }).addTo(map);
      markersRef.current.push(polyline); // 加入 ref 以便下次清除
    }
  }, [activities, isToday, onMarkerClick]);

  useEffect(() => {
    window.flyToUser = () => {
      if (mapInstanceRef.current && userPos)
        mapInstanceRef.current.flyTo(userPos, 16);
    };
  }, [userPos]);

  return (
    <div className="relative w-full h-full">
      <style>{mapStyles}</style>
      <div ref={mapRef} className="w-full h-full z-0" />
    </div>
  );
});

export default GameMap;
