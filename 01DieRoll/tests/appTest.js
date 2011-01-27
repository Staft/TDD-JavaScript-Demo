/*global YUI, app, authorsName, rollDie */
/*jslint onevar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true */
// Create new YUI instance, and populate it with the required modules
YUI().use('node', 'console', 'test', function(Y) {
 
  var unitTests, reporter;
  
  //
  // SUPPORT FUNCTIONS
  //
  function authorsNameExists() {
    return ( "string" === typeof(authorsName) ) ? true : false;
  }

  unitTests = new Y.Test.Case({
 
    name: "Testing Die Roll implementation",

    setUp :
    function () {
    },

    tearDown :
    function () {
    },

    "test that a global variable named authorsName exists" :
    function () {
      Y.assert( authorsNameExists(), "You need a global variable named authorsName defined in app.js located in the src folder" );
    },

    "test that the variable authorsName follows the proper format" :
    function () {
      var re, sourceString;
      
      re = /^[A-Za-z\'\-]+\s+[A-Za-z\'\-]+/;
      sourceString = authorsNameExists() ? authorsName : "";
      
      Y.Assert.isNotNull( sourceString.match(re), "The variable authorsName must have a value of 'Yourfirstname Yourlastname' (insert your own name)" );
    },

    "test that function rollDie is declared" :
    function () {
      Y.assert( "function" === typeof rollDie, "You need a function that will allow users of your code to roll a six-sided die. This function must be named rollDie, and defined in app.js located in the src folder" );
      Y.Assert.areEqual( 0, rollDie.length, "function rollDie must have no input parameter" );
     },
     
     "test that rollDie returns a numeric value" : 
     function () {
       Y.Assert.isNumber( rollDie(), "function rollDie should return a number" );
     },    

     "test that rollDie returns an integer numeric value" : 
     function () {
       var i, result;
       for(i = 0; i < 10; i = i + 1) {
         result = rollDie();
         Y.Assert.areEqual( Math.floor(result), result, "function rollDie should return an integer (whole number)" );
       }
     },    

    "test that the highest rolled value is 6" :
    function () {
      var i, max = 0;
      for(i = 0; i < 100000; i = i + 1) {
        max = Math.max(max, rollDie());
      }
      Y.Assert.areEqual( max, 6, "The maximimum possible die roll should be 6" );
    },

    "test that the lowest rolled value is 1" :
    function () {
      var i, min = 99;
      for(i = 0; i < 100000; i = i + 1) {
        min = Math.min(min, rollDie());
      }
      Y.Assert.areEqual( min, 1, "The minimum possible die roll should be 1" );
    }

  });


  function logResultsToServer(data){
    var testResults, serverReporter;
    
    testResults = Y.Test.Runner.getResults();
    serverReporter = new Y.Test.Reporter("http://nwghost.com/tdd-collector.php", Y.Test.Format.TAP);
    serverReporter.addField("authorsName", authorsNameExists() ? authorsName : "UNKNOWN AUTHOR");
    serverReporter.report(testResults);
  }

  reporter = new Y.Console({
      newestOnTop: false
  });  

  reporter.render("#testReport");
  Y.Test.Runner.add(unitTests);
  Y.Test.Runner.subscribe(Y.Test.Runner.COMPLETE_EVENT, logResultsToServer);
  Y.Test.Runner.run();
  
 });