self.addEventListener('install',function(event){
    console.log('SW Installing');
    self.skipWaiting();
});
self.addEventListener('activate',function(event){
    console.log('SW Activate.');
});
self.addEventListener('fetch',function(event){
    //console.log('SW fetching.',event);
});