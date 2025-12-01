
import React from 'react';
import { TattooStyle, StyleDefinition } from '../types';
import { X, Check, BookOpen } from 'lucide-react';

interface StyleLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStyle: (style: TattooStyle) => void;
}

const stylesData: StyleDefinition[] = [
  {
    id: TattooStyle.REALISM,
    name: "Realizm / Fotorealizm",
    description: "Sztuka, która wygląda jak zdjęcie. Wymaga wysokiego kontrastu i skomplikowanego cieniowania, aby stworzyć głębię i trójwymiarowość.",
    traits: ["Brak wyraźnych konturów", "Gładkie cieniowanie", "Wysoki kontrast", "Efekt 3D"]
  },
  {
    id: TattooStyle.OLD_SCHOOL,
    name: "Old School (Tradycyjny)",
    description: "Klasyczny styl zachodni. Znany z ikonicznych obrazów (kotwice, róże, orły, jaskółki) i wyjątkowej trwałości.",
    traits: ["Grube, czarne kontury", "Ograniczona paleta barw (czerwony, zielony, żółty)", "Płaski wygląd 2D", "Ikoniczna symbolika"]
  },
  {
    id: TattooStyle.NEO_TRADITIONAL,
    name: "Neo Tradycyjny",
    description: "Ewolucja stylu Old School. Zachowuje pogrubione linie, ale dodaje więcej detali, głębi oraz szerszą, bardziej żywą paletę kolorów.",
    traits: ["Zróżnicowana grubość linii", "Szersza paleta kolorów", "Wpływy Art Nouveau", "Elementy dekoracyjne"]
  },
  {
    id: TattooStyle.WATERCOLOR,
    name: "Akwarela (Watercolor)",
    description: "Naśladuje wygląd malarstwa akwarelowego na płótnie. Często pozbawiony konturów, wykorzystuje plamy koloru, aby uzyskać miękki, artystyczny efekt.",
    traits: ["Brak konturów", "Plamy i zacieki farby", "Miękkie przejścia tonalne", "Pastelowe i żywe kolory"]
  },
  {
    id: TattooStyle.BLACKWORK,
    name: "Blackwork",
    description: "Termin obejmujący tatuaże wykonane wyłącznie czarnym tuszem. Kładzie nacisk na kształt, wzór i negatywną przestrzeń zamiast na cieniowanie.",
    traits: ["Wysoki kontrast", "Solidne wypełnienia czernią", "Wykorzystanie negatywnej przestrzeni", "Odważne wzory"]
  },
  {
    id: TattooStyle.MINIMALIST,
    name: "Minimalizm / Fine Line",
    description: "Skupia się na prostocie. Projekty są zredukowane do najbardziej podstawowych elementów przy użyciu bardzo cienkich, delikatnych linii.",
    traits: ["Linie 'Single Needle'", "Proste kształty", "Mała skala", "Dużo wolnej przestrzeni (oddech)"]
  },
  {
    id: TattooStyle.GEOMETRIC,
    name: "Geometryczny",
    description: "Wykorzystuje geometryczne kształty i linie do tworzenia złożonych, często symetrycznych wzorów. Może być duchowy (święta geometria) lub abstrakcyjny.",
    traits: ["Idealna symetria", "Proste linie", "Figury (koła, trójkąty)", "Matematyczna precyzja"]
  },
  {
    id: TattooStyle.JAPANESE,
    name: "Japoński (Irezumi)",
    description: "Tradycyjny styl sięgający okresu Edo. Podąża za ścisłymi regułami dotyczącymi obrazowania, przepływu (flow) i tła (wiatr, fale).",
    traits: ["Płynna kompozycja dopasowana do ciała", "Mitologiczne bestie (Smoki, Koi)", "Tła (wiatr, woda)", "Odważne kolory"]
  },
  {
    id: TattooStyle.DOTWORK,
    name: "Dotwork",
    description: "Obrazy tworzone w całości lub w większości z pojedynczych kropek. Cieniowanie uzyskuje się poprzez zagęszczenie kropek (stippling).",
    traits: ["Tekstura kropkowania", "Mandale", "Miękkie efekty cieniowania", "Skomplikowane detale"]
  },
  {
    id: TattooStyle.TRASH_POLKA,
    name: "Trash Polka",
    description: "Styl przypominający kolaż, pochodzący z Niemiec. Mieszanka realistycznych obrazów z abstrakcyjnym chaosem. Wyłącznie czerń i czerwień.",
    traits: ["Tylko czerń i czerwień", "Estetyka kolażu", "Rozmazania i chaotyczne linie", "Typografia / Tekst"]
  },
  {
    id: TattooStyle.BIOMECHANICAL,
    name: "Biomechanika",
    description: "Zaprojektowany tak, aby wyglądało to jak rozerwana skóra odsłaniająca robotyczne lub obce mechanizmy pod spodem.",
    traits: ["Efekt rozdartej skóry", "Tryby i tłoki", "Głębia 3D", "Metaliczne tekstury"]
  },
  {
    id: TattooStyle.SKETCH,
    name: "Szkic / Ilustracyjny",
    description: "Naśladuje wygląd surowego szkicu z notatnika artysty. Zawiera linie konstrukcyjne i luźne, artystyczne pociągnięcia.",
    traits: ["Surowe linie ołówka", "Niedokończony wygląd", "Artystyczna swoboda", "Kreskowanie (Hatching)"]
  },
  {
    id: TattooStyle.TRIBAL,
    name: "Tribal",
    description: "Oparty na dziedzictwie rdzennych kultur (Polinezja, Maorysi itp.). Używa grubych, solidnych czarnych linii dopasowanych do anatomii mięśni.",
    traits: ["Solidna czerń", "Płynne krzywe", "Znaczenie kulturowe", "Abstrakcyjne wzory"]
  }
];

const StyleLibrary: React.FC<StyleLibraryProps> = ({ isOpen, onClose, onSelectStyle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-ink-900/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-ink-800 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl border border-ink-700 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-ink-700 flex justify-between items-center bg-ink-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ink-700 rounded-lg">
              <BookOpen className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white">Biblioteka Stylów</h2>
              <p className="text-sm text-ink-400">Encyklopedia Estetyki Tatuażu</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-ink-700 rounded-full transition-colors text-ink-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stylesData.map((style) => (
              <div 
                key={style.id} 
                className="bg-ink-900 rounded-xl p-5 border border-ink-700 hover:border-gold-500/50 transition-all group flex flex-col h-full"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                    {style.name}
                  </h3>
                  <p className="text-sm text-ink-300 leading-relaxed mb-4">
                    {style.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Główne cechy:</p>
                    <ul className="text-sm text-ink-400 space-y-1">
                      {style.traits.map((trait, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50 mt-1.5 shrink-0"></span>
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-ink-800">
                  <button
                    onClick={() => {
                      onSelectStyle(style.id);
                      onClose();
                    }}
                    className="w-full py-2 px-4 bg-ink-800 hover:bg-gold-500 hover:text-ink-900 text-gold-400 rounded-lg border border-gold-500/30 hover:border-transparent transition-all font-medium flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  >
                    <Check className="w-4 h-4" />
                    Wybierz ten styl
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleLibrary;
