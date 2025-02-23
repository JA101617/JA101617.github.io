window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']], // 行内公式
      displayMath: [['$$', '$$'], ['\\[', '\\]']], // 块级公式
      packages: ['base', 'ams'], // 启用 amsmath 包
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'], // 跳过不渲染的标签
      processHtmlClass: 'arithmatex', // 仅渲染具有此类名的内容
      linebreaks: { automatic: true } // 启用公式换行支持
    }
  };
  