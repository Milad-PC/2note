const STATIC_Cache_VERSION = 'static_1';
const DYNAMIC_Cache_VERSION = 'Dynamic_1';
const STATIC_ASSESTS = [
    '/','/index.html','/install.html','/manifest.json','/JS/index.js',
    '/JS/jquery-3.7.1.min.js','/CSS/index.css','/CSS/maincss.css','/IMG/favicon.ico',
    '/FONT/iranyekanwebblackfanum.eot','/FONT/iranyekanwebblackfanum.ttf',
    '/CSS/bootstrap.rtl.min.css', '/CSS/bootstrap-icons-v1-10.css','/CSS/bootstrap-icons-v1-11.css',
    '/CSS/fonts/bootstrap-icons.woff','/CSS/fonts/bootstrap-icons.woff2',
    '/CSS/owl.carousel.min.css','/CSS/owl.theme.default.min.css','/JS/owl.carousel.min.js',
    'JS/bootstrap.bundle.min.js'
];

self.addEventListener('install',function(event){
    console.log('[SW] Installing');
    self.skipWaiting();
    event.waitUntil(
        caches.open(STATIC_Cache_VERSION)
        .then((cache) => {
            console.log('static cash ready');
            return cache.addAll(STATIC_ASSESTS);
        })
        .catch((err) => {
            console.log('static Cache ERROR');
            console.log(err);
        })
    );
});
self.addEventListener('activate',function(event){
    console.log('[SW] Activate.');
    event.waitUntil(
        caches.keys()
        .then((keys) => {
            keys.map((key) => {
                if(key !== STATIC_Cache_VERSION && key !== DYNAMIC_Cache_VERSION){
                    console.log('Cache Deleted ' + key);
                    caches.delete(key);
                }
            })
        })
    );
    return self.clients.claim();
});
/*
self.addEventListener('fetch',function(event){
    const req = event.request;
    event.respondWith(
        caches.match(req)
        .then((response) => {
            return response || fetch(req)
            .then((res) => {
                caches.open(DYNAMIC_Cache_VERSION)
                .then((cache) => {
                    cache.put(req,res);
                });
                return res.clone();
            })
            .catch(function(err){
                console.log('Error Inner Fetch');
                console.log(err);
            });
        }).catch(console.error)
    );
});
*/
/*
    cache starategies
*/
// ========  1. Cache Only
/*
self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.request)
    );
});
*/
// ========  2. Network Only
/*
self.addEventListener('fetch',function(event){
    event.respondWith(
        fetch(event.request)
    );
});
*/
// ========  3. Cache First , falling back to network
self.addEventListener('fetch',function(event){
    /*
    event.respondWith(
        caches.match(event.request)
        .then((res) => {
            return res || fetch(event.request)
            .then((newRes) => {
                caches.open(DYNAMIC_Cache_VERSION)
                .then(cache => cache.put(event.request,newRes));
                return newRes.clone();
            })
        })
    );
    */
});

// ========  4. Network First , falling back to Cache
/*
self.addEventListener('fetch',function(event){
    event.respondWith(
        fetch(event.request)
        .then((res) => {
            caches.open(DYNAMIC_Cache_VERSION)
            .then(cache => cache.put(event.request , res));
            return res.clone();
        })
        .catch(err => caches.match(event.request))
    );
});
*/
// ========  5. Cache With Network Update
/*
self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.request)
        .then((res) => {

            const UpdateRespond = fetch(event.request)
            .then((newRes) => {
                cache.put(event.request , newRes.clone());
                return newRes;
            });

            return res || UpdateRespond;
        })
    );
});
*/

