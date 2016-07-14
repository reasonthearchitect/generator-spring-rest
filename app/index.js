'use strict'; 
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    _ = require('underscore.string'),
    shelljs = require('shelljs'),
    scriptBase = require('../script-base'),
    packagejs = require(__dirname + '/../package.json'),
    crypto = require("crypto"),
    mkdirp = require('mkdirp'),
    html = require("html-wiring"),
    ejs = require('ejs');

var SianGenerator = module.exports = function SianGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = JSON.parse(html.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SianGenerator, yeoman.generators.Base);
util.inherits(SianGenerator, scriptBase);

SianGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    console.log(chalk.red('\n' +
        '              _    __    _       __        ___   ____  _      __        \n' +
        '             | |  / /\\  \\ \\  /  / /\\      | | \\ | |_  \\ \\  / ( (`       \n' +
        '           \\_|_| /_/--\\  \\_\\/  /_/--\\     |_|_/ |_|__  \\_\\/  _)_)       \n'));

    console.log('\nWelcome to the Sian Generator v' + packagejs.version + '\n');
    var insight = this.insight();
    var questions = 2; // making questions a variable to avoid updating each question by hand when adding additional options

     var prompts = [
        {
            type: 'input',
            name: 'baseName',
            validate: function (input) {
                if (/^([a-zA-Z0-9_]*)$/.test(input)) return true;
                return 'Your application name cannot contain special characters or a blank space, using the default name instead';
            },
            message: '(1/' + questions + ') What is the base name of your application?',
            default: 'test'
        },
        {
            type: 'input',
            name: 'packageName',
            validate: function (input) {
                if (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)) return true;
                return 'The package name you have provided is not a valid Java package name.';
            },
            message: '(2/' + questions + ') What is your default Java package name?',
            default: 'com.tek.myservice'
        },
        {
            type: 'input',
            name: 'gitreponame',
            validate: function (input) {
                if (/^([a-zA-Z0-9_]*\/[a-zA-Z0-9_]*)$/.test(input)) return true;
                return 'Not a valid Git URL';
            },
            message: '(3/' + questions + ') What is the parent git repo name?',
            default: 'reasonthearchitect/<change-me>'
        }

    ];
    console.log("1");
    this.baseName               = this.config.get('baseName');
    this.packageName            = this.config.get('packageName');
    this.gitreponame            = this.config.get('gitreponame')
    this.packageNameGenerated   = this.config.get('packageNameGenerated');

    if (this.baseName != null &&
        this.packageName != null
        ) {
            console.log(chalk.green('This is an existing project, using the configuration from your .yo-rc.json file \n' +
            'to re-generate the project...\n'));
        cb();
    } else {
        this.prompt(prompts, function (props) {
            if (props.insight !== undefined) {
                insight.optOut = !props.insight;
            }
            this.baseName               = props.baseName;
            this.packageName            = props.packageName;
            this.gitreponame            = props.gitreponame;
            var generated               = ".generated";
            this.packageNameGenerated   = props.packageName +  generated;
            
            cb();
        }.bind(this));
    }
};

SianGenerator.prototype.app = function app() {
    var insight = this.insight();
    insight.track('generator', 'app');

    var packageFolder = this.packageName.replace(/\./g, '/');
    var javaDir = 'src/main/java/' + packageFolder + '/';
    var groovyItTest = 'src/integration/groovy/' + packageFolder + '/it/';
    var resourceDir = 'src/main/resources/';
    var conf = "conf/"
    var webappDir = 'src/main/webapp/';
     // so that tags in templates do not get mistreated as _ templates
    this.angularAppName = _.camelize(_.slugify(this.baseName)) + 'App';
    this.camelizedBaseName = _.camelize(this.baseName);
    this.slugifiedBaseName = _.slugify(this.baseName);
    
    doroot(this);
    dodocs(this);
    dogradlew(this);
    dogradle(this);
    doapp(this);
    doconcourse(this);

    this.config.set('baseName',             this.baseName);
    this.config.set('packageName',          this.packageName);
    this.config.set('packageNameGenerated', this.packageNameGenerated);
    this.config.set('gitreponame'),         this.gitreponame;      
};

function dodocs(thing ) {
    thing.template('_README.md',                'README.md', thing, {});
    thing.template('docs/_pipeline.md',         'docs/pipeline.md', thing, {});
    thing.template('docs/_developersetup.md',   'docs/developersetup.md', thing, {});
}

function doconcourse(thing) {

    thing.template('_pipeline.yml',             'pipeline.yml', thing, {});
    thing.copy('credentials.example.yml',       'credentials.yml');
    thing.template('ci/tasks/_package.yml',     'ci/tasks/package.yml', thing, {});
    thing.template('ci/scripts/_package.sh',    'ci/scripts/package.sh', thing, {});
    thing.template('_Dockerfile',               'Dockerfile', thing, {});
}

function doroot(thing) {
    thing.template('_README.md',                'README.md', thing, {});
    thing.copy('.gitignore',                    '.gitignore');
    thing.copy('LICENSE',                       'LICENSE');
    thing.template('_Vagrantfile',              'Vagrantfile', thing, {});
}

