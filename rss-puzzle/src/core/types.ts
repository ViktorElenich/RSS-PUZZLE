export type Child = Node | string | number | false | undefined;
export type Dataset = Record<string, string>;
export type AttributeValue = string | number | boolean;
export type Attributes = Record<string, AttributeValue>;
export type EventTuple = 
  readonly [type: keyof HTMLElementEventMap, handler: (event: Event) => void];
  
export type CreateElementOptions<T extends HTMLElement> = {
  props?: Partial<T>;
  className?: string;
  classes?: string[];
  style?: Partial<CSSStyleDeclaration>;
  dataset?: Dataset;
  attrs?: Attributes;
  on?: readonly EventTuple[];
  text?: string;
}

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type UserData = {
  firstName: string;
  surname: string;
};

export type WordData = {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
};

export type LevelData = {
  id: string;
  name: string;
  imageSrc: string;
  cutSrc: string;
  author: string;
  year: string;
};

export type Round = {
  levelData: LevelData;
  words: WordData[];
};

export type LevelCollection = {
  rounds: Round[];
};

export type ShuffledWord = {
  word: string;
  originalIndex: number;
  isFirst: boolean;
  isLast: boolean;
  width: string;
  drawWidth: number;
  bgX: number;
  bgY: number;
};

export type DragManagerOptions = {
  puzzleArea: HTMLElement;
  sourceArea: HTMLElement;
  getCurrentRow: () => HTMLElement | undefined;
  onUpdate: () => void;
  onValidationClear: () => void;
};

export type AppSettings = {
  audio?: boolean;
  translation?: boolean;
  picture?: boolean;
};