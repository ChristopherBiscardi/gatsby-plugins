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

Create `src/context.js` in your theme. This file will bootstrap our context and two pragmas. (Note: once you understand this example, you can change this file name or do this anywhere.)

```js
/** @jsx jsx */
import React from "react";
import { jsxPragma, mdxPragma } from "isolated-theme-ui";

export const MyThemeContext = React.createContext({
  theme: {},
  components: {}
});

// our custom pragmas, bootstrapped with our context
export const jsx = jsxPragma(MyThemeContext);
export const mdx = mdxPragma(MyThemeContext);
```

Then use it in `wrapRootElement` to set the tokens and any components in your context. These are the tokens and context that will be applied when you use the `sx` prop or pass the `mdx` pragma to `MDXRenderer`.

`theme` here could be `import { deep } from 'theme-ui/presets'`, but we put it in a different file so that users can shadow it with their own theme later on.

```js
import React from "react";
import { MyThemeContext, jsx } from "./src/context";
import theme from "./src/theme";

export const wrapRootElement = ({ element }) => (
  <MyThemeContext.Provider
    value={{
      theme,
      components: {
        h1: props =>
          jsx(
            "h1",
            { ...props, sx: { color: "primary" } },
            `h1 from theme B` + props.children
          )
      }
    }}
  >
    {element}
  </MyThemeContext.Provider>
);
```

Usage of the bootstrapped jsx and mdx pragmas looks like this. You can use each independently or together, as seen in this page template. Using the `mdx` pragma is passing it into `MDXRenderer`. To use `sx` you need to use the pragma declaration `/** @jsx jsx */` and the import.

```js
/** @jsx jsx */
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { jsx, mdx } from "../context";

export default ({ data }) => (
  <div>
    <h1
      sx={{
        color: "primary"
      }}
    >
      {data.mdx.frontmatter.title}
    </h1>
    <MDXRenderer scope={{ mdx }}>{data.mdx.body}</MDXRenderer>
  </div>
);

export const query = graphql`
  query ThemeBQuery($id: String!) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        title
      }
      body
    }
  }
`;
```
