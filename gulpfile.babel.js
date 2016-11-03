// GULPFILE
// - - - - - - - - - - - - - - -
// This file processes all of the assets in the "apps/assets" folder
// and outputs the finished files in the "staticfiles" folder.

// LIBRARIES
// - - - - - - - - - - - - - - -
import gulp from 'gulp';
import paths from './projectpath.babel';
import loadPlugins from 'gulp-load-plugins';

const plugins = loadPlugins();
// TASKS
// - - - - - - - - - - - - - - -

gulp.task('copy:govuk_template:css', () => gulp.src(paths.template + 'assets/stylesheets/**/*.css')
  .pipe(plugins.sass({
    outputStyle: 'compressed'
  }))
  .on('error', plugins.sass.logError)
  .pipe(plugins.cssUrlAdjuster({
    prependRelative: '/static/',
  }))
  .pipe(gulp.dest(paths.dist + 'stylesheets/'))
);


gulp.task('sass', () => gulp
  .src(paths.src + 'stylesheets/*.scss')
  .pipe(plugins.sass({
    outputStyle: 'compressed',
    includePaths: [
      paths.npm + 'govuk-elements-sass/public/sass/',
      paths.toolkit + 'stylesheets/'
    ]
  }))
  .pipe(plugins.base64({baseDir: 'apps'}))
  .pipe(gulp.dest(paths.dist + 'stylesheets/'))
);

// Watch for changes and re-run tasks
gulp.task('watchForChanges', function() {
  gulp.watch(paths.src + 'stylesheets/**/*.scss', ['sass']);
  gulp.watch('gulpfile.babel.js', ['default']);
});

gulp.task('lint:sass', () => gulp
  .src([
    paths.src + 'stylesheets/**/*.scss'
  ])
    .pipe(plugins.sassLint({
        rules: {
            'no-mergeable-selectors': 1, // Severity 1 (warning)
            'pseudo-element': 0,
            'no-ids': 0,
            'mixins-before-declarations': 0,
            'no-duplicate-properties': 0
        }
    }))
    .pipe(plugins.sassLint.format(stylish))
    .pipe(plugins.sassLint.failOnError())
);

// Default: compile everything
gulp.task('default',
  [
    'copy:govuk_template:css',
    'sass',
  ]
);

// Optional: recompile on changes
gulp.task('watch',
    ['watchForChanges']
);
