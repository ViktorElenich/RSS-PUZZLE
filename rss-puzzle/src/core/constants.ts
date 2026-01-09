export const PageIds = {
  LoginPage: 'login-page',
  StartPage: 'start-page',
  MainPage: 'main-page',
  StatisticsPage: 'statistics-page',
} as const;

export const LoginConstants = {
  FirstNameInputId: 'first-name',
  SurnameInputId: 'surname',
  FirstNameLabelText: 'First Name',
  SurnameLabelText: 'Surname',
  ButtonText: 'Login',
  FormTitle: 'RSS Puzzle',
  Description: 'Enter your details to start the game',
} as const;

export const ValidationConstants = {
  MinFirstNameLength: 3,
  MinSurnameLength: 4,
} as const;

export const USER_DATA_KEY = 'rss-puzzle-user';

export const HeaderConstants = {
  ButtonText: 'Logout',
} as const;

export const StartPageConstants = {
  Title: 'RSS Puzzle',
  Description: 'Boost your English skills by assembling sentences from jumbled words. Enjoy a unique puzzle-like experience with artwork from famous masters.',
  ButtonText: 'Start Game',
} as const;

export const MainPageConstants = {
  Title: 'RSS Puzzle',
  LevelLabel: 'Level',
  RoundLabel: 'Round',
  PuzzleAreaId: 'puzzle-area',
  SourceAreaId: 'source-area',
  ButtonCheck: 'Check',
  ButtonGiveUp: 'I don\'t know',
  ButtonContinue: 'Continue',
  ButtonResults: 'Results',
  ClassHidden: 'hidden',
  ClassSuccess: 'success',
  ClassError: 'error',
  ClassDragging: 'dragging',
  ClassClone: 'dragging-clone',
  WordPieceClass: 'word-piece',
  HintTranslationClass: 'hint-translation',
  HintButtonClass: 'hint-btn',
  HintButtonActive: 'active',
  DragZIndex: '1000',
  DragOpacity: '0.9',
  DragThresholdPx: 5,
  WordWidthMultiplier: 10,
  WordWidthBase: 20,
  IconShowTranslation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  IconHideTranslation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>',
} as const;

export const GameConstants = {
  TotalSentences: 10,
  PercentageBase: 100,
  Divider: 2,
} as const;