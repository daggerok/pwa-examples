w([1],{8:function(e,r){navigator.serviceWorker.controller?console.log("[PWA Builder] active service worker found, no need to register"):navigator.serviceWorker.register("service-worker.js",{scope:"./"}).then(function(e){console.log("Service worker has been registered for scope:"+e.scope)})}},[8]);