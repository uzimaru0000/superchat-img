import { Hono } from 'hono';
import { SuperChat } from '../components/SuperChat';
import { loadGoogleFont } from './lib/fonts';
import { getIcon } from './lib/icon';
import { generateImage } from './lib/img';
import { createKey } from './lib/store';

export interface Env {
  Bindings: {
    SUPERCHAT_IMG: KVNamespace;
  };
}

const app = new Hono<Env>();

const getFonts = async (
  kv: KVNamespace,
  props: { family: string; weight: number }
) => {
  const key = await createKey(props);
  const cache = await kv.get(key, 'arrayBuffer');

  if (cache) {
    return cache;
  }

  const font = await loadGoogleFont({
    family: 'Noto Sans JP',
    weight: 400,
  });

  await kv.put(key, font, { expirationTtl: 604800 });

  return font;
};

app
  .get('/', async (c) => {
    const { price, name, message, icon: iconUrl } = c.req.query();

    const storeKey = await createKey({ price, name, message, iconUrl });

    const icon = await getIcon(iconUrl);
    const notoSans400 = await getFonts(c.env.SUPERCHAT_IMG, {
      family: 'Noto Sans JP',
      weight: 400,
    });
    const notoSans500 = await getFonts(c.env.SUPERCHAT_IMG, {
      family: 'Noto Sans JP',
      weight: 500,
    });

    const img = await generateImage(
      <SuperChat
        icon={icon ?? ''}
        price={Number(price)}
        name={name}
        message={message}
      />,
      [
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
      ]
    );

    c.res.headers.set('content-type', 'image/png');
    c.res.headers.set('Access-Control-Allow-Origin', '*');
    c.res.headers.set('Cache-Control', 'public, max-age=14400');

    return c.body(img);
  })
  .post('/', async (c) => {
    const { price, name, message, icon: iconFile } = await c.req.parseBody();
    const icon = await getIcon(iconFile as File);

    const storeKey = await createKey({ price, name, message, icon });

    const notoSans400 = await getFonts(c.env.SUPERCHAT_IMG, {
      family: 'Noto Sans JP',
      weight: 400,
    });
    const notoSans500 = await getFonts(c.env.SUPERCHAT_IMG, {
      family: 'Noto Sans JP',
      weight: 500,
    });

    const img = await generateImage(
      <SuperChat
        icon={icon ?? ''}
        price={Number(price)}
        name={String(name)}
        message={message ? String(message) : ''}
      />,
      [
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
      ]
    );

    c.res.headers.set('content-type', 'image/png');
    c.res.headers.set('Access-Control-Allow-Origin', '*');
    c.res.headers.set('Cache-Control', 'public, max-age=14400');

    return c.body(img);
  });

export default app;
