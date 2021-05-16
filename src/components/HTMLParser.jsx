import React from "react";
import DOMpurify from "dompurify";

export default function HTMLParser({ html, style }) {
  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{
        __html: DOMpurify.sanitize(html),
      }}
    />
  );
}
