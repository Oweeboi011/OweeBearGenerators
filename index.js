'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');



module.exports = yeoman.generators.Base.extend({
  //Configurations will be loaded here.
  //Ask for user input
  prompting: function() {
    var done = this.async();
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your project name',
      //Defaults to the project's folder name if the input is skipped
      default: this.appname
    }, function(answers) {
      this.props = answers;
      this.log(answers.name);
      done();
    }.bind(this));
  },
  //Writing Logic here
  writing: {
    //Copy the configuration files
    config: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          name: this.props.name
        }
      );
      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile'), {
          name: this.props.name
        }
      );
    },

    app: function() {
      this.fs.copyTpl(
        this.templatePath('_server.js'),
        this.destinationPath('server.js'), {
          name: this.props.name
        }
      );
      //app logo
      this.fs.copy(
        this.templatePath('assets/images/oweebearApps.png'),
        this.destinationPath('src/assets/images/oweebearApps.png')
      );
      this.fs.copy(
        this.templatePath('assets/scripts/bootstrap.min.js'),
        this.destinationPath('src/assets/scripts/bootstrap.min.js')
      );
      this.fs.copy(
        this.templatePath('assets/scripts/jquery.min.js'),
        this.destinationPath('src/assets/scripts/jquery.min.js')
      );
      this.fs.copy(
        this.templatePath('assets/scripts/react-bootstrap.min.js'),
        this.destinationPath('src/assets/scripts/react-production.min.js')
      );
    }
  },
  install: function() {
    this.installDependencies();
  }
});