'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const spsync = require('gulp-spsync-creds').sync;

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const production = {
    "username": "cromwel.m.penaranda@accenturemanilapdc.onmicrosoft.com",
    "password": "Avanade1234",
    "tenant": "accenturemanilapdc",
    "cdnSite": "sites/AkuminaAddIn/",
    "cdnLib" : "AppCatalog",
    "catalogSite": "/sites/AkuminaAddIn/"
}

const test = {
    "username": "cromwel.m.penaranda@accenturemanilapdc.onmicrosoft.com",
    "password": "Avanade1234",
    "tenant": "accenturemanilapdc",
    "cdnSite": "sites/AkuminaAddIn/",
    "cdnLib" : "AppCatalog",
    "catalogSite": "/sites/AkuminaAddIn/"
}

build.task('upload-to-sharepoint', {
	execute: (config) => {
		return new Promise((resolve, reject) => {
			const deployFolder = require('./config/copy-assets.json');
			const folderLocation = `./${deployFolder.deployCdnPath}/**/*.js`;
			
			return gulp.src(folderLocation)
			.pipe(spsync({
				"username": config.production ? production.username : test.username,
				"password": config.production ? production.password : test.password,
				"site": `https://${config.production ? production.tenant : test.tenant}.sharepoint.com/${config.production ? production.cdnSite : test.cdnSite}`,
				"libraryPath": config.production ? production.cdnLib : test.cdnLib,
				"publish": true
			}))
			.on('finish', resolve);
		});
	}
});

function handleError (err) {
	console.log("ERROR ENCOUNTERED: " + err.toString())
	process.exit(-1)
  }

build.task('upload-app-pkg', {
	execute: (config) => {
		return new Promise((resolve, reject) => {
			const pkgFile = require('./config/package-solution.json');
			const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;
			return gulp.src(folderLocation)
			.pipe(spsync({
				"username": config.production ? production.username : test.username,
				"password": config.production ? production.password : test.password,
				"site": `https://${config.production ? production.tenant : test.tenant}.sharepoint.com/${config.production ? production.catalogSite : test.catalogSite}`,
				"libraryPath": "AppCatalog",
				"publish": true
			}))					
			.on('finish', resolve)
			.on('error', handleError);
		});
	}
});
build.initialize(gulp);