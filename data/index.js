'use strict';
var util = require('util'),
        fs = require('fs'),
        path = require('path'),
        yeoman = require('yeoman-generator'),
        chalk = require('chalk'),
        _ = require('lodash'),
        _s = require('underscore.string'),
        shelljs = require('shelljs'),
        html = require("html-wiring"),
        scriptBase = require('../script-base'),
        figlet      = require('figlet');

var reservedWords_Java = ["ABSTRACT", "CONTINUE", "FOR", "NEW", "SWITCH", "ASSERT", "DEFAULT", "GOTO", "PACKAGE", "SYNCHRONIZED", "BOOLEAN", "DO", "IF", "PRIVATE", "THIS", "BREAK", "DOUBLE", "IMPLEMENTS", "PROTECTED", "THROW", "BYTE", "ELSE", "IMPORT", "PUBLIC", "THROWS", "CASE", "ENUM", "INSTANCEOF", "RETURN", "TRANSIENT", "CATCH", "EXTENDS", "INT", "SHORT", "TRY", "CHAR", "FINAL", "INTERFACE", "STATIC", "VOID", "CLASS", "FINALLY", "LONG", "STRICTFP", "VOLATILE", "CONST", "FLOAT", "NATIVE", "SUPER", "WHILE"];

// The JHipster reserved keywords are only for the entity names.
// They are used to generate AngularJS routes, so we cannot create an entity using one of the JHipster default routes.
var reservedWords_JHipster = ["ADMIN", "ACCOUNT", "LOGIN", "LOGOUT", "ACTIVATE", "SETTINGS", "PASSWORD", "SESSIONS", "METRICS", "HEALTH", "CONFIGURATION", "AUDITS", "LOGS", "REGISTER", "RESET", "TEST"];

