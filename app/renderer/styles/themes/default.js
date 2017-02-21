import Color from 'color';

const unitSize = '20px';
const subunitSize = '5px';

//Typo
const fontName = '"Segoe UI", "Open Sans", sans-serif, serif';
const fontNameLight = '"Segoe UI Light", "Open Sans Light", sans-serif, serif';
const fontNameBold = '"Segoe UI Bold", "Open Sans Bold", sans-serif, serif';

const baseFontSize = '.875rem';
const secondTextFontSize = '.75rem';
const smallTextFontSize = '.625rem';
const accentTextFontSize = '1.1rem';

// Grid
const gridColumns = 12;
const gridMargin = '2.12765%';
const gridMarginCondensed = 0;

// Z-index
const zindexDropdown = 1000;
const zindexPopover = 1010;
const zindexTooltip = 1030;
const zindexFixedNavbar = 1030;
const zindexModalBackdrop = 1040;
const zindexModal = 1050;
const zindexCharms = 1060;
const zindexFullScreen = 2147483646;
const zindexVideoControls = 2147483647;

// Colors
const transparent = 'transparent';
const black = '#000000';
const white = '#ffffff';
const lime = '#a4c400';
const green = '#60a917';
const emerald = '#008a00';
const blue = '#00AFF0';
const teal = '#00aba9';
const cyan = '#1ba1e2';
const cobalt = '#0050ef';
const indigo = '#6a00ff';
const violet = '#aa00ff';
const pink = '#dc4fad';
const magenta = '#d80073';
const crimson = '#a20025';
const red = '#ce352c';
const orange = '#fa6800';
const amber = '#f0a30a';
const yellow = '#e3c800';
const brown = '#825a2c';
const olive = '#6d8764';
const steel = '#647687';
const mauve = '#76608a';
const taupe = '#87794e';
const dark = '#1d1d1d';
const darkBrown = '#63362f';
const darkCrimson = '#640024';
const darkMagenta = '#81003c';
const darkIndigo = '#4B0096';
const darkCyan = '#1b6eae';
const darkCobalt = '#00356a';
const darkTeal = '#004050';
const darkEmerald = '#003e00';
const darkGreen = '#128023';
const darkOrange = '#bf5a15';
const darkRed = '#9a1616';
const darkPink = '#9a165a';
const darkViolet = '#57169a';
const darkBlue = '#16499a';
const lightBlue = '#4390df';
const lighterBlue = '#00ccff';
const lightTeal = Color(teal).lighten(.3).string();
const lightOlive = '#78aa1c';
const lightOrange = Color(orange).lighten(.3).string();
const lightPink = '#f472d0';
const lightRed = Color(red).lighten(.1).string();
const lightGreen = Color(green).lighten(.1).string();
const lightCyan = '#59cde2';
const grayed = '#585858';
const grayDarker = '#222222';
const darker = '#222222';
const grayDark = '#333333';
const gray = '#555555';
const grayLight = '#999999';
const grayLighter = '#eeeeee';
const darkGray = '#333333';
const darkerGray = '#222222';
const lightGray = '#999999';
const lighterGray = '#eeeeee';

//Navbar colors
const navbarBackground = grayLighter;
const navbarElementColor = dark;

//Menu colors
const menuItemHoverBackground = '#edf4fc';
const menuItemHoverBorder = '#a8d2fd';
const menuItemTitleBackground = '#f6f7f8';
const menuBorder = '#dcddde';
const menuShadow = '#ececec';
const menuShadowA = 'rgba(236, 236, 236, .7)';

// Additional colors
const textColor = '#262626';
const textColor2 = '#52677a';
const subColor = '#999999';
const linkColor = '#2086bf';
const linkVisitedColor = '#2086bf';
const disabledColor = '#CACACA';
const borderColor = '#bcd9e2';
const borderColorButton = '#d9d9d9';
const hintColor = '#FFFCC0';

const bodyBGColor = '#E5E5E5';
const defaultBGColor = '#FFFFFF';
const secondBGColor = '#F5F5F5';
const thirdBGColor = '#e8f1f4';

const winBorderSize = '.5rem';
const winBorderColor = '#6badf6';
const winBorderColorInactive = '#ebebeb';
const winDialogContentBackground = '#ededed';
const winFlatBackgroundColor = '#ffffff';
const winFlatBorderColor = '#e9e9e9';
const winFlatSystemButtonHoverBackground = '#cde6f7';
const winFlatSystemButtonActiveBackground = '#92c0e0';
const winFlatSystemButtonActiveColor = '#2a8dd4';
const winFlatSystemButtonRestColor = '#777777';
const winCloseButtonColor = '#c75050';
const winCloseButtonActiveColor = '#e04343';
const winCloseButtonInActiveColor = '#bcbcbc';

const sidebarBackground = '#71b1d1';
const sidebarBackgroundActive = white;
const sidebarColor = '#323232';

//Inputs
const inputHoverState = '#919191';
const inputRestState = '#d9d9d9';
const inputDisabledState = '#8a8a8a';
const inputDisabledBgState = '#E6E6E6';
const inputFocusState = '#919191';
const inputActiveState = '#1e1e1e';
const placeHolderText = grayLight;

