
export enum TattooStyle {
  REALISM = 'Realizm',
  OLD_SCHOOL = 'Old School (Tradycyjny)',
  NEO_TRADITIONAL = 'Neo Tradycyjny',
  WATERCOLOR = 'Akwarela (Watercolor)',
  BLACKWORK = 'Blackwork',
  MINIMALIST = 'Minimalizm / Fine Line',
  GEOMETRIC = 'Geometryczny',
  JAPANESE = 'Japoński (Irezumi)',
  DOTWORK = 'Dotwork',
  TRASH_POLKA = 'Trash Polka',
  TRIBAL = 'Tribal',
  BIOMECHANICAL = 'Biomechanika',
  SKETCH = 'Szkic / Ilustracyjny'
}

export enum ColorScheme {
  BLACK_AND_GREY = 'Czerń i szarość',
  FULL_COLOR = 'Pełny kolor',
  RED_AND_BLACK = 'Tylko czerwony i czarny'
}

export enum BodyPlacement {
  FOREARM = 'Przedramię',
  SHOULDER = 'Ramię / Bark',
  CHEST = 'Klatka piersiowa',
  BACK = 'Plecy',
  NECK = 'Szyja / Kark',
  BEHIND_EAR = 'Za uchem',
  THIGH = 'Udo',
  CALF = 'Łydka',
  ANKLE = 'Kostka',
  HAND = 'Dłoń'
}

export interface GeneratedImage {
  id: string;
  url: string;      // 2D Design
  mockupUrl?: string; // 3D Visualization (Optional now)
  prompt: string;
  style: TattooStyle;
  colorScheme?: ColorScheme; // Added for regeneration
  placement: string;
  placementDetail?: string;
  size?: string;
  additionalDetails?: string; // Added for regeneration
  createdAt: number;
}

export interface GenerationRequest {
  subject: string;
  style: TattooStyle;
  colorScheme: ColorScheme;
  placement: BodyPlacement;
  placementDetail?: string;
  size: string;
  additionalDetails?: string;
}

export interface StyleDefinition {
  id: TattooStyle;
  name: string;
  description: string;
  traits: string[];
}
