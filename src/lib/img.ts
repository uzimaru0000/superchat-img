// @ts-ignore
import satori, { init } from 'satori/wasm';
import type { SatoriOptions } from 'satori';
import initYoga from 'yoga-wasm-web';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import type { ReactNode } from 'react';
import { loadGoogleFont } from './fonts';
import yogaWasm from '../vender/yoga.wasm';
import resvgWasm from '../vender/resvg.wasm';

const genModuleInit = () => {
  let isInit = false;
  return async () => {
    if (isInit) {
      return;
    }

    // @ts-ignore
    init(await initYoga(yogaWasm));
    await initWasm(resvgWasm);
    isInit = true;
  };
};
const moduleInit = genModuleInit();

export const generateImage = async (
  node: ReactNode,
  fonts: SatoriOptions['fonts']
) => {
  await moduleInit();

  const svg = await satori(node, {
    width: 674,
    height: 1000,
    fonts: fonts,
  });

  const resvg = new Resvg(svg);
  const box = resvg.innerBBox();
  box && resvg.cropByBBox(box);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
};
