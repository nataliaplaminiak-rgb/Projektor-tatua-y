
import React, { useEffect } from 'react';
import { TattooStyle, ColorScheme, GenerationRequest, BodyPlacement } from '../types';
import { Wand2, Loader2, Sparkles } from 'lucide-react';

interface ControlsProps {
  isLoading: boolean;
  onGenerate: (request: GenerationRequest) => void;
  selectedStyle?: TattooStyle;
}

const Controls: React.FC<ControlsProps> = ({ isLoading, onGenerate, selectedStyle }) => {
  const [subject, setSubject] = React.useState('');
  const [style, setStyle] = React.useState<TattooStyle>(TattooStyle.BLACKWORK);
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(ColorScheme.BLACK_AND_GREY);
  const [placement, setPlacement] = React.useState<BodyPlacement>(BodyPlacement.FOREARM);
  const [placementDetail, setPlacementDetail] = React.useState('');
  const [size, setSize] = React.useState('');
  const [details, setDetails] = React.useState('');

  useEffect(() => {
    if (selectedStyle) {
      setStyle(selectedStyle);
    }
  }, [selectedStyle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    onGenerate({
      subject,
      style,
      colorScheme,
      placement,
      placementDetail,
      size: size || '15 cm', // Default fallback
      additionalDetails: details
    });
  };

  return (
    <div className="bg-ink-800 p-6 rounded-2xl shadow-xl border border-ink-700">
      <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-gold-500" />
        Kreator Projektu
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Temat */}
        <div>
          <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
            Pomysł na tatuaż / Temat
          </label>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="np. Wilk wyjący do księżyca, geometryczny kompas, róża wiatru..."
            className="w-full bg-ink-900 border border-ink-700 rounded-lg p-3 text-white placeholder-ink-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all resize-none h-20"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Styl */}
          <div>
            <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
              Styl artystyczny
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as TattooStyle)}
              className="w-full bg-ink-900 border border-ink-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
            >
              {Object.values(TattooStyle).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Kolorystyka */}
          <div>
            <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
              Paleta kolorów
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
              className="w-full bg-ink-900 border border-ink-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
            >
              {Object.values(ColorScheme).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wielkość */}
          <div>
            <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
              Planowana Wielkość
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="np. 15 cm, 10x5 cm"
              className="w-full bg-ink-900 border border-ink-700 rounded-lg p-3 text-white placeholder-ink-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
            />
          </div>
          
           {/* Miejsce na ciele - Ogólne */}
           <div>
            <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
              Część ciała
            </label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as BodyPlacement)}
              className="w-full bg-ink-900 border border-ink-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
            >
              {Object.values(BodyPlacement).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dokładne umiejscowienie */}
        <div>
          <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
            Dokładny opis umiejscowienia (Opcjonalne)
          </label>
          <input
            type="text"
            value={placementDetail}
            onChange={(e) => setPlacementDetail(e.target.value)}
            placeholder="np. Na wewnętrznej stronie, owijający się wokół..."
            className="w-full bg-ink-900 border border-ink-700 rounded-lg p-3 text-white placeholder-ink-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
          />
        </div>

           {/* Szczegóły */}
           <div>
            <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-1">
              Dodatkowe szczegóły projektu
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="np. otoczony kwiatami, mroczny klimat..."
              className="w-full bg-ink-900 border border-ink-700 rounded-lg p-3 text-white placeholder-ink-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
            />
          </div>

        <button
          type="submit"
          disabled={isLoading || !subject}
          className={`w-full py-4 px-6 rounded-lg font-bold text-ink-900 uppercase tracking-widest transition-all transform flex items-center justify-center gap-2
            ${isLoading || !subject 
              ? 'bg-ink-500 cursor-not-allowed opacity-50' 
              : 'bg-gold-400 hover:bg-gold-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Projektowanie...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generuj Projekt
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Controls;
