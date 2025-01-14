# Splay {#Splay}

### 一些名词

- zig : 当前节点向父节点位置旋转
- zig-zig : 自己&父节点&再上一级节点方向相同，对自己&父节点进行同向旋转
- zig-zag : 自己&父节点，父节点&再上一级节点方向不同，对自己进行两次反向旋转

（配图见下）

> Splaying not only moves the accessed node to the root, but also roughly halves the depth of most nodes on the path.

### 操作

- Rotate

  - 以右旋为例，设当前节点 $x$， 父亲 $y$
    - $x$ 的右儿子给 $y$ ， $y$ 的左儿子给 $x$
    - 若 $y$ 有父亲 $z$ 则 $x$ 顶替 $y$ 的位置

  <details>
  	<summary> code </summary>
  	<pre><code>
    void Rotate(int x) {
      int y = fa[x], z = fa[y], chk = get(x);
      ch[y][chk] = ch[x][chk ^ 1];
      if (ch[x][chk ^ 1]) fa[ch[x][chk ^ 1]] = y;
      ch[x][chk ^ 1] = y;
      fa[y] = x;
      fa[x] = z;
      if (z) ch[z][y == ch[z][1]] = x;
      maintain(y);
      maintain(x);
    }
    </code></pre>
  </details>


  - 其中 `maintain` 只是维护子树信息，由具体使用决定，一般是 $O(1)$ ， 因而整个操作 $O(1)$ 


- Splay

  - 核心操作，将一个节点一路转到根

<details>
	<summary> code </summary>
	<pre><code>
  bool get(int x) { return x == ch[fa[x]][1]; }
  void Splay(int x) {
    for (int f = fa[x]; f = fa[x], f; rotate(x))
      if (fa[f]) Rotate(get(x) == get(f) ? f : x);
    rt = x;
  }
    </code></pre>
</details>


  - 复杂度单次可能 $O(N)$ ，但是均摊是 $O(\log N)$ 的，分析见下
- Find

  - 一路往下找 + splay上去
  - $ O(\log{N})$ 
- Delete

  - 找到点并splay上去，如果计数为1则删除节点，否则合并两棵子树（查询当前根节点的前驱，将其设为根，并将其右儿子设为另一棵树的根）

<details>
	<summary> code </summary>
	<pre><code>  void Delete(int k) {
    Find(k);
    if (cnt[rt] > 1) {
      cnt[rt]--;
      Maintain(rt);
      return;
    }
    if (!ch[rt][0] && !ch[rt][1]) {
      Clear(rt);
      rt = 0;
      return;
    }
    if (!ch[rt][0]) {
      int cur = rt;
      rt = ch[rt][1];
      fa[rt] = 0;
      Clear(cur);
      return;
    }
    if (!ch[rt][1]) {
      int cur = rt;
      rt = ch[rt][0];
      fa[rt] = 0;
      Clear(cur);
      return;
    }
    int cur = rt, x = Pre();
    fa[ch[cur][1]] = x;
    ch[x][1] = ch[cur][1];
    Clear(cur);
    Maintain(rt);
  }
    </code></pre>
</details>


  - $O(\log N)$

- Insert操作

  - 一路往下找+splay上去
  - $O(\log{N})$

### Splay操作的复杂度分析

写完才发现oiwiki上有很详细的分析...挂个[链接](https://oi-wiki.org/ds/splay/#时间复杂度)

- 势能函数$\Phi(p) =\sum_{i\in subtree(p)} \log{S(i)}$，其中 $S(i)$ 指 $i$ 的子树大小。记 $\log{S(i)} = rank(i)$ ，则 $\Phi(p)=\sum_{i\in subtree(p)} rank(i)$

- zig, zig-zig, zig-zag本体复杂度为1,2,2

- zig : 

  <img src="/img/ads/ads-SplayZig.png" alt="ads-SplayZig" style="zoom:67%;" />


$$
  \begin{aligned}
  \hat{c_i} =& 1 + \Phi(T_2) - \Phi(T_1)\\
   = &1 + R_2(x) - R_1(x) + (R_2(p) - R_1(p))\\
   \leq &1 + R_2(x) - R_1(x)
   \end{aligned}
$$

- zig-zag: 

<img src="/img/ads/ads-SplayZigZag.jpg" alt="ads-SplayZigZag" style="zoom:67%;" />


$$
\begin{aligned}
 \hat{c_i} =& 2 + \Phi(T_2) - \Phi(T_1)\\
   = &2 + R_2(x) - R_1(x) + R_2(p) - R_1(p) + R_2(g) - R_1(g)\\
  
\end{aligned}
$$
  因为$R_1(g) = R_2(x)$
  故
$$
\begin{aligned}
\hat{c_i} = &2 - (R_1(x) + R_1(p) )+ R_2(p)  + R_2(g)\\
  \leq &2 - 2R_1(x) + R_2(p) + R_2(g)
\end{aligned}
$$

  又因为 $ R_2(p) = \log{(1+A+B)}$, $ R_2(g) = \log{(1+C+D)}$ ，$R_2(x) = \log(3+A+B+C+D)$

  令 $a = 1+A+B$ , $b = 1 + C + D$  , $ c = 3 + A + B + C + D$ , 则 $a+b\leq c$ ，$\log{a}+\log{b} =\log{(ab)}\leq \log{\frac{c^2}{4}} = 2\log{c} - 2$ ， 即 
$$
2+R_2(p)+R_2(g)\leq 2R_2(x)
$$
  所以
$$
\hat{c_i} \leq 2(R_2(x)-R_1(x))
$$

- zig-zig : 

  <img src="/img/ads/ads-SplayZigZig.png" alt="ads-SplayZigzig" style="zoom:67%;" />


$$
  \begin{aligned}
  \hat{c_i} =& 2 + \Phi(T_2) - \Phi(T_1)\\
   = &2 + R_2(x) - R_1(x) + R_2(p) - R_1(p) + R_2(g) - R_1(g)\\
   = &2 + R_2(p) + R_2(g) - R_1(p) - R_1(x)\\
   \leq &2 + R_2(x) + R_2(g) - 2R_1(x)
   \end{aligned}
$$

  同理zig-zag的均值不等式可得$ R_1(x)+R_2(g)-2R_2(x)\leq -2$ ，即 $2R_2(x) - R_1(x) - R_2(g)\ge 2$

  所以
$$
  \begin{aligned}
  \hat{c_i} \leq &2 + R_2(x) + R_2(g) - 2R_1(x)\leq 3(R_2(x)-R_1(x))
  \end{aligned}
$$

​		假设一次splay共计进行了 $n$ 步，因为单zig只会在转到根出现，则总复杂度
$$
T_n \leq 1+3(R_n(x)-R_0(x))
$$
​		而$R_n(x)$ 为 $O(\log{N})$的，所以splay操作也是$O(\log{N})$的

​		值得注意的是$R_0(x)$不一定为0

### 作业题

<details>
	<summary> T1：access(splay)操作 </summary>
	<img src="/img/ads/Splay-T1.jpg" alt="RBT-T1" />
    <pre>Tips:与父亲同向则先转父亲，否则先转自己（然后都要转一次自己）</pre>
</details>