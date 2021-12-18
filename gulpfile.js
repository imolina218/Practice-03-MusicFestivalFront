const { src, dest, watch, parallel } = require("gulp"); // Cuando queres lamar multiples funciones se utilizan llaves

// Dependencias CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Dependencias Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// Javascript
const terser = require("gulp-terser-js");

function css( done ) {
    
    src("src/scss/**/*.scss") // Identificar archivo css a compilar
        .pipe(sourcemaps.init())
        .pipe( plumber())
        .pipe( sass() ) // Compilarlo
        .pipe( postcss([autoprefixer(), cssnano() ]) )
        .pipe(sourcemaps.write("."))
        .pipe( dest("build/css") ) // Almacenarla
    done();
}

// Conversion de imagenes a jpg y png
function imagenes( done ) {
    const opciones = {
        optimizationLevel: 3
    }

    src("src/img/**/*.{png,jpg}")
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest("build/img") )

    done();
}

// Conversion de imagenes a Webp
function versionWebp( done ) {
    const opciones = {
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")
        .pipe( webp(opciones) )
        .pipe( dest("build/img") )

    done();
}

// Conversion de imagenes a avif
function versionAvif( done ) {
    const opciones = {
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")
        .pipe( avif(opciones) )
        .pipe( dest("build/img") )

    done();
}

// Pasa archivos js a la carpeta build
function javascript( done ) {
    src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe( terser())
        .pipe(sourcemaps.write("."))
        .pipe( dest("build/js") );

    done();
}

// Crear watch para gestionar archivos de gulp
function dev( done ) {
    watch("src/scss/**/*.scss", css); // Detecta cambios en los archivos CSS
    watch("src/js/**/*.js", javascript); // Detecta cambios en los archivos JS
    done();
}


exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev);




