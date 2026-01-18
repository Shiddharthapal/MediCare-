import { c as createComponent, d as createAstro, f as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, n as renderComponent } from '../chunks/astro/server_GeokaOP0.mjs';
import 'clsx';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Projects/All Project/MediCare-/src/layouts/Layout.astro", void 0);

const $$ = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "MediCare+" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", null, { "client:only": true, "client:component-hydration": "only", "client:component-path": "C:/Projects/All Project/MediCare-/src/components/App", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/All Project/MediCare-/src/pages/[...index].astro", void 0);

const $$file = "C:/Projects/All Project/MediCare-/src/pages/[...index].astro";
const $$url = "/[...index]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