const borderRadius = '.3125rem';

const symbolWarning = '"\\26A0"';
const symbolNoEntry = '"\\26D4"';
const symbolInfo = '"\\24D8"';
const symbolQuestion = '"\\2753"';

const preloaderRingTime = '4000ms';
const preloaderRingSize = '32px';
const preloaderColor = white;
const preloaderColorDark = gray;
const preloaderRingRotate = '-14deg';
const preloaderRingTimeMute = '30';

const tileMargin = '5px';
const tileSize = '150px';
const tileHalfSize = '70px';
const tileMedium = '310px';
const tileBig = '470px';
const tileLarge = '630px';
const tileOutlineSize = '3px';
const tileGroupMargin = '80px';

const tileMDFactor = '1.25';

const appBarBackground = '#0072C6';
const appBarBackgroundActive = '#005696';
const appBarDividerColor = '#4C9CD7';

const appBarBackgroundDarcula = '#3C3F41';
const appBarBackgroundActiveDarcula = dark;
const appBarDividerColorDarcula = '#616162';

const fmElementHoverBackground = '#cde6f7';
const fmTabActiveColor = '#0072c6';
const fmTabRestColor = '#444444';
const fmTabBackground = '#ffffff';
const fmPanelBackground = '#ffffff';
const fmPanelCaptionRestColor = '#666666';
const fmBorderColor = '#d4d4d4';

export default {
  unitSize,
  subunitSize,

  //Typo
  fontName,
  fontNameLight,
  fontNameBold,

  baseFontSize,
  secondTextFontSize,
  smallTextFontSize,
  accentTextFontSize,

  // Grid
  gridColumns,
  gridMargin,
  gridMarginCondensed,

  // Z-index
  zindexDropdown,
  zindexPopover,
  zindexTooltip,
  zindexFixedNavbar,
  zindexModalBackdrop,
  zindexModal,
  zindexCharms,
  zindexFullScreen,
  zindexVideoControls,

  // Colors
  transparent,
  black,
  white,
  lime,
  green,
  emerald,
  blue,
  teal,
  cyan,
  cobalt,
  indigo,
  violet,
  pink,
  magenta,
  crimson,
  red,
  orange,
  amber,
  yellow,
  brown,
  olive,
  steel,
  mauve,
  taupe,
  dark,
  darkBrown,
  darkCrimson,
  darkMagenta,
  darkIndigo,
  darkCyan,
  darkCobalt,
  darkTeal,
  darkEmerald,
  darkGreen,
  darkOrange,
  darkRed,
  darkPink,
  darkViolet,
  darkBlue,
  lightBlue,
  lighterBlue,
  lightTeal,
  lightOlive,
  lightOrange,
  lightPink,
  lightRed,
  lightGreen,
  lightCyan,
  grayed,
  grayDarker,
  darker,
  grayDark,
  gray,
  grayLight,
  grayLighter,
  darkGray,
  darkerGray,
  lightGray,
  lighterGray,

  //Navbar colors
  navbarBackground,
  navbarElementColor,

  //Menu colors
  menuItemHoverBackground,
  menuItemHoverBorder,
  menuItemTitleBackground,
  menuBorder,
  menuShadow,
  menuShadowA,

  // Additional colors
  textColor,
  textColor2,
  subColor,
  linkColor,
  linkVisitedColor,
  disabledColor,
  borderColor,
  borderColorButton,
  hintColor,

  bodyBGColor,
  defaultBGColor,
  secondBGColor,
  thirdBGColor,

  winBorderSize,
  winBorderColor,
  winBorderColorInactive,
  winDialogContentBackground,
  winFlatBackgroundColor,
  winFlatBorderColor,
  winFlatSystemButtonHoverBackground,
  winFlatSystemButtonActiveBackground,
  winFlatSystemButtonActiveColor,
  winFlatSystemButtonRestColor,
  winCloseButtonColor,
  winCloseButtonActiveColor,
  winCloseButtonInActiveColor,

  sidebarBackground,
  sidebarBackgroundActive,
  sidebarColor,

  //Inputs
  inputHoverState,
  inputRestState,
  inputDisabledState,
  inputDisabledBgState,
  inputFocusState,
  inputActiveState,
  placeHolderText,

  borderRadius,

  symbolWarning,
  symbolNoEntry,
  symbolInfo,
  symbolQuestion,

  preloaderRingTime,
  preloaderRingSize,
  preloaderColor,
  preloaderColorDark,
  preloaderRingRotate,
  preloaderRingTimeMute,

  tileMargin,
  tileSize,
  tileHalfSize,
  tileMedium,
  tileBig,
  tileLarge,
  tileOutlineSize,
  tileGroupMargin,

  tileMDFactor,

  appBarBackground,
  appBarBackgroundActive,
  appBarDividerColor,

  appBarBackgroundDarcula,
  appBarBackgroundActiveDarcula,
  appBarDividerColorDarcula,

  fmElementHoverBackground,
  fmTabActiveColor,
  fmTabRestColor,
  fmTabBackground,
  fmPanelBackground,
  fmPanelCaptionRestColor,
  fmBorderColor,
};
