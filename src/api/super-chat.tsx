import * as React from "react";

type Props = {
  query: { [key: string]: string };
};

const Style = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&display=swap');
    body {
        margin: 0;
        padding: 0;
        font-family: 'Noto Sans JP', sans-serif;
    }
`,
    }}
  />
);

export default ({ query }: Props) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <Style />
      </head>
      <body>
        <Component
          icon={decodeURIComponent(query.icon)}
          name={decodeURIComponent(query.name) || "名無し"}
          price={Number(query.price)}
          message={query.message && decodeURIComponent(query.message)}
        />
      </body>
    </html>
  );
};

const Component = ({
  icon,
  name,
  price,
  message,
}: {
  icon: string;
  name: string;
  price: number;
  message: string;
}) => {
  const { header, body, text } = color(price);

  return (
    <div
      id="super-chat"
      style={{
        width: "337px",
        display: "flex",
        flexDirection: "column",
        color: text,
        fontWeight: "500",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "8px 16px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: header,
        }}
      >
        <img
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgb(128, 128, 128)",
          }}
          src={icon}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "16px",
          }}
        >
          <div>{name}</div>
          <div>￥{price.toLocaleString()}</div>
        </div>
      </div>
      {message && (
        <div
          style={{
            background: body,
            padding: "8px 16px",
            fontWeight: "400",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

const color = (price: number) => {
  if (price < 1000) {
    return {
      header: "rgb(0, 183, 155)",
      body: "rgb(27, 230, 173)",
      text: "black",
    };
  } else if (price < 5000) {
    return {
      header: "rgb(255, 170, 0)",
      body: "rgb(255, 195, 34)",
      text: "black",
    };
  } else if (price < 10000) {
    return {
      header: "rgb(186, 23, 81)",
      body: "rgb(231, 28, 88)",
      text: "white",
    };
  } else {
    return {
      header: "rgb(183, 35, 26)",
      body: "rgb(205, 49, 37)",
      text: "white",
    };
  }
};
