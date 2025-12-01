
import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Trash2, Eye } from 'lucide-react';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
  onSelect: (image: GeneratedImage) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onDelete, onSelect }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto">
      <h3 className="text-2xl font-serif text-white mb-6 border-b border-ink-700 pb-2">Twoje Portfolio</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-white p-2 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer" onClick={() => onSelect(img)}>
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Mini Mockup Preview on Hover */}
              <div className="absolute top-2 right-2 w-16 h-16 rounded border-2 border-white shadow-md overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                 <img src={img.mockupUrl} className="w-full h-full object-cover" alt="Mockup preview" />
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                 <button 
                   onClick={(e) => { e.stopPropagation(); onSelect(img); }}
                   className="p-3 bg-white text-ink-900 rounded-full hover:bg-gold-400 transition-colors"
                   title="Zobacz szczegóły"
                 >
                   <Eye className="w-5 h-5" />
                 </button>
                 <a 
                  href={img.url} 
                  download={`inkspire-${img.id}.png`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-white text-ink-900 rounded-full hover:bg-gold-400 transition-colors"
                  title="Pobierz projekt"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}
                  className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Usuń"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-3 px-1">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs text-ink-500 font-bold uppercase tracking-wider">{img.style}</p>
                   <p className="text-sm text-ink-900 font-medium line-clamp-1" title={img.prompt}>{img.prompt}</p>
                </div>
                <span className="text-[10px] text-ink-400">
                  {new Date(img.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
