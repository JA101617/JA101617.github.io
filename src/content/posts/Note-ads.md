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

# Lesson 1 : AVL,Splay,Amortized Analysis

**注**：下文代码使用C++，以结构体数组实现

```
struct Node{
	int lson, rson, val, h;
}t[maxn];
```

## AVL Trees

**定义：** 

- 空树是平衡的
- 非空树是平衡的当且仅当左右子树是平衡的且其高度差不超过1

**注**：定义空树高度为-1

**Balance Factor：** $BF(node) = h_L-h_R$

- 没有绝对值，可以为负，对于平衡的树，BF取值为$\pm 1$或 $0$
- 故当某节点的BF值不为上述值则需要调整

### Rotation Operations

- **Left-Rotate**

```cpp
int Lrotate(int p){
    int ls = t[p].lson;
    t[p].lson = t[ls].rson;
    t[ls].rson = p;
    t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    t[ls].h = max(H(t[ls].lson),H(t[ls].rson))+1;
    return ls;
}
```

- **Right-Rotate**

```cpp
int Rrotate(int p){
    int rs = t[p].rson;
    t[p].rson = t[rs].lson;
    t[rs].lson = p;
    t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    t[rs].h = max(H(t[rs].lson),H(t[rs].rson))+1;
    return rs;
}
```

<img src="/img/ads/ads-AVLRotate.png" alt="ads-AVLRotate" style="zoom:67%;" />

### 实现

- 插入节点，注意此刻只影响其祖先的BF值，故只用在递归的时候通过返回值提醒祖先节点进行检查
- 观察可知，当某个节点通过Rotate完成调整后，该子树的 $BF$ 值相比插入前不变，故只需在离其最近的不平衡祖先( $p$ )进行调整即可 
- 若插入在 $p$ 左子树且 $BF(p) > 0$ ，以 $p$ 为中心右旋
- 若插入在 $p$ 右子树且 $BF(p) < 0$ ，以 $p$ 为中心左旋
- 若插入在 $p$ 左子树且 $BF(p) < 0$ ，先以 $ls$ 为中心右旋再以 $p$ 为中心左旋

```cpp
int RLrotate(int p){
    t[p].lson = Rrotate(t[p].lson);
    return Lrotate(p);
}
```

- 若插入在 $p$ 右子树且 $BF(p) > 0$ ，先以 $rs$ 为中心左旋再以 $p$ 为中心右旋

```cpp
int LRrotate(int p){
    t[p].rson = Lrotate(t[p].rson);
    return Rrotate(p);
}
```

- 插入的实现（默认没有重复值）

```cpp
int H(int p){
    return (p <= tot && p != 0)? t[p].h : -1;
}
int insert(int p, int v){
    if(!p){
        t[++tot] = (Node){0, 0, v, 0};
        return tot;
    }
    if(v <= t[p].val){
        t[p].lson = insert(t[p].lson,v);
        if(H(t[p].lson) - H(t[p].rson) == 2){
            if(v <= t[t[p].lson].val) p = Lrotate(p);
            else p = RLrotate(p);
        }
    } 
    else{
        t[p].rson = insert(t[p].rson,v);
        if(H(t[p].lson) - H(t[p].rson) == -2){
            if(v > t[t[p].rson].val) p = Rrotate(p);
            else p = LRrotate(p);
        }
    }
    t[p].h = max(H(t[p].lson),H(t[p].rson))+1;
    return p;
}
```

- 删除（TBC）

## Amortized Analysis均摊分析  

### Aggregate Analysis

- $n$ 个操作总最差用时 $T(n)$， 则 amortized cost 为 $\dfrac{ T(n) } { n }$ 

### Accounting method

- 类似存款存入不会比取出少，设计每种操作的均摊成本$d_i$ ，使得相比于实际成本$c_i$有$\forall_i\ \ d_i \ge c_i$
- 势能函数$\phi(op_i)$ 表示整个数据结构在第i个操作前后的势能，满足$d_i-c_i = \phi(op_i)-\phi( op_{ i-1 } )$，则

$$
\begin{aligned}
\sum_{ i=1 }^n  d_i &= \sum_{i=1}^n (c_i+\phi(op_i)-\phi( op_{i-1} ) )\\
&= \phi(op_n)-\phi(op_0)+\sum_{i=1}^n c_i
\end{aligned}
$$

需要$\phi(op)$的复杂度不高于前面，方便起见可以让$\phi(op_0)=0$

## Splay

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
  d_i =& 1 + \phi(T_2) - \phi(T_1)\\
   = &1 + R_2(x) - R_1(x) + (R_2(p) - R_1(p))\\
   \leq &1 + R_2(x) - R_1(x)
   \end{aligned}
  $$

- zig-zag: 


$$
  \begin{aligned}
  d_i =& 2 + \phi(T_2) - \phi(T_1)\\
   = &2 + R_2(x) - R_1(x) + R_2(p) - R_1(p) + R_2(g) - R_1(g)\\
  
   \end{aligned}
$$
  因为$R_1(g) = R_2(x)$
  故
$$
  \begin{aligned}
  d_i = &2 - (R_1(x) + R_1(p) )+ R_2(p)  + R_2(g)\\
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
  d_i \leq 2(R_2(x)-R_1(x))
$$

- zig-zig : 

  <img src="/img/ads/ads-SplayZigZig.png" alt="ads-SplayZigzig" style="zoom:67%;" />
  
  
  $$
  \begin{aligned}
  d_i =& 2 + \phi(T_2) - \phi(T_1)\\
   = &2 + R_2(x) - R_1(x) + R_2(p) - R_1(p) + R_2(g) - R_1(g)\\
   = &2 + R_2(p) + R_2(g) - R_1(p) - R_1(x)\\
   \leq &2 + R_2(x) + R_2(g) - 2R_1(x)
   \end{aligned}
  $$

  同理zig-zag的均值不等式可得$ R_1(x)+R_2(g)-2R_2(x)\leq -2$ ，即 $2R_2(x) - R_1(x) - R_2(g)\ge 2$

  所以
  $$
  \begin{aligned}
  d_i \leq &2 + R_2(x) + R_2(g) - 2R_1(x)\leq 3(R_2(x)-R_1(x))
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

## 红黑树

TBC
