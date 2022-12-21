var gulp = require('gulp');
// const uglify = require('gulp-uglify');
var bump = require('gulp-bump');
// const sass = require('gulp-sass')(require('sass'));
var babel = require("gulp-babel");

gulp.task('js',['api','image','login','utils','bump', 'verifition'], function () {
    return gulp.src('./bin/*.js') // read all
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./lib'));
});

gulp.task('api', function () {
    return gulp.src('./bin/api/*.js') // read all
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./lib/api'));
});

gulp.task('image', function () {
    return gulp.src('./bin/image/*') // read all
        .pipe(gulp.dest('./lib/image'));
});

gulp.task('login', function () {
    return gulp.src('./bin/login/*.vue') // read all
        .pipe(gulp.dest('./lib/login'));
});

gulp.task('utils', function () {
    return gulp.src('./bin/utils/*.js') // read all
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./lib/utils'));
});

gulp.task('verifition',['verifitionUtils','verifitionApi','Verify'], function () {
    return gulp.src('./bin/verifition/*.vue') // read all
        .pipe(gulp.dest('./lib/verifition'));
});

gulp.task('verifitionUtils', function () {
    return gulp.src('./bin/verifition/utils/*.js') // read all
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./lib/verifition/utils'));
});
gulp.task('verifitionApi', function () {
    return gulp.src('./bin/verifition/api/*.js') // read all
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./lib/verifition/api'));
});


gulp.task('Verify', function () {
    return gulp.src('./bin/verifition/Verify/*.vue') // read all
        .pipe(gulp.dest('./lib/verifition/Verify'));
});

gulp.task('bump',function(){
    return gulp.src('./package.json')
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});


gulp.task('default', ['js'])
