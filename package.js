Package.describe({
  summary: "Reaction Analytics - Integrate third-party analytics libraries",
  name: "reactioncommerce:reaction-analytics",
  version: "1.0.3",
  git: "https://github.com/reactioncommerce/reaction-analytics.git"
});

Package.registerBuildPlugin({
  name: 'analyticsConfigurator',
  use: [
    'underscore@1.0.3',
    'reactioncommerce:reaction-analytics-libs@1.0.1'
  ],
  sources: [
    'server/buildtools/analyticsSources.js',
    'server/buildtools/defaultConfiguration.js',
    'server/buildtools/analyticsConfigurator.js'
  ],
  npmDependencies: {}
});

Package.on_use(function (api, where) {
  api.versionsFrom('METEOR@1.0');
  api.use("meteor-platform@1.2.2");
  api.use("less");
  api.use("jquery");
  api.use('browser-policy-content', 'server');
  api.use('iron:router@1.0.9', 'client');
  api.use("reactioncommerce:core@0.7.0");
  api.use("reactioncommerce:reaction-analytics-libs@1.0.1", 'client');

  api.addFiles([
    "common/routing.js",
    "common/collections.js"
  ], ["client", "server"]);

  api.addFiles([
    "client/startup.js",
    "client/templates/reactionAnalytics/reactionAnalytics.html",
    "client/templates/reactionAnalytics/reactionAnalytics.js"
  ], ["client"]);

  api.addFiles([
    "server/security/browserPolicy.js",
    "server/security/AnalyticsEvents.js",
    "server/publications.js",
    "server/register.js"
  ], ["server"]);
});
