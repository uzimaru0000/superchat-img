import { Hono } from 'hono';
import { SuperChat } from '../components/SuperChat';
import { getIcon } from './lib/icon';
import { generateImage } from './lib/img';

export interface Env {}

const app = new Hono();

app
  .get('/', async (c) => {
    const { price, name, message, icon: iconUrl } = c.req.query();
    const icon = await getIcon(iconUrl);

    const img = await generateImage(
      <SuperChat
        icon={icon ?? ''}
        price={Number(price)}
        name={name}
        message={message}
      />
    );

    return c.body(img);
  })
  .post('/', async (c) => {
    const { price, name, message, icon: iconFile } = await c.req.parseBody();
    const icon = await getIcon(iconFile as File);

    console.log({ price, name, message, icon: iconFile });

    const img = await generateImage(
      <SuperChat
        icon={icon ?? ''}
        price={Number(price)}
        name={String(name)}
        message={message ? String(message) : ''}
      />
    );

    return c.body(img);
  });

export default app;
