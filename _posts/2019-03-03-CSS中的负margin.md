---
subject: CSS中的负margin
classes: ["css"]
keywords: ["review"]
cover: css.jpg
specialStyle: negative-margin.css
---
这篇文章旨在厘清有关margin在CSS中的一些性质，特别是关于负margin的特性。主要参考的是CSS: The Definitive Guide, 4th Edition和CSS Mastery, 3rd Edition。

### 水平方向上的margin
如果假设`box-sizing: content-box`，那么影响水平布局的因素包括：
- `margin-left`
- `border-left`
- `padding-left`
- `width`
- `padding-right`
- `border-right`
- `margin-right`

如果假设`box-sizing: border-box`，那么可以简化为：
- `margin-left`
- `width`
- `margin-right`

下面的讨论都基于`border-box`来展开。

基本原则：
1. `margin-left + width + margin-right = parent element width`
2. 如果三个值出现过定义，总是`margin-right`被重置为符合第一条原则的值
3. 水平方向的`margin`不会collapse

下面是一些示例：
- parent element width指的是`content-box`

<section class="demo">
  <div class="margin-demo">
    <div id="parent-width" class="demo-example">
      <div>
        <p>
          left margin 10px
        </p>
        <p>
          NO left margin
        </p>
      </div>
    </div>
    <pre class="demo-code">
&lt;div style="width: 250px; padding: 10px; outline: 1px solid red;">
  &lt;p style="width: 200px; margin-left: 10px;">
    left margin 10px
  </p>
  &lt;p style="width: 200px;">
    NO left margin
  </p>
</div>
    </pre>
  </div>
</section>

- 设置一个auto。该值会被设置为符合第一原则的值

<section class="demo">
  <div class="margin-demo">
    <div id="auto-width" class="demo-example">
      <div>
        <p>
          left margin auto
        </p>
        <p>
          width auto
        </p>
        <p>
          right margin auto
        </p>
      </div>
    </div>
    <pre class="demo-code">
&lt;div style="width: 250px; padding: 10px; outline: 1px solid red;">
  &lt;p style="margin-left: auto; width: 200px; margin-right: 10px;">
    left margin auto
  </p>
  &lt;p style="margin-left: 10px; width: auto; margin-right: 10px;">
    width auto
  </p>
  &lt;p style="margin-left: 10px; width: 200px; margin-right: auto;">
    right margin auto
  </p>
</div>
    </pre>
  </div>
</section>

- 设置两个auto。如果仅设置一边的margin，该值会被设置为0；但是如果两边的margin都为auto，那么它们会均分剩下的空间，产生居中的效果

<section class="demo">
  <div class="margin-demo">
    <div id="auto-width2" class="demo-example">
      <div>
        <p>
          left margin auto<br>
          width auto
        </p>
        <p>
          left margin auto<br>
          right margin auto
        </p>
        <p>
          width auto<br>
          right margin auto
        </p>
      </div>
    </div>
    <pre class="demo-code">
&lt;div style="width: 250px; padding: 10px; outline: 1px solid red;">
  &lt;p style="margin-left: auto; width: auto; margin-right: 10px;">
    left margin auto
    width auto
  </p>
  &lt;p style="margin-left: auto; width: 200px; margin-right: auto;">
    left margin auto
    right margin auto
  </p>
  &lt;p style="margin-left: 10px; width: auto; margin-right: auto;">
    width auto
    right margin auto
  </p>
</div>
    </pre>
  </div>
</section>

- 设置三个auto。两边的margin都被重置为0。

<section class="demo">
  <div class="margin-demo">
    <div id="auto-width3" class="demo-example">
      <div>
        <p>
          left margin auto<br>
          width auto<br>
          right margin auto
        </p>
      </div>
    </div>
    <pre class="demo-code">
&lt;div style="width: 250px; padding: 10px; outline: 1px solid red;">
  &lt;p style="margin-left: auto; width: auto; margin-right: auto;">
    left margin auto
    width auto
    right margin auto
  </p>
</div>
    </pre>
  </div>
</section>

- 负margin。有了上述例子作为基础，可以理解负margin和正margin的原理是一样的，都是需要满足第一原则。

<section class="demo">
  <div class="margin-demo">
    <div id="negative-margin" class="demo-example">
      <div>
        <p>
          left negative margin
        </p>
        <p>
          right negative margin
        </p>
        <p>
          both negative margin
        </p>
      </div>
    </div>
    <pre class="demo-code">
