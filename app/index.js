'use strict'; 
var util        = require('util'),
    path        = require('path'),
    yeoman      = require('yeoman-generator'),
    chalk       = require('chalk'),
    _           = require('underscore.string'),
    shelljs     = require('shelljs'),
    scriptBase  = require('../script-base'),
    packagejs   = require(__dirname + '/../package.json'),
    crypto      = require("crypto"),
    mkdirp      = require('mkdirp'),
    html        = require("html-wiring"),
    ejs         = require('ejs'),
    figlet      = require('figlet'),
    clear       = require('clear');

var SianGenerator = module.exports = function SianGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = JSON.parse(html.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SianGenerator, yeoman.generators.Base);
util.inherits(SianGenerator, scriptBase);

SianGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    clear();
    
    console.log(chalk.yellow(figlet.textSync('Spring Stream: Init', { horizontalLayout: 'full' })));

    console.log('\nWelcome to the Sian Generator v' + packagejs.version + '\n');
    var insight = this.insight();
    var questions = 7; // making questions a variable to avoid updating each question by hand when adding additional options

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
            message: '(3/' + questions + ') What is the git repo name?',
            default: 'change/me'
        },
        {
            type: 'input',
            name: 'port',
            validate: function (input) {
                if (/^([0-9_]*)$/.test(input)) return true;
                return 'Not a valid port';
            },
            message: '(4/' + questions + ') What port would you like to use?',
            default: '8080'
        },
        {
            type: 'input',
            name: 'dockerrootrepo',
            message: '(5/' + questions + ') What is the docker root repo name?'
        },
        {
            type: 'input',
            name: 'zookeeperurl',
            message: '(6/' + questions + ') What is the production zookeeper url?'
        },
        {
            type: 'input',
            name: 'kafkaurl',
            message: '(7/' + questions + ') What is the production kafka url?'
        }
    ];

    this.baseName               = this.config.get('baseName');
    this.packageName            = this.config.get('packageName');
    this.gitreponame            = this.config.get('gitreponame');
    this.dockerrootrepo         = this.config.get('dockerrootrepo');
    this.packageNameGenerated   = this.config.get('packageNameGenerated');
    this.port                   = this.config.get('port');
    this.zookeeperurl           = this.config.get('zookeeperurl');
    this.kafkaurl               = this.config.get('kafkaurl');

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
            this.port                   = props.port;
            this.dockerrootrepo         = props.dockerrootrepo;
            this.zookeeperurl           = props.zookeeperurl;
            this.kafkaurl               = props.kafkaurl;

            var generated               = ".generated";
            this.packageNameGenerated   = props.packageName +  generated;
            
            cb();
        }.bind(this));
    }
};

SianGenerator.prototype.app = function app() {
    var insight = this.insight();
    insight.track('generator', 'app');

    this.packageFolder = this.packageName.replace(/\./g, '/');
    
     // so that tags in templates do not get mistreated as _ templates
    this.angularAppName = _.camelize(_.slugify(this.baseName)) + 'App';
    this.camelizedBaseName = _.camelize(this.baseName);
    this.slugifiedBaseName = _.slugify(this.baseName);


    doroot(this);
    dodocs(this);
    dogradlew(this);
    dogradle(this);
    doapp(this);
    dodockerkafka(this);
    doJbehave(this, this.packageFolder); 
    doIntegrationTest(this);
    doFunctional(this, this.packageFolder);
    dotest(this);

    this.config.set('baseName',             this.baseName);
    this.config.set('packageName',          this.packageName);
    this.config.set('packageNameGenerated', this.packageNameGenerated);
    this.config.set('gitreponame'),         this.gitreponame;  
    this.config.set('packageFolder'),       this.packageFolder;
    this.config.set('port'),                this.port;
    this.config.set('dockerrootrepo',       this.dockerrootrepo);
    this.config.set('zookeeperurl',         this.zookeeperurl );
    this.config.set('kafkaurl',             this.kafkaurl);
};

function dotest(thing) {
    var testResourceDir = 'src/test/resources/';
    thing.template(testResourceDir + 'config/_application.yml', testResourceDir + 'config/application.yml', thing, {});
    thing.template(testResourceDir + '_logback-test.xml', testResourceDir + 'logback-test.xml', thing, {});
    thing.copy('src/test/groovy/placeholder','src/test/groovy/placeholder');
}

function doFunctional(thing, packageFolder) {
    var srcFolder  = 'src/functional/groovy/package/functional/';
    var destFolder = 'src/functional/groovy/' + packageFolder + '/functional/';
    thing.copy('gradle/conf/test/restassured.gradle', 'gradle/conf/test/restassured.gradle');
    thing.template(srcFolder + '_AbstractFunctionTest.groovy', 
        destFolder + 'AbstractFunctionTest.groovy', thing, {});
}


function doIntegrationTest(thing) {
    var groovyItTest = 'src/integration/groovy/' + thing.packageFolder + '/it/';
    thing.template('src/integration/groovy/package/it/_AbstractItTest.groovy', groovyItTest + 'AbstractItTest.groovy', thing, {});
    
}

function dodockerkafka(thing) {
    thing.copy('docker-kafka/broker-list.sh',                       'docker-kafka/broker-list.sh');
    thing.copy('docker-kafka/create-topics.sh',                     'docker-kafka/create-topics.sh');
    thing.copy('docker-kafka/docker-compose-single-broker.yml',     'docker-kafka/docker-compose-single-broker.yml');
    thing.copy('docker-kafka/Dockerfile',                           'docker-kafka/Dockerfile');
    thing.copy('docker-kafka/download-kafka.sh',                    'docker-kafka/download-kafka.sh');
    thing.copy('docker-kafka/start-kafka.sh',                       'docker-kafka/start-kafka.sh');
}

function dodocs(thing) {
    thing.template('_README.md',                 'README.md', thing, {});
    thing.template('docs/_dev_env_setup.md',     'docs/dev_env_setup.md', thing, {});
    thing.template('docs/_dev_project_setup.md', 'docs/dev_project_setup.md', thing, {});
    thing.template('docs/_kafka_setup.md',       'docs/kafka_setup.md', thing, {});
    thing.template('docs/_streams.md',           'docs/steams.md', thing, {});
}

function doroot(thing) {
    thing.template('_README.md',                'README.md', thing, {});
    thing.copy('.gitignore',                    '.gitignore');
    thing.copy('LICENSE',                       'LICENSE');
    thing.template('_Jenkinsfile',              'Jenkinsfile', thing, {});
    thing.template('_Dockerfile',               'Dockerfile', thing, {}); 
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
    thing.copy('gradle/conf/streams.gradle',            'gradle/conf/streams.gradle');
    // Set up and stuff.
    thing.copy('gradle/conf/ide.gradle',                'gradle/conf/ide.gradle');
    thing.copy('gradle/conf/metrics.gradle',            'gradle/conf/metrics.gradle');
    thing.copy('gradle/conf/utils.gradle',              'gradle/conf/utils.gradle');
    thing.copy('gradle/conf/websockets.gradle',         'gradle/conf/websockets.gradle');
    
    // Testing
    thing.copy('gradle/conf/test/restassured.gradle',   'gradle/conf/test/restassured.gradle');
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

function doJbehave(thing, packageFolder) {

    var srcJavaDir = 'src/jbehave/java/package/jbehave/';
    var targetJavaDir = 'src/jbehave/java/' + packageFolder + '/jbehave/';

    thing.template(srcJavaDir + '_AbstractSpringJBehaveStory.java',       targetJavaDir + 'AbstractSpringJBehaveStory.java', thing, {});
    thing.template(srcJavaDir + '_AcceptanceTest.java',                   targetJavaDir + 'AcceptanceTest.java', thing, {});
    thing.template(srcJavaDir + '_AcceptanceTestsConfiguration.java',     targetJavaDir + 'AcceptanceTestsConfiguration.java', thing, {});
    thing.template(srcJavaDir + '_Steps.java',                            targetJavaDir + 'Steps.java', thing, {});

    var srcGroovyPackage = 'src/jbehave/groovy/package/jbehave/facade/';
    var targetGroovyPackage = 'src/jbehave/groovy/' + packageFolder + '/jbehave/facade/';
    thing.template(srcGroovyPackage + '_ExampleOfHowToBehave.groovy',     targetGroovyPackage + 'ExampleOfHowToBehave.groovy', thing, {}); 

    var srcStoryPackage = 'src/jbehave/stories/package/jbehave/facade/';
    var targetStoryPackage = 'src/jbehave/stories/' + packageFolder + '/jbehave/facade/';
    thing.template( srcStoryPackage + '_example_of_how_to_behave.story',     targetStoryPackage  + 'example_of_how_to_behave.story', thing, {}); 
}
















