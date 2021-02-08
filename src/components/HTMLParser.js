import React from "react";
import DOMpurify from "dompurify";


export default function HTMLParser({ html }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMpurify.sanitize(html),
      }}
    ></div>
  );
}