var reservedWords_MySQL = ["ACCESSIBLE", "ADD", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC", "ASENSITIVE", "BEFORE", "BETWEEN", "BIGINT", "BINARY", "BLOB", "BOTH", "BY", "CALL", "CASCADE", "CASE", "CHANGE", "CHAR", "CHARACTER", "CHECK", "COLLATE", "COLUMN", "CONDITION", "CONSTRAINT", "CONTINUE", "CONVERT", "CREATE", "CROSS", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "CURRENT_USER", "CURSOR", "DATABASE", "DATABASES", "DAY_HOUR", "DAY_MICROSECOND", "DAY_MINUTE", "DAY_SECOND", "DEC", "DECIMAL", "DECLARE", "DEFAULT", "DELAYED", "DELETE", "DESC", "DESCRIBE", "DETERMINISTIC", "DISTINCT", "DISTINCTROW", "DIV", "DOUBLE", "DROP", "DUAL", "EACH", "ELSE", "ELSEIF", "ENCLOSED", "ESCAPED", "EXISTS", "EXIT", "EXPLAIN", "FALSE", "FETCH", "FLOAT", "FLOAT4", "FLOAT8", "FOR", "FORCE", "FOREIGN", "FROM", "FULLTEXT", "GRANT", "GROUP", "HAVING", "HIGH_PRIORITY", "HOUR_MICROSECOND", "HOUR_MINUTE", "HOUR_SECOND", "IF", "IGNORE", "IN", "INDEX", "INFILE", "INNER", "INOUT", "INSENSITIVE", "INSERT", "INT", "INT1", "INT2", "INT3", "INT4", "INT8", "INTEGER", "INTERVAL", "INTO", "IS", "ITERATE", "JOIN", "KEY", "KEYS", "KILL", "LEADING", "LEAVE", "LEFT", "LIKE", "LIMIT", "LINEAR", "LINES", "LOAD", "LOCALTIME", "LOCALTIMESTAMP", "LOCK", "LONG", "LONGBLOB", "LONGTEXT", "LOOP", "LOW_PRIORITY", "MASTER_SSL_VERIFY_SERVER_CERT", "MATCH", "MAXVALUE", "MEDIUMBLOB", "MEDIUMINT", "MEDIUMTEXT", "MIDDLEINT", "MINUTE_MICROSECOND", "MINUTE_SECOND", "MOD", "MODIFIES", "NATURAL", "NOT", "NO_WRITE_TO_BINLOG", "NULL", "NUMERIC", "ON", "OPTIMIZE", "OPTION", "OPTIONALLY", "OR", "ORDER", "OUT", "OUTER", "OUTFILE", "PRECISION", "PRIMARY", "PROCEDURE", "PURGE", "RANGE", "READ", "READS", "READ_WRITE", "REAL", "REFERENCES", "REGEXP", "RELEASE", "RENAME", "REPEAT", "REPLACE", "REQUIRE", "RESIGNAL", "RESTRICT", "RETURN", "REVOKE", "RIGHT", "RLIKE", "SCHEMA", "SCHEMAS", "SECOND_MICROSECOND", "SELECT", "SENSITIVE", "SEPARATOR", "SET", "SHOW", "SIGNAL", "SMALLINT", "SPATIAL", "SPECIFIC", "SQL", "SQLEXCEPTION", "SQLSTATE", "SQLWARNING", "SQL_BIG_RESULT", "SQL_CALC_FOUND_ROWS", "SQL_SMALL_RESULT", "SSL", "STARTING", "STRAIGHT_JOIN", "TABLE", "TERMINATED", "THEN", "TINYBLOB", "TINYINT", "TINYTEXT", "TO", "TRAILING", "TRIGGER", "TRUE", "UNDO", "UNION", "UNIQUE", "UNLOCK", "UNSIGNED", "UPDATE", "USAGE", "USE", "USING", "UTC_DATE", "UTC_TIME", "UTC_TIMESTAMP", "VALUES", "VARBINARY", "VARCHAR", "VARCHARACTER", "VARYING", "WHEN", "WHERE", "WHILE", "WITH", "WRITE", "XOR", "YEAR_MONTH", "ZEROFILL", "GENERAL", "IGNORE_SERVER_IDS", "MASTER_HEARTBEAT_PERIOD", "MAXVALUE", "RESIGNAL", "SIGNAL", "SLOW"];

var reservedWords_Postgresql = ["USER"];

var reservedWords_Cassandra = ["ADD", "ALL", "ALTER", "AND", "ANY", "APPLY", "AS", "ASC", "ASCII", "AUTHORIZE", "BATCH", "BEGIN", "BIGINT", "BLOB", "BOOLEAN", "BY", "CLUSTERING", "COLUMNFAMILY", "COMPACT", "CONSISTENCY", "COUNT", "COUNTER", "CREATE", "DECIMAL", "DELETE", "DESC", "DOUBLE", "DROP", "EACH_QUORUM", "FLOAT", "FROM", "GRANT", "IN", "INDEX", "CUSTOM", "INSERT", "INT", "INTO", "KEY", "KEYSPACE", "LEVEL", "LIMIT", "LOCAL_ONE", "LOCAL_QUORUM", "MODIFY", "NORECURSIVE", "NOSUPERUSER", "OF", "ON", "ONE", "ORDER", "PASSWORD", "PERMISSION", "PERMISSIONS", "PRIMARY", "QUORUM", "REVOKE", "SCHEMA", "SELECT", "SET", "STORAGE", "SUPERUSER", "TABLE", "TEXT", "TIMESTAMP", "TIMEUUID", "THREE", "TOKEN", "TRUNCATE", "TTL", "TWO", "TYPE", "UPDATE", "USE", "USER", "USERS", "USING", "UUID", "VALUES", "VARCHAR", "VARINT", "WHERE", "WITH", "WRITETIME", "DISTINCT", "BYTE", "SMALLINT", "COMPLEX", "ENUM", "DATE", "INTERVAL", "MACADDR", "BITSTRING"];

var reservedWords_Oracle = ["ACCESS", "ACCOUNT", "ACTIVATE", "ADD", "ADMIN", "ADVISE", "AFTER", "ALL", "ALL_ROWS", "ALLOCATE", "ALTER", "ANALYZE", "AND", "ANY", "ARCHIVE", "ARCHIVELOG", "ARRAY", "AS", "ASC", "AT", "AUDIT", "AUTHENTICATED", "AUTHORIZATION", "AUTOEXTEND", "AUTOMATIC", "BACKUP", "BECOME", "BEFORE", "BEGIN", "BETWEEN", "BFILE", "BITMAP", "BLOB", "BLOCK", "BODY", "BY", "CACHE", "CACHE_INSTANCES", "CANCEL", "CASCADE", "CAST", "CFILE", "CHAINED", "CHANGE", "CHAR", "CHAR_CS", "CHARACTER", "CHECK", "CHECKPOINT", "CHOOSE", "CHUNK", "CLEAR", "CLOB", "CLONE", "CLOSE", "CLOSE_CACHED_OPEN_CURSORS", "CLUSTER", "COALESCE", "COLUMN", "COLUMNS", "COMMENT", "COMMIT", "COMMITTED", "COMPATIBILITY", "COMPILE", "COMPLETE", "COMPOSITE_LIMIT", "COMPRESS", "COMPUTE", "CONNECT", "CONNECT_TIME", "CONSTRAINT", "CONSTRAINTS", "CONTENTS", "CONTINUE", "CONTROLFILE", "CONVERT", "COST", "CPU_PER_CALL", "CPU_PER_SESSION", "CREATE", "CURRENT", "CURRENT_SCHEMA", "CURREN_USER", "CURSOR", "CYCLE", " ", "DANGLING", "DATABASE", "DATAFILE", "DATAFILES", "DATAOBJNO", "DATE", "DBA", "DBHIGH", "DBLOW", "DBMAC", "DEALLOCATE", "DEBUG", "DEC", "DECIMAL", "DECLARE", "DEFAULT", "DEFERRABLE", "DEFERRED", "DEGREE", "DELETE", "DEREF", "DESC", "DIRECTORY", "DISABLE", "DISCONNECT", "DISMOUNT", "DISTINCT", "DISTRIBUTED", "DML", "DOUBLE", "DROP", "DUMP", "EACH", "ELSE", "ENABLE", "END", "ENFORCE", "ENTRY", "ESCAPE", "EXCEPT", "EXCEPTIONS", "EXCHANGE", "EXCLUDING", "EXCLUSIVE", "EXECUTE", "EXISTS", "EXPIRE", "EXPLAIN", "EXTENT", "EXTENTS", "EXTERNALLY", "FAILED_LOGIN_ATTEMPTS", "FALSE", "FAST", "FILE", "FIRST_ROWS", "FLAGGER", "FLOAT", "FLOB", "FLUSH", "FOR", "FORCE", "FOREIGN", "FREELIST", "FREELISTS", "FROM", "FULL", "FUNCTION", "GLOBAL", "GLOBALLY", "GLOBAL_NAME", "GRANT", "GROUP", "GROUPS", "HASH", "HASHKEYS", "HAVING", "HEADER", "HEAP", "IDENTIFIED", "IDGENERATORS", "IDLE_TIME", "IF", "IMMEDIATE", "IN", "INCLUDING", "INCREMENT", "INDEX", "INDEXED", "INDEXES", "INDICATOR", "IND_PARTITION", "INITIAL", "INITIALLY", "INITRANS", "INSERT", "INSTANCE", "INSTANCES", "INSTEAD", "INT", "INTEGER", "INTERMEDIATE", "INTERSECT", "INTO", "IS", "ISOLATION", "ISOLATION_LEVEL", "KEEP", "KEY", "KILL", "LABEL", "LAYER", "LESS", "LEVEL", "LIBRARY", "LIKE", "LIMIT", "LINK", "LIST", "LOB", "LOCAL", "LOCK", "LOCKED", "LOG", "LOGFILE", "LOGGING", "LOGICAL_READS_PER_CALL", "LOGICAL_READS_PER_SESSION", "LONG", "MANAGE", "MASTER", "MAX", "MAXARCHLOGS", "MAXDATAFILES", "MAXEXTENTS", "MAXINSTANCES", "MAXLOGFILES", "MAXLOGHISTORY", "MAXLOGMEMBERS", "MAXSIZE", "MAXTRANS", "MAXVALUE", "MIN", "MEMBER", "MINIMUM", "MINEXTENTS", "MINUS", "MINVALUE", "MLSLABEL", "MLS_LABEL_FORMAT", "MODE", "MODIFY", "MOUNT", "MOVE", "MTS_DISPATCHERS", "MULTISET", "NATIONAL", "NCHAR", "NCHAR_CS", "NCLOB", "NEEDED", "NESTED", "NETWORK", "NEW", "NEXT", "NOARCHIVELOG", "NOAUDIT", "NOCACHE", "NOCOMPRESS", "NOCYCLE", "NOFORCE", "NOLOGGING", "NOMAXVALUE", "NOMINVALUE", "NONE", "NOORDER", "NOOVERRIDE", "NOPARALLEL", "NOPARALLEL", "NOREVERSE", "NORMAL", "NOSORT", "NOT", "NOTHING", "NOWAIT", "NULL", "NUMBER", "NUMERIC", "NVARCHAR2", "OBJECT", "OBJNO", "OBJNO_REUSE", "OF", "OFF", "OFFLINE", "OID", "OIDINDEX", "OLD", "ON", "ONLINE", "ONLY", "OPCODE", "OPEN", "OPTIMAL", "OPTIMIZER_GOAL", "OPTION", "OR", "ORDER", "ORGANIZATION", "OSLABEL", "OVERFLOW", "OWN", "PACKAGE", "PARALLEL", "PARTITION", "PASSWORD", "PASSWORD_GRACE_TIME", "PASSWORD_LIFE_TIME", "PASSWORD_LOCK_TIME", "PASSWORD_REUSE_MAX", "PASSWORD_REUSE_TIME", "PASSWORD_VERIFY_FUNCTION", "PCTFREE", "PCTINCREASE", "PCTTHRESHOLD", "PCTUSED", "PCTVERSION", "PERCENT", "PERMANENT", "PLAN", "PLSQL_DEBUG", "POST_TRANSACTION", "PRECISION", "PRESERVE", "PRIMARY", "PRIOR", "PRIVATE", "PRIVATE_SGA", "PRIVILEGE", "PRIVILEGES", "PROCEDURE", "PROFILE", "PUBLIC", "PURGE", "QUEUE", "QUOTA", "RANGE", "RAW", "RBA", "READ", "READUP", "REAL", "REBUILD", "RECOVER", "RECOVERABLE", "RECOVERY", "REF", "REFERENCES", "REFERENCING", "REFRESH", "RENAME", "REPLACE", "RESET", "RESETLOGS", "RESIZE", "RESOURCE", "RESTRICTED", "RETURN", "RETURNING", "REUSE", "REVERSE", "REVOKE", "ROLE", "ROLES", "ROLLBACK", "ROW", "ROWID", "ROWNUM", "ROWS", "RULE", "SAMPLE", "SAVEPOINT", "SB4", "SCAN_INSTANCES", "SCHEMA", "SCN", "SCOPE", "SD_ALL", "SD_INHIBIT", "SD_SHOW", "SEGMENT", "SEG_BLOCK", "SEG_FILE", "SELECT", "SEQUENCE", "SERIALIZABLE", "SESSION", "SESSION_CACHED_CURSORS", "SESSIONS_PER_USER", "SET", "SHARE", "SHARED", "SHARED_POOL", "SHRINK", "SIZE", "SKIP", "SKIP_UNUSABLE_INDEXES", "SMALLINT", "SNAPSHOT", "SOME", "SORT", "SPECIFICATION", "SPLIT", "SQL_TRACE", "STANDBY", "START", "STATEMENT_ID", "STATISTICS", "STOP", "STORAGE", "STORE", "STRUCTURE", "SUCCESSFUL", "SWITCH", "SYS_OP_ENFORCE_NOT_NULL$", "SYS_OP_NTCIMG$", "SYNONYM", "SYSDATE", "SYSDBA", "SYSOPER", "SYSTEM", "TABLE", "TABLES", "TABLESPACE", "TABLESPACE_NO", "TABNO", "TEMPORARY", "THAN", "THE", "THEN", "THREAD", "TIMESTAMP", "TIME", "TO", "TOPLEVEL", "TRACE", "TRACING", "TRANSACTION", "TRANSITIONAL", "TRIGGER", "TRIGGERS", "TRUE", "TRUNCATE", "TX", "TYPE", "UB2", "UBA", "UID", "UNARCHIVED", "UNDO", "UNION", "UNIQUE", "UNLIMITED", "UNLOCK", "UNRECOVERABLE", "UNTIL", "UNUSABLE", "UNUSED", "UPDATABLE", "UPDATE", "USAGE", "USE", "USER", "USING", "VALIDATE", "VALIDATION", "VALUE", "VALUES", "VARCHAR", "VARCHAR2", "VARYING", "VIEW", "WHEN", "WHENEVER", "WHERE", "WITH", "WITHOUT", "WORK", "WRITE", "WRITEDOWN", "WRITEUP", "XID", "YEAR", "ZONE"];

var supportedValidationRules = ['required', 'max', 'min', 'maxlength', 'minlength', 'maxbytes', 'minbytes', 'pattern'];

// enum-specific vars
var enums = [];

var existingEnum = false;

var EntityGenerator = module.exports = function EntityGenerator(args, options, config) {
    yeoman.generators.NamedBase.apply(this, arguments);
    this.useConfigurationFile =false;
    this.env.options.appPath = this.config.get('appPath') || 'src/main/webapp';


    this.baseName = this.config.get('baseName');
    this.packageName = this.config.get('packageName');
    this.indexname = this.config.get('indexname');

    this.packageFolder = this.config.get('packageFolder');
    this.elastic = this.config.get('elastic');
    this.sql = this.config.get('sql');
    sql = this.sql;
    mongo = this.mongo;
    elastic = this.elastic;
    this.mongo = this.config.get('mongo');
    this.prodDatabaseType = this.config.get('prodDatabaseType');
    prodDatabaseType = this.prodDatabaseType;
    this.angularAppName = _s.camelize(_s.slugify(this.baseName)) + 'App';
    this.scrippsConfigDirectory = '.scripps';
    this.filename = this.scrippsConfigDirectory + '/' + _s.capitalize(this.name) + '.json';
    if (shelljs.test('-f', this.filename)) {
        console.log(chalk.green('Found the ' + this.filename + ' configuration file, automatically generating the entity'));
        try {
            this.fileData = JSON.parse(html.readFileAsString(this.filename))
        } catch (err) {
            console.log(chalk.red('The configuration file could not be read!'));
            return;
        }
        this.useConfigurationFile = true;
    }
    if (!(/^([a-zA-Z0-9_]*)$/.test(this.name))) {
        console.log(chalk.red('The entity name cannot contain special characters'));
        throw new Error("Validation error");
    } else if (this.name == '') {
        console.log(chalk.red('The entity name cannot be empty'));
        throw new Error("Validation error");
    } else if (this.name.indexOf("Detail", this.name.length - "Detail".length) !== -1) {
        console.log(chalk.red('The entity name cannot end with \'Detail\''));
        throw new Error("Validation error");
    } else if (reservedWords_Java.indexOf(this.name.toUpperCase()) != -1) {
        console.log(chalk.red('The entity name cannot contain a Java reserved keyword'));
        throw new Error("Validation error");
    } else if (reservedWords_JHipster.indexOf(this.name.toUpperCase()) != -1) {
        console.log(chalk.red('The entity name cannot contain a JHipster reserved keyword'));
        throw new Error("Validation error");
    } else if (prodDatabaseType == 'mysql' && reservedWords_MySQL.indexOf(this.name.toUpperCase()) != -1) {
        console.log(chalk.red('The entity name cannot contain a MySQL reserved keyword'));
        throw new Error("Validation error");
    } else if (prodDatabaseType == 'postgresql' && reservedWords_Postgresql.indexOf(this.name.toUpperCase()) != -1) {
        console.log(chalk.red('The entity name cannot contain a PostgreSQL reserved keyword'));
        throw new Error("Validation error");
    } else if (prodDatabaseType == 'cassandra' && reservedWords_Cassandra.indexOf(this.name.toUpperCase()) != -1) {
        console.log(chalk.red('The entity name cannot contain a Cassandra reserved keyword'));
        throw new Error("Validation error");
    } else if (prodDatabaseType == 'oracle' && reservedWords_Oracle.indexOf(this.name.toUpperCase()) != -1) {
        console.log(chalk.red('The entity name cannot contain a Oracle reserved keyword'));
        throw new Error("Validation error");
    } else if (prodDatabaseType == 'oracle' && _s.underscored(this.name).length > 26) {
        console.log(chalk.red('The entity name is too long for Oracle, try a shorter name'));
        throw new Error("Validation error");
    }
    console.log(chalk.yellow(figlet.textSync('Spring Stream: Data', { horizontalLayout: 'full' })));
    console.log(chalk.red('The entity ' + this.name + ' is being created.'));
    // Specific Entity sub-generator variables
    this.fieldId = 0;
    this.fields = [];
    this.relationshipId = 0;
    this.relationships = [];
    this.pagination = 'no';
    this.validation = false;
    this.dto = 'no';
};

var fieldNamesUnderscored = ['id'];
var sql;
var mongo;
var databaseType;
var prodDatabaseType;
var elastic;

util.inherits(EntityGenerator, yeoman.generators.Base);
util.inherits(EntityGenerator, scriptBase);

EntityGenerator.prototype.askForFields = function askForFields() {

    if (this.useConfigurationFile == true) {// don't prompt if data are imported from a file
        return;
    }
    var cb = this.async();
    this.fieldId++;
    console.log(chalk.green('Generating field #' + this.fieldId));
    var prompts = [
        {
            type: 'confirm',
            name: 'fieldAdd',
            message: 'Do you want to add a field to your entity?',
            default: true
        },
        {
            when: function (response) {
                return response.fieldAdd == true;
            },
            type: 'input',
            name: 'fieldName',
            validate: function (input) {
                if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
                    return 'Your field name cannot contain special characters';
                } else if (input == '') {
                    return 'Your field name cannot be empty';
                } else if (input.charAt(0) == input.charAt(0).toUpperCase()) {
                    return 'Your field name cannot start with a upper case letter';
                } else if (input == 'id' || fieldNamesUnderscored.indexOf(_s.underscored(input)) != -1) {
                    return 'Your field name cannot use an already existing field name';
                } else if (reservedWords_Java.indexOf(input.toUpperCase()) != -1) {
                    return 'Your field name cannot contain a Java reserved keyword';
                } else if (prodDatabaseType == 'mysql' && reservedWords_MySQL.indexOf(input.toUpperCase()) != -1) {
                    return 'Your field name cannot contain a MySQL reserved keyword';
                } else if (prodDatabaseType == 'postgresql' && reservedWords_Postgresql.indexOf(input.toUpperCase()) != -1) {
                    return 'Your field name cannot contain a PostgreSQL reserved keyword';
                } else if (prodDatabaseType == 'cassandra' && reservedWords_Cassandra.indexOf(input.toUpperCase()) != -1) {
                    return 'Your field name cannot contain a Cassandra reserved keyword';
                } else if (prodDatabaseType == 'oracle' && reservedWords_Oracle.indexOf(input.toUpperCase()) != -1) {
                    return 'Your field name cannot contain a Oracle reserved keyword';
                } else if (prodDatabaseType == 'oracle' && input.length > 30) {
                    return 'The field name cannot be of more than 30 characters';
                }
                return true;
            },
            message: 'What is the name of your field?'
        },
        {
            when: function (response) {
                return response.fieldAdd == true;
            },
            type: 'list',
            name: 'fieldType',
            message: 'What is the type of your field?',
            choices: [
                {
                    value: 'String',
                    name: 'String'
                },
                {
                    value: 'BigDecimal',
                    name: 'BigDecimal'
                },
                {
                    value: 'DateTime',
                    name: 'DateTime'
                },
                {
                    value: 'Boolean',
                    name: 'Boolean'
                }
            ],
            default: 0
        }
    ];
    this.prompt(prompts, function (props) {
        if (props.fieldAdd) {
            if (props.fieldIsEnum) {
                props.fieldType = _s.capitalize(props.fieldType);
            }

            var field = {
                fieldId: this.fieldId,
                fieldName: props.fieldName,
                fieldType: props.fieldType
                };

            fieldNamesUnderscored.push(_s.underscored(props.fieldName));
            this.fields.push(field);
        }
        console.log(chalk.red('=================' + _s.capitalize(this.name) + '================='));
        if (props.fieldAdd) {
            this.askForFields();
        } else {
            cb();
        }
    }.bind(this));
};

