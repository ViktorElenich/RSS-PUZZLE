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