function dogradlew(thing) {
    thing.copy('gradlew',                                   'gradlew');
    thing.copy('gradlew.bat',                               'gradlew.bat');
    thing.copy('gradle/wrapper/gradle-wrapper.jar',         'gradle/wrapper/gradle-wrapper.jar');
    thing.copy('gradle/wrapper/gradle-wrapper.properties',  'gradle/wrapper/gradle-wrapper.properties');
}

function dogradle(thing) {

    thing.copy('build.gradle',                              'build.gradle');
    thing.template('_gradle.properties',                    'gradle.properties', thing, {});
    thing.template('_settings.gradle',                      'settings.gradle', thing, {});
    thing.copy('gradle/conf/profiles/profile_dev.gradle',   'gradle/conf/profiles/profile_dev.gradle');
    thing.copy('gradle/conf/profiles/profile_prod.gradle',  'gradle/conf/profiles/profile_prod.gradle');
    thing.copy('gradle/conf/profiles/profile_fast.gradle',  'gradle/conf/profiles/profile_fast.gradle');

    // *** runtime
    thing.copy('gradle/conf/boot.gradle',               'gradle/conf/boot.gradle');
    thing.copy('gradle/conf/groovy.gradle',             'gradle/conf/groovy.gradle');
    thing.copy('gradle/conf/jackson.gradle',            'gradle/conf/jackson.gradle');
    thing.copy('gradle/conf/kafka.gradle',              'gradle/conf/kafka.gradle');
    thing.copy('gradle/conf/lombok.gradle',             'gradle/conf/lombok.gradle');
    thing.copy('gradle/conf/meta.gradle',               'gradle/conf/meta.gradle');
    thing.copy('gradle/conf/spring-cloud.gradle',       'gradle/conf/spring-cloud.gradle');
    
    // Set up and stuff.
    thing.copy('gradle/conf/ide.gradle',                'gradle/conf/ide.gradle');
    thing.copy('gradle/conf/metrics.gradle',            'gradle/conf/metrics.gradle');
    thing.copy('gradle/conf/utils.gradle',              'gradle/conf/utils.gradle');
    
    // Testing
    thing.copy('gradle/conf/test/restassured.gradle',   'gradle/conf/test/restassured.gradle');
    thing.copy('gradle/conf/test/sonar.gradle',         'gradle/conf/test/sonar.gradle');
    thing.copy('gradle/conf/test/unit.gradle',          'gradle/conf/test/unit.gradle');
    thing.copy('gradle/conf/test/integration.gradle',   'gradle/conf/test/integration.gradle');
    thing.copy('gradle/conf/test/jbehave.gradle',       'gradle/conf/test/jbehave.gradle');
}

function doapp(thing, interpolateRegex) {
    var javaGeneratedDir = 'src/main/java/' + thing.packageFolder + '/generated/';
    var resourceDir = 'src/main/resources/';
    var interpolateRegex = /<%=([\s\S]+?)%>/g;

    // Resources
    thing.template(resourceDir + '_logback.xml', resourceDir + 'logback.xml', thing, {'interpolate': interpolateRegex});
    thing.template(resourceDir + '/config/_application.yml', resourceDir + 'config/application.yml', thing, {});
    thing.template(resourceDir + '/config/_application-dev.yml', resourceDir + 'config/application-dev.yml', thing, {});
    thing.template(resourceDir + '/config/_application-prod.yml', resourceDir + 'config/application-prod.yml', thing, {});
    thing.template(resourceDir + '/config/_application.yml', resourceDir + 'config/application.yml', thing, {});
    thing.template(resourceDir + '/config/_application.yml', resourceDir + 'config/application.yml', thing, {});
    thing.template(resourceDir + '/config/_application-dev.yml', resourceDir + 'config/application-dev.yml', thing, {});
    thing.template(resourceDir + '/config/_application-prod.yml', resourceDir + 'config/application-prod.yml', thing, {});
    
    // Code
    thing.template('src/main/java/package/_Application.java',     'src/main/java/'+ thing.packageFolder +'/Application.java', thing, {});
    thing.template('src/main/java/package/config/_Constants.java', javaGeneratedDir + 'config/Constants.java', thing, {});
    thing.template('src/main/java/package/config/apidoc/_SwaggerConfiguration.java', javaGeneratedDir + 'config/apidoc/SwaggerConfiguration.java', thing, {});
    thing.template('src/main/java/package/config/_JacksonConfiguration.java', javaGeneratedDir + 'config/JacksonConfiguration.java', thing, {});
    thing.template('src/main/java/package/config/_MetricsConfiguration.java', javaGeneratedDir + 'config/MetricsConfiguration.java', thing, {});
    thing.template('src/main/java/package/domain/util/_CustomLocalDateSerializer.java', javaGeneratedDir + 'domain/util/CustomLocalDateSerializer.java', thing, {});
    thing.template('src/main/java/package/domain/util/_CustomDateTimeSerializer.java', javaGeneratedDir + 'domain/util/CustomDateTimeSerializer.java', thing, {});
    thing.template('src/main/java/package/domain/util/_CustomDateTimeDeserializer.java', javaGeneratedDir + 'domain/util/CustomDateTimeDeserializer.java', thing, {});
    thing.template('src/main/java/package/domain/util/_ISO8601LocalDateDeserializer.java', javaGeneratedDir + 'domain/util/ISO8601LocalDateDeserializer.java', thing, {});
}
















