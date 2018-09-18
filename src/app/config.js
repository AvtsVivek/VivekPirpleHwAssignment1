/*
* 
* 
*/


// Container for all the environment.
var environments = {};

// Staging {default} environment. 

environments.staging = {
    'httpPort': 2000,
    'httpsPort': 2001,
    'envName' : 'Staging'
}

// Production environment.
environments.production = {
    'httpPort': 6000,
    'httpsPort': 6001,
    'envName' : 'Production'
}

// Determine which environment is passed through the command line.
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// The current evn is one that we defined. That is we have staging or production, so current env shuld be one of them. 
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module.
module.exports = environmentToExport;