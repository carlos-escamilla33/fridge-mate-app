import { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';
import { pugSvg } from './pugArt';

// variant: 'fawn' | 'brindle'. happy: tongue out.
export default function Pug({ variant = 'fawn', happy = false, size = 64, style }) {
  const xml = useMemo(() => pugSvg(variant, happy), [variant, happy]);
  return <SvgXml xml={xml} width={size} height={size} style={style} />;
}
