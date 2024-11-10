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
- [DP](#DP)


**注**：下文代码使用C++，以结构体数组实现

# Amortized Analysis均摊分析  

## Aggregate Analysis

- $n$ 个操作总最差用时 $T(n)$， 则 amortized cost 为 $\dfrac{ T(n) } { n }$ 

## Accounting method

- 类似存款存入不会比取出少，设计每种操作的均摊成本$d_i$ ，使得相比于实际成本$c_i$有$\forall_i\ \ \hat{c_i} \ge c_i$
- 势能函数$\phi(op_i)$ 表示整个数据结构在第i个操作前后的势能，满足$\hat{c_i}-c_i = \phi(op_i)-\phi( op_{ i-1 } )$，则

$$
\begin{aligned}
\sum_{ i=1 }^n  \hat{c_i} &= \sum_{i=1}^n (c_i+\phi(op_i)-\phi( op_{i-1} ) )\\
&= \phi(op_n)-\phi(op_0)+\sum_{i=1}^n c_i
\end{aligned}
$$

需要$\phi(op)$的复杂度不高于前面，方便起见可以让$\phi(op_0)=0$

# AVL Trees<a id="AVL"></a>

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


## Rotation Operations

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

## 操作

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



# Splay<a id="Splay"></a>

### 一些名词

- zig : 当前节点向父节点位置旋转
- zig-zig : 自己&父节点&再上一级节点方向相同，对自己&父节点进行同向旋转
- zig-zag : 自己&父节点，父节点&再上一级节点方向不同，对自己进行两次反向旋转

（配图见下）

## 操作

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
- Search

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

- 势能函数$\phi(p) =\sum_{i\in subtree(p)} \log{S(i)}$，其中 $S(i)$ 指 $i$ 的子树大小。记 $\log{S(i)} = rank(i)$ ，则 $\phi(p)=\sum_{i\in subtree(p)} rank(i)$

- zig, zig-zig, zig-zag本体复杂度为1,2,2

- zig : 

  <img src="/img/ads/ads-SplayZig.png" alt="ads-SplayZig" style="zoom:67%;" />
  
  $$
  \begin{aligned}
  \hat{c_i} =& 1 + \phi(T_2) - \phi(T_1)\\
   = &1 + R_2(x) - R_1(x) + (R_2(p) - R_1(p))\\
   \leq &1 + R_2(x) - R_1(x)
   \end{aligned}
  $$

- zig-zag: 

<img src="/img/ads/ads-SplayZigZag.jpg" alt="ads-SplayZigZag" style="zoom:67%;" />

$$
\begin{aligned}
 \hat{c_i} =& 2 + \phi(T_2) - \phi(T_1)\\
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
  \hat{c_i} =& 2 + \phi(T_2) - \phi(T_1)\\
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




# B+ Tree<a id="B+"></a>

是一种多叉树

**定义** : A B+ tree of order M is a tree with following structural properties:

- Root: a leaf / has [2~M] children
- Nonleaf nodes (except root) : has [$\lceil M/2 \rceil$ , M] children
- Leaf: same depth

 如图为 M = 3 的情况

可以看出非叶子节点最多存储 M-1 个键值，其中第 i 个对应其第 i+1 个子树中存储的最小值

![Degree3Bplus](/img/ads/B+Order3.jpg)

## 操作

- Find
  - 与当前节点的所有子节点左边界值进行比较以找到应该在的区间

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

# 红黑树<a id="RB"></a>



**定义：** 一棵红黑树需要满足如下条件：

- 节点分为红黑两种颜色
- 根节点为黑色
- 空节点（NIL）为黑色
- 红色节点的子节点一定为黑色
- 从根节点往下到叶节点（NIL），每条路径上黑色节点数量相同
  - 定义每个节点的黑高 (Black height)是从自己向下到NIL的路径上黑色节点的个数（**但是不包含自己**）
    - 例如 BH(NIL) = 0， 单个节点的树 BH = 1（对应NIL，根节点本身不算在内）


**性质：**

- 可以得到的导出性质（用于判别红黑树）：红黑树的红色节点的两个子节点一定同为叶子或同不为叶子（其中叶子指NIL）。

-  $N$ 个内部节点（不含NIL）的红黑树的高度最大为 $2\log_2(N+1)$

  - 证明：综合以下两条
  
  $$
  \begin{cases}
  N \ge 2^{BlackHeight} - 1\\
  Height \le 2BlackHeight
  \end{cases}
  $$

## 操作

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
      - case 3 : 红色节点染黑，其父亲染红，再将新的黑色节点右旋上去
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
	  
	- 平衡维护：也需要递归地调整。记当前导致失衡的子树的根节点是x，依据兄弟节点(w)、其子节点(lc & rc)以及父亲节点(fa)进行分类。以下以 x 为左子树为例，右子树则需对称处理。
	
	  - case 1 : x,w,lc,rc全黑
	
	    - case 1.1 fa 是红色的：将 w 染红， fa 染黑，相当于从 w 子树中抽一个黑色出来共享给 x
	    - case 1.2 fa 是黑色的：同样将 w 染红，然而在 fa 的子树内无法找到可以用来从红转黑共享给 x 的黑色节点，因而将矛盾转移到 fa 以上的部分。如果 fa 就是根节点，则可以直接退出（因为整棵树黑高平等减一）。
	
	  - case 2 : x,w黑，rc红：将 w 染为和 fa 相同的颜色，将 rc 和 fa 染黑，并对 fa 进行一次左旋。思路是给 x 上方补一个黑节点，为了和其他子树保持一致顶上留一个与原 fa 相同的节点。因为 rc 的高度-1，将 rc 本身变黑以弥补。
	
	    ![case2](/img/ads/RBT-DeleteBalanceCase2.jpg)
	
	  - case 3 : x,w,rc黑，lc红：刚刚那个思路中更改 rc 颜色用于补偿的步骤无法实施。将 w 染红， lc 染黑，右旋 w 使得 b 成为新的根。可以发现在 w 和 lc 对调染色时， lc 的整体黑高比 rc 高了 1，其左右两子树的黑高倒是与 rc 一致，因此将 lc 转到根节点后 lc 子树内黑高与原先一致，但右子节点变红了，则状况转为 case 2 。
	
	    ![case3](/img/ads/RBT-DeleteBalanceCase3.jpg)
	
	  - case 4 : fa,x,lc,rc黑，w红：将 fa 左旋，使 w 成为新的根节点。但此时左右两子树黑高差1，因此将 fa 染红， w 染黑（此时至少保证了向 lc 方向的路径与向 rc 方向的路径黑高一致），然而 fa 子树内黑高仍然不相等，因此递归到子树中去，可能转化为 case 1.1,case 2,case 3。
	
	  ​      ~~懒得画了，借一下oiwiki的图~~
	
	  ![case4](/img/ads/RBT-DeleteBalanceCase4.jpg)
	
	  - 综合以上四种情况：case1.2需要向上递归，case4需要向下递归，剩余情况无需递归。case2，case3，case4中存在Rotate操作，则最多旋转次数为由 case4 转到 case3 再到 case2 ，共计3次
	
	- 删除部分最坏即寻找前驱后继，复杂度为树高；平衡维护部分向上递归 (case1.2) 与向下递归 (case4) 不兼容，因此最坏复杂度即树高， $O(\log{N})$

- 查找前驱后继等操作同正常 BST

## 比较：AVL与RBT的旋转操作次数

|        | AVL          | RBT     |
| ------ | ------------ | ------- |
| Insert | $\le 2$      | $\le 2$ |
| Delete | $O(\log{N})$ | $\le 3$ |

分析见[AVL](#AVL)和[RBT](#RB)的相应部分。

# Inverted File Index

**定义：**

- **Index:** a mechanism for locating a given term in a text.
- **Inverted file: **  contains a list of pointers (e.g. the number of a page) to all occurrences of that term in the text.



## Distributed Indexing

- **Term-partitioned Index**  存储困难，检索容易
- **Document-partiitioned index** 存储容易，检索困难

## Dynamic Indexing

- 文档加入正常插入
- 文档删除：攒够一定量删除请求（存在auxiliary index）统一处理（写满了/定期），处理时需要在main index和auxiliary index同步检索
  - 树型结构太大就改用懒删除

## Thresholding

- Query:对词组按出现频率排序

# 左偏堆<a id="Leftist"></a>

- 思路：使右子树相对稀疏
- **Npl** : null path length，一个节点到其子树内**没有两个孩子的节点**的最短距离。特别的，Npl(NULL) = -1 。
  - $Npl(X) = \displaystyle\min_{\forall C \in son(X)} \{Npl(C) + 1\}$
  - 左偏堆要求对于所有节点的左右儿子有 $Npl(ls) \ge Npl(rs)$ 
    - 如果不满足可以交换左右儿子实现
- 性质
  - 右路径长度为 r 的左偏堆至少拥有 $2^r-1$ 个节点。（此时是满二叉树）[tips : 数学归纳法]

<details>
	<summary> code </summary>
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
  - DeleteMin : O(logN)

## 斜堆<a id="Skew"></a>

神必算法

- 每Merge必调换左右儿子

- 复杂度：均摊分析
  - $D_i = the\ \ root\ \ of\ \ the\ \ resulting\ \ tree$ 
  - $\phi (D_i) = number\ \  of\ \ heavy\ \ nodes$
    - heavy nodes :  右子树大于左子树的节点
    - 除了在归并路线上的节点，其他节点的轻重性质不变化
    - 定义最开始的右路径（即归并路线）上轻节点 $l_i$ ，重节点 $h_i$ 。
      - 则 $l_i$ 越多 $l_i$ 越少（ $l_i$ 多则堆趋于左倾堆，则右路径长度就短，至多到 $O(\log N)$ 级别）
    - 极端情况变化：轻全变重

$$
T_{worst}=l_1+h_1+l_2+h_2\\
\phi_i = h_1+h_2+h\\
\phi_{i+1} \le l_1+l_2+h\\
T_{amortized} = T_{worst}+\phi_{i+1}-\phi_i\le 2(l_1+l_2) \Rightarrow O(\log N)  
$$



# 二项队列<a id="Binomial"></a>

- 是一些堆（二项树）的集合（森林）
- k阶二项树（ $B_k$ ）由两个k-1阶二项树将两个根相连形成，特别的，单点是0阶。
  - $B_k$ 共有 $2^k$ 个节点，深度为 $i$ 的一层（根为0）有 $(^k_i)$ 个

![BinomialQueuesExample](/img/ads/BinomialQueuesExample.jpg)

- 以长子兄弟的形式存储，同一节点的所有儿子按子树大小降序排列

### 操作


- Merge：单次复杂度 $O(\log n)$ ， 均摊 $O(1)$
	- 二项树的合并，显然 $O(1)$

<details>
	<summary> code </summary>
	<pre><code>
      T2->Next = T1->Lson;
      T1->Lson = T2;
	</code></pre>
</details>


- Insert：即将一棵 $B_0$ 树合并到队列中，单次最好 $O(1)$ 最坏 $O(\log n)$ ， 均摊 $O(1)$

- Build：将节点逐个插入，由均摊分析得总复杂度 $O(n)$

- POP：将最小根节点取出，将其对应二项树拆成所有子树再Merge回去， $O(\log n)$

- Decrease Key：在二叉树上进行上调，显然 $O(\log n)$

### 均摊分析

  - 建树

    - $\phi = number\ \ of\ \ trees$

    - 假设进行插入时现有单独的树$B_0,B_1,...,B_k, B_{k+t},....(t\ge 2)$，则插入时会与 $B_0$ 到 $B_k$ 合并得到一棵 $B_{k+1}$ ，其他不变，则 $\phi_i - \phi_{i-1} = -k$ （正在插入的那个点也是一棵树）

    - $\hat{c_i} = c_i + \phi_i - \phi_{i-1} = 1+(k+1) -k = 2 $

      - 为什么$c_i = 1 + (k+1)$ ？

        因为要有 $k+1$ 次合并和 $O(1)$ 的创建节点

    - Banking Method : 每个点初始一块钱，合并操作花掉两棵子树之一（被合并成为儿子那个点）的一块钱，则整个树至少还有一块钱（在根节点上），则整个系统钱不会为负，因而总复杂度是 $O(N)$ 的
    
  - 插入：由建树的过程可以得到每个点的插入平均下来是 $O(1)$ 的

# 总结：复杂度

| Heaps        | Leftist | Skew | Binomial | Fibonacci       | Binary | Link list |
| ------------ | ------- | ---- | -------- | --------------- | ------ | --------- |
| Make heap    | O(1)    | O(1) | O(1)     | O(1)            | O(1)   | O(1)      |
| Find-Min     |         |      | O(1)     |                 |        |           |
| Merge(Union) |         |      | O(1)     |                 |        |           |
| Insert       |         |      | O(log n) |                 |        |           |
| Delete       |         |      |          |                 |        |           |
| Delete-Min   |         |      |          | (amortized)O(1) |        |           |
| Decrease-Key |         |      |          |                 |        |           |

| BST  | RBTree | AVL  | Splay |
| ---- | ------ | ---- | ----- |
|      |        |      |       |

# Backtracking<a id="backtracking"></a>

- 考虑对称性可以少算不少

template（略）

- min-max搜索

  以棋类游戏（三子棋为例）评估一个情况的优劣为其所有后继中估值最低的那种，从而得到最优解。左右旋不会影响整颗树的红黑平衡吗，为什么旋转的代码里面没有关于颜色的内容围棋这类，只需模糊搜索评估的优劣比人强就行。

  - 找到比另一分支更小的结果可以直接停掉
  
- $\alpha-\beta$ pruning

# DP<a id="DP"></a>

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

