export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "COVID_19_PRISON/_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.7cd817bc.js","app":"_app/immutable/entry/app.76638d16.js","imports":["_app/immutable/entry/start.7cd817bc.js","_app/immutable/chunks/index.11e7d0cf.js","_app/immutable/chunks/singletons.3c795352.js","_app/immutable/entry/app.76638d16.js","_app/immutable/chunks/index.11e7d0cf.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
