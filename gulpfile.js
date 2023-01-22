const {
    watch,
    src,
    dest,
    parallel


} = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');

const browserSync = require('browser-sync').create();


function styles() {
    return src('app/scss/style.scss')
        .pipe(sass())
        .pipe(sass().on('error', sass.logError))


        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            cascade: false,
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))

        .pipe(dest('app/css'))

        .pipe(browserSync.stream())





}

function scripts() {
    return src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/slick-carousel/slick/slick.js',
            'node_modules/rateyo/src/jquery.rateyo.js',
            'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
            'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
            'app/js/main.js'

        ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}



function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    })
}


function build() {
    return src(['app/**/*.html', 'app/css/style.min.css', 'app/js/main.min.js'], {
            base: 'app'
        })
        .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')
}






function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);

    watch(["app/**/*.html"]).on('change', browserSync.reload);
}








exports.scripts = scripts;
exports.styles = styles;
exports.style = build;

exports.cleanDist = cleanDist;
exports.browsersync = browsersync;
exports.watching = watching;


exports.default = parallel(styles, scripts, browsersync, watching);