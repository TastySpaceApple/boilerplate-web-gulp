// npm i gulp gulp-sass sass gulp-file-include gulp-rename merge-stream gulp-concat --save-dev
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
var rename = require("gulp-rename");
const fs = require('fs');
const path = require('path');
const merge = require('merge-stream');
const concat = require('gulp-concat');

const fileinclude = require('gulp-file-include');

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return !file.startsWith('_') && fs.statSync(path.join(dir, file)).isDirectory();
    });
}

const srcFolder = './views/src';
const outputFolder = './views/build';

const views = getFolders(srcFolder);

const flattenPath = () => rename(function (path) {
  path.dirname = '';
})

gulp.task('build-styles', function() {

  const scssFiles = views.map(view => path.join(srcFolder, view, view + '.scss'))

  return gulp.src(scssFiles, {"allowEmpty": true})
          .pipe(sass())
          .pipe(flattenPath())
          .pipe(gulp.dest(outputFolder));
});


gulp.task('build-js', function() {
  const tasks = views.map((view) => {
    return gulp.src([
        path.join(srcFolder, '_shared', '**/*.js'),
        path.join(srcFolder, view, './*/*.js'),
        path.join(srcFolder, view, view + '.js'),
      ], {"allowEmpty": true})
      .pipe(concat(view + '.js'))
      .pipe(gulp.dest(outputFolder));
  });
  return merge(tasks);
});


gulp.task('build-html', function() {
  const htmlFiles = views.map(view => path.join(srcFolder, view, view + '.html'))

  return gulp.src(htmlFiles, {"allowEmpty": true})
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(flattenPath())
    .pipe(gulp.dest(outputFolder))
});

// gulp.task('smoosh', function() {
//   return gulp.src('./build/*.html')
//     .pipe(smoosher())
//     .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
//     .pipe(gulp.dest('./views'))
// });

gulp.task('watch', function(){
  gulp.watch(srcFolder + '/**/*.scss', gulp.series('build-styles'));
  gulp.watch(srcFolder + '/**/*.js', gulp.series('build-js'));
  gulp.watch(srcFolder + '/**/*.html', gulp.series('build-html'));
})

gulp.task('build', gulp.series('build-styles', 'build-js', 'build-html'));

gulp.task('default', gulp.series('build', 'watch'))
gulp.task('dev', gulp.series('build', 'watch'))