&lt;div style="width: 250px; padding: 10px; outline: 1px solid red;">
  &lt;p style="margin-left: -20px; width: auto; margin-right: 10px;">
    left negative margin
  </p>
  &lt;p style="margin-left: 10px; width: auto; margin-right: -20px;">
    right negative margin
  </p>
  &lt;p style="margin-left: -20px; width: auto; margin-right: -20px;">
    both negative margin
  </p>
</div>
    </pre>
  </div>
</section>

### 竖直方向上的margin

影响高度的的因素同样在`box-sizing: content-box`下包括：
- `margin-top`
- `border-top`
- `padding-top`
- `height`
- `padding-bottom`
- `border-bottom`
- `margin-bottom`

在`box-sizing: border-box`下简化为：
- `margin-top`
- `height`
- `margin-bottom`

它的基本原则比较复杂，我们可以直接从例子中观察：
- 如果父级元素没有`padding`或者`border`，那么子元素的margin会“溢出”；但如果父元素有`padding`或者`border`，那么子元素的margin和父元素的padding不会重叠。

<section class="demo">
  <div class="margin-demo">
    <div id="auto-height" class="demo-example">
      <div>
        <p>
          parent element with NO padding or border
        </p>
      </div>
      <div>
        <p>
          parent element with padding or border
        </p>
      </div>
    </div>
    <pre class="demo-code">
&lt;div style="width: 250px; outline: 1px solid red;">
  &lt;p style="margin-top: 10px; margin-bottom: 10px;">
    parent element with NO padding or border
  </p>
</div>
&lt;div style="width: 250px; padding-top: 10px; padding-bottom: 10px; outline: 1px solid red;">
  &lt;p style="margin-top: 10px; margin-bottom: 10px;">
    parent element with padding or border
  </p>
</div>
    </pre>
  </div>
</section>

- 竖直方向上相邻元素的`margin`会互相重叠，即`margin collapse`。多个正margin重叠时，最终值取其中的最大值。当多个负margin和正margin重叠时，取最大的正margin和最小的负margin的和。

<section class="demo">
  <div class="margin-demo">
    <div id="margin-collapse" class="demo-example">
      <div>
        <ul>
          <li>ul margin bottom 10px</li>
          <li>li margin bottom 20px</li>
        </ul>
        <h1>h1 margin top 5px</h1>
      </div>
      <div>
        <ul>
          <li>ul margin bottom 10px</li>
          <li>li margin bottom -15px</li>
        </ul>
        <h1>h1 margin top 5px</h1>
      </div>
    </div>
    <pre class="demo-code">
&lt;div style="width: 250px; outline: 1px solid red;">
  &lt;ul style="margin-bottom: 10px;">
    &lt;li style="margin-bottom: 20px;">ul margin bottom 10px</li>
    &lt;li style="margin-bottom: 20px;">li margin bottom 20px</li>
  </ul>
  &lt;h1 style="margin-bottom: 5px;">h1 margin top 5px</h1>
</div>
&lt;div style="width: 250px; outline: 1px solid red;">
  &lt;ul style="margin-bottom: 10px;">
    &lt;li style="margin-bottom: -15px;">ul margin bottom 10px</li>
    &lt;li style="margin-bottom: -15px;">li margin bottom -15px</li>
  </ul>
  &lt;h1 style="margin-bottom: 5px;">h1 margin top 5px</h1>
</div>
    </pre>
  </div>
</section>

关于负margin的特性，在CSS Mastery一书中有很好的总结：
> - A negative margin to the left or top will pull the element in that direction, overlapping any elements next to it.
- A negative right or bottom margin will pull in any adjacent elements so that they overlap the element with the negative margin.
- On a floated element, a negative margin opposite the float direction will decrease
the float area, causing adjacent elements to overlap the floated element. A negative
margin in the direction of the float will pull the floated element in that direction.
- Finally, the behavior of negative margins to the sides is slightly moderated when
used on a nonfloating element without a defined width. In that case, negative
margins to the left and right sides both pull the element in that direction. This
expands the element, potentially overlapping any adjacent elements.

书中利用负margin以及绝对定位作出了文本标注的效果，如下所示：

<section class="demo">
  <div class="comment-effect">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <aside>a comment example</aside>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
</section>

顺带提一句，书中还介绍了三角形的画法，利用的是`border`的特性。这里我就直接截图了。

<img src="/assets/images/triangles-in-css.png">

### `flex`和`grid`中的margin

对`flex`中的子元素应用`margin: auto`，会使`margin`充满可用的空间，因此可以作出垂直和水平居中的效果。

<section class="demo">
  flex wrapper
  <div class="flex-margin">
    <div><code>margin: auto;</code></div>
  </div>
</section>

对`grid`也是一样的。
