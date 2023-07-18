const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { mkdtemp, rm, writeFile } = require('node:fs/promises');
const { createPdf } = require('./pptr');
const os = require("os");
const bodyParser = require('body-parser');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const urlPattern = /^https?:\/\/\w+/;
const defaultPdfOpts = {
  format: 'A4',
  scale: 0.5,
  printBackground: true,
  displayHeaderFooter: true,
  margin: { left: "10mm", right: "10mm", bottom: "60mm", top: "10mm" },
  footerTemplate: '<p style="font-size:12px;margin-left: 550px;"><span class="pageNumber"></span>/<span class="totalPages"></span></p>'
};

// @描述 提供一个接口用于将 html 转化为 pdf 文件
// @参数 html     字符串；这里可以传入 body 或者 url
// @参数 pdfOpts  对象；生成 pdf 的设置参数
// @返回 返回 pdf 文件流
app.post('/pdf', async function (req, res) {
  let params = req.body;
  let d = await mkdtemp(os.tmpdir());
  let htmlPath;
  if (urlPattern.test(params.html)) {
    htmlPath = params.html
  } else {
    localPath = path.join(d, 'document.html');
    await writeFile(localPath, params.html);
    htmlPath = `file://${localPath}`;
  }

  let pdfPath = path.join(d, 'document.pdf');
  let pdfOpts = Object.assign({ path: pdfPath }, defaultPdfOpts, params.pdfOpts);
  await createPdf(htmlPath, pdfOpts);

  rm(d, { recursive: true, force: true }); // 异步删除临时目录
  res.sendFile(pdfPath);
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
