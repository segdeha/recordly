var gulp         = require( 'gulp' )
var gutil        = require( 'gulp-util' )
var sass         = require( 'gulp-sass' )
var babel        = require( 'gulp-babel' )
var uglify       = require( 'gulp-uglify' )
var concat       = require( 'gulp-concat' )
var cleancss     = require( 'gulp-cleancss' )
var browserify   = require( 'gulp-browserify' )
var sourcemaps   = require( 'gulp-sourcemaps' )
var autoprefixer = require( 'gulp-autoprefixer' )

const production = false
// const production = true

const config = {
	input     : {
		sass  : 'src/sass/*',
		babel : 'src/babel/app.js'
	},
	output : 'public/assets'
}

gulp.task( 'default', [ 'sass', 'babel', 'watch' ])

// compile scss
// concat vendor css with my compiled css
// move to dist/assets/styles.css
gulp.task( 'sass', function() {
	gulp.src( config.input.sass )
		.pipe( sourcemaps.init() ) // 🚧 don't use in production 🚧
		.pipe( sass() )
			.on( 'error', gutil.log )
		.pipe( concat( 'styles.css' ) )
		.pipe( autoprefixer({ browsers : [ 'Safari 5' ] }) )
		.pipe( cleancss({ keepBreaks : false }) )
		.pipe( sourcemaps.write() ) // 🚧 don't use in production 🚧
		.pipe( gulp.dest( config.output ) )
})

// transpile babel to js
// concat vendor js with my transpile js
// move to dist/assets/behaviors.js
gulp.task( 'babel', function () {
	gulp.src( config.input.babel )
		.pipe( sourcemaps.init() ) // 🚧 don't use in production 🚧

		.pipe( browserify({
			debug      : !production,
			transform  : [ 'reactify' ],
			extensions : [ '.js', '.jsx' ]
		}))
			.on( 'error', gutil.log )

		// make React available externally for dev tools
		.on( 'prebundle', function( bundler ) {
			bundler.require( 'react' );
		})

		.pipe( babel() )
			.on( 'error', gutil.log )
		// .pipe( uglify() ) // 🚧 only use in production 🚧
		.pipe( sourcemaps.write() ) // 🚧 don't use in production 🚧
		.pipe( gulp.dest( config.output ) )
})

// watch for changes and recompile automatically
gulp.task( 'watch', function() {
	gulp
		.watch( 'src/**/*.scss', [ 'sass' ] )
		.on( 'change', function( event ) {
			gutil.log( 'File ' + event.path + ' was ' + event.type + ', running tasks...' )
		})
	gulp
		.watch( 'src/**/*.js', [ 'babel' ] )
		.on( 'change', function( event ) {
			gutil.log( 'File ' + event.path + ' was ' + event.type + ', running tasks...' )
		})
})
