module.exports = config => {
    config.addPassthroughCopy('./src/assets/images');
    config.addPassthroughCopy('./src/assets/fonts'); //todo
    config.addPassthroughCopy('./src/robots.txt'); //todo
    config.addPassthroughCopy('./src/site.webmanifest') //todo

    config.setDataDeepMerge(true);

    return {    
      markdownTemplateEngine: 'njk',
      dataTemplateEngine: 'njk',
      htmlTemplateEngine: 'njk',
      dir: {
        input: 'src',
        output: 'dist'
      }
    };
  };
  