import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createElement } from 'react';
import satori from 'satori';
import { loadGoogleFont } from '../lib/fonts';
import { SuperChat } from '../components/SuperChat';
import { BBox, Resvg } from '@resvg/resvg-js';
import fetch from 'node-fetch';

const getIcon = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.clone().blob();
  const buf = await res.clone().buffer();
  return `data:${blob.type};base64,${buf.toString('base64')}`;
};

export default async (req: VercelRequest, res: VercelResponse) => {
  const { icon, name, price, message } = req.query;

  const notoSans400 = await loadGoogleFont({
    family: 'Noto Sans JP',
    weight: 400,
  });
  const notoSans500 = await loadGoogleFont({
    family: 'Noto Sans JP',
    weight: 500,
  });

  const svg = await satori(
    createElement(SuperChat, {
      // @ts-ignore
      icon: icon ? await getIcon(icon) : undefined,
      // @ts-ignore
      name,
      price: Number(price),
      // @ts-ignore
      message,
    }),
    {
      width: 337,
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
    }
  );

  const resvg = new Resvg(svg);
  resvg.cropByBBox(resvg.innerBBox() ?? new BBox());
  const renderImg = resvg.render();
  const img = renderImg.asPng();

  res.status(200).setHeader('content-type', 'image/png').send(img);
};
