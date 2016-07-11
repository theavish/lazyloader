(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.loader = factory(root);
    }
})(this, function (root) {

    'use strict';

    var loader = {};

    var callback = function () {};

    var offset, poll, delay, useDebounce;

    var isHidden = function (element) {
        return (element.offsetParent === null);
    };

    var isInView = function (element, view) {
        if (isHidden(element)) {
            return false;
        }

        var box = element.getBoundingClientRect();
        return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
    };

    var debounceOrThrottle = function () {
        if (!useDebounce && !!poll) {
            return;
        }
        clearTimeout(poll);
        poll = setTimeout(function () {
            loader.render();
            poll = null;
        }, delay);
    };

    loader.init = function (opts) {
        opts = opts || {};
        var offsetAll = opts.offset || 0;
        var offsetVertical = opts.offsetVertical || offsetAll;
        var offsetHorizontal = opts.offsetHorizontal || offsetAll;
        var optionToInt = function (opt, fallback) {
            return parseInt(opt || fallback, 10);
        };
        offset = {
            t: optionToInt(opts.offsetTop, offsetVertical),
            b: optionToInt(opts.offsetBottom, offsetVertical),
            l: optionToInt(opts.offsetLeft, offsetHorizontal),
            r: optionToInt(opts.offsetRight, offsetHorizontal)
        };
        delay = optionToInt(opts.throttle, 250);
        useDebounce = opts.debounce || false;
        callback = opts.callback || callback;
        loader.render();
        if (document.addEventListener) {
            root.addEventListener('scroll', debounceOrThrottle, false);
            root.addEventListener('load', debounceOrThrottle, false);
        } else {
            root.attachEvent('onscroll', debounceOrThrottle);
            root.attachEvent('onload', debounceOrThrottle);
        }
    };

    loader.render = function () {
        var elem;
        var nodes = document.querySelectorAll('img[data-loader-set], img[data-loader-src]');
        var view = {
            t: 0 - offset.t,
            b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
            l: 0 - offset.l,
            r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
        };
        for (var i = 0; i < nodes.length; i++) {
            elem = nodes[i];
            if (isInView(elem, view)) {
                    
                if (!!elem.getAttribute('data-loader-set')) {
                    elem.setAttribute('srcset', elem.getAttribute('data-loader-set'));
                    elem.removeAttribute('data-loader-set');
                } else if (!!elem.getAttribute('data-loader-src')) {
                    elem.setAttribute('src', elem.getAttribute('data-loader-src'));
                    elem.removeAttribute('data-loader-src');
                }

                callback(elem, 'load');
            }
        }

        if (!nodes.length) {
            loader.detach();
        }
    };

    loader.detach = function () {
        if (document.removeEventListener) {
            root.removeEventListener('scroll', debounceOrThrottle);
        } else {
            root.detachEvent('onscroll', debounceOrThrottle);
        }
        clearTimeout(poll);
    };

    return loader;

});
