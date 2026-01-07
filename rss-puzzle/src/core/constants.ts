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