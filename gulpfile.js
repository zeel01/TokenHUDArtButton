const Gulp = require("gulp");
const zip = require("gulp-zip");

function createRelease(cb) {
	return Gulp.src([
		"module.json",
		"artbutton.js",
		"lang/*",
		"media-popout.html",
	], { base: "." })
		.pipe(zip("artbutton.zip"))
		.pipe(Gulp.dest("./"));
}

exports.zip = createRelease;
exports.default = createRelease;