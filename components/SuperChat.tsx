import React from 'react';

export interface Props {
  icon: string;
  name: string;
  price: number;
  message: string;
}
export const SuperChat: React.FC<Props> = ({
  icon,
  name,
  price,
  message,
}: Props) => {
  const { header, body, text } = color(price);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: text,
        fontWeight: '500',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '16px 32px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          background: header,
        }}
      >
        {icon ? (
          <img
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
            }}
            width={80}
            height={80}
            src={icon}
          />
        ) : (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgb(128, 128, 128)',
              color: 'rgba(0, 0, 0, 0.5)',
              fontSize: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            ？
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '32px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '32px' }}>{name}</div>
          <div style={{ display: 'flex', fontSize: '32px' }}>
            ￥{price.toLocaleString()}
          </div>
        </div>
      </div>
      {price >= 200 && message && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            background: body,
            padding: '16px 32px',
            fontWeight: '400',
            fontSize: '32px',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

const color = (price: number) => {
  const keys = [100, 200, 500, 1000, 2000, 5000, 10000] as const;
  const map = {
    100: {
      header: 'rgb(21, 101, 192)',
      body: 'rgb(21, 101, 192)',
      text: 'white',
    },
    200: {
      header: 'rgb(0, 184, 212)',
      body: 'rgb(0, 229, 255)',
      text: 'black',
    },
    500: {
      header: 'rgb(0, 191, 165)',
      body: 'rgb(29, 233, 182)',
      text: 'black',
    },
    1000: {
      header: 'rgb(255, 179, 0)',
      body: 'rgb(255, 202, 40)',
      text: 'black',
    },
    2000: {
      header: 'rgb(230, 81, 0)',
      body: 'rgb(245, 124, 0)',
      text: 'white',
    },
    5000: {
      header: 'rgb(194, 24, 91)',
      body: 'rgb(233, 30, 99)',
      text: 'white',
    },
    10000: {
      header: 'rgb(208, 0, 0)',
      body: 'rgb(230, 33, 23)',
      text: 'white',
    },
  };

  const key = keys.filter((x) => Number(x) <= price).reverse()[0];

  return map[key];
};
