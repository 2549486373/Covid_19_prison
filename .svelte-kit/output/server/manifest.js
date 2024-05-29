export const manifest = {
	appDir: "_app",
	appPath: "Covid_19_prison/_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.68fc54df.js","imports":["_app/immutable/entry/start.68fc54df.js","_app/immutable/chunks/index.8802f197.js","_app/immutable/chunks/singletons.189678af.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.92cf8e76.js","imports":["_app/immutable/entry/app.92cf8e76.js","_app/immutable/chunks/index.8802f197.js"],"stylesheets":[],"fonts":[]}},
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
