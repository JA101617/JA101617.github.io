---
title: ADS学习笔记
published: 2024-09-24
description: 'ADS课程中的课堂笔记及课后的少量补充'
image: ''
tags: [algorithm,ads]
category: 'notebook'
draft: false 
lang: 'zh-CN' 

---

# 导航

- [补天](#SOS)

## 数据结构

- [AVL](#AVL)
- [Splay](#Splay)
- [B+ Tree](#B+)
- [RB Tree](#RB)
- [Leftist Heap](#Leftist)
- [Skew Heap](#Skew)
- [Binomial Heap](#Binomial)

## 算法

- [Backtracking](#backtracking)
- [Divide and Conquer](#DivideConquer)
- [DP](#DP)
- [Greedy](#Greedy)
- [NPC](#NPC)
- [Approximation](#approx)
- [Local Search](#local)
- [Randomized Algorithms](#random)
- [Parallel Algorithms](#parallel)
- [External Sorting](#external)


**注**：下文代码使用C++，以结构体数组实现

## Amortized Analysis均摊分析  

**$\text{worst-case bound}\ge\text{amortized bound}\ge\text{average-case bound}$**

### Aggregate Analysis

- $n$ 个操作总最差用时 $T(n)$， 则 amortized cost 为 $\dfrac{ T(n) } { n }$ 

### Accounting method

- 类似存款存入不会比取出少，设计每种操作的均摊成本$\hat{c_i}$ ，当某次操作的 $\hat{c_i} > c_i$ 差额被称为 credit ，后面如果存在 $\hat{c_i} < c_i$ 的情况，差额可以用 credit 补上，则

$$
T_{amortized} = \dfrac{\sum \hat{c_i} }{n} \ge \dfrac{\sum c_i}{n}
$$

### Potential method

- 定义势能函数 $\Phi(D_i)$ ，则前文的 credit 就演化为 $\hat{c_i}-c_i = Credit_i = \Phi(op_i)-\Phi( op_{ i-1 } )$

  

$$
\begin{aligned}
\sum_{ i=1 }^n  \hat{c_i} &= \sum_{i=1}^n (c_i+\Phi(op_i)-\Phi( op_{i-1} ) )\\
&= \Phi(op_n)-\Phi(op_0)+\sum_{i=1}^n c_i
\end{aligned}
$$

需要$\Phi(op)$的复杂度不高于 $\displaystyle\sum_{i=1}^n \hat{c_i}$，方便起见可以让$\Phi(op_0)=0$

### 作业题

<details>
	<summary> T1：概念辨析 </summary>
	<pre>
	When doing amortized analysis, which one of the following statements is FALSE?
	A.Aggregate analysis shows that for all n, a sequence of n operations takes worst-case time T(n) in total.  Then the amortized cost per operation is therefore T(n)/n
	B.For potential method, a good potential function should always assume its maximum at the start of the sequence
	C.For accounting method, when an operation's amortized cost exceeds its actual cost, we save the difference as credit to pay for later operations whose amortized cost is less than their actual cost
	D.The difference between aggregate analysis and accounting method is that the later one assumes that the amortized costs of the operations may differ from each other
	Answer : B
	</pre>
</details>
<details>
	<summary> T2：势能函数设计 </summary>
	<img src="/img/ads/AmortizedT2-5.jpg" alt="image-20241111204947435" />
    <pre>Answer : D</pre>
    <img src="https://zhoutimemachine.github.io/note/courses/imgs/ads/ads_hw_1.2.png" alt="1.2"/>
</details>





## AVL Trees<a id="AVL"></a>

**定义：** 

- 空树是平衡的
- 非空树是平衡的当且仅当左右子树是平衡的且其高度差不超过1

**注**：定义空树高度为-1

**Balance Factor：** $BF(node) = h_L-h_R$

- 没有绝对值，可以为负，对于平衡的树，BF取值为$\pm 1$或 $0$
- 故当某节点的BF值不为上述值则需要调整

**树高**

- 记 $n_h$ 为树高 h 的情况下节点数最小值，那么 $n_h = n_{h-1} + n_{h-2} + 1 $ 
- 与斐波那契对照，可得 $n_h = F_{h+3}-1$ 
- 从斐波那契数列的通项可以看出 $h = O(\log{N})$

<details>
	<summary> 结构体定义 </summary>
	<pre><code>
struct Node{
	int lson, rson, val, h;
}t[maxn];
  </code></pre>
</details>



### Rotation Operations

- **Left-Rotate**

<details>
	<summary> code </summary>
	<pre><code>
int Lrotate(int p){
    int rs = t[p].rson;
    t[p].rson = t[rs].lson;
    t[rs].lson = p;
    t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    t[rs].h = max(H(t[rs].lson),H(t[rs].rson))+1;
    return rs;
}
  </code></pre>
</details>


- **Right-Rotate**

<details>
	<summary> code </summary>
	<pre><code>
int Rrotate(int p){
    int ls = t[p].lson;
    t[p].lson = t[ls].rson;
    t[ls].rson = p;
    t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    t[ls].h = max(H(t[ls].lson),H(t[ls].rson))+1;
    return ls;
}
  </code></pre>
</details>


<img src="/img/ads/ads-AVLRotate.png" alt="ads-AVLRotate" style="zoom:67%;" />

- **LR-Rotate**：先以 $ls$ 为中心左旋再以 $p$ 为中心右旋

<details>
	<summary> code </summary>
	<pre><code>
int LRrotate(int p){
    t[p].lson = Lrotate(t[p].lson);
    return Rrotate(p);
}
  </code></pre>
</details>


- **RL-Rotate**：先以 $rs$ 为中心右旋再以 $p$ 为中心左旋

<details>
	<summary> code </summary>
	<pre><code>
int RLrotate(int p){
    t[p].rson = Rrotate(t[p].rson);
    return Lrotate(p);
}
  </code></pre>
</details>


### 操作

- Maintain

  ​	如果需要调整， $|BF(D)|=2$ ，以下以左倾为例进行分析（右倾是对称的）。树结构如下

  ![TreeStruct](/img/ads/AVLMaintain.jpg)

  - 若 $BF(B)\ge0$ ，`Rrotate(D)` 即可

  ![Rrot](/img/ads/AVLMaintainRrot.jpg)

  - 反之 `LRrotate(D)`

  ![LRrot](/img/ads/AVLMaintainLRrot.jpg)

  <details>
  	<summary> code </summary>
  	<pre><code>
    int H(int p){
        return (p <= tot && p != 0)? t[p].h : -1;
    }
    void Maintain(int p){
    	int ls = t[p].lson, rs = t[p].rson;
    	if(H(ls) - H(rs) == 2){
    		if(H(t[ls].lson) >= H(t[ls].rson)) Rrotate(p);
    		else LRrotate(p);
    	}
    	else if(H(ls) - H(rs) == -2){
    		if(H(t[rs].rson) >= H(t[rs].lson)) Lrotate(p);
    		else RLrotate(p);
    	}
    	t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    }
      </code></pre>
  </details>


  - 显然复杂度 $O(1)$


- Insert

  - 因为要递归找到叶子所以是 $O(\log{N})$
  - 只影响其祖先的BF值，故只用在递归的时候通过返回值提醒祖先节点进行检查。进一步观察可知，当某个节点通过Rotate完成调整后，该子树的 $BF$ 值相比插入前不变，故实际上只在离其最近的不平衡祖先进行调整
  - 因为只在最近的不平衡祖先进行调整，而 Maintain 函数中最多进行一次 LR 或者 RL ，因此整个插入过程 Rotate 次数至多为 2


<details>
	<summary> code </summary>
	<pre><code>
int insert(int p, int v){
    if(!p){
        t[++tot] = (Node){0, 0, v, 0};
        return tot;
    }
    if(v <= t[p].val) t[p].lson = insert(t[p].lson,v);
    else t[p].rson = insert(t[p].rson,v);
    Maintain(p);
    return p;
}
  </code></pre>
</details>


- Delete
  - 删除节点
    - 叶节点：直接删掉
    - 只有左子树/右子树：用有的那个子节点替代自己（此时那个子节点一定是个叶节点）
    - 兼有左右子树：取前驱/后继替代自己，将其节点删掉
    - 从删除的叶节点向上调整即可
  - 值得注意的是，删除节点后的向上调整并不停止于第一个失衡的祖先，一个节点删除可能引发上方处于BF值同号临界的一系列祖先都失衡需要旋转，因此旋转次数 $O(\log{N})$ ，总复杂度 $O(\log{N})$
- Find, Predecessor, Successor, Rank：同正常二叉树， $O(\log{N})$ 

### 作业题

<details>
	<summary> T1：最少结点数计算 </summary>
	<pre>
	If the depth of an AVL tree is 6 (the depth of an empty tree is defined to be -1), then the minimum possible number of nodes in this tree is:33
	</pre>
</details>


<details>
	<summary> T2：AVL的插入 </summary>
	<pre>
	Insert 2, 1, 4, 5, 9, 3, 6, 7 into an initially empty AVL tree.  Which one of the following statements is FALSE?
	A.4 is the root
	B.3 and 7 are siblings
	C.2 and 6 are siblings
	D.9 is the parent of 7
	Answer : B
	</pre>
</details>


## Splay<a id="Splay"></a>

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




## B+ Tree<a id="B+"></a>

是一种多叉树

**定义** : A B+ tree of order M is a tree with following structural properties:

- Root: a leaf / has [2~M] children
- Nonleaf nodes (except root) : has [$\lceil M/2 \rceil$ , M] children
- Leaf: same depth

 如图为 M = 3 的情况

可以看出非叶子节点最多存储 M-1 个键值，其中第 i 个对应其第 i+1 个子树中存储的最小值

![Degree3Bplus](/img/ads/B+Order3.jpg)

### 操作

- Find
  - 与当前节点的所有子节点左边界值进行比较以找到应该在的区间
  - 如果不使用二分查找优化复杂度 $O((M/\log{M})\log{N})$ ，否则 $O(\log{N})$ 。 Insert 和 Delete 操作同理。

<details>
	<summary> code </summary>
	<pre><code>
 Node Find(int key, Node cur){
 	int i = 0;
 	while( i < cur.cntSon )
 		if(key >= cur.keys[i] ) ++i;
 	if( i == cur.cntkeys ) return EmptyNode;
 	return Find(key, cur.son[i]);
 }
    </code></pre>
</details>



- Insert
  - 先递归到对应的区间，即叶节点，此时有几种情况

    - 如果那个区间包含的数不超过 M - 1 个：直接插入进去就行
    - 否则，需要对这个区间进行分裂，上层结构也需要有相应变化

      - 当前叶节点分裂成两个，各自拥有 $\lfloor (M+1)/2 \rfloor$ 个数
      - 递归处理父节点，直到找到一个儿子数量没到 $M-1$ 的祖宗节点为止。如果直到根节点都不满足要求，重新建一0个根节点并将原根节点分裂

<details>
	<summary>Check：检测是否已经存在</summary>
	<pre><code>
int Check(struct Node t, int v){
    for(int i = t.totv; i; --i)
        if(t.v[i - 1] == v) return 1;
    return 0;
}
	</code></pre>
</details>


<details>
	<summary>Set：更新节点属性</summary>
	<pre><code>
void Set(int id, int Totch, int Totv, int Leaf){
    T[id].totch = Totch;
    T[id].IsLeaf = Leaf;
    T[id].totv = Totv;
}
	</code></pre>
</details>


<details>
	<summary>UpdateRelation：更新节点亲子关系</summary>
	<pre><code>
void UpdateRelation(int ffa, int son0, int son1){
    T[ffa].ch[0] = son0;
    T[ffa].ch[1] = son1;
    T[son0].fa = ffa;
    T[son1].fa = ffa;
}
	</code></pre>
</details>


<details>
	<summary>InsData：在指定数组插入数据并保持数组有序</summary>
	<pre><code>
void InsData(int *fro, int *dest, int *len, int val){
    for(int i = 0; i &lt; (*len); ++i){
        dest[i] = fro[i];
    }
    dest[(*len)] = val;
    for(int i = (*len); i && dest[i - 1] &gt; val; --i){
        dest[i] = dest[i - 1];
        dest[i - 1] = val;
    }
    (*len)++;
}*
	</code></pre>
</details>


<details>
	<summary>Deal：沿着链向上处理分裂</summary>
	<pre><code>void deal(int cur, int son0, int son1, int insert_val){
	if(!cur){
		Set(cur = root = ++cnt, 2, 1, 0);
		UpdateRelation(cur, son0, son1);
		T[cur].v[0] = insert_val;
		T[cur].fa = 0;
		return;
	}
	//处理掉父亲关系问题
	if(T[cur].totv &lt; 2){
		InsData(T[cur].v, T[cur].v, &T[cur].totv, insert_val);
		int pos;
		for(pos = T[cur].totch; pos; --pos){
			if(T[cur].ch[pos - 1] == son0){
				T[cur].ch[pos] = son1;
				break;
			}
			T[cur].ch[pos] = T[cur].ch[pos - 1];
		}
		T[cur].totch++;
		T[son1].fa = cur;
		return;
	}
    // 分裂示意图
	//                                  /            \(v2)
	//   cur(v1~v3)              cur(v1)          newnode(v3)
	//  /   |   \        =&gt;      /    \            /      \
	// A    son   B              A     son0        son1    B
	//
	InsData(T[cur].v, b, &T[cur].totv, insert_val);
	Set(++cnt, 2, 1, 0);
	T[cnt].v[0] = b[2];
	Set(cur, 2, 1, 0);
	T[cur].v[0] = b[0];
	if(T[cur].ch[0] == son0) {
		UpdateRelation(cnt, T[cur].ch[1], T[cur].ch[2]);
		UpdateRelation(cur, son0, son1);
    }
	else if(T[cur].ch[1] == son0) {
		UpdateRelation(cnt, son1, T[cur].ch[2]);
		UpdateRelation(cur, T[cur].ch[0], son0);
	}
	else UpdateRelation(cnt, son0, son1);
	deal(T[cur].fa, cur, cnt, b[1]);
}
	</code></pre>
</details>


<details>
	<summary>Insert：插入值</summary>
	<pre><code>
int Insert(int cur, int val){
    if(T[cur].IsLeaf){
        if(Check(T[cur], val)) return 0;
        if(T[cur].totv &lt; 3){
            InsData(T[cur].v, T[cur].v, &T[cur].totv, val);
        }
        else{
            InsData(T[cur].v, b, &T[cur].totv, val);
            Set(++cnt, 0, 2, 1);
            Set(cur, 0, 2, 1);
            for(int i = 0; i &lt; 2; ++i){
                T[cur].v[i] = b[i];
                T[cnt].v[i] = b[2+i];
            }
            if(T[cur].fa)
                deal(T[cur].fa, cur, cnt, b[2]);
            else{
                Set(root = ++cnt, 2, 1, 0);
                T[root].v[0] = b[2];
                T[root].fa = 0;
                UpdateRelation(root, cur, cnt - 1);
            }
        }
        return 1;
    }
    int to_node = 0;
    for(int i = 0; i &lt; T[cur].totv; ++i)
        if(val &gt;= T[cur].v[i]) ++to_node;
    return Insert(T[cur].ch[to_node], val);
}
	</code></pre>
</details>



- Delete
  - 同样是递归到相应叶节点进行处理
    - 当删除掉当前值不会使叶节点包含值少于 $\lceil M/2 \rceil$ ，直接删除
    - 若删除后本节点不符合要求
      - 若兄弟节点包含多于 $\lceil M/2 \rceil$ 个值，可以从兄弟节点借一个，并更新父节点中的分隔值
      - 否则与兄弟节点合并并删除父节点中的分隔值，递归处理父节点

### 作业题

<details>
	<summary> T1：节点数计算 </summary>
	<pre>
	A 2-3 tree with 3 nonleaf nodes must have 18 keys at most.(T)
	Tips:叶节点指的是直接连向数值的节点而非数值本体
	</pre>
</details>


<details>
	<summary> T2：插入与分裂操作 </summary>
	<img src="/img/ads/BPT-T2.jpg" alt="BPT-T2" />
    <pre>
    结构大致是(懒得画图，自行意会一下)
    [6]
    [2,4][8]
    [0,1][2,3][4,5][6,7][8,9]
    </pre>
</details>


<details>
	<summary> T3：删除操作 </summary>
	<img src="/img/ads/BPT-T3.jpg" alt="BPT-T3" />
    <pre>
    结构是
    [4,6]
    [1,2,3][4,5][6,7,8]
    目前还没有写过删除的代码所以实现细节不明
    </pre>
</details>


<details>
	<summary> T4：概念辨析 </summary>
	<img src="/img/ads/BPT-T4.jpg" alt="BPT-T4" />
    <pre>
    注意只有根节点这种特例！！
    </pre>
</details>




## 红黑树<a id="RB"></a>

**定义：** 一棵红黑树需要满足如下条件：

- 节点分为红黑两种颜色
- 根节点为黑色
- 空节点（NIL）为黑色
- 红色节点的子节点一定为黑色
- 从根节点往下到叶节点（NIL），每条路径上黑色节点数量相同
  - 定义每个节点的黑高 (Black height)是从自己向下到NIL的路径上黑色节点的个数（**但是不包含自己**）
    - 例如 BH(NIL) = 0， 单个节点的树 BH = 1（对应NIL，根节点本身不算在内）

**Internal node与External node**: External node指NIL，其他都是Internal

**性质：**

- 可以得到的导出性质（用于判别红黑树）：红黑树的红色节点的两个子节点一定同为叶子或同不为叶子（其中叶子指NIL）。

- $N$ 个内部节点（不含NIL）的红黑树的高度最大为 $2\log_2(N+1)$

  - 证明：综合以下两条

  $$
  \begin{cases}
  N \ge 2^{BlackHeight} - 1\\
  Height \le 2BlackHeight
  \end{cases}
  $$

### 操作

- Rotate : 与 [AVL](#AVL) 的旋转操作基本一致

- Insert

  - 思路为先以红色节点的形式像普通BST一样插在叶节点（因为会有两个NIL所有肯定满足性质4，且插入红色节点不影响黑高），然后再调整使得红色节点不相邻。记插入节点为 x
    - 若 x.fa 是黑色就不用调整

    - 若 x.fa 是红色，需要分类讨论并且向上递归处理。下图中橘色节点代表使红黑树失衡的子树
      - case 1：将两个红色节点染黑，“根节点”染红，并向上递归处理（引号是因为是当前考虑的子树的根而不一定是整颗树的）
        - 如果"根节点"没有父亲，则根节点再染黑，结束
        - 如果”根节点“的父亲是黑，直接结束
        - 如果根节点父亲是红的，向上递归，可能转成其他case
      - case 2 : 基于橙色节点左旋转为case 3
      - case 3 : 红色节点染黑，其父亲染红，再将新的黑色节点右旋上去。个人理解思路为将红色节点分给右侧
        ![Insert](/img/ads/RBT-insert.jpg)

      - 综合上述情况，只有case1可能向上递归，其他情况不会。只有case2 和 case3 需要 Rotate ，因此最多旋转次数为从 case2 转到 case3 ，即最多两次

  - 复杂度 $O(\log N)$


- Delete

  ~~赞美[修佬](https://note.isshikih.top/cour_note/D2CX_AdvancedDataStructure/Lec02/#删除)~~

  - 考虑分成两部分进行分类讨论：删除和删除后平衡维护

  - 删除

    - case 0 : 如果整颗树只有一个节点直接删，无需后续维护（可以理解为特化的 case 3 ? )

    - case 1 : 如果该节点左右儿子都有就取前驱/后继（只取值不取颜色）代替自己并删除前驱/后继对应节点，前驱/后继可能是没有儿子的，这种情况即转为 case 3 ，也可能是只有一个儿子的，这种情况即转为 case 2

      

    - case 2 : 如果该节点左右儿子只有一个，则那个节点一定是红的（因为黑高一致），则本节点一定是黑的。用子节点代替待删除节点并染黑即可，无需后续维护

    - case 3 : 如果该节点没有（非空）子节点，若节点为红直接删掉，节点为黑删掉后还要维护一下

    **结论** 每个 case 都能转化为删除叶节点的情况，但只有在最后转化为删除某黑色节点时才会导致黑高的性质不能满足，需要进行平衡维护。

  - 平衡维护：也需要递归地调整。记当前导致失衡的子树的根节点是x（颜色不定） ，依据兄弟节点(w)、其子节点(lc & rc)以及父亲节点(fa)进行分类。以下以 x 为左子树为例，右子树则需对称处理。

    - case 1 : w,lc,rc全黑

      - case 1.1 fa 是红色的：将 w 染红， fa 染黑，相当于从 w 子树中抽一个黑色出来共享给 x
      - case 1.2 fa 是黑色的：同样将 w 染红，然而在 fa 的子树内无法找到可以用来从红转黑共享给 x 的黑色节点，因而将矛盾转移到 fa 以上的部分。如果 fa 就是根节点，则可以直接退出（因为整棵树黑高平等减一）。

    - case 2 : w黑，rc红：将 w 染为和 fa 相同的颜色，将 rc 和 fa 染黑，并对 fa 进行一次左旋。思路是给 x 上方补一个黑节点，为了和其他子树保持一致顶上留一个与原 fa 相同的节点。因为 rc 的高度-1，将 rc 本身变黑以弥补。

      ![case2](/img/ads/RBT-DeleteBalanceCase2.jpg)

    - case 3 : w,rc黑，lc红：刚刚那个思路中更改 rc 颜色用于补偿的步骤无法实施。将 w 染红， lc 染黑，右旋 w 使得 b 成为新的根。可以发现在 w 和 lc 对调染色时， lc 的整体黑高比 rc 高了 1，其左右两子树的黑高倒是与 rc 一致，因此将 lc 转到根节点后 lc 子树内黑高与原先一致，但右子节点变红了，则状况转为 case 2 。

      ![case3](/img/ads/RBT-DeleteBalanceCase3.jpg)

    - case 4 : fa,lc,rc黑，w红：将 fa 左旋，使 w 成为新的根节点。但此时左右两子树黑高差1，因此将 fa 染红， w 染黑（此时至少保证了向 lc 方向的路径与向 rc 方向的路径黑高一致），然而 fa 子树内黑高仍然不相等，因此递归到子树中去，可能转化为 case 1.1,case 2,case 3。

    ​      ~~懒得画了，借一下oiwiki的图~~

    ![case4](/img/ads/RBT-DeleteBalanceCase4.jpg)

    - 综合以上四种情况：case1.2需要向上递归，case4需要向下递归，剩余情况无需递归。case2，case3，case4中存在Rotate操作，则最多旋转次数为由 case4 转到 case3 再到 case2 ，共计3次

  - 删除部分最坏即寻找前驱后继，复杂度为树高；平衡维护部分向上递归 (case1.2) 与向下递归 (case4) 不兼容，因此最坏复杂度即树高， $O(\log{N})$

- 查找前驱后继等操作同正常 BST

### 比较：AVL与RBT的旋转操作次数

|        | AVL          | RBT     |
| ------ | ------------ | ------- |
| Insert | $\le 2$      | $\le 2$ |
| Delete | $O(\log{N})$ | $\le 3$ |

分析见[AVL](#AVL)和[RBT](#RB)的相应部分。

### 作业题

<details>
	<summary> T1：插入节点 </summary>
	<img src="/img/ads/RBT-T1.jpg" alt="RBT-T1" />
    <pre>Tips:得到结果19是红色的</pre>
</details>


<details>
	<summary> T2：删除节点（但是强度很低） </summary>
	<img src="/img/ads/RBT-T2.jpg" alt="RBT-T2" />
    <pre>Tips:谁顶上去谁变黑</pre>
</details>




## Inverted File Index

**定义：**

- **Index:** a mechanism for locating a given term in a text.
- **Inverted file: **  contains a list of pointers (e.g. the number of a page) to all occurrences of that term in the text.

### Word Stemming

- 将一个单词化为它的词根

### Stop Words

- 可以理解为“虚词”，过于普遍的单词没必要 index （比如 a, the , it ）
- **但是出现频率最高的词不一定是stop word**

寻找单词

- Sol1 : Search trees(b tree,b+ tree, trie)
- Sol2 : Hashing

### Distributed Indexing

- **Term-partitioned Index**  依据单词字典序存储，存储困难，检索容易，容灾能力差
- **Document-partiitioned index** 依据文章划分存储，存储容易，检索困难，容灾能力好

### Dynamic Indexing

- 文档加入正常插入
- 文档删除：攒够一定量删除请求（存在auxiliary index）统一处理（写满了/定期），处理时需要在main index和auxiliary index同步检索
  - 树型结构太大就改用懒删除

### Thresholding

- Document：只取出权重前 x 的文档
- Query：对词组按出现频率排序，按照频率由高到低的词组搜索到的文档贡献不同的权重

### Evaluate

对于一次搜索

|               | Relevant | Irrelevant |
| ------------- | -------- | ---------- |
| Retrieved     | $R_R$    | $I_R$      |
| Not Retrieved | $R_N$    | $I_N$      |

则有两个评估指标

- **Precision精确度** $P=R_R/(R_R+I_R)$
- **Recall召回率** $R=R_R/(R_R+R_N)$

### 作业题

<details>
	<summary> T1：Distributed Indexing </summary>
	<img src="/img/ads/IFI-T1.jpg" alt="IFI-T1" />
    <pre>
    区分两种存储方式
    </pre>
</details>


<details>
	<summary> T2：Evaluation </summary>
	<img src="/img/ads/IFI-T2.jpg" alt="IFI-T2" />
    <pre>
    问的是召回率
    </pre>
</details>


<details>
	<summary> T3：accessing terms </summary>
	<img src="/img/ads/IFI-T3.jpg" alt="IFI-T3" />
    <pre>
    哈希表不利于搜索序列和模糊搜索
    </pre>
</details>




## 左偏堆<a id="Leftist"></a>

- 思路：使右子树相对稀疏
- **Npl** : null path length，一个节点到其子树内**没有两个孩子的节点**的最短距离。特别的，Npl(NULL) = -1 。
  - $Npl(X) = \displaystyle\min_{\forall C \in son(X)} \{Npl(C) + 1\}$
  - 左偏堆要求对于所有节点的左右儿子有 $Npl(ls) \ge Npl(rs)$ 
    - 如果不满足可以交换左右儿子实现
- 性质
  - 右路径长度为 r 的左偏堆至少拥有 $2^r-1$ 个节点。（此时是满二叉树）[tips : 数学归纳法]

<details>
	<summary>结构体定义</summary>
	<pre><code>
    struct TreeNode{
        ElementType Element;
        PriorityQueue Left,Right;
        int Npl;
    };
  </code></pre>
</details>



- 复杂度

  - Merge : O(logN)

  <details>
  	<summary>code</summary>
  	<pre><code>
      PriorityQueue Merge( PriorityQueue H1, PriorityQueue H2 )
      {
      	if(H1 == NULL) return H2;
      	if(H2 == NULL) return H1;
      	if(H1->Element > H2->Element) swap(H1,H2);
      	if(H1->Left == NULL) H1->Left = H2;
      	else{
      		H1->Right = Merge(H1->Right,H2);
      		if(H1->Left->Npl < H1->Right->Npl) SwapChildren(H1);
      		H1->Npl = H1->Right->Npl + 1;
      	}
      	return H1;
      }
    </code></pre>
  </details>


  - DeleteMin : 将根节点左右儿子合并就行，O(logN)

### 作业题

<details>
	<summary> T1：Build heap </summary>
	<img src="/img/ads/LH-T1.jpg" alt="LH-T1" />
    <pre>
    由这道题可以理解为什么左偏树和斜堆的BuildHeap复杂度是（斜堆是均摊）O(n)
    </pre>
</details>




## 斜堆<a id="Skew"></a>

神必算法

- 每Merge必调换左右儿子
- **只有在合并的末尾，即叶子节点才无需交换左右儿子** ，这是与下面这份代码实现不同的

<details>
	<summary>早年的代码一份</summary>
	<pre><code>
    newnode(int v){//返回节点编号 	
    	int x=++cnt; 	
    	val[x]=v,ls[x]=rs[x]=0; 	
    	return x; 
    } 
    int merge(int a,int b){//以a,b为根的树合并,返回根节点 	
    	if(!a||!b) return a+b;
        if(val[a] > val[b]) swap(a,b); 	
        rs[a]=merge(rs[a],b); 	
        swap(ls[a],rs[a]);
        return a; 
    }
  </code></pre>
</details>



- 复杂度：均摊分析
  - $D_i = the\ \ root\ \ of\ \ the\ \ resulting\ \ tree$ 
  - $\Phi (D_i) = number\ \  of\ \ heavy\ \ nodes$
    - heavy nodes :  右子树大于左子树的节点
    - 除了在归并路线上的节点，其他节点的轻重性质不变化
      - 重节点一定会变轻，但是轻节点不一定变重
    - 定义最开始的右路径（即归并路线）上轻节点 $l_i$ ，重节点 $h_i$ 。
      - 则 $l_i$ 越多 $l_i$ 越少（ $l_i$ 多则堆趋于左倾堆，则右路径长度就短，至多到 $O(\log N)$ 级别）
    - 极端情况变化：轻全变重

$$
T_{worst}=l_1+h_1+l_2+h_2\\
\phi_i = h_1+h_2+h\\
\phi_{i+1} \le l_1+l_2+h\\
T_{amortized} = T_{worst}+\phi_{i+1}-\phi_i\le 2(l_1+l_2) \Rightarrow O(\log N)
$$

### 作业题

直接把结论列出来好了

- 按顺序插入 $1-2^k-1$ 得到的总是完全满二叉树
- 斜堆的 right path 长度是任意的，只是轻节点数受到限制

## 二项队列<a id="Binomial"></a>

- 是一些堆（二项树）的集合（森林）
- k阶二项树（ $B_k$ ）由两个k-1阶二项树将两个根相连形成，特别的，单点是0阶。
  - $B_k$ 共有 $2^k$ 个节点，深度为 $i$ 的一层（根为0）有 $(^k_i)$ 个

![BinomialQueuesExample](/img/ads/BinomialQueuesExample.jpg)

- 以长子兄弟的形式存储，同一节点的所有儿子按子树大小降序排列

### 操作

<details>
	<summary> 结构体定义 </summary>
	<pre><code>
      typedef struct BinNode *Position;
      typedef struct Collection *BinQueue;
      typedef struct BinNode *BinTree;
      struct BinNode
      {
      	ElementType Element;
      	Position LeftChild;
      	Position NextSibling;
      };
      struct Collection
      {
      	int CurrentSize;
      	BinTree TheTrees[MaxTrees];
      };
    </code></pre>
</details>



- Merge：单次复杂度 $O(\log n)$ ， 均摊 $O(1)$
  - 二项树的合并，显然 $O(1)$，两个堆的合并类似于两个二进制数逐位做加法

<details>
	<summary> 两棵树的合并 </summary>
	<pre><code>
      BinTree CombineTrees( BinTree T1, BinTree T2 )
      {
      	if(T1->Element > T2->Element) return CombineTrees(T2,T1);
      	T2->NextSibling = T1->LeftChild;
      	T1->LeftChild = T2;
      	return T1;
      }
	</code></pre>
</details>


<details>
	<summary> 两个二项堆的合并 </summary>
	<pre><code>
      BinQueue Merge( BinQueue H1, BinQueue H2 )
      {
      	BinTree T1,T2,Carry = NULL;
      	int i,j;
      	if( H1->CurrentSize + H2->CurrentSize > Capacity ) ErrorMessage();
      	H1->CurrentSize += H2->CurrentSize;
      	for( i = 0; j = 1; j <= H1->CurrentSize; ++i, j *= 2){
      		T1 = H1->TheTrees[i];
      		T2 = H2->TheTrees[i];
      		switch(4*!!Carry + 2*!!T2 + !!T1){
      			case 0:case 1:break;
      			case 2: H1->TheTrees[i] = T2;
      					H2->TheTrees[i] = NULL;break;
      			case 4: H1->TheTrees[i] = Carry;
      					Carry = NULL;break;
      			case 3: Carry = CombineTrees( T1, T2 );
      					H1->TheTrees[i] = H2->TheTrees[i] = NULL;break;
      			case 5: Carry = CombineTrees( T1, Carry );
      					H1->TheTrees[i] = NULL;break;
      			case 6: Carry = CombineTrees( T2, Carry );
      					H2->TheTrees[i] = NULL; break;
      			case 7: H1->TheTrees[i] = Carry; 
      					Carry = CombineTrees( T1, T2 ); 
      					H2->TheTrees[i] = NULL; break;
      		}
      	}
      	return H1;
      }
	</code></pre>
</details>


- Find-Min : 在根节点队列中遍历寻找 $O(\log{n})$ 但是如果专门记录更新可以做到 $O(1)$
- Insert：即将一棵 $B_0$ 树合并到队列中，单次最好 $O(1)$ 最坏 $O(\log n)$ ， 均摊 $O(1)$
- Build：将节点逐个插入，由均摊分析得总复杂度 $O(n)$
- DeleteMin：将最小根节点取出，将其对应二项树拆成所有子树再Merge回去， $O(\log n)$

<details>
	<summary> DeleteMin </summary>
	<pre><code>
    ElementType  DeleteMin( BinQueue H )
	{	
		BinQueue DeletedQueue; 
		Position DeletedTree, OldRoot;
		ElementType MinItem = Infinity;
		int i, j, MinTree;
		if ( IsEmpty( H ) )  {  PrintErrorMessage();  return –Infinity; }
		for ( i = 0; i < MaxTrees; i++) {
	    	if( H->TheTrees[i] && H->TheTrees[i]->Element < MinItem ) { 
				MinItem = H->TheTrees[i]->Element;  MinTree = i;    		} 
		} /* end for-i-loop */
		DeletedTree = H->TheTrees[ MinTree ];  
		H->TheTrees[ MinTree ] = NULL;
		OldRoot = DeletedTree; 
		DeletedTree = DeletedTree->LeftChild;   
		free(OldRoot);
		DeletedQueue = Initialize();    
		DeletedQueue->CurrentSize = ( 1<<MinTree ) – 1;  
		for ( j = MinTree – 1; j >= 0; j – – ) {  
            DeletedQueue->TheTrees[j] = DeletedTree;
            DeletedTree = DeletedTree->NextSibling;
            DeletedQueue->TheTrees[j]->NextSibling = NULL;
		}
		H->CurrentSize  – = DeletedQueue->CurrentSize + 1;
		H = Merge( H, DeletedQueue );
		return MinItem;
	}
	</code></pre>
</details>


- Decrease Key：在二叉树上进行上调，显然 $O(\log n)$

### 均摊分析

  - 建树

    - $\Phi = number\ \ of\ \ trees$

    - 假设进行插入时现有单独的树$B_0,B_1,...,B_k, B_{k+t},....(t\ge 2)$，则插入时会与 $B_0$ 到 $B_k$ 合并得到一棵 $B_{k+1}$ ，其他不变，则 $\Phi_i - \Phi_{i-1} = -k$ （正在插入的那个点也是一棵树）

    - $\hat{c_i} = c_i + \Phi_i - \Phi_{i-1} = 1+(k+1) -k = 2 $

      - 为什么$c_i = 1 + (k+1)$ ？

        因为要有 $k+1$ 次合并和 $O(1)$ 的创建节点

    - Banking Method : 每个点初始一块钱，合并操作花掉两棵子树之一（被合并成为儿子那个点）的一块钱，则整个树至少还有一块钱（在根节点上），则整个系统钱不会为负，因而总复杂度是 $O(N)$ 的

  - 插入：由建树的过程可以得到每个点的插入平均下来是 $O(1)$ 的

## 总结：复杂度

| Heaps        | Leftist           | Skew                  | Binomial                        | Fibonacci             | Binary            | Link list |
| ------------ | ----------------- | --------------------- | ------------------------------- | --------------------- | ----------------- | --------- |
| Make heap    | $O(1)$            | $O(1)$                | $O(1)$                          | $O(1)$                | $O(1)$            | $O(1)$    |
| Build heap   | $\Theta (N)$      | amortized$\Theta(N)$  | $\Theta(N)$                     | $\Theta(N)$           | $\Theta(N)$       | $O(N)$    |
| Find-Min     | $\Theta(1)$       | $\Theta(1)$           | $\Theta(\log{N})$或$\Theta( 1)$ | $\Theta(1)$           | $\Theta(1)$       | $O(N)$    |
| Merge(Union) | $\Theta(\log{N})$ | amortized$O(\log{N})$ | $\Theta(\log{N})$               | $\Theta(1)$           | $\Theta(N)$       | $O(1)$    |
| Insert       | $\Theta(\log{N})$ | amortized$O(\log{N})$ | amortized$O(1)$                 | $\Theta(1)$           | $\Theta(\log{N})$ | $O(1)$    |
| Delete-Min   | $\Theta(\log{N})$ | amortized$O(\log{N})$ | $\Theta(\log{N})$               | amortized$O(\log{N})$ | $\Theta(\log{N})$ | $O(N)$    |
| Decrease-Key | $\Theta(\log{N})$ | amortized$O(\log{N})$ | $\Theta(\log{N})$               | amortized$\Theta(1)$  | $\Theta(\log{N})$ | $O(1)$    |

**注** ： 

1. Make heap指初始化一个空的堆， Build heap则是依据已有数据构建堆
2. Delete指在只知道数值的情况下删除数值对应节点
3. Decrease-Key指将一已知节点的值修改并调整数据结构的过程
4. Link list指无序的链表，仅用作对照
5. 内容参考了[Wikipedia](https://en.wikipedia.org/wiki/Priority_queue#Summary_of_running_times)
6. 二项堆的Find-Min操作的两种复杂度取决于有没有用变量实时更新记录Min值，老师PPT中貌似默认不维护

|        | BST    | RBTree       | AVL          | Splay                 |
| ------ | ------ | ------------ | ------------ | --------------------- |
| Insert | $O(N)$ | $O(\log{N})$ | $O(\log{N})$ | amortized$O(\log{N})$ |
| Delete | $O(N)$ | $O(\log{N})$ | $O(\log{N})$ | amortized$O(\log{N})$ |
| Find   | $O(N)$ | $O(\log{N})$ | $O(\log{N})$ | amortized$O(\log{N})$ |

## Backtracking<a id="backtracking"></a>

<details>
	<summary> 回溯模板 </summary>
	<pre><code>
	bool Backtracking ( int i ){
    	Found = false;
    	if ( i > N )return true; /* solved with (x1, ..., xN) */
    	for ( each xi in Si ) { 
    		/* check if satisfies the restriction R */
    		OK = Check((x1, ..., xi) , R ); 
    		/* pruning */
    		if ( OK ) {
    			Count xi in;
    			Found = Backtracking( i+1 );
    			if ( !Found )Undo( i ); 
    			/* recover to (x1, ..., xi-1) */
    		}
    		if ( Found ) break; 
    	}
    	return Found;
    }
	</code></pre>
</details>


- 考虑对称性可以少算不少

- min-max搜索

  以棋类游戏（三子棋为例）评估一个情况的优劣为其所有后继中估值最低的那种，从而得到最优解。围棋这类，只需模糊搜索评估的优劣比人强就行。

  - 找到比另一分支更小的结果可以直接停掉
  - 定义某局面的"goodness"为如下等式

$$
f(P) = W_{computer}-W_{human}
$$

​				其中W表示在P局面下获胜的结局数。

​				computer的目标是使其最大化，人类反之，因而搜索呈现一层取min一层取max的				状态。

- $\alpha-\beta$ pruning

  - $\alpha$ pruning ： 在求 max 的层向下搜索（则本层是取min），如果计算出比当前解更小的解就无需再搜索

  ![alpha](/img/ads/alphapruning.jpg)

  - $\beta$ pruning ： 在求 min 的层向下搜索（则本层取max），若计算出比当前已知解更大的解就无需再搜索

  ![beta](/img/ads/betapruning.jpg)

## Divide and Conquer<a id="DivideConquer"></a>

重点是主定理

### 主定理

**一些数学推导基础**

- $a^{\log_b{N}} = a^{\frac{\log_a{N}}{\log_a{b}}}=N^{\log_b{a}}$
- 对 $T(N) = aT(N/b)+f(N)$ 的推导

$$
\begin{aligned}
T(N) &= aT(N/b)+f(N)\\
	&=a(aT(N/b^2)+f(N/b))+f(N)\\
	&=...\\
	&=a^kT(N/b^k)+\sum_{i=0}^{k-1} a^if(N/b^i) ,其中 k=\log_b{N}\\
	&=N^{log_b{a}}+\sum_{i=0}^{k-1} a^if(N/b^i)
\end{aligned}
$$

若后面那坨东西复杂度不高于 $N^{log_b{a}}$ ，则总复杂度就是 $\Theta(N^{log_b{a}})$ 

一个值得关注的临界是 $f(N) = N^{log_b{a}}$  ，这意味着 $a^if(N/b^i)$ 与 $f(N)$ 等同，后面的级数和大致由 $f(N)log_b{N}$ 划定界限。

### 形式1

$T(N) = aT(N/b) + f(N)$

- 若$\exist \epsilon > 0$ 使得 $f(N) = O(N^{log_b^{a}-\epsilon})$ ，则 $T(N) = \Theta(N^{log_b{a}})$
- 若 $f(N) = \Theta(N^{log_b{a}})$ ，则 $T(N) = \Theta(N^{log_b^a}\log{N})$
- 若$\exist \epsilon > 0$ 使得 $f(N) = \Omega(N^{log_b{a}-\epsilon})$ ，且存在常数 $c<1$ 使得 $af(N/b)<cf(N)$ 则 $T(N) = \Theta(f(N))$

### 形式2

$T(N) = aT(N/b) + f(N)$

- 若$\exist \kappa<1$ 使得 $af(N/b) = \kappa f(N)$ ，则 $T(N) = \Theta(f(N))$
- 若 $af(N/b) = f(N)$ ，则 $T(N) = \Theta(f(N)\log_b{N})$
- 若$\exist K > 1$ 使得 $af(N/b) = K f(N)$ ，则 $T(N) = \Theta(N^{log_b{a}}) $

### 形式3

$T(N) = aT(N/b) + \Theta(N^k\log^p{N})$ $(a\ge 1,b>1,p\ge 0)$的解
$$
T(N) = 
\begin{cases} 
      O(N^{\log_b a}) & \text{if } a > b^k \\
      O(N^k \log^{p+1} N) & \text{if } a = b^k \\
      O(N^k \log^p N) & \text{if } a < b^k 
   \end{cases}
$$


## DP<a id="DP"></a>

**范例：矩阵乘法次序决定**

`f[l][r]` 为完成 l 到 r 的乘法的最小次数，则
$$
f[l][r] = \min_{k\in[l,r-1]} f[l][k]+f[k+1][r]+Row[l]*Col[k]*Col[r]
$$
**卡特兰数**

矩阵乘法的方案数
$$
b_n=\sum_{i=1}^{n-1} b_ib_{n-i}
$$
通项公式
$$
h_n=\frac{1}{n+1}(_n^{2n})
$$
对应实例

- 出栈次序
- 括号匹配

### DP 问题的特点

- Optimal Substructure





**样例：BST建立**

| break | case | char | do   | return | switch | void |
| ----- | ---- | ---- | ---- | ------ | ------ | ---- |
| 0.22  | 0.18 | 0.20 | 0.05 | 0.25   | 0.02   | 0.08 |

建立BST使得 $\sum prob_i\times (h_i+1)$ 最小

记 $f_{i,j}$ 为 i 到 j 区间二叉树建好后的代价
$$
f_{i,j} = \min_{k\in[i+1,j-1]} f_{i,k-1} + f_{k+1,j} + w_{i,j}
$$
**样例：Floyd**

## Greedy<a id="Greedy"></a>

- 当且仅当局部最优解和全局最优解重合时有效，否则正确性无法保证
- 但是一般乱搞离最优解不会太远

**例题**

给定一系列活动 $S={a_1,...,a_n}$ ，每个活动占据时间 $[s_i,f_i)$ ，要求合理安排使得安排活动数量最大化

1. 离散化，枚举每个活动 $f_s = \min_{j<s}{f_j} +1$ ，前缀 min 可以维护，总复杂度 $O(n)$

2. 按结束时间第一关键字（升序）开始时间第二关键字（降序）排列，能塞就塞

- 证明

  >Consider any nonempty subproblem $S_k$ ,and let $a_m$ be an activity in $S_k$ with the earliest finish time.  Then $a_m$ is included in some maximum-size subset of mutually compatible activities of $S_k$.

​		若 $A_k$ 是一个最优解集合

​		若 $a_m\in A_k$ 无需证明

​		否则将 $A_k$ 中的最早结束的活动替换为 $a_m$ 仍然合法

### 哈夫曼编码树

依据出现频率编码，形成的二叉树只在叶节点对应字符的编码

<details>
	<summary> code </summary>
	<pre><code>
void Huffman ( PriorityQueue  heap[ ],  int  C ){   
	consider the C characters as C single node binary trees,and initialize them into a min heap;
	for ( i = 1; i < C; i++ ) { 
		create a new node;
		/* be greedy here */
		delete root from min heap and attach it to left_child of node;
		delete root from min heap and attach it to right_child of node;
		weight of node = sum of weights of its children;
		/* weight of a tree = sum of the frequencies of its leaves */
		insert node into min heap;
	}
}
	</code></pre>
</details>



- 证明
- [ ] 待理解补全

## NPC问题<a id="NPC"></a>

### Complexity

- 可分为P,NP,EXP,PSPACE...
- 以下只介绍P和NP

**NP的N是非确定性而非“NOT”**

- 探讨判定问题(decidable problem)，一个问题的判定版本和优化版本存在联系

对于最短路问题：

1. 求解最短路
2. 求解最短路路径
3. 判定是否存在长度不大于 $k$ 的路径

则$1\ge 2\ge 3$

- 其中23等价，因为如果可求解3，二分答案即可求2，反之显然
- 12也等价，因为如果能求解2，通过逐个删去边判断最短路是否变化即可得到1

三者在多项式意义下难度等同

以下就判定问题的范围内进行讨论，以间接推断优化问题的难度

**但是不是所有问题的判定问题和优化问题在多项式意义下都相当**

### 图灵机角度理解P与NP

- **图灵机**
  - 组成：包括无限内存（一条无限长的纸带，有单位格子的划分）和一个读写头（scanner,可以对纸带上的内容进行读写，可以移动）（还有一个有限状态控制器/程序）
  - 运行方式
    - 改变控制器状态
    - 在读写头的位置进行数据修改
    - 读写头移动（至多一个单位长度，也即向左一格/不动/向右一格）
- **Deterministic Turing Machine** 每次执行一条指令，其后续指令也由这条指令和当前数据唯一确定
- **Nondeterministic Turing Machine** 每次从一个有限集合中取出指令执行。如果存在执行指令选择集合能够有解，则该机器永远选择能达到有解的指令
- P对应所有能在DTM上以输入规模的多项式时间求解的判定问题
- NP对应所有能在NTM上以输入规模的多项式时间求解的判定问题

注：不是所有判定问题都是NP的，例如判断一张图是否不存在hamiltonian cycle

### 另一角度

#### P(polynomial)

实例I可分为yes-instance和no-instance

判定问题的算法A(I)输出仅有yes or no

如果A对于任意实例I，输出yes iff I是 yes-instance，则称A解决了这个问题

若算法A存在多项式复杂度 $p(I)$ 使得对于任意的 I A都能在 $O(p(|I|))$ 终止（其中 $|I|$ 表示 $I$ 的规模），则称A是多项式时间的算法

**P** ： 所有拥有多项式时间的算法的判定问题的集合

#### NP(non-deterministically polynomial)

$\Leftrightarrow$ 多项式时间可验证 

### NPC问题

- 任意的NP问题都可以多项式时间规约(polynomially reduce)到NPH问题
- 而NPH中属于NP的部分为NPC问题，其关系如下图所示

![P、NP、NP-complete 和 NP-hard 问题集的欧拉图。](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/P_np_np-complete_np-hard.svg/2560px-P_np_np-complete_np-hard.svg.png)

<center>By <a href="//commons.wikimedia.org/wiki/User:Behnam" title="User:Behnam">Behnam Esfahbod</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=3532181">Link</a></center>

#### 规约

>对于任意问题A的实例 $\alpha$ ，如果存在多项式时间（不妨假设其为 $O(N^{k_1})$ ）的算法 R 使得 $R(\alpha) = \beta$ ，且存在另一个多项式时间（假设为 $O(N^{k_2})$ ）的算法 D，$D(\beta)$ 的输出是问题 B 的一个解，且这个解答同样适用于问题 A ，则称问题 A 可以规约到 B，记作 $A\le_P B$

![image-20241230111740401](/img/ads/ads-NPC-reduce.jpg)

- 说人话就是可以在多项式时间内将问题 A 转化成 B

### 形式化语言描述

#### 抽象问题的定义

- 抽象问题 $Q$ 定义为一个二元关系 $Q \subseteq I \times S$，其中：
  - $I$ 是问题的实例集合。
  - $S$ 是问题的解集合。
  - 对于每个问题实例 $i \in I$，存在一个解 $s \in S$。
- 例：最短路径问题（Shortest Path Problem）
  - $I = \{ \langle G, u, v \rangle : G \text{ 是一个无向图}, u, v \text{ 是 } G \text{ 的顶点} \}$
  - $S = \{ \langle u, w_1, w_2, \ldots, w_k, v \rangle : \text{表示从 } u \text{ 到 } v \text{ 的路径} \}$
- 判定问题（Decision Problem）可抽象为一个从 $I$ 到 $\{0, 1\}$ 的映射：
  - $Q(i) = 1$ 表示实例 $i$ 有解。
  - $Q(i) = 0$ 表示实例 $i$ 无解。

#### 编码与具体问题

- 编码（Encoding）
  - $I$ 映射为二进制字符串集合 $\{0, 1\}^*$。
  - $Q$ 映射为具体问题 $Q(x) \in \{0, 1\}$，其中 $x \in \{0, 1\}^*$ 是编码后的问题实例。

#### 基本概念

（基于判定问题）

- 字母表 $\Sigma$：有限符号集合，例如 $\Sigma = \{0, 1\}$。
- 语言 $L$ 是由字母表 $\Sigma$ 构成的字符串集合。
  - $L \subseteq \Sigma^*$，其中 $\Sigma^*$ 是 $\Sigma$ 上所有可能字符串的集合。
  - $L = \{x\in\sum^*:Q(x)=1\}$
  - 空字符串记为 $\varepsilon$ ，空语言记为 $\empty$
- 语言操作：
  - 补集（Complement）：$\Sigma^* - L$ 表示 $L$ 的补集。
  - 连接（Concatenation）：$L_1 \cdot L_2 = \{x_1x_2 : x_1 \in L_1, x_2 \in L_2 \}$。
  - 闭包（Kleene Star）：
    - $L^* = \{\varepsilon\} \cup L \cup L^2 \cup L^3 \cup \cdots$。
    - $L^k$ 表示 $k$ 次自连接。
- 决定语言与接受语言：
  - 算法 A 接受字符串 x $\Leftrightarrow$ A(x)=1，反之则为 A 拒绝 x
  - L 被 A 决定：A必须正确接受 $L$ 中的所有字符串，且拒绝 $L^c$ 中的所有字符串。
  - L被 A 接受：算法仅需要正确接受 $L$ 中的字符串，而无需对 $L^c$ 的字符串作出正确判断。

#### P&NP&NPC

- P类问题：

  - 语言 $L \subseteq \{0, 1\}^*$ 属于 $P$，如果存在一个算法 $A$ 满足：
    - 对于所有输入 $x \in \{0, 1\}^*$，$A(x)$ 可以在多项式时间内判断 $x \in L$。

- NP类问题：

  - 语言 $L \subseteq \{0, 1\}^*$ 属于 $NP$，如果存在一个多项式时间验证算法 $A(x, y)$ 和一个常数 $c$，满足：
    - 对于任意 $x \in \{0, 1\}^*$，
      $x \in L \iff \exists y \in \{0, 1\}^* \text{ 且 } |y| = O(|x|^c) \text{ 使得 } A(x, y) = 1$。
    - $y$ 是验证算法使用的“证书”(certificate)。

- co-NP： $\{L:\bar{L}\in NP\}$

  - 若 $P=NP$ ，则有 $NP=co-NP$
  - 具体可能的关系如下

  ![image-20241230120124114](/img/ads/ads-NPC-4poss.jpg)

- 多项式时间规约：一个语言 $L_1$ 多项式时间归约到语言 $L_2$ （记作 $L_1 \leq_P L_2$）即存在一个多项式时间可计算函数 $f : \{0, 1\}^* \to \{0, 1\}^*$，使得对于所有 $x \in \{0, 1\}^*$，$x \in L_1 \iff f(x) \in L_2$

  - 称 $f$ 为 reduction function, 能多项式时间计算 $f$ 的算法 $F$ 为 reduction algorithm
  - 注意这个 $iff$ 符号，如果题目只有单向的话是错的，此事在98亦有记载

- NPC：$L \subseteq \{0, 1\}^*$ 是NPC问题，需满足

  1. $L \in NP$。

  2. $\forall L' \in NP$，$L' \leq_P L$。

### 实例

#### Halting Problem 停机问题

- 若可判定，则存在一个函数P，对于一段代码，返回1/0（不停机/停机）

- 则

  ```cpp
  Loop(P){
  	if(P(P)) return 0;
  	else infinityloop();
  }
  ```

  则 Loop(Loop) 无法判断停机

  构成悖论 ~~可能写的不对，意会一下这个理发师悖论就好了~~

- 它是一个不可判定问题

#### Postpone Corresponding Problem(PCP)

大意是每张牌分上下两个标签，提问是否存在某个线性放置方式使得前一张牌的下标签与后一张牌的上标签一致

myc说略了

#### Hamilton Cycle Problem(HCP)

> Hamiltonian cycle problem: Given a graph G=(V, E), is there a simple cycle that visits all vertices?

#### Traveling Salesman Problem(TSP)

> Traveling salesman problem: Given a complete graph G=(V, E), with edge costs, and an integer K, is there a simple cycle that visits all vertices and has total cost $\le$ K?

#### Circuit-SAT

第一个被证明是NPC的问题，又称 satisfiability problem

>Input a boolean expression and ask if it has an assignment to the variables that gives the expression a value of 1.

#### Clique Problem

> Given an undirected graph G = (V, E) and an integer K, does G contain a complete subgraph (clique) of (at least) K vertices?
>
> CLIQUE = { <G, K> : G is a graph with a clique of size K }.

#### Vertex Cover Problem

> Given an undirected graph G = (V, E) and an integer K, does G contain a subset V' $\subseteq$ V such that |V'| is (at most) K and every edge in G has a vertex in V' (vertex cover)?
>
> VERTEX-COVER = { <G, K> : G has a vertex cover of size K }.

#### 哈密顿回路问题到旅行商问题

- 已知Hamilton Cycle Problem是NPC的，求证Traveling Salesman Problem也是NPC的

- 证明TSP是NP问题，并通过规约证明 $HCP\le_P TSP$ 即可

  - Q：为什么要先证明是NP的

    A：如果不说明它是NP的，它完全可能落入NPH问题中

  - NP：因为它可以多项式验证，显然

  - 规约方式：将HCP的输入图 G 转为完全图 $G'$ ，G中不存在的边的边权设为 $K+1$ ，那么如果 TSP 成立， HCP也成立

#### Clique问题到节点覆盖问题

- 已知Clique问题是NPC，求证节点覆盖问题是NPC
  - NP：可以多项式验证
    - 检查 $|V'|\le K$，枚举图上每条边即可， $O(N^3)$ （其实我觉得用不着 $N^3$， 可能是什么奇怪的实现方式）
  - 规约 $CLIQUE\le_P VERTEX-COVER$
    - 对于团问题的图 G ，构造其补图 $G'$
    - 则整张图上除了大小为 $K$ 的团之外的点全部选中必然构成一个大小为 $|V|-K$ 的节点覆盖（注意这里是判定问题而非优化问题），二者成对偶关系

## 近似<a id="approx"></a>

- 目的：对于一些问题利用多项式时间找到近似的最优解
- 近似比(approximation ratio)：称一个算法的近似比为 $\rho(n) \iff$ $\forall n,$ C是最优解，$C^*$是近似解，则 $\max(\frac{C}{C^*},\frac{C^*}{C})\le \rho(n)$  $\iff$ 说这个算法是 $\rho(n)$-approximation algorithm
- 近似范式(approximation scheme)：一种特殊的近似算法，除了数据以外接受 $\varepsilon$ 这个参数，保证是 $(1+\varepsilon)$-approximation algorithm
  - PTAS(polynomial-time approximation scheme)：复杂度是对于 $n$ 的多项式，而对于 $\varepsilon$ 未必，例如 $O(n^{2/\varepsilon})$
  - FPTAS(full polynomial-time approximation scheme)：复杂度对 $\varepsilon$ 也是多项式，如 $O((1/\varepsilon)^2n^3)$

### 实例

#### Bin Packing

- 问题：一维装箱任务，给定 $N$ 个长度为 $S_1,..,S_N$ 的物品，将其装到长度固定的箱子中，求最少的箱子数量
- 属于NPH问题

##### 在线算法

存在物品序列使得任意在线算法的相似比至少为5/3

###### Next Fit

- 思路：只看当前这一个，能装就装，装不了新开

- 若 $M$ 为理想装箱数量，则该算法最多使用 $2M-1$ 个箱子

  - 证明思路：即证若NF需要 2M 或 2M+1 个箱子，则理想情况至少需要 M+1 个箱子

  - 称每个箱子 $B_i$ 的空间利用率为 $0<S(B_i)\le 1$

    则有 $S(B_{2k-1})+S(B_{2k}) > 1$

    求和得到 $\sum_{i=1}^{2M} S(B_i) > M$ ，即理想情况也不止 $M$ 个箱子

<details>
	<summary>code</summary>
	<pre><code>
void NextFit ( )
{   read item1;
    while ( read item2 ) {
        if ( item2 can be packed in the same bin as item1 )
	place item2 in the bin;
        else
	create a new bin for item2;
        item1 = item2;
    } /* end-while */
}
  </code></pre>
</details>


###### First Fit

- 思路：寻找前面所有箱子中第一个能放下的

- 若 $M$ 为理想装箱数量，则该算法使用不多于 $1.7M$ 个箱子（已有构造出来的使用 1.7M-1.7 箱子的序列

<details>
	<summary>code</summary>
	<pre><code>
void FirstFit ( )
{   while ( read item ) {
        scan for the first bin that is large enough for item;
        if ( found )
	place item in that bin;
        else
	create a new bin for item;
    } /* end-while */
}
  </code></pre>
</details>


###### Best Fit

- 思路：寻找前面所有箱子中最刚刚好放下的

- 若 $M$ 为理想装箱数量，则该算法使用不多于 $1.7M$ 个箱子

<details>
	<summary>code</summary>
	<pre><code>
void BestFit() {
    while (read item) {
        scan for the bin with the tightest fit (smallest remaining space) 
        that is large enough for the item;
        if (found)
            place the item in that bin;
        else
            create a new bin for the item;
    }
}
  </code></pre>
</details>



##### 离线算法

- 思路：物品大小降序排列后再使用 FF 或 BF
- 该算法使用不多于 $(11M+6)/9$ 个箱子，这是确界（存在构造）

#### 背包

- 分数背包是一个典型的贪心问题（按性价比排序）

- 分数背包到01背包：强行按性价比选整件

  - 近似比为2（记P为最大收益）
    $$
    p_{max}\le P_{opt}\le P_{frac}\\
    p_{max}\le P_{greedy}\\
    P_{opt}\le P_{frac}\le P_{greedy}+p_{max}\\
    \Rightarrow P_{opt}/P_{greedy}\le 1+p_{max}/P_{greedy}\le 2
    $$
    其中

    - $p_{max}$ 是单个物品最大价值
    - $P_{frac}$ 是分数背包最优解
    - $P_{greedy}$ 是贪心01的解
    - $P_{opt}$ 是01的最优解

- DP算法的优化处理：在值域范围太大时

  - 将 $p_i$ 映射到更小的范围，通常除以一个常数 $K$

  - 但是要保证够高的精度，以保证：

    $(1+\varepsilon)P_{ans}\ge P$



#### K-center Problem

- （2D）在平面中选择 K 个点，使得以这 $K$ 个点为圆心，r 为半径的圆能覆盖给出点集的所有点，且 r 最小化

##### 贪心1

- 首先选择所有点的中间值（取平均），然后持续添加点使得半径降低
- 对于如图所示情形非常辣鸡

![image-20241230153157709](/img/ads/ads-approx-Kcgreedy1.jpg)

##### 二分答案

- 只需要判断在二分的半径 $r$ 时是否有解，然而这个也很难精确判定，因此使用近似算法

- 过程：

  随机选择点，将距离其在 2r 以内的点全部删除。重复K次后若还剩下点，则判断该 r 无解

- 若成功，说明 2r 是可行解，若失败，则说明 **r 必定不是可行解** （注意倍数）

  - 前者显然，对于后者：假设最优解中使用 r 覆盖的点集为 S，则从 S 中任意挑选一个点，以其为圆心， 2r 的圆必定能覆盖 S 中所有点

- 近似比：通过成功的二分压缩上限，失败的二分压缩下限，最终得到可行解为 2r 。故 $r < r_{opt} < 2r$ ，即 $\rho = 2$

- 小优化：从随机选点转变为离原来选的点最远的点，不改变近似比

- 除非 P = NP ，否则不存在 $\rho < 2$ 的算法

  - Dominating-set Problem（NPC） ：能否找到一个大小不超过 $K$ 的点集，使得对于图上的所有点，要么属于 该点集，要么与点集有边相连
  - 支配集问题是 K-center 的特殊情况：将图中每条边视作两个点距离为1，则如果存在支配集，$r=1$
  - 若 $\rho < 2$ ，由于 r 为整数解，$r=1$ ，即这个NPC问题被多项式时间解决了
  - 综上若 $P\neq NP$ ， $\rho \ge 2$

## Local Search<a id="local"></a>

### Framework

- Local: 确定 neighbor的范围，找到 local 的最优解
- Search: 从一个可行解开始，在邻域中搜索更优解，直到无法优化

### Neighbor Relation

- 称 S' 是 S 的邻居 $\iff$ S'可以通过对 S 进行微小修改得到 $\iff$ S~S'
- N(S) ： {S':S~S'}

<details>
	<summary>例：梯度下降的代码</summary>
	<pre><code>
SolutionType Gradient_descent()
{   Start from a feasible solution S in FS ;
    MinCost = cost(S);
    while (1) {
        S’ = Search( N(S) ); /* find the best S’ in N(S) */
        CurrentCost = cost(S’);
        if ( CurrentCost < MinCost ) {
            MinCost = CurrentCost;    S = S’;
        }
        else  break;
    }
    return S;
}
  </code></pre>
</details>


### 实例

#### Vertex Cover Problem

>Given an undirected graph G = (V, E).  Find a minimum subset S of  V such that for each edge (u, v) in E, either u or v  is in S.

- cost(S) = |S|
- 起始 S = V，扰动：删去某个点
- 极其容易陷入局部最优解，例如菊花图删去中心

##### 优化：大都市算法(metropolis algorithm)

- idea ：一定概率接受非更优解

````cpp
SolutionType Metropolis()
{   Define constants k and T;
    Start from a feasible solution S in FS ;
    MinCost = cost(S);
    while (1) {
        S’ = Randomly chosen from N(S); 
        CurrentCost = cost(S’);
        if ( CurrentCost < MinCost ) {
            MinCost = CurrentCost;    S = S’;
        }
        else {
            With a probability p, let S = S’;
            else  break;
        }
    }
    return S;
}

````

其中 $p=e^{-\Delta cost/(kT)}$ ， k 是一个系数，T是固定的“温度”

##### 优化：模拟退火(Simulated Annealing)

在metropolis基础上，T逐渐下降

所谓退火就是锻造过程中温度下降的过程，随着温度下降原子排列趋于稳定。

#### Hopfield Neural Networks

##### 问题

对于G=(V,E)，边带权，为每个点分配状态($s_v=\pm 1$) ,使得：

- 若 $w_e \ge 0$，u,v 不同状态
- 若 $w_e < 0$ ， u,v 同状态

$|w_e|$ 表示需求强烈程度

也即：$\sum s_us_vw_e$ 的最小值求解

##### 求解

- 定义：

  - 称一条边是好的当且仅当 $s_us_vw_e <0$ 

  - 称一个局面是好的当且仅当$\sum s_us_vw_e\le 0$ 

  - 称一个局面是稳定的当且仅当所有节点的要求被满足，即每个节点的邻接边中好边的边权绝对值总和小于坏边边权总和

- 流程：每次选择一个没有被满足的点，翻转

- 正确性：

  - 定义整个图的能量 $E=-\frac{1}{2}\sum_i\sum_jw_{ij}s_is_j$

  - 对不满足的点 $i$ 进行翻转，能量改变量为$\Delta E=-v_i\sum_{i\neq j}w_{ij}v_j $ ，希望 E 变小即希望 $v_i\sum_{i\neq j}w_{ij}v_j \ge 0$ ，即其邻接边中好边的边权绝对值总和小于坏边边权总和

##### 复杂度

  - 势能函数 $\Phi(S) =\sum_{\text{e is good}} |w_e|$
  - 则每次翻转 $\Phi$ 都会增加，最坏情况每次增加1
  - 复杂度是 $O(W)$ 的（其中W是最大权重），因而不一定是多项式

#### 最大割问题

##### 问题

将节点分为AB两个集合，所有链接A中点和B中点的边称为割，目标是最大化割的权重

##### 求解

- 类似hopfield的状态翻转，考虑更改某个节点的归属，收益为$gain(u)=W(新增的割边)-W(减少的割边)$ ,挑选 $gain > 0$ 的节点翻转

- 同样不一定是多项式算法

- 可以证明的近似比： 2 ，即$W_{local}\ge 0.5 W_{global}$

  - 证明：

    $(A, B)$ 是局部最优 $\Rightarrow$ $\forall u \in A$,$\sum_{v\in A} w_{uv}\leq\sum_{v\in B}w_{uv}$ 

    则

  $$
   2\sum_{u,v \in A}w_{uv}=\sum_{u\in A} \sum_{v\in A}w_{uv}\leq\sum_{u\in A} \sum_{v\in B}w_{uv}=w(A,B)\\
   2 \sum_{u,v \in A} w_{uv} \leq w(A, B)
  $$

  ​	同理$ 2 \sum_{u,v \in B} w_{uv} \leq w(A, B)$ ，则合起来得到 $\sum_{u,v \in A} w_{uv}+\sum_{u,v \in B} w_{uv} \leq w(A, B)$

  ​	$(A^*, B^*)$是全局最优$\Rightarrow$

  ​	带入上面的结论，有$ w(A^*, B^*) \leq w(A, B) + w(A, B) = 2w(A, B)$

  ​	即$ w(A, B) \geq \frac{1}{2} w(A^*, B^*)$

- 学者结果：除非 P=NP，否则 近似比不小于 17/16

##### 复杂度

- 不是多项式时间复杂度
- 如果限制为**仅在有足够大的优化时才继续运行**则可以做到
  - **Big-improvement-flip** : 只更新翻转后收益增加大于 $\frac{2\varepsilon}{|V|}w(A,B)$ 的点
  - 求得的答案满足 $(2+\varepsilon)w(A,B)\ge w(A^*,B^*)$
  - 至多翻转 $O(n/\varepsilon \log{W})$ 次

#### 其他优化

- k-flip以增加搜索的邻域
  - $O(n^k)$ 寻找邻居
  - K-L算法：计算一批节点的增益，选其中一批统一更新

### 作业

![image-20241231155954347](/img/ads/Local-HW.jpg)

构造，不会

# 随机化算法<a id="random"></a>

- 对于离散变量X，我们有

$$
E(X) = \sum i*Pr(X=i)
$$

### 例1：The Hiring Problem

- 只招一个员工，共有 n 个面试者，每天面试一个人，如果被面素质高于当前员工则替换
- 雇人的价格是 $C_h$  Hiring cost
- 找一个面试者的价格是 $C_i$ Interviewing cost
- $C_i << C_h$

#### Sol 1

- 策略如上

- 第一个人必定被雇佣，第二个人被雇佣概率为 1/2，第三个人概率为 1/3，...，第 n 个人为 1/n

- 最坏情况开销即素质递增， $O(nC_h)$ 

- **Randomness assumption**

  > any of first i candidates is equally likely to be best-qualified so far

- 对于随机的情况，雇佣次数的期望利用期望的线性性，转化为每个人被雇佣期望的加和，则有

$$
E(X) = \sum_{i=1}^n \frac{1}{n}=\ln{n}+O(1)
$$

​		平均的花销为 $O(\ln{n}C_h + nC_i)$

因此可以将面试者数列随机打乱再进行面试

范例代码：

```cpp
for(i in [1,n])
    A[i].P = 1+rand()%(N^3)
sort A[i] base on A[i].P
```

### 例1 在线ver

- 无法获取全部面试者名单，只能雇佣一次

#### Sol2

- 对前 k 个人做调研，获取 max 不雇佣
- 对后 n-k 个人，雇佣遇到的第一个超过 max 的人，否则雇佣最后一个



定义$S$ 为雇佣到最佳， $S_i$ 为第 i 个面试者是最佳且被雇佣的

则 
$$
\begin{aligned}
Pr[S_i] &= Pr[i\ is\ the\ best]*Pr[no\ one\ at\ k+1~i-1\ are\ hired] \\
&= \frac{1}{n}*\frac{k}{i-1} = \frac{k}{n(i-1)}
\end{aligned}
$$
PS: 后面那一项等价于 [1,i-1]的最大值出现在[1,k]，故概率为 $\frac{k}{i-1}$
$$
Pr[S] = \sum_{i=k+1}^n Pr[S_i]=\sum_{i=k}^{n-1}\frac{k}{ni}
$$
由微寄分小知识
$$
\int_k^n \frac{1}{x}dx\le \sum_{i=k}^{n-1} \frac{1}{i}\le\int_{k-1}^{n-1} \frac{1}{x}dx
$$
不会就回去看看伟大的[辅学网站](https://ckc-agc.bowling233.top/)

则 $Pr[S]=\frac{k}{n}\ln{\frac{n}{k}}$

取 $k=N/e$ 则 $Pr_{max}=1/e$

### 快排

随机化选择 split，直到选到中间部分也即[1/4N,3/4N]（称为找到一个 central splitter）

期望选择次数
$$
E{X} = \frac{1}{2}+\frac{1}{2^2}+\frac{1}{2^3}+..+\frac{1}{2^n}=2
$$
（提示，这里不是 $\sum_{i=1}^ni2^{-i}$ 的原因是其展开思路是期望线性性）

- **type j** : the subporblem S is of type j iff $N(\frac{3}{4})^{j+1}\le |S|\le N(\frac{3}{4})^j$
  - 性质： 至多有 $(\frac{4}{3})^{j+1}$ 个 type j 的子问题

![image-20241224112956436](C:\Users\JA2012\AppData\Roaming\Typora\typora-user-images\image-20241224112956436.png)

# Parallel Algorithms<a id="parallel"></a>

## 省流

| 问题-算法                     | T                  | W                   |
| ----------------------------- | ------------------ | ------------------- |
| 前缀和                        | $O(\log{n})$       | $O(n)$              |
| 单轮归并-并行二分             | $O(\log{n})$       | $O(n\log{n})$       |
| 单轮归并-$\log{n}$分块        | $O(\log{n})$       | $O(n)$              |
| 找最大值-朴素并行             | $O(1)$             | $O(n^2)$            |
| 找最大值-$\sqrt{n}$ 分块      | $O(\log{\log{n}})$ | $O(n\log{\log{n}})$ |
| 找最大值-$\log{\log{n}}$ 分块 | $O(\log{\log{n}})$ | $O(n)$              |
| 找最大值-随机采样             | $O(1)$             | $O(n)$              |

- $W(n)/P(n)+T(n)$

## PRAM 模型

### 特性

1. 假设存在多个处理器，且同时执行操作
2. 假设所有处理器可以同时访问同一个全局的内存
3. 假设所有处理器同步运行

### 运算过程

1. 同时读
2. 各自计算
3. 同时写

### 缺陷

1. 无法说明算法在不同数量处理器的实际表现
2. 分配到处理器，过于细节繁琐而忽视算法总体架构

### Work-Depth Presentation

- Work load(总操作数) W(n)

- Worst-case running time T(n)

  按我的理解，T(n)表征了算法中不得不品的串行部分，不包括W(n) 的并行部分

- **WD-presentation Sufficiency Theorem** : 对于一个用WD模式表示的算法，在任意的 $P(n)$ 个处理器上需要运行 $O(W(n)/P(n)+T(n))$ 的时间

  - 但是要求算法遵循与WD表示法中相同的并发写入规则（不知道什么鬼）

## 冲突处理规则

- EREW(Exclusive read exclusive write)：同时读或者写同一个单元都不允许
- CREW(Concurrent read exclusive write)：允许同时读同一个单元，不允许同时写
- CRCW(Concurrent read Concurrent write)：允许同时读和写同一个单元
  - Common rule : 要求所有写入值一致否则无效
  - Arbitrary rule : 随机选一个写
  - Priority rule : 依据优先级选一个写（PPT上说选择编号最小的处理器的结果）

## 实例

### 前缀和

- B(h,i) 表示第 h 层（从0开始）第 i 号节点的计算结果，成树型结构向上累加

![image-20241230203949806](/img/ads/ads-par-sum.jpg)

#### PRAM 模型

复制数据

```cpp
for P_i, 1 ≤ i ≤ n pardo
    B(0, i) := A(i)
```

逐层向上累加

```cpp
for h = 1 to log n do //这层循环有层数依赖无法并行
    if i ≤ n / 2^h
        B(h, i) := B(h-1, 2i-1) + B(h-1, 2i)
    else
        stay idle
```

输出顶层节点

```cpp
for i = 1: output B(log n, 1); 
for i > 1: stay idle
```

#### WD表示

忽略部分细节

```cpp
for Pi ,  1 <= i <= n  pardo
   B(0, i) := A( i )
for h = 1 to log n 
    for Pi, 1 <= i <= n/2^h  pardo
        B(h, i) := B(h-1, 2i-1) + B(h-1, 2i)
for i = 1 pardo
   output  B(log n, 1)
```

- $T(n)=\log{n}+2$
- $W(n) = n+n/2+n/4+...+n/2^k+1 = 2n$

---

进一步，若要求出每一个位置的前缀和，需要增加一个向下传播的过程，完整代码如下

```cpp
for Pi , 1 <= i <= n pardo
  B(0, i) := A(i)
for h = 1 to log n
  for i , 1 <= i <= n/2h pardo
    B(h, i) := B(h - 1, 2i - 1) + B(h - 1, 2i)
for h = log n to 0
  for i even, 1 <= i <= n/2h pardo
    C(h, i) := C(h + 1, i/2)
  for i = 1 pardo
    C(h, 1) := B(h, 1)
  for i odd, 3 <= i <= n/2h pardo
    C(h, i) := C(h + 1, (i - 1)/2) + B(h, i)
for Pi , 1 <= i <= n pardo
  Output C(0, i)

```

$T(n)=O(\log{n})$   $W(n)=O(n)$

### 归并

将有序的A(1),...,A(n)和B(1),...B(m)合并为有序的C(1),...,C(n+m)

- 思路：转合并为求解排名

  - Rank(i,B)表示 $A_i$ 在B中的排名，即$B(Rank(i,B)) < A_i < B(Rank(i,B)+1)$
  - Rank(i,A)表示 $B_i$ 在A中的排名

  则Merge转化为如下两步

  ```cpp
  for Pi , 1 <= i <= n  pardo
      C(i + RANK(i, B)) := A(i)
  for Pi , 1 <= i <= n  pardo
      C(i + RANK(i, A)) := B(i)
  ```

可以 $O(1)$ 计算（并行），故以下讨论Rank的求法

#### sol 1 : 二分

```cpp
for Pi , 1 <= i <= n  pardo
    RANK(i, B) := BS(A(i), B)
    RANK(i, A) := BS(B(i), A)
```

$T(n)=O(\log{n})$   $W(n) = O(n\log{n})$ 

#### sol 2 : 顺序计算

```cpp
i = j = 0; 
while ( i <= n || j <= m ) {
    if ( A(i+1) < B(j+1) )
        RANK(++i, B) = j;
    else RANK(++j, A) = i;
}
```

$T(n) = W(n) = O(n+m)$

#### sol 3 : 分块处理

- 前置条件：n=m，且A(n+1)与B(n+1)都大于A(n)和B(n)
- 则取 $p=n/\log{n}$ ，对A和B按等间隔 $\log{n}$ 分成 $p$ 个块，对每个块的第一个元素先求Rank
  - 这一步 $T=O(\log{n})$  $W=O(p\log{n}) = O(n)$
- 然后在两个大小为 $\log{n}$ 的块内求每个元素的Rank，使用串行（因为这里没有办法对这 $2\log{n}$ 个元素作并行了）
  - 这一步 $T=O(\log{n})$ $W = O(p\log{n}) = O(n)$ 
- 综上所述，总复杂度为$T=O(\log{n})$ $W=O(n)$

### 找最大值

#### 并行 ver0

- 思路：并行比较 $n^2$ 对数的大小关系，唯一全都大于的就是 max

```cpp
for Pi , 1 <= i <= n  pardo
    B(i) := 0
for i and j, 1 <= i, j <= n  pardo
    if ( (A(i) < A(j)) || ((A(i) = A(j)) && (i < j)) )
            B(i) = 1
    else B(j) = 1
for Pi , 1 <= i <= n  pardo
    if B(i) == 0
       A(i) is a maximum in A
```

- 使用CRCW-Arbitrary rule
- $T(n)=O(1)$   $W(n) = n^2$

#### Doubly-logarithmic Paradigm

1. 若按照 $\sqrt{n}$ 分块

- 对于每个块，使用上述的ver 0求解 max 得到 $\{M_i\}$ ，（并行执行），$T=T(\sqrt{n}) = O(1)$   $W=W(\sqrt{n}) = O(n)$
- 然后对 ${M_i}$ 再做同样的操作（按根号分块，聚合，如此反复）
- 一共要执行 $n=2^{2^h}$ 的 $h$ ，即 $\log{\log{n}}$ 次
- 故$ T = O(\log{\log{n}})\  W=O(n\log{\log{n}})$

2. 若按照 $h=\log{\log{n}}$ 的大小分块，总组数 $n/h$

- 同上述操作进行，共进行 $\log{\log{(n/h)}}$ 次递归
- $T = O(h+\log{\log{(n/h)}}) = O(\log{\log{n}})$   $W=O(h\times(n/h)+(n/h)\log{\log{(n/h)}})=O(n)$
- [ ] 理解这里多出来的h和h*n/h从何而来（目前猜测第一层使用了直接的线性求解max）

#### 随机采样Random Sampling

- 高可能性（但不是一定）失败概率 $O(1/n^c)$，c是一个正常数（不知道是几）
- T(n) = O(1) W(n)=O(n)

步骤：

- $n^{1/8}$ 中随机取样，得到 $n^{7/8}$ 个元素
  - $T=O(1),W=O(n^{7/8})$
- 将这 $n^{7/8}$ 个元素再按 $n^{1/8}$ 为单位分块，一共就 $n^{3/4}$ 块；每个 $n^{1/8}$ 块取最大值
  - $T=O(1),W=O(n^{3/4}×n^{2×1/8})=O(n)$
- 现在剩下$n^{3/4}$ 个元素，按$n^{1/4}$ 为单位分块，共计 $n^{1/2}$ 个块；每个 $n^{1/4}$取最大值
  - $T=O(1),W=O(n^{1/2}×n^{2×1/4})=O(n)$
- 剩下 $n^{1/2}$ 个元素，直接取最大值
  - $T=O(1),W=O(n^{2×1/2})=O(n)$

## 习题

1. In order to solve  the maximum finding problem by a parallel  algorithm  with *T*(*n*)=*O*(1) , we need work load $W(n)=Ω(n^2)$ in return.(F)

   ver0确实需要 $W(n)=O(n^2)$ ，但是随机采样不是，认为随机采样可以解决问题（实在不行多跑几次）

   以下的另外一道题就是正确的表述

   > To solve the Maximum Finding problem with parallel Random Sampling method, *O*(*n*) processors are required to get *T*(*n*)=*O*(1) and *W*(*n*)=*O*(*n*) with very high probability. 

2. The prefix-min problem is to find for each *i*, 1≤*i*≤*n*, the smallest element among *A*(1), *A*(2), ⋯, *A*(*i*).  What is the run time and work load for the following algorithm?

   ```cpp
   for i, 1≤i≤n pardo
     B(0, i) = A(i)
   for h=1 to log(n)
     for i, 1≤i≤n/2^h pardo
       B(h, i) = min {B(h-1, 2i-1), B(h-1, 2i)}
   for h=log(n) to 0
     for i even, 1≤i≤n/2^h pardo
       C(h, i) = C(h+1, i/2)
     for i=1 pardo
       C(h, 1) = B(h, 1)
     for i odd, 3≤i≤n/2^h pardo
       C(h, i) = min {C(h + 1, (i - 1)/2), B(h, i)}
   for i, 1≤i≤n pardo
     Output C(0, i)
   ```

​		$T=O(\log{n})$   $W=O(n)$

​		同求前缀和  ~~这道题题面写的lofn我真的会笑死~~



# External Sorting<a id="external"></a>

~~这个开篇真的会梦回计组~~

- 内存不足以排序的数据量，访问磁盘开销巨大（记得看看计组cache那一章）$\Rightarrow$ 使用归并排序，但是磁盘访问次数尽可能最小化
- why归并排序？ 内存一次性能处理的数据量有限，归并能够在这一基础下把有序数列规模增大直到有序 ~~其他排序做得到吗.jpg~~

以下令内存最大容量为 $M$ , 总数据量 $N$ ，实行 $k$ 路归并

## 一些名词

- **run** : 一段数据，它应当是内部有序的
- **pass** : 将 $k$ 路数据归并到其他路的过程
- **copy** : 从一路将数据分发到若干路的过程（正常不会出现在计数中，只是老师在用3 tapes做2路归并的例子时出现过)
- **tape** : 一个磁盘，这里可以理解为一个无限大的存放 runs 的地方

## 性能优化

### Passes

$2k$ 个磁盘时

- Number of passes = $1+\lceil\log_k{N/M}\rceil$
  - "1" 是从 $T_1$ 向其他磁带分发 pass 的过程，由于是第一次还需要将每个 pass 内部变为有序
  - 此后每一次 pass （假设还是统一归并到 $T_1$ ）会让 $pass$ 数量变为 $\frac{1}{k}$  （上取整）

- 老师给出的其中一个例子如下

![image-20241229120325961](/img/ads/Extsort-2kexample.jpg)

此时要优化passes的数量：

1. 增加 $k$  $\Rightarrow$ tape数量、排序复杂度增加

2. 算法优化：Replacement Selection

   - 可以获得更长的run从而减少passes

   <details>
   	<summary> Replacement Selection </summary>
       <pre>
   When the input is much too large to fit into memory, we have to do **external sorting** instead of internal sorting.  One of the key steps in external sorting is to generate sets of sorted records (also called **runs**) with limited internal memory.  The simplest method is to read as many records as possible into the memory, and sort them internally, then write the resulting run back to some tape.  The size of each run is the same as the capacity of the internal memory.
   **Replacement Selection** sorting algorithm was described in 1965 by Donald Knuth.  Notice that as soon as the first record is written to an output tape, the memory it used becomes available for another record.  Assume that we are sorting in ascending order, if the next record is not smaller than the record we have just output, then it can be included in the run.
   For example, suppose that we have a set of input { 81, 94, 11, 96, 12, 99, 35 }, and our memory can sort 3 records only.  By the simplest method we will obtain three runs: { 11, 81, 94 }, { 12, 96, 99 } and { 35 }.  According to the replacement selection algorithm, we would read and sort the first 3 records { 81, 94, 11 } and output 11 as the smallest one.  Then one space is available so 96 is read in and will join the first run since it is larger than 11. Now we have { 81, 94, 96 }.  After 81 is out, 12 comes in but it must belong to the next run since it is smaller than 81.  Hence we have { 94, 96, 12 } where 12 will stay since it belongs to the next run.  When 94 is out and 99 is in, since 99 is larger than 94, it must belong to the **first run**.  Eventually we will obtain two runs: the first one contains { 11, 81, 94, 96, 99 } and the second one contains { 12, 35 }.
       </pre>
   </details>

### Tapes:Polyphase Merge Sorting多相归并

$k+1$ 个磁盘

- 合并规则有所变化：不会把现有runs的磁盘一定要搬空了

- 二路归并时

  > If the number of runs is a fibonacci number $F_N$ , then the best way to distribute them is to split them into $F_{N-1}$ and $F_{N-2}$

  例：$(a,b,c)$ 表示 $T_1T_2T_3$ 中的 runs 数量
  $$
  (21,13,0)\rightarrow(8,0,13)\rightarrow(0,8,5)\rightarrow\\
  (5,3,0)\rightarrow(2,0,3)\rightarrow(0,2,1)\rightarrow\\(1,1,0)\rightarrow
  (0,0,1)
  $$

- $k$ 路归并时

  - 定义 $k$ 阶斐波那契数： $F_N^{(k)} = \sum_{i=1}^k F_{N-i}^{(k)}$
  - 按照 $k$ 阶斐波那契数拆分更优
  - 实现方式（参考修佬的PPT）：
    - 每次 $k$ 路归一路，取 $k$ 路中的 min ，然后 $k$ 路各自减去 min
    - 显而易见这样能始终保持一路为空

- Q：如果数量不恰好为斐波那契数？

  A：在后面补上空的 runs 即可

### Parallel Operation

对于 $k$ 路归并需要 $2k$ 个读缓存和 2 个写缓存

（GPT对于这个2的系数的解释，以读为例：一个缓冲区正在被读取时，另一个缓冲区可以并行加载下一块数据）

- 如果 $k$ 增长，IO时间会增加但是 passes 会减少，buffer空间减小
- 为达到最高效率，需要依据硬件的参数找到 trade-off 的较优解

### Merge Time

- 利用哈夫曼编码数

例如：对四个2,4,5,15的runs作合并，如图所示的合并效率最高， $T=O(the\ weighted\ external\  path\ length)$

![image-20241229162209552](/img/ads/ads-ext-huffman.jpg)

# Left Undone<a id="SOS"></a>

![image-20241231184319762](/img/ads/SOS-1.jpg)

cuo?

![image-20250102150425613](/img/ads/SOS-2.jpg)

![image-20250102150745147](C:\Users\JA2012\AppData\Roaming\Typora\typora-user-images\image-20250102150745147.png)

![image-20250102154801138](/img/ads/SOS-3.jpg)

利用期望，单个盒子一个没中的概率为 $(1-\frac{1}{m})^m\rightarrow \frac{1}{e}$

![image-20250102163541647](/img/ads/SOS-4.jpg)

![image-20250102234714756](C:\Users\JA2012\AppData\Roaming\Typora\typora-user-images\image-20250102234714756.png)

这。。。。。猜测可能是因为不一定是常数
