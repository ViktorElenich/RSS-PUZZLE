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
  PuzzleRowHeightPx: 45,
  PuzzleWidthPx: 1000,
  AudioBaseUrl: 'assets/audio/',
  ImagesBaseUrl: 'assets/images/',
  IconShowTranslation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  IconHideTranslation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>',
  IconSpeaker: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
  IconPicture: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
  IconHome: `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>`,
} as const;

export const GameConstants = {
  TotalSentences: 10,
  PercentageBase: 100,
  Divider: 2,
  TotalLevels: 6,
} as const;

export const PuzzleRenderConstants = {
  TabSize: 10,
  CurveOffset: 5,
  StrokeWidth: 1,
  ShadowBlur: 3,
  TextStrokeWidth: 3,
  TabHeightDivider: 3,
  OverlayOpacity: 0.2,
  StartPoint: 0,
  StrokeColor: 'rgba(255, 255, 255, 0.5)',
  ShadowColor: 'black',
  TextColor: 'white',
  Font: 'bold 16px "Segoe UI", sans-serif',
  OverlayStyle: 'rgba(0, 0, 0, 0.2)',
  TextBaseline: 'middle',
  TextAlign: 'center',
  PlaceholderColor: '#b7c2ce',
} as const;