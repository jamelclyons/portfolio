import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import hash from 'gulp-hash-filename';
import { deleteAsync } from 'del';

import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

const sassCompiler = gulpSass(sass);

const paths = {
    scss: './scss/**/*.scss',
    css: './dist/css',
    html: './index.html'
};
const regex = /dist\/css\/index-[a-f0-9]{32}\.css/;

gulp.task('clean', async () => {
    await deleteAsync([`${paths.css}`]);
});

const findCss = async () => {
    const files = await glob(path.join(paths.css, '*.css'), (err, files) => {
        if (err) {
            console.error('Error searching for CSS files:', err);
            return [];
        }

        return files;
    });

    return files;
};

const replaceCssInHtml = (cssFileName) => {

    fs.readFile(paths.html, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the HTML file:', err);
            return;
        }

        const updatedHtml = data.replace(/href=".*?index(?:-[a-f0-9]{32})?\.css"/, `href="${cssFileName}"`);

        fs.writeFile(paths.html, updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to the HTML file:', err);
            } else {
                console.log('HTML file updated with new CSS file name:', cssFileName);
            }
        });
    });
}

gulp.task('build', gulp.series('clean', function () {
    return gulp.src(paths.scss)
        .pipe(sassCompiler({ outputStyle: 'expanded' })
            .on('error', sassCompiler.logError))
        .pipe(concat('index.css'))
        .pipe(cleanCSS())
        .pipe(hash())
        .pipe(gulp.dest(paths.css))
        .on('end', function () {
            findCss().then((files) => {
                const cssFileName = files.filter(file => regex.test(file))[0];

                if (cssFileName) {
                    replaceCssInHtml(cssFileName);
                }
            });
        });
}));

gulp.task('watch', function () {
    gulp.watch(paths.scss, gulp.series('build'));
});

gulp.task('default', gulp.series('build', 'watch'));