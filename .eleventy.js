require('dotenv').config();
const { EleventyI18nPlugin } = require("@11ty/eleventy");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
      // any valid BCP 47-compatible language tag is supported
      defaultLanguage: "en", // Required, this site uses "en"
      errorMode: "never"
    });
    markdownTemplateEngine: "njk";
    eleventyConfig.addPlugin(inclusiveLangPlugin);
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
    
    // Add date filter for formatting ISO dates
    eleventyConfig.addFilter("dateFilter", (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    });
    
    // Copy Static Files to /_Site
    eleventyConfig.addPassthroughCopy({
    "./admin/config.yml": "./admin/config.yml",
    });
  };