var fs   = Npm.require('fs');
var path = Npm.require('path');

var getAsset = function (filename) {
  return GetAnalyticsLib(filename);
}

var handler = function (compileStep) {
  var jsonPath = compileStep._fullInputPath;
  
  var analyticsConfiguration = compileStep.read().toString('utf8');
  
  if (analyticsConfiguration === '') {
    analyticsConfiguration = defaultConfiguration;
    fs.writeFileSync(jsonPath, analyticsConfiguration);
  }
  
  try {
    analyticsConfiguration = JSON.parse(analyticsConfiguration);
  } catch (e) {
    compileStep.error({
      message: e.message,
      sourcePath: compileStep.inputPath
    });
    return;
  }
  
  var libConfiguration = analyticsConfiguration.libs || {};
  
  var analyticsLibs = {};
  
  // Read through config file to see which analytics libs are enabled
  var analyticsLibsSetup = _.every(libConfiguration, function(enabled, libName) {
    
    var src = analyticsSources[libName];
    if (src == null) {
      compileStep.error({
        message: "The analytics library for " + libName + " at " + src + " does not exist.",
        sourcePath: compileStep.inputPath
      });
      return false; // Throw error and exit if we can't find the file.
    }
    
    if (!enabled) {
      return true; // If analytics provider is disabled, skip it
    }
    
    analyticsLibs[src] = src;
    // compileStep.error({
    //   message: "First lib: " + analyticsLibs[src],
    //   sourcePath: "analytics loop"
    // });
    // return false;
    //
    
    return true;
  });
  
  if (!analyticsLibsSetup) {
    return false;
  }
  
  
  for (var jsPath in analyticsLibs) {
    var file = getAsset(jsPath);
    compileStep.addJavaScript({
      path: jsPath,
      data: file,
      sourcePath: jsPath,
      bare: true
    });
  }
  
  
  // _.each(analyticsLibs, function(libSrc) {
  //   var lib = Asset.getText(libSrc);
  //   var libNameRegexp = /([a-zA-Z]*\.js)$/;
  //   var libName = libNameRegexp.exec(libSrc);
  //   compileStep.error({
  //     message: "in Analytics loop",
  //     sourcePath: "analytics loop"
  //   });
  //   return false;
  //
  //   compileStep.addJavaScript({
  //     path: 'client/compatability/' + libName,
  //     data: lib,
  //     sourcePath: libSrc,
  //     bare: true
  //   });
  // });
};

Plugin.registerSourceHandler('analytics.json', {archMatching: 'web'}, handler);
