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


**注**：下文代码使用C++，以结构体数组实现

# Amortized Analysis均摊分析  

## Aggregate Analysis

- $n$ 个操作总最差用时 $T(n)$， 则 amortized cost 为 $\dfrac{ T(n) } { n }$ 

## Accounting method

- 类似存款存入不会比取出少，设计每种操作的均摊成本$d_i$ ，使得相比于实际成本$c_i$有$\forall_i\ \ \hat{c_i} \ge c_i$
- 势能函数$\phi(op_i)$ 表示整个数据结构在第i个操作前后的势能，满足$d_i-c_i = \phi(op_i)-\phi( op_{ i-1 } )$，则

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

```
struct Node{
	int lson, rson, val, h;
}t[maxn];
```

## Rotation Operations

- **Left-Rotate**

```cpp
int Lrotate(int p){
    int rs = t[p].rson;
    t[p].rson = t[rs].lson;
    t[rs].lson = p;
    t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    t[rs].h = max(H(t[rs].lson),H(t[rs].rson))+1;
    return rs;
}
```

- **Right-Rotate**

```cpp
int Rrotate(int p){
    int ls = t[p].lson;
    t[p].lson = t[ls].rson;
    t[ls].rson = p;
    t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    t[ls].h = max(H(t[ls].lson),H(t[ls].rson))+1;
    return ls;
}
```

<img src="/img/ads/ads-AVLRotate.png" alt="ads-AVLRotate" style="zoom:67%;" />

- **LR-Rotate**：先以 $ls$ 为中心左旋再以 $p$ 为中心右旋

```cpp
int LRrotate(int p){
    t[p].lson = Lrotate(t[p].lson);
    return Rrotate(p);
}
```

- **RL-Rotate**：先以 $rs$ 为中心右旋再以 $p$ 为中心左旋

```cpp
int RLrotate(int p){
    t[p].rson = Rrotate(t[p].rson);
    return Lrotate(p);
}
```

## 操作

- Maintain

  ​	如果需要调整， $|BF(p)|=2$ ，以下以左倾为例进行分析（右倾是对称的）。树结构如下

  ![TreeStruct](/img/ads/AVLMaintain.jpg)

  - 若 $BF(B)\ge0$ ，`Rrotate(D)` 即可

  ![Rrot](/img/ads/AVLMaintainRrot.jpg)

  - 反之 `LRrotate(D)`

  ![LRrot](/img/ads/AVLMaintainLRrot.jpg)

  ```\
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
  ```

  - 显然复杂度 $O(1)$

- Insert

  - 因为要递归找到叶子所以是 $O(\log{n})$

  - 只影响其祖先的BF值，故只用在递归的时候通过返回值提醒祖先节点进行检查。进一步观察可知，当某个节点通过Rotate完成调整后，该子树的 $BF$ 值相比插入前不变，故实际上只在离其最近的不平衡祖先进行调整


```cpp
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
```

- Delete
  - 删除节点
    - 叶节点：直接删掉
    - 只有左子树/右子树：用有的那个子节点替代自己（此时那个子节点一定是个叶节点）
    - 兼有左右子树：取前驱/后继替代自己，将其节点删掉
    - 从删除的叶节点向上调整即可

- Find：同正常二叉树， $O(\log{n})$ 
- 



# Splay<a id="Splay"></a>

### 一些名词

- zig : 当前节点向父节点位置旋转
- zig-zig : 自己&父节点&再上一级节点方向相同，对自己&父节点进行同向旋转
- zig-zag : 自己&父节点，父节点&再上一级节点方向不同，对自己进行两次反向旋转

（配图见下）

### 复杂度分析

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

- splay操作

​		假设一次splay共计进行了 $n$ 步，因为单zig只会在转到根出现，则总复杂度
$$
T_n \leq 1+3(R_n(x)-R_0(x))
$$
​		而$R_n(x)$ 为 $O(\log{N})$的，所以splay操作也是$O(\log{N})$的

​		值得注意的是$R_0(x)$不一定为0

- search操作

  ​	一路往下找，链长是$O(\log{N})$ + splay上去

- delete操作

  ​	找到点并splay上去，如果计数为1则删除节点，否则合并两棵子树（查询前驱将其设为根）

- insert操作

  ​	一路往下找+splay上去，链长也是$O(\log{N})$


# B+ Tree<a id="B+"></a>

TBC

# 红黑树<a id="RB"></a>

TBC

# Inverted File Index

**定义：**

- **Index:** a mechanism for locating a given term in a text.
- **Inverted file: ** contains a list of pointers (e.g. the number of a page) to all occurrences of that term in the text.



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

```c
struct TreeNode{
	ElementType Element;
	PriorityQueue Left,Right;
	int Npl;
};
```

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

      ```
      T2->Next = T1->Lson;
      T1->Lson = T2;
      ```


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

  以棋类游戏（三子棋为例）评估一个情况的优劣为其所有后继中估值最低的那种，从而得到最优解。

  围棋这类，只需模糊搜索评估的优劣比人强就行。

  - 找到比另一分支更小的结果可以直接停掉
  - $\alpha-\beta$ pruning
