import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'DM Sans',
  android: 'DM Sans',
  default: 'DM Sans',
});

const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const typography = {
  fontFamily,
  fontWeights,
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: fontWeights.bold,
    lineHeight: 34,
  },
  h2: {
    fontFamily,
    fontSize: 24,
    fontWeight: fontWeights.bold,
    lineHeight: 30,
  },
  h3: {
    fontFamily,
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    lineHeight: 26,
  },
  h4: {
    fontFamily,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
  },
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
  },
  button: {
    fontFamily,
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
  },
  buttonSmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    lineHeight: 18,
  },
};