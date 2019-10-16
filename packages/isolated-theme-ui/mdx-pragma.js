import { useContext } from "react";
import { mdx as mdxReactPragma } from "@mdx-js/react";

// mdxPragma is an mdx pragma replacement that 
// allows users to isolate the set of components
// used via custom context
// 
// It is a passthrough to the @mdx-js/react pragma
export const mdxPragma = context => (type, props, ...children) => {
    const { components } = useContext(context);
    return mdxReactPragma.apply(undefined, [
      type,
      { ...props, components },
      ...children
    ]);
  };