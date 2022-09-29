# READEME.md

## 部署

```bash
DOCKER_BUILDKIT=0 docker build -t htmltopdf:latest .
# docker run -d --rm --name htmltopdf -p 3000:3000 htmltopdf:latest
docker run -d --restart unless-stopped --name htmltopdf -p 3000:3000 htmltopdf:latest
```

## 尝试/了解过的方法

### wkhtmltopdf   

大部分情况体验很好，而且对表格支持也不错，但是当出现表格中的 td 内容太多时，会出现文字截断的情况，尝试过网上的  `page-break-*` 的各种方案均没有解决。看了其源码，它是通过 QT 的 WebEngine 生成一个打印版的 pdf，类似于 chrome 中的打印预览为 pdf，然后输出 pdf 页，不过可能是由于 `wkhtmltopdf 12.6 patched QT` 中的 QT 太旧（基于 QT4.8 的 fork），所以导致预览效果并没有 chrome 那么好。所以导出的 pdf 会出现这种问题。

### jsPDF + html2canvas  

jsPDF 对 utf8 的支持不太友好，网上也有相关的解决方案，比如指定字体等。我的需求需要使用自己的字体，并且 jsPDF 只支持文本渲染，如果想要支持网页渲染，则需要使用 html2canvas 将网页转化为图像，然后通过算法去截取成 pdf 页，基于图像生成的 pdf 没办法拷贝，所以就没有继续调研了。

### pdfmake   

通过 json 对象的方式生成 pdf，我本身用的是 html 文本，懒得转了，效果未知。
