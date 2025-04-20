import React, { useState, useRef } from 'react';
import { SketchPicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

const tops = [
  { id: 'shirt', name: 'T-Shirt', src: '/shirt.png', layer: 1 },
  { id: 'sweater', name: 'Sweater', src: '/sweater.png', layer: 2 },
  { id: 'dress', name: 'Dress', src: '/dress.png', layer: 3 },
];

const bottoms = [
  { id: 'jeans', name: 'Jeans', src: '/jeans.png', layer: 1 },
];

const fabricPatterns = [
  { name: 'None', url: '' },
  { name: 'Cheetah', url: '/cheetah.png' },
  { name: 'Jean', url: '/jean material.avif' },
];

export default function DressUpGame() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [colors, setColors] = useState({});
  const [patterns, setPatterns] = useState({});
  const [positions, setPositions] = useState({});
  const canvasRef = useRef(null);

  const handleColorChange = (color) => {
    if (!selectedItem) return;
    setColors({ ...colors, [selectedItem]: color.hex });
  };

  const handlePatternSelect = (patternUrl) => {
    if (!selectedItem) return;
    setPatterns({ ...patterns, [selectedItem]: patternUrl });
  };

  const handleDragStop = (e, data, id) => {
    setPositions({ ...positions, [id]: { x: data.x, y: data.y } });
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    const newPositions = { ...positions };
    delete newPositions[selectedItem];
    setPositions(newPositions);
    setSelectedItem(null);
  };

  const handleReset = () => {
    setPositions({});
    setColors({});
    setPatterns({});
    setSelectedItem(null);
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current);
    const dataUrl = canvas.toDataURL();
    const savedGallery = JSON.parse(localStorage.getItem('modisteGallery') || '[]');
    savedGallery.push({ image: dataUrl, timestamp: Date.now() });
    localStorage.setItem('modisteGallery', JSON.stringify(savedGallery));
    alert('Outfit saved to your gallery!');
  };

  const allItems = [...tops, ...bottoms];
  const layeredItems = allItems
    .filter(item => positions[item.id])
    .sort((a, b) => (a.layer || 0) - (b.layer || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
        <div className="text-2xl font-bold tracking-wide text-orange-600">✨ The Modiste ✨</div>
        <nav className="flex gap-4">
          <Button variant="ghost">Home</Button>
          <Button className="bg-yellow-400 text-white hover:bg-yellow-500">Design Outfit</Button>
          <Button variant="ghost">My Gallery</Button>
          <Button variant="ghost">My Alerts</Button>
          <Button className="bg-yellow-400 text-white hover:bg-yellow-500">Login</Button>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-24 bg-orange-100 flex flex-col items-center py-4 space-y-4">
          {["Tops", "Bott", "Dres", "Shoe", "Acce", "Hairs"].map((label, i) => (
            <Button key={i} variant="ghost" className="w-16 h-16 bg-white rounded-full shadow">
              <img src="/placeholder.png" alt={label} className="w-full h-full object-contain" />
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </aside>

        {/* Main Design Area */}
        <main className="flex-1 px-6 py-4 flex flex-col items-center">
          <div ref={canvasRef} className="relative w-[350px] h-[650px] border-[6px] border-yellow-400 rounded-lg bg-white flex items-center justify-center shadow-md">
            <img src="/Avatar Base.png" alt="Avatar" className="absolute w-full h-full object-cover z-0" />

            {layeredItems.map(item => (
              <Draggable
                key={item.id}
                position={positions[item.id]}
                onStop={(e, data) => handleDragStop(e, data, item.id)}
              >
                <motion.img
                  src={item.src}
                  alt={item.name}
                  className="absolute max-w-[200px] cursor-move"
                  style={{
                    zIndex: item.layer || 0,
                    filter: `drop-shadow(0 0 0 ${colors[item.id] || 'transparent'})`,
                    backgroundImage: patterns[item.id] ? `url(${patterns[item.id]})` : 'none',
                    backgroundBlendMode: 'overlay',
                    backgroundSize: 'cover',
                  }}
                  onClick={() => setSelectedItem(item.id)}
                  animate={{ opacity: 1 }}
                />
              </Draggable>
            ))}
          </div>

          <div className="flex gap-6 mt-6">
            <Button onClick={handleSave} className="bg-yellow-400 text-white px-6 py-2 rounded-full shadow-md hover:bg-yellow-500">
              SAVE DESIGN
            </Button>
            <Button onClick={() => alert('Search logic here')} className="bg-yellow-400 text-white px-6 py-2 rounded-full shadow-md hover:bg-yellow-500">
              FIND MATCHES
            </Button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-white border-l p-4">
          <h3 className="text-xl font-bold text-purple-900 border-b pb-2 mb-4">Bottoms</h3>
          {bottoms.map(item => (
            <div key={item.id} className="border rounded-lg p-2 mb-2 shadow-sm cursor-pointer" onClick={() => setPositions({ ...positions, [item.id]: { x: 50, y: 200 } })}>
              <img src={item.src} alt={item.name} className="w-20 h-20 object-contain mx-auto" />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
