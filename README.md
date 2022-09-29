# READEME.md

## Deployment

```bash
DOCKER_BUILDKIT=0 docker build -t htmltopdf:latest .
# docker run -d --rm --name htmltopdf -p 3000:3000 htmltopdf:latest
docker run -d --restart unless-stopped --name htmltopdf -p 3000:3000 htmltopdf:latest
```

## Usage 

```bash
curl -H 'Content-Type: application/json' --data '{"html": "http://www.baidu.com"}' -X POST "http://localhost:3000/pdf" -o test.pdf
```

## Other ways

### wkhtmltopdf   

大部分情况体验很好，而且对表格支持也不错，但是当出现表格中的 td 内容太多时，会出现文字截断的情况，尝试过网上的  `page-break-*` 的各种方案均没有解决。看了其源码，它是通过 QT 的 WebEngine 生成一个打印版的 pdf，类似于 chrome 中的打印预览为 pdf，然后输出 pdf 页，不过可能是由于 `wkhtmltopdf 12.6 patched QT` 中的 QT 太旧（基于 QT4.8 的 fork），所以导致预览效果并没有 chrome 那么好。所以导出的 pdf 会出现这种问题。

#### 想出了一种优化方案
A4 纸的宽度为：210mm X 297mm；分别设置上下左右边界为：10mm；在默认情况下，中间区域支持的像素是 1298px；因为我的内容是一个纯表格，所以可以通过计算设置每行为固定高度（59px，1298px刚好是其整数倍）；并且要求 td 里面的内容也满足固定高度，对于多行文本，应该在末尾插入一空行（纠正 td 边界宽度导致的像素偏移），下面是生成脚本：

```bash
wkhtmltopdf \
  --enable-local-file-access \
  --page-size A4 \
  --margin-top 10mm \
  --margin-bottom 10mm \
  --margin-left 10mm \
  --margin-right 10mm \
  test.html test.pdf
```

### jsPDF + html2canvas  

jsPDF 对 utf8 的支持不太友好，网上也有相关的解决方案，比如指定字体等。我的需求需要使用自己的字体，并且 jsPDF 只支持文本渲染，如果想要支持网页渲染，则需要使用 html2canvas 将网页转化为图像，然后通过算法去截取成 pdf 页，基于图像生成的 pdf 没办法拷贝，所以就没有继续调研了。

### pdfmake   

通过 json 对象的方式生成 pdf，我本身用的是 html 文本，懒得转了，效果未知。

### chromehtmltopdf

这是一个用户因为 wkhtmltopdf 使用旧的 web engine，从而构建一个基于 chrome 内核的导出工具，依赖一些环境，没有尝试过了。
