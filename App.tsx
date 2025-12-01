
import React, { useState, useEffect } from 'react';
import { Palette, Info, AlertCircle, BookOpen, Layers, Image as ImageIcon, Loader2, RefreshCw, Wand2, Lock } from 'lucide-react';
import Controls from './components/Controls';
import Gallery from './components/Gallery';
import StyleLibrary from './components/StyleLibrary';
import { generateDesignOnly, generateMockup } from './services/geminiService';
import { GeneratedImage, GenerationRequest, TattooStyle, BodyPlacement, ColorScheme } from './types';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [mockupLoading, setMockupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(null);
  
  // Tab state for switching between Design and Mockup
  const [viewMode, setViewMode] = useState<'design' | 'mockup'>('design');

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedLibraryStyle, setSelectedLibraryStyle] = useState<TattooStyle | undefined>(undefined);

  // States for Mockup Regeneration/Creation
  const [regenPlacement, setRegenPlacement] = useState<BodyPlacement>(BodyPlacement.FOREARM);
  const [regenDetail, setRegenDetail] = useState('');
  const [regenSize, setRegenSize] = useState<string>('');

  useEffect(() => {
    if (activeImage) {
        setRegenPlacement((activeImage.placement as BodyPlacement) || BodyPlacement.FOREARM);
        setRegenDetail(activeImage.placementDetail || '');
        setRegenSize(activeImage.size || '');
    }
  }, [activeImage]);

  // Step 1: Generate Design Only
  const handleGenerate = async (request: GenerationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const designUrl = await generateDesignOnly(request);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: designUrl,
        // mockupUrl is initially undefined
        prompt: request.subject,
        style: request.style,
        colorScheme: request.colorScheme,
        placement: request.placement,
        placementDetail: request.placementDetail,
        size: request.size,
        additionalDetails: request.additionalDetails,
        createdAt: Date.now()
      };

      setImages(prev => [newImage, ...prev]);
      setActiveImage(newImage);
      setViewMode('design'); 
    } catch (err: any) {
      setError(err.message || "Nie udało się wygenerować projektu. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  // Logic to regenerate the Design (Step 1 again)
  const handleRegenerateDesign = () => {
    if (!activeImage) return;

    // Use stored parameters from the active image to trigger a new generation
    const request: GenerationRequest = {
        subject: activeImage.prompt,
        style: activeImage.style,
        colorScheme: activeImage.colorScheme || ColorScheme.BLACK_AND_GREY, // Fallback if missing
        placement: activeImage.placement as BodyPlacement,
        placementDetail: activeImage.placementDetail,
        size: activeImage.size || '15 cm',
        additionalDetails: activeImage.additionalDetails
    };

    handleGenerate(request);
  };

  // Step 2: Create Mockup (Visualize)
  const handleCreateOrRegenerateMockup = async () => {
    if (!activeImage) return;
    setMockupLoading(true);
    setError(null);
    
    // Switch to mockup view immediately to show loader
    setViewMode('mockup');

    try {
        const newMockupUrl = await generateMockup(
            activeImage.url, 
            activeImage.style,
            regenPlacement,
            regenDetail,
            regenSize || '15 cm'
        );
        
        // Update active image with new mockup data
        const updatedImage = {
            ...activeImage,
            mockupUrl: newMockupUrl,
            placement: regenPlacement,
            placementDetail: regenDetail,
            size: regenSize
        };

        setActiveImage(updatedImage);
        setImages(prev => prev.map(img => img.id === activeImage.id ? updatedImage : img));

    } catch (err: any) {
        setError("Nie udało się stworzyć wizualizacji. " + err.message);
        setViewMode('design'); // Go back on error
    } finally {
        setMockupLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (activeImage?.id === id) {
      setActiveImage(null);
    }
  };

  const handleSelectImage = (image: GeneratedImage) => {
    setActiveImage(image);
    setViewMode('design');
  };

  useEffect(() => {
    if (!activeImage && images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images, activeImage]);

  const hasMockup = !!activeImage?.mockupUrl;

  return (
    <div className="min-h-screen bg-ink-900 text-ink-100 font-sans selection:bg-gold-500 selection:text-ink-900">
      
      <nav className="border-b border-ink-800 bg-ink-900/95 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gold-400 to-amber-600 rounded-lg">
                <Palette className="w-6 h-6 text-ink-900" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Ink<span className="text-gold-400">Spire</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLibraryOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-ink-800 hover:bg-ink-700 text-gold-400 rounded-full border border-ink-700 transition-colors text-sm font-medium"
              >
                <BookOpen className="w-4 h-4" />
                Biblioteka Stylów
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 lg:sticky lg:top-24 z-30">
            <div className="mb-6">
              <h1 className="text-3xl font-serif text-white mb-2">Zaprojektuj Tatuaż</h1>
              <p className="text-ink-300">Stwórz unikalny wzór, a następnie sprawdź go na ciele.</p>
            </div>
            
            <Controls 
              isLoading={loading} 
              onGenerate={handleGenerate} 
              selectedStyle={selectedLibraryStyle}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-ink-800/50 rounded-lg border border-ink-700/50">
              <div className="flex items-center gap-2 text-gold-400 mb-2">
                <Info className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wide">Proces Tworzenia</span>
              </div>
              <p className="text-xs text-ink-400 leading-relaxed">
                System działa dwuetapowo: <br/>
                1. Najpierw generowany jest <strong>projekt 2D</strong>.<br/>
                2. Jeśli projekt Ci się spodoba, kliknij "Wizualizuj", aby AI nałożyło go na ciało z zachowaniem podanej wielkości.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-ink-800 rounded-2xl shadow-2xl border border-ink-700 overflow-hidden min-h-[500px] flex flex-col relative">
              
              {activeImage && !loading && (
                <div className="flex border-b border-ink-700 bg-ink-900/50">
                  <button 
                    onClick={() => setViewMode('design')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors
                      ${viewMode === 'design' ? 'bg-ink-800 text-gold-400 border-b-2 border-gold-400' : 'text-ink-400 hover:text-white hover:bg-ink-800/50'}`}
                  >
                    <Layers className="w-4 h-4" />
                    Projekt (2D)
                  </button>
                  <button 
                    onClick={() => hasMockup && setViewMode('mockup')}
                    disabled={!hasMockup && !mockupLoading}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors
                      ${viewMode === 'mockup' ? 'bg-ink-800 text-gold-400 border-b-2 border-gold-400' : 'text-ink-400'}
                      ${!hasMockup && !mockupLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-ink-800/50'}`}
                  >
                    {hasMockup || mockupLoading ? <ImageIcon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    Wizualizacja na ciele
                  </button>
                </div>
              )}

              <div className="flex-1 relative bg-black flex items-center justify-center min-h-[450px]">
                {activeImage ? (
                  <div className="w-full h-full relative group flex flex-col items-center justify-center bg-white/5">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none"></div>

                    {loading || mockupLoading ? (
                       <div className="absolute inset-0 bg-ink-900 z-30 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24">
                           <div className="absolute inset-0 border-t-4 border-gold-500 rounded-full animate-spin"></div>
                           <div className="absolute inset-4 border-t-4 border-white rounded-full animate-spin-slow opacity-70"></div>
                        </div>
                        <p className="mt-6 text-gold-400 font-serif tracking-widest animate-pulse text-center">
                          {mockupLoading ? 'Nakładanie tatuażu...' : 'Projektowanie wzoru...'}<br/>
                          <span className="text-xs text-ink-400 normal-case font-sans">
                            {mockupLoading ? 'Dopasowywanie do anatomii' : 'Tworzenie unikalnego projektu 2D'}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col">
                          <div className="flex-1 flex items-center justify-center p-4 bg-ink-900">
                             {/* DISPLAY LOGIC */}
                             {viewMode === 'design' && (
                                <div className="flex flex-col items-center gap-4 max-h-full w-full">
                                    <img 
                                        src={activeImage.url} 
                                        alt="Design" 
                                        className="object-contain max-h-[60vh] rounded-lg shadow-2xl bg-white p-4"
                                    />
                                    
                                    {/* Design Action Buttons */}
                                    {!hasMockup && (
                                      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                        <button 
                                            onClick={handleCreateOrRegenerateMockup}
                                            className="px-6 py-3 bg-gold-400 hover:bg-gold-500 text-ink-900 font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-500/20 transition-all"
                                        >
                                            <Wand2 className="w-5 h-5" />
                                            Zatwierdź i Wizualizuj na ciele
                                        </button>

                                        <button 
                                            onClick={handleRegenerateDesign}
                                            className="px-6 py-3 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-gold-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            Generuj ponownie (Inna wersja)
                                        </button>
                                      </div>
                                    )}
                                </div>
                             )}

                             {viewMode === 'mockup' && hasMockup && (
                                 <img 
                                    src={activeImage.mockupUrl} 
                                    alt="Mockup" 
                                    className="w-full h-full object-contain max-h-[70vh] rounded-lg shadow-2xl"
                                />
                             )}
                          </div>

                          {/* REGENERATE / VISUALIZE PANEL FOR MOCKUP */}
                          {viewMode === 'mockup' && (
                              <div className="w-full p-4 bg-ink-900 border-t border-ink-800 flex flex-col md:flex-row gap-3 items-center justify-center animate-in slide-in-from-bottom-5">
                                  <select 
                                      value={regenPlacement} 
                                      onChange={(e) => setRegenPlacement(e.target.value as BodyPlacement)}
                                      className="bg-ink-800 text-white text-sm rounded border border-ink-700 p-2 outline-none focus:border-gold-500 w-full md:w-auto"
                                  >
                                      {Object.values(BodyPlacement).map(p => <option key={p} value={p}>{p}</option>)}
                                  </select>
                                  
                                  <input 
                                      type="text" 
                                      placeholder="Wymiar (np. 15 cm)" 
                                      value={regenSize}
                                      onChange={(e) => setRegenSize(e.target.value)}
                                      className="bg-ink-800 text-white text-sm rounded border border-ink-700 p-2 outline-none focus:border-gold-500 w-full md:w-24"
                                  />

                                  <input 
                                      type="text" 
                                      placeholder="Szczegóły (np. trochę niżej)" 
                                      value={regenDetail}
                                      onChange={(e) => setRegenDetail(e.target.value)}
                                      className="bg-ink-800 text-white text-sm rounded border border-ink-700 p-2 outline-none focus:border-gold-500 flex-1 w-full md:w-auto"
                                  />

                                  <button 
                                      onClick={handleCreateOrRegenerateMockup}
                                      className="w-full md:w-auto px-4 py-2 bg-gold-400 hover:bg-gold-500 text-ink-900 font-bold rounded flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                                  >
                                      <RefreshCw className="w-4 h-4" />
                                      {hasMockup ? 'Popraw / Zmień miejsce' : 'Wizualizuj'}
                                  </button>
                              </div>
                          )}

                          {viewMode === 'design' && hasMockup && (
                             <div className="w-full p-4 text-center border-t border-ink-800">
                                <p className="text-ink-400 text-xs">Wizualizacja została już wygenerowana. Przejdź do zakładki powyżej, aby ją zobaczyć.</p>
                             </div>
                          )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 max-w-md opacity-50">
                     {loading ? (
                        <div className="flex flex-col items-center">
                           <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                           <p className="text-gold-400">Rozgrzewanie maszyn...</p>
                        </div>
                     ) : (
                       <>
                        <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-ink-600 rounded-full flex items-center justify-center">
                            <Palette className="w-10 h-10 text-ink-600" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Puste Płótno</h3>
                        <p className="text-ink-400">
                          Wypełnij formularz po lewej, aby wygenerować swój pierwszy projekt 2D.
                        </p>
                       </>
                     )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Gallery 
          images={images} 
          onDelete={handleDelete} 
          onSelect={handleSelectImage}
        />
        
        <StyleLibrary 
          isOpen={isLibraryOpen} 
          onClose={() => setIsLibraryOpen(false)}
          onSelectStyle={(style) => setSelectedLibraryStyle(style)}
        />
        
      </main>
    </div>
  );
};

export default App;
