const sonarqubeScanner = require('sonarqube-scanner');
const args = require('minimist')(process.argv.slice(2))

sonarqubeScanner( {
  serverUrl: 'https://sonarqube.unicornlab.online/',
  login : 'b475036f6b0c38ccff1484724ed1c648819b64d3',
  options : {
    'sonar.sources' : '.',
    'sonar.inclusions' : 'app/**',
    'sonar.projectName': 'uu_jokes_maing01-nodejs-server',
    'sonar.projectKey' : 'uu_jokes_maing01-nodejs-server',
    'sonar.javascript.lcov.reportPaths': './target/coverage/lcov/lcov.info',
    'sonar.dependencyCheck.jsonReportPath' : './dependency-check-reports/dependency-check-report.json',
    'sonar.dependencyCheck.htmlReportPath' : './dependency-check-reports/dependency-check-report.html',
    'sonar.test': './test',
    'sonar.test.inclusions': 'test/**',
    'sonar.qualitygate.wait' : 'true',
    'sonar.continue' : 'true'
  }
}, () => {});
