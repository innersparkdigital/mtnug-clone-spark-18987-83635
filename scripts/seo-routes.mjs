import { readFileSync } from 'node:fs';
import ts from 'typescript';

export const SITE = 'https://www.innersparkafrica.com';
export const canonicalUrl = (route) => `${SITE}${route === '/' ? '/' : `/${route.replace(/^\/+|\/+$/g, '')}/`}`;
const PRIVATE = new Set(['/auth', '/reset-password', '/app-coming-soon', '/payment-success', '/payment-canceled', '/chat-sessions', '/my-goals', '/mood-check-in', '/profile-settings', '/account-deletion', '/corporate-admin', '/corporate-dashboard', '/corporate-assessments', '/corporate-wellbeing-check', '/wellness-reports', '/therapist', '/client-login', '/client-dashboard', '/admin/finance', '/learning/dashboard', '/learning/student-dashboard', '/learning/admin-dashboard', '/mind-check/analytics', '/unsubscribe', '/feedback', '/corporate/service-request', '/wellbeing-check/embed']);

function parse(file) { return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); }
function walk(node, callback) { callback(node); ts.forEachChild(node, child => walk(child, callback)); }
function literal(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isJsxExpression(node)) return literal(node.expression);
  return undefined;
}
function attributes(node) {
  return Object.fromEntries(node.attributes.properties.filter(ts.isJsxAttribute).map(p => [p.name.getText(), literal(p.initializer)]));
}
function text(node) {
  if (ts.isJsxText(node)) return node.text;
  if (ts.isJsxElement(node)) return node.children.map(text).join('');
  return literal(node) || '';
}
function decode(value) { return value?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim(); }

export function routeInventory() {
  const app = parse('src/App.tsx');
  const sources = new Map();
  walk(app, node => {
    if (ts.isImportDeclaration(node) && node.importClause?.name) sources.set(node.importClause.name.text, `${node.moduleSpecifier.text.replace(/^\.\//, 'src/')}.tsx`);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      walk(node, child => {
        if (ts.isCallExpression(child) && child.expression.kind === ts.SyntaxKind.ImportKeyword) {
          const target = literal(child.arguments[0]);
          if (target) sources.set(node.name.text, `${target.replace(/^\.\//, 'src/')}.tsx`);
        }
      });
    }
  });
  const routes = new Map();
  walk(app, node => {
    if (!ts.isJsxSelfClosingElement(node) || node.tagName.getText() !== 'Route') return;
    const attrs = attributes(node);
    const route = attrs.path;
    if (!route || /[:*]/.test(route)) return;
    let component;
    let redirect;
    walk(node, child => {
      if (!ts.isJsxSelfClosingElement(child) || child === node) return;
      if (child.tagName.getText() === 'Navigate') redirect = attributes(child).to;
      else component ??= child.tagName.getText();
    });
    if (!routes.has(route)) routes.set(route, { path: route, source: sources.get(component), redirect, private: PRIVATE.has(route) || route.startsWith('/thank-you-') });
  });
  return [...routes.values()];
}

export function metadataFromSource(route) {
  if (!route.source) throw new Error(`No page source for ${route.path}`);
  const page = parse(route.source);
  const props = {};
  let title, description, h1;
  walk(page, node => {
    if (ts.isPropertyAssignment(node)) {
      const value = literal(node.initializer);
      if (value) props[node.name.getText().replace(/["']/g, '')] ??= value;
    }
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const attrs = attributes(node);
      Object.entries(attrs).forEach(([key, value]) => { if (value) props[key] ??= value; });
      if (node.tagName.getText() === 'meta' && attrs.name === 'description') description ??= attrs.content;
    }
    if (ts.isJsxElement(node)) {
      if (node.openingElement.tagName.getText() === 'title') title ??= text(node);
      if (node.openingElement.tagName.getText() === 'h1') h1 ??= text(node);
    }
  });
  const assessment = route.path.startsWith('/mind-check/');
  title = assessment ? `${props.title} Test - Free Mental Health Screening | InnerSpark` : title || props.title || props.headline;
  description ||= props.metaDescription || props.description;
  h1 ||= props.h1 || props.headline || props.title || title;
  if (!title || !description || title.includes('undefined')) throw new Error(`Missing search metadata for ${route.path} (${route.source})`);
  return {
    path: route.path, title: decode(title), description: decode(description), h1: decode(h1),
    intro: decode(assessment ? props.description : description),
    sections: assessment ? [{ h2: 'Understanding your results', p: 'This screening is not a diagnosis. Your results are a starting point for reflection, not a substitute for assessment by a qualified mental health professional.' }] : [],
  };
}