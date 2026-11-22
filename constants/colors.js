// Warm, calm pug palette: cream backgrounds, fawn/caramel accent, cocoa text,
// sage for success, honey for warnings, soft terracotta for errors.
// Text colors are checked for contrast against their backgrounds (4.5:1 or better,
// except textMuted, which is for hints and inactive icons).
const Colors = {
  bg: '#FBF7F1',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  accent: '#9A5F33',
  accentLight: '#F5E8D8',
  accentMid: '#EBD3B6',
  accentText: '#85512A',

  textPrimary: '#3B2A22',
  textSecondary: '#7A6253',
  textMuted: '#968171',

  border: '#EADFD3',
  borderLight: '#F4EDE4',

  danger: '#C2574B',
  dangerBg: '#FBECE9',
  dangerBorder: '#F0C9C2',
  dangerText: '#A3443A',

  warn: '#D9A441',
  warnBg: '#FCF3E0',
  warnBorder: '#F1DDAE',
  warnText: '#8A5F0E',

  success: '#6F8F5E',
  successBg: '#EEF3E8',
  successText: '#4F6B41',

  white: '#FFFFFF',
  transparent: 'transparent',

  // Household member avatars, in the same warm family.
  avatars: ['#9A5F33', '#6F8F5E', '#C98A3D', '#B5655A', '#7D6A8C'],
};

export default Colors;
