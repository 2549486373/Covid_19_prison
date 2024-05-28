export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.72612013.js","imports":["_app/immutable/entry/start.72612013.js","_app/immutable/chunks/index.8802f197.js","_app/immutable/chunks/singletons.c04954df.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.7ac8270f.js","imports":["_app/immutable/entry/app.7ac8270f.js","_app/immutable/chunks/index.8802f197.js"],"stylesheets":[],"fonts":[]}},
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
