const fs = require("fs");
const path = require("path");

const gulp = require("gulp");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const stripCssComments = require("strip-css-comments");
const trim = require("gulp-trim");
const decomment = require("decomment");
<%_ if (useSass) { _%>
const sass = require("gulp-sass");
<%_ } _%>
const del = require("del");
const shell = require("gulp-shell");

let watcher;

gulp.task("clean", () => {
  return del(["./*.umd.*"]);
});
<%_ if (useSass) { _%>
gulp.task("sass", () => {
  return gulp
    .src(["./src/*.scss"])
    .pipe(sass())
    // .pipe(stripCssComments())
    .pipe(trim())
    .pipe(gulp.dest("./"));
});
<%_ } else {_%>
  gulp.task("copy", () => {
    return gulp
      .src(["./src/*.css"])
      .pipe(gulp.dest("./"));
  });
<%_ } _%>
gulp.task("replaceStyles", () => {
  return gulp
    .src("./src/<%= themeName %>.js")
    .pipe(
      replace(
        /<style id="\${templateId}-style"><\/style>/g,
        '<style id="${templateId}-style">' +
          fs.readFileSync("./<%= themeName %>.css") +
          "</style>"
      )
    )
    .pipe(gulp.dest("./"));
});

gulp.task("compile", () => {
  return gulp
    .src(["./<%= themeName %>.js"])
    .pipe(
      replace(
        /^(import .*?)(['"]\.\.\/(?!\.\.\/).*)(\.js['"];)$/gm,
        "$1$2.umd$3"
      )
    )
    .pipe(
      rename({
        suffix: ".umd"
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("stopwatch", done => {
  watcher.close();
  done();
});

gulp.task("watch", () => {
  watcher = gulp.watch(["./src/*"], gulp.series("stopwatch", "build", "watch"));
  return watcher;
});

gulp.task("bundle", shell.task("../../node_modules/.bin/rollup -c"));

gulp.task(
  "build",
  gulp.series("clean", <%_ if (useSass) { _%>"sass", <%_ } else { _%>"copy", <% } %>"replaceStyles", "compile", "bundle")
);

gulp.task("default", gulp.series("build"));

gulp.task("dev", gulp.series("default", "watch"));
