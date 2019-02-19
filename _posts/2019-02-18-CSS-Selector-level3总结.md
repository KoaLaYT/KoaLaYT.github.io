---
subject: CSS selector level 3 小结
classes: ["css"]
keywords: ["review"]
cover: css.jpg
specialStyle: selector.css
---
当前CSS选择器的标准是Level 3，其中定义的所有选择器可见[W3C](https://drafts.csswg.org/selectors-3/#combinators)，在MDN中更是有一份包含了Level 4的[详细清单](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)。为了以后参考方便，我先简单概述下`CSS`的`Cascade`和`Inheritance`原理，再说明选择器优先级的计算方法，一些常见的选择器及其用例总结在最后。

### 为什么要有`Cascade`和`Inheritance`

一张网页中对一个元素样式的定义不仅来源于开发人员提供的`.css`文件中，还有别的来源，其所有可能的拉来源包括：
- user agent / 浏览器
- user / 用户
- author / 开发人员
- animation / 动画效果创建的虚拟规则
- transition / 过渡效果创建的虚拟规则

因此同一个元素的某一属性可能被重复定义过，这时候就需要一个规则解决这些冲突，即`cascade`。同样的，一张样式表里不可能对所有元素的所有属性都有定义，当一个属性缺少定义时，需要一个规则来决定它的值，即`inheritance`。

### `cascade`规则概述
首先根据样式来源，并且结合`!important`，按如下顺序决定优先级（越在后面优先级越高）
1. Normal user agent declarations
2. Normal user declarations
3. Normal author declarations
4. Animation declarations
5. Important author declarations
6. Important user declarations
7. Important user agent declarations
8. Transition declarations

这里面有两个问题要澄清下：
- 根据规范，`!important`可以覆盖`animation`，但是在Chrome上有[bug](https://bugs.chromium.org/p/chromium/issues/detail?id=223450)，不能实现这一规则，而现在似乎只有Firefox是符合规范的。
- MDN上`transition`的优先级是最低的，根据我简单的测试，它的优先级至少是比`animation`低的，因此浏览器此处的行为也与规范有所差异。

之后根据来源按优先级分类完成后，同处一个来源的规则有冲突，则按如下方法计算选择器的优先级：
- 计算ID选择器个数 = a
- 计算类选择器、属性选择器和伪类的个数 = b
- 计算元素名选择器，伪元素的个数 = c

其比较方法是优先比较a的个数，越多优先级越高，a相同时比较b，最后是c。

注意：
1. `*`，四个结合器以及`:not()`是忽略的
2. `inline style`所属Author Origin，并且它的优先级高于一切选择器
3. 优先级不是10进制的，10个c不等于1个b。可以说它是无限进制的，1个b比任何个数的c都要大

```
/* 几个例子 优先级表示为(a, b, c) */
*                         (0, 0, 0)
li                        (0, 0, 1)
ul ol + li                (0, 0, 3)
h1 + [rel=up]             (0, 1, 1)  
#s12:not(foo)             (1, 0, 1)
```

最后，如果选择器优先级也相等，那么后定义的规则覆盖前面定义的规则。

### `inheritance`规则概述

继承规则比较简单，当一个元素的某一属性未被直接定义时，首先继承其父元素的值，如果无法继承，则使用初始值（initial value）

### Level 3选择器小结

#### 选择器组 / Groups of selectors
```css
h1 { color: red; }
h2 { color: red; }
h3 { color: red; }
/* 完全等价于 */
h1, h2, h3 {
  color: red;
}
/* 但是如果一组选择器中有一个是非法的，那么整个组的规则都会被弃用 */
h1, h2..foo, h3 {
  color: red /* h1, h3也会失效 */
}

h1 { color: red; }
h2..foo { color: red; } /* 不合法，仅此条不生效 */
h3 { color: red; }
```
#### 简单选择器 / Simple selectors
有关`@namespace`的部分应该与`HTML5`的关系不大，因此这部分略去了。

根据W3C标准的分类，简单选择器包括
- Type selector： `elementname`
- Universal selector: `*`
- Attribute selector: `[attribute=value]`
- Class selector: `.classname`
- ID selector: `#idname`
- Pseudo-classes: `:pseudoclass`

首先展开Attribute Selector：
```css
[attr]        /* 带有attr属性 */
[attr=val]    /* 属性值恰好为val */
[attr~=val]   /* 属性值以空格分割， 其中一个指恰好为val， 如果val中含有空格或本身为空格， 将会实效 */
[attr|=val]   /* 属性值为val 或 val- */

/* 下面三个和字符串匹配有关 */
[attr^=val]   /* 以val开头 */
[attr$=val]   /* 以val结尾 */
[attr*=val]   /* 含有val */
```
在Selector Level 4中新增了两个语法，即可以在之前六种（第一种除外）用法的最后加入`s`或`i`标签，分别代表`case-sensitive`和`case-insensitive`。（他们本身是`case-insensitive`的，即大小写都可以）
```css
a[href*="insensitive" i]    /* 大小写无关 */
a[href*="SensiTiVe" s]      /* 大小写相关，根据MDN，这条规则还在实验中 */
```
然后是Pseudo-classes：

- 常常与`<a>`相关的四个伪类

```css
/* 推荐按照以下顺序来为链接自定义样式 */
:link
:visited
:hover
:active
```

- `:focus`和`:focus-within`(level 4)

```
/* 如果一个元素自己或者任一后代处于`:focus`，那么`:focus-within`就会选中它。 */

<!-- html -->
<form>
  <p>
    <label>name: </label>
    <input>
  </p>
  <p>
    <label>age: </label>
    <input>
  </p>
</form>

<!-- css -->
form:focus-within {
  background-color: gray;
}
```
<section id="focus-demo" class="demo">
  <form>
    <p>
      <label>name: </label>
      <input>
    </p>
    <p>
      <label>age: </label>
      <input>
    </p>
  </form>
</section>

- `:target`

```
<!-- html -->
<ul>
  <li><a href="#para1">select para1</a></li>
  <li><a href="#para2">select para2</a></li>
</ul>
<p id="para1">demo para1</p>
<p id="para2">demo para2</p>

<!-- css -->
p:target::before {
  content:"➡️";
  padding-right: 1rem;
}
```
<section id="target-demo" class="demo">
  <ul>
    <li><a href="#para1">select para1</a></li>
    <li><a href="#para2">select para2</a></li>
  </ul>
  <p id="para1">demo para1</p>
  <p id="para2">demo para2</p>
</section>

- `:lang()`

```
下面这个例子中，用[lang|="fr"]只能选中body，而用:lang(fr)则能选中body和p

<!-- html -->
<body lang="fr">
  <p>Je suis francais</p>
</body>
```

- 和`<form>`状态相关

```
/* level 3定义的 */
:disabled
:enabled
:checked

/* 而在level 4中定义了更多，这里也就根据MDN上的内容罗列几个常用的 */
:in-range
:out-of-range

:invalid
:valid

:default
:required
:optional

:read-only
:read-write
```

- 和文本结构相关的伪类

```
/* 在CSS里都代表<html> */
:root
:scope    /* level 4 */

/* 与shadow DOM相关，定义在Scoping Module Level 1中 */
:host
:host()

/* 类似与nth-child(an+b)的一组伪类
 * b代表从子元素中的第b个开始计数，a代表迭代的步长, n从0开始+1
 * a的正负代表迭代选择的方向，正朝结尾，负朝开始 */
:nth-child()
:nth-last-child() /* 从结尾处开始计数 */
:nth-of-type()
:nth-last-of-type()
:first-child()
:last-child()
:first-of-type()
:last-of-type()
:only-child()
:only-type()
:empty()
```

- `:not()`

```
/* :not()不能嵌套:not()，只能包含简单选择器，即这一节的所有选择器 */
```

#### 伪元素 / Pseudo-elements
根据Level 3，伪元素包括`::after`, `::before`, `::first-letter`, `::first-line`

而在Level 4中，有用的有`::selection`, `::slotted()`(与shadow DOM相关)。
```
/* 鼠标选中的内容即为::selection */

<!-- html -->
<p>This text has special styles when you highlight it.</p>

<!-- css -->
p::selection {
  background-color: red;
  color: green;
}
```

<section id="selection-demo" class="demo">
  <p>This text has special styles when you highlight it.</p>
</section>

#### 结合器 / Combinators
```
A B       /* 所有A的后代B */
A > B     /* 所有的子元素B */
A + B     /* 与A有同一父元素的下一个相邻元素B */
A ~ B     /* 与A有同一父元素的所有后继元素B */
```
