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
} as const;

export const GameConstants = {
  TotalSentences: 10,
  PercentageBase: 100,
} as const;