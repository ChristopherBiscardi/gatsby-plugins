import { jsx as emotion } from "@emotion/core";
import { useContext } from "react";
import css from "@styled-system/css";

const getCSS = (props, theme) => {
  if (!props.sx && !props.css) return undefined;

  const styles = css(props.sx)(theme);
  const raw = typeof props.css === "function" ? props.css(theme) : props.css;
  return [styles, raw];
};

const parseProps = (props, theme) => {
  if (!props) return null;
  const next = {};
  for (let key in props) {
    if (key === "sx") continue;
    next[key] = props[key];
  }
  const css = getCSS(props, theme);
  if (css) next.css = css;
  return next;
};

export const pragma = context => (type, props, ...children) => {
  const theme = useContext(context);
  return emotion.apply(undefined, [
    type,
    parseProps(props, theme),
    ...children
  ]);
};
