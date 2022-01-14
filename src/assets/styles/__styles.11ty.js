const ENTRY_FILE_NAME = 'style.scss';

const path = require('path');
const sass = require('sass');

const CleanCSS = require('clean-css');
const { readFileSync } = require('fs');

const isProd = process.env.ELEVENTY_ENV === 'production';

module.exports = class {
    async data() {
        const entryPath = path.join(__dirname, `/${ENTRY_FILE_NAME}`);

        return {
            permalink: `/assets/styles/style.css`,
            eleventyExcludeFromCollections: true,
            entryPath
        };
    }

    async compile(path) {
        return new Promise((resolve, reject) => {
            let options = {};

            if (!isProd) {
                options.sourceMap = true
                options.sourceMapEmbed = true
                options.outputStyle = 'expanded'
            }

            return sass.compileAsync(path, options)
            .then(res => {
                resolve(res.css.toString());
            })
            .catch(err => {
                reject(err);
            });
        })
    }

    async minify(css) {
        return new Promise((resolve, reject) => {
            if (!isProd) {
                resolve(css);
            }

            const minified = new CleanCSS().minify(css);

            if (!minified.styles) {
                return reject(minified.error);
            }

            resolve(minified.styles);
        })
    }

    renderError(error) {
        return `
        /* Error compiling stylesheet */
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }
        html,
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            font-family: monospace;
            font-size: 1.25rem;
            line-height:1.5;
        } 
        body::before { 
            content: ''; 
            background: #000;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: 0.7;
            position: fixed;
        }
        body::after { 
            content: '${error}'; 
            white-space: pre;
            display: block;
            top: 0; 
            padding: 30px;
            margin: 50px;
            width: calc(100% - 100px);
            color:#721c24;
            background: #f8d7da;
            border: solid 2px red;
            position: fixed;
        }`
    }

    // render the CSS file
    async render({ entryPath }) {
        try {
            const css = await this.compile(entryPath);
            const result = await this.minify(css);

            return result;
        } catch (err) {
            if (isProd) {
                throw new Error(err);
            } else {
                console.error(err);
                const msg = err.formatted || err.message;
                return this.renderError(msg);
            }
        }
    }
}