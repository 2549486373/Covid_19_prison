

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.0a9ba377.js","_app/immutable/chunks/index.11e7d0cf.js","_app/immutable/chunks/singletons.fd4a2f61.js"];
export const stylesheets = [];
export const fonts = [];
