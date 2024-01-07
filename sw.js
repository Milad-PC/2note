const STATIC_Cache_VERSION = 'static_2';
const STATIC_ASSESTS = [
    '/','/index.html','/install.html','/manifest.json','/JS/index.js',
    '/JS/jquery-3.7.1.min.js','/CSS/index.css','/CSS/maincss.css','/IMG/favicon_32.png'
    ,'/IMG/favicon_64.png','/IMG/favicon_128.png','/IMG/favicon_196.png','/IMG/favicon_256.png'
    ,'/IMG/favicon_512.png','/IMG/favicon_1024.png','/IMG/favicon.ico','/IMG/favicon.jpg','/IMG/maskable_icon_x512.png'
    ,'/FONT/danstevis.otf','/FONT/iranyekanwebblackfanum.eot','/FONT/iranyekanwebblackfanum.ttf',
    '/FONT/Morabba-Black.ttf','/FONT/Morabba-Bold.ttf','/FONT/Morabba-ExtraBold.ttf','/FONT/Morabba-Heavy.ttf',
    '/FONT/Morabba-Light.ttf','/FONT/Morabba-Medium.ttf','/FONT/Morabba-Regular.ttf','/FONT/Morabba-SemiBold.ttf',
    '/FONT/Morabba-UltraLight.ttf','/CSS/bootstrap.rtl.min.css'
];

self.addEventListener('install',function(event){
    console.log('SW Installing');
    self.skipWaiting();
});
self.addEventListener('activate',function(event){
    console.log('SW Activate.');
});
self.addEventListener('fetch',function(event){
    const req = event.request;
    event.respondWith(
        caches.match(req)
        .then((response) => {
            return response || fetch(req)
            .then((res) => {
                caches.open(STATIC_Cache_VERSION)
                .then((cache) => {
                    cache.put(req,res);
                });
                return res.clone();
            }).catch(console.error);
        }).catch(console.error)
    );
});