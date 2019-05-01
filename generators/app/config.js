module.exports = {
    options: {
      'skip-welcome-message': {
        desc: 'Skips the welcome message',
        type: Boolean
      },
      'skip-install-message': {
        desc: 'Skips the message after the installation of dependencies',
        type: Boolean
      },
      'test-framework': {
        desc: 'Test framework to be invoked',
        type: String,
        defaults: 'mocha'
      }
    },
    prompts: [
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which additional Avanade-SPFX features would you like to include?',
        choices: [
         {
           name: 'Full-blown Avanade-SPFX Pattern',
           value: 'includeSPFXAva',
           checked: true
          },
          {
            name: 'Avanade Look and Feel GUI (not yet ready)',
            value: 'includeSass',
            checked: false
          },
          {
            name: 'SFPX/Azure Services (not yet ready)',
            value: 'includeBootstrap',
            checked: false
          },

        ]
      }
    ],
    dirsToCreate: ['assets/images', 'assets/scripts', 'services/'],
    filesToCopy: [
      {
        input: 'gitignore',
        output: '.gitignore'
      },
      {
        input: 'gitattributes',
        output: '.gitattributes'
      },
      {
        input: 'editorconfig',
        output: '.editorconfig'
      },
      {
        input: 'assets/images/oweebearApps.png',
        output: 'assets/images/oweebearApps.png'
      },
      {
        input: 'assets/scripts/bootstrap.min.js',
        output: 'assets/scripts/bootstrap.min.js'
      },
      {
        input: 'assets/scripts/jquery.min.js',
        output: 'assets/scripts/jquery.min.js'
      },
      {
        input: 'assets/scripts/react-bootstrap.min.js',
        output: 'assets/scripts/react-bootstrap.min.js'
      },
      {
        input: 'assets/scripts/react.production.min.js',
        output: 'assets/scripts/react.production.min.js'
      },
      {
        input: 'services/o365SP_CommonService.ts',
        output: 'services/o365SP_CommonService.ts'
      },
      {
        input: 'services/o365SP_AzureService.ts',
        output: 'services/o365SP_AzureService.ts'
      }
    ],
    filesToRender: [
      {
        input: '_gulpfile.js',
        output: 'gulpfile.js'
      },
      {
        input: '_package.json',
        output: 'package.json'
      }
    ]
  };