EntityGenerator.prototype.files = function files() {
    // Expose utility methods in templates
    this.util = {};
    this.util.contains = _.contains;

    if (this.useConfigurationFile == false) { // store informations in a file for further use.
        this.data = {};
        this.data.fields = this.fields;
        this.write(this.filename, JSON.stringify(this.data, null, 4));
    } else  {
        this.fields = this.fileData.fields;
    }

    // Load in-memory data for fields
    for (var idx in this.fields) {
        var field = this.fields[idx];

        if (_.isUndefined(field.fieldNameCapitalized)) {
            field.fieldNameCapitalized = _s.capitalize(field.fieldName);
        }

        if (_.isUndefined(field.fieldNameUnderscored)) {
            field.fieldNameUnderscored = _s.underscored(field.fieldName);
        }
    }
    this.fieldsContainDateTime = false;
    for (var idx in this.fields) {
        var field = this.fields[idx];
        if (field.fieldType == 'DateTime') {
            this.fieldsContainDateTime = true;
        }
    }
    this.fieldsContainBigDecimal = false;
    for (var idx in this.fields) {
        var field = this.fields[idx];
        if (field.fieldType == 'BigDecimal') {
            this.fieldsContainBigDecimal = true;
        }
    }
    this.entityClass = _s.capitalize(this.name);
    this.entityInstance = _s.decapitalize(this.name);

    this.differentTypes = [this.entityClass];

    var insight = this.insight();
    var interpolateRegex = /<%=([\s\S]+?)%>/g; // so that thymeleaf tags in templates do not get mistreated as _ templates
    insight.track('generator', 'entity');
    insight.track('entity/fields', this.fields.length);

    this.packageFolder = this.packageName.replace(/\./g, '/');

    this.template('src/main/java/package/dto/_Dto.java',
        'src/main/java/' + this.packageFolder + '/dto/' + this.entityClass + '.java', this, {});
};

EntityGenerator.prototype.getTableName = function(value) {
    return _s.underscored(value).toUpperCase();
};

EntityGenerator.prototype.getColumnName = function(value) {
    return _s.underscored(value).toLowerCase();
};
