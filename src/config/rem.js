// (function(doc, win) {
//     var docEl = doc.documentElement,
//         resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//         recalc = function() {
//             var clientWidth = docEl.clientWidth;
//             if (!clientWidth) return;
//             var dpr = win.devicePixelRatio || 1;
//             debugger
//             docEl.style.fontSize = 100 * (clientWidth * dpr / 750)  + 'px';
            
//         };
//     if (!doc.addEventListener) return;
//     win.addEventListener(resizeEvt, recalc, false);
//     doc.addEventListener('DOMContentLoaded', recalc, false);
// })(document, window);

(function(doc, win) {
    
    var setdpr = function (baseFontSize, fontscale) {
        var _baseFontSize = baseFontSize || 100;
        var _fontscale = fontscale || 1;
        var win = window;
        var doc = win.document;
        var ua = navigator.userAgent;
        var matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
        var UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
        var isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
        var isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
        var dpr = win.devicePixelRatio || 1;
        if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
            // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
            dpr = 1;
        }
        var scale = 1 / dpr;

        var html = document.getElementsByTagName('html')[0]; 
        //屏幕的宽度（兼容处理）
        var w = document.documentElement.clientWidth || document.body.clientWidth;


        var metaEl = doc.querySelector('meta[name="viewport"]');
        if (!metaEl) {
            metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            doc.head.appendChild(metaEl);
        }
        metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);
        doc.documentElement.style.fontSize = _baseFontSize * (w * dpr / 750)  + 'px';//_baseFontSize / 2 * dpr * _fontscale + 'px';
        window.viewportScale = dpr;
        console.log(dpr)
    }
    setdpr();
})(document, window);