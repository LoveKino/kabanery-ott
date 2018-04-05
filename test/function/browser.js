'use strict';

const browserJsEnv = require('browser-js-env');
const promisify = require('es6-promisify');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const readFile = promisify(fs.readFile);

const headlessOpen = async(url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });

  return {
    kill: () => {
      browser.close();
    }
  };
};

const runFileInBrowser = (file) => {
  return readFile(file).then((str) => {
    return browserJsEnv(str, {
      cwd: path.dirname(file),
      clean: true,
      open: headlessOpen
    });
  });
};

let testFiles = {
  'view:base': path.join(__dirname, '../browser/case/base.js')
};

describe('browser', () => {
  for (let name in testFiles) {
    it(name, () => {
      return runFileInBrowser(testFiles[name]);
    });
  }
});
