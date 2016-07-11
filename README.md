# lazyloader
lazy loading images



use `data-loader-set` for srcset
use `data-loader-src` for src

```
 <img
        alt="meat"
        height="900px"
        src="../spinner.gif"
        data-loader-set="http://baconmockup.com/300/900 300w, http://baconmockup.com/500/900 500w, http://baconmockup.com/700/900 700w"
        sizes="(min-width: 1024px) 33.3vw, (min-width: 640px) 50vw, (min-width: 400px) 75vw, 100vw">
```
