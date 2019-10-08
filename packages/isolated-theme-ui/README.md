# isolated theme-ui

A theme-ui pragma implementation that allows bootstrapping the provider context so that the tokens can be isolated from other libraries. Everything else is the same so theme-ui is a peerDep.

## What is it for?

Gatsby themes mostly.

Under normal usage gatsby-theme-a and gatsby-theme-b will import the same `ThemeProvider` from something like emotion, styled-components, etc. The result is two competing `ThemeProviders` using the same React context instance leading to collisions. Imagine component lib A having a `fontSizes` key in the theme that is an array of 3 values while component lib b has one that's 4. You'll either end up with one too many or one too few font sizings, resulting in broken sites just from installing a Gatsby theme.

This library currently solves this problem by letting you bootstrap a new context to handle the token values. Because these contexts are instantiated per-theme, they are isolated from each other and won't conflict. They can also be imported if you want to use a particular theme's tokens (or multiple token sets).

More generally this pattern applies to all such libraries that may want to isolate their core context usage from getting messed with or messing with other libs.

## Status

Currently it's an experiement that works for the sx prop.

TODO:

- [ ] check Styled.x components
- [ ] MDX components?

## Usage

This is a brief, non-optimal usage. Typically it would be good to move the provider out of this file into a `wrapRootElement` and file it can be imported from on it's own to allow other user to consume it. This illustrates the point though

```js
/** @jsx jsx */
import React from "react";
import { pragma } from "isolated-theme-ui";
import theme from "../theme";
const MyThemeContext = React.createContext(theme);
const jsx = pragma(MyThemeContext);

export default props => (
  <h1
    sx={{
      color: "primary",
      fontFamily: "heading"
    }}
  >
    Hello from A
  </h1>
);
```
