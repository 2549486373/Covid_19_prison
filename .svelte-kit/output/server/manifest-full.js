export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.219bdfba.js","imports":["_app/immutable/entry/start.219bdfba.js","_app/immutable/chunks/index.8802f197.js","_app/immutable/chunks/singletons.3b49440b.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.72321e00.js","imports":["_app/immutable/entry/app.72321e00.js","_app/immutable/chunks/index.8802f197.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
