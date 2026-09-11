import { plugin } from "bun";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

plugin({
  name: "stubs",
  setup(build) {
    const nullRe = /(components\/(Header|Footer|AppDownload|RelatedArticles|SocialShareButtons|NewsletterForm))$/;
    build.onResolve({ filter: nullRe }, (args) => ({ path: args.path, namespace: "nullstub" }));
    build.onLoad({ filter: /.*/, namespace: "nullstub" }, () => ({
      contents: "export default function(){return null;}",
      loader: "js",
    }));
    build.onResolve({ filter: /integrations\/supabase\/client$/ }, (args) => ({ path: args.path, namespace: "supastub" }));
    build.onLoad({ filter: /.*/, namespace: "supastub" }, () => ({
      contents: "export const supabase = { from(){ return { select(){return this;}, eq(){return this;}, order(){return Promise.resolve({data:[]});} }; } };",
      loader: "js",
    }));
  },
});

const file = process.argv[2];
const mod = await import(file);
const Comp = mod.default;
const html = renderToStaticMarkup(
  React.createElement(MemoryRouter, null, React.createElement(Comp))
);
const helmet = Helmet.renderStatic();
console.log(JSON.stringify({
  html,
  title: helmet.title.toString(),
  meta: helmet.meta.toString(),
  link: helmet.link.toString(),
  script: helmet.script.toString(),
}));
