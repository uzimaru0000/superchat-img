// @ts-ignore
import satori, { init } from 'satori/wasm';
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

export const generateImage = async (node: ReactNode) => {
  await moduleInit();
  const notoSans400 = await loadGoogleFont({
    family: 'Noto Sans JP',
    weight: 400,
  });
  const notoSans500 = await loadGoogleFont({
    family: 'Noto Sans JP',
    weight: 500,
  });

  const svg = await satori(node, {
    width: 674,
    height: 1000,
    fonts: [
      {
        name: 'Noto Sans JP',
        data: notoSans400,
        weight: 400,
      },
      {
        name: 'Noto Sans JP',
        data: notoSans500,
        weight: 500,
      },
    ],
  });

  const resvg = new Resvg(svg);
  const box = resvg.innerBBox();
  box && resvg.cropByBBox(box);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
};
