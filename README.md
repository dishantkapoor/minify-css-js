# Minify JS and CSS and Upload on S3

To install package run
`npm install minify-css-js`



![Logo](https://raw.githubusercontent.com/dishantkapoor/minify-css-js/main/minify-css-js.png)


## Use Cases
 - Minify CSS and JS
 - Upload on S3 Bucket
 - Define Path or Change Location on S3
 - Define Path for Local Location


## 1. Minify CSS and JS 
To Minify your CSS and JS you need to write the following code

```javascript
const Minify=require('minify-css-js')

new Minify()
.add_js('/public/js/theme.js')
.add_js('/public/js/app.js')
.add_js('/public/js/work.js')
.add_css('public/css/bootstrap.css')
.add_css('public/css/slider.css')
.add_css('public/css/styles.css')
.minify()
// Here add_js use for minify JS files and add_css for minify css files
// .minify() use for execution
```
The path you defined for CSS or JS files. it will create minified files on same location Like:

```javascript
If the path : /public/js/theme.js
The Output  : /public/js/theme.min.js
```
Smae for CSS
```javascript
If the path : /public/css/bootstrap.css
The Output  : /public/css/bootstrap.min.css
```



## 2. Upload on S3 Bucket
To Upload your Minified CSS and JS you need pass your S3 Details


```javascript
const Minify=require('minify-css-js')

new Minify()
.s3({
    ACCESS_KEY:"Your S3 Access Key",
    SECRET_KEY:"Your S3 Secret",
    BUCKET:"bucket-name"
})
.add_js('public/js/theme.js')
.add_css('public/css/bootstrap.css')
.minify()
// It will upload on s3 alse on same location and same folder structure
```



## 3. Define Path or Change Location on S3
If you are worry about path while uploading on s3 bucket. Here is Solution. you can specify your own path that will replace existing path with your path with the help of `path_replace()` function. It accept 2 parameters

```javascript
path_replace('Existing Path for Match','Replace with this Path')
```
Suppose the file in your local on this location `public/css/style.css`

and you want to upload on s3 on location `assets/css/style.css`

for this you can pass like this

`path_replace('public/','assets/')`

Check below complete example.


```javascript
const Minify=require('minify-css-js')

new Minify()
.s3({
    ACCESS_KEY:"Your S3 Access Key",
    SECRET_KEY:"Your S3 Secret",
    BUCKET:"bucket-name"
})
.path_replace('./public','assets')
.add_js('public/js/theme.js')
.add_css('public/css/bootstrap.css')
.minify()
// It will upload on s3 alse on same location and same folder structure
```

## 4. Define Path Local Location Path
If you are worry about path while uploading on s3 bucket. Here is Solution. you can specify your own path that will replace existing path with your path with the help of `local_path_replace()` function. It accept 2 parameters

```javascript
local_path_replace('Existing Path for Match','Replace with this Path')
```
Suppose the file in your local on this location `public/css/style.css`

and you want to store on different location in your local `assets/css/style.css`

for this you can pass like this

`local_path_replace('public/','assets/')`

Check below complete example.


```javascript
const Minify=require('minify-css-js')

new Minify()
.local_path_replace('./public','assets')
.add_js('public/js/theme.js')
.add_css('public/css/bootstrap.css')
.minify()
// It will upload on s3 alse on same location and same folder structure
```

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)



## Authors

- [@dishantkapoor](https://www.github.com/dishantkapoor)

## Buy Me A Coffee
#### If this package has helped you in development and you would like to support me, please consider buying me a coffee by clicking the link below.
[![Logo](https://raw.githubusercontent.com/dishantkapoor/minify-css-js/main/coffee.png)
](https://www.buymeacoffee.com/dishantkapoor)