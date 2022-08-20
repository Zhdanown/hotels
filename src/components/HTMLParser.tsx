import React, { CSSProperties } from "react";
import DOMpurify from "dompurify";

export default function HTMLParser({
  html,
  style,
}: {
  html: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{
        __html: DOMpurify.sanitize(html),
      }}
    ></div>
  );
}
