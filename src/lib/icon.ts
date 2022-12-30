export const getIcon = async (data: string | File) => {
  if (typeof data === 'string') {
    return fetchIcon(data);
  } else {
    return readIcon(data);
  }
};

const fetchIcon = async (url: string) => {
  const res = await fetch(url);
  const contentType = res.headers.get('content-type');
  const buf = buffer2base64(await res.arrayBuffer());

  return `data:${contentType ?? 'image/png'};base64,${btoa(buf)}`;
};

const readIcon = async (file: File) => {
  const buf = buffer2base64(await file.arrayBuffer());
  return `data:${file.type};base64,${btoa(buf)}`;
};

const buffer2base64 = (buf: ArrayBuffer) => {
  return new Uint8Array(buf).reduce((acc, x) => {
    return acc + String.fromCharCode(x);
  }, '');
};
