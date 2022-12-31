export const createKey = (value: Record<string, any>) => {
  return md5(JSON.stringify(value));
};

const md5 = async (v: string) => {
  const buf = new TextEncoder().encode(v);
  const hash = await crypto.subtle.digest('MD5', buf);
  return [...new Uint8Array(hash)]
    .map((x) => {
      return x.toString(16).padStart(2, '0');
    })
    .join('');
};
