'use strict';

module.exports = function(grunt) {
	var pkg, taskName, ect_var;
	pkg = grunt.file.readJSON('package.json');
	grunt.initConfig({
		// 簡易サーバ
		browserSync: {
			dev: {
				bsFiles: {
					src: ["dist/src/**/*.*js", "dist/**/*.html"]
				},
				options: {
					//watchTask: true,
					server: 'dist',
				}
			}
		}
	});

	// GruntFile.jsに記載されているパッケージを自動読み込み
	for(taskName in pkg.devDependencies) {
		if(taskName.substring(0, 6) == 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}
	
	grunt.registerTask('default', ['browserSync']);
	
	grunt.registerTask('eatwarnings', function() {
		grunt.warn = grunt.fail.warn = function(warning) {
			grunt.log.error(warning);
		};
	});

};
