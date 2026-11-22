import { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';
import { logoSvg } from './pugArt';

// FridgeMate logo: a pug peeking over the top of a fridge.
export default function Logo({ size = 72, style }) {
  const xml = useMemo(() => logoSvg(), []);
  return <SvgXml xml={xml} width={size} height={size} style={style} />;
}
