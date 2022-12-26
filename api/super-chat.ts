import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createElement } from 'react';
import satori from 'satori';
import { loadGoogleFont } from '../lib/fonts';
import { SuperChat } from '../components/SuperChat';
import { BBox, Resvg } from '@resvg/resvg-js';
import fetch from 'node-fetch';
import { Form, File } from 'multiparty';
import { readFile } from 'fs/promises';

type Props = {
  icon: string | File;
  name: string;
  price: number;
  message: string;
};

const getIcon = async (data: string | File) => {
  if (typeof data === 'string') {
    return fetchIcon(data);
  } else {
    return readIcon(data);
  }
};

const fetchIcon = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.clone().blob();
  const buf = await res.clone().buffer();
  return `data:${blob.type};base64,${buf.toString('base64')}`;
};

const readIcon = async (file: File) => {
  const buf = await readFile(file.path);
  return `data:${file.headers['content-type']};base64,${buf.toString(
    'base64'
  )}`;
};

const getProps = async (req: VercelRequest): Promise<Props> => {
  if (req.method === 'GET') {
    const { icon, name, price, message } = req.query;
    return { icon, name, price: Number(price), message } as Props;
  } else if (req.method === 'POST') {
    const form = new Form();
    const data = await new Promise<Props>((resolve, reject) => {
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject({ err });
        } else {
          resolve({
            icon: files['icon']?.[0],
            name: fields['name']?.[0],
            price: Number(fields['price']),
            message: fields['message'],
          });
        }
      });
    });
    return data;
  } else {
    throw new Error('invalid request');
  }
};

export default async (req: VercelRequest, res: VercelResponse) => {
  const { icon, name, price, message } = await getProps(req);

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

  res
    .status(200)
    .setHeader('content-type', 'image/png')
    .setHeader('Access-Control-Allow-Origin', '*')
    .send(img);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
