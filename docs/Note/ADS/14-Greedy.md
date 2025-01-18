# Greedy

一般是按照一种符合直觉的方式从局部确定全局方案，最简单的例子是买相同的东西选择性价比最高的。

当且仅当局部最优解和全局最优解重合时有效，否则正确性无法保证，

但是一般贪心离最优解不会太远，具体差多少会在[近似比](/Note/ADS/16-Approximation/)中讨论

## 案例 {#案例}

### 活动安排 {#活动安排}

给定一系列活动 $S={a_1,...,a_n}$ ，每个活动占据时间 $[s_i,f_i)$ ，要求合理安排使得安排活动数量最大化

#### 解法 {#解法}

1. 离散化，枚举每个活动 $f_s = \min_{j<s}{f_j} +1$ ，前缀 min 可以维护，总复杂度 $O(n)$

2. 按结束时间第一关键字（升序）开始时间第二关键字（降序）排列，能塞就塞

#### 证明 {#证明}

> Consider any nonempty subproblem $S_k$ ,and let $a_m$ be an activity in $S_k$ with the earliest finish time.  Then $a_m$ is included in some maximum-size subset of mutually compatible activities of $S_k$.

​若 $A_k$ 是一个最优解集合，

​若 $a_m\in A_k$ 无需证明，

​否则将 $A_k$ 中的最早结束的活动替换为 $a_m$ 仍然合法，这表明 $a_m$ 必然存在于某个最优解集合。

不断缩小时间范围即可得到上述贪心策略的正确性。

### 哈夫曼编码树 {#哈夫曼编码树}

#### 解法 {#解法}

依据出现频率编码，形成的二叉树只在叶节点对应字符的编码

??? code
    ```c
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
    ```

#### 证明 {#证明}

- Greedy-Choice Property
  
假设当前权重最低的两个字符分别是 $x$ 和 $y$ ，对应权重 $w_x$ 与 $w_y$ ，且存在一个最优解的树 $T$ ，其中没有将 $x$ 和 $y$ 合并。

那么将 $x$ 和 $y$ 合并，替代掉 $T$ 中最深的节点对（最优结构中不会存在无谓的中间节点，如果这个深度最深的节点没有兄弟，那么它的父节点直接消失会更好），得到的结果将频率更高（或者至少不会低于 $x$ 和 $y$ ）的两个节点的深度减小，因此得到的新树 $T'$ 必然不会更劣。

- Optimal Substructure Property

最开始我没想明白为什么要证明这一条，但是现在应该有所理解。

这一步是要说明，我们将 $x$ 和 $y$ 合并作一个节点看待继续进行的贪心过程最终能够展开到 $x$ 和 $y$ ，且最优性质不改变。

那么我们假设 $x$ 和 $y$ 合并成 $z$ ， $w_z=w_x+w_y$ ，整个字符集为 $\mathbb{C}$

对于 $\mathbb{C}'=\mathbb{C} \text{\\} \{x,y\}\cup\{z\}$ 构建的哈夫曼 $T'$ ，假设将 $z$ 还原为 $x$ 和 $y$ 后得到的 $T$ 不是最优。

那么必然存在更优的编码树 $T''$ ，它没有将 $x$ 和 $y$ 合并，从 Greedy-Choice Property 来看，我们可以将其优化得到 $T^*$ ，其中 $x$ 和 $y$ 合并了，且 $cost(T^*)
\le cost(T'') < cost(T)$ 

此时 $T^*$ 必然对应 $\mathbb{C}'$ 的一个 $T^{*'}$

然而 $cost(T^*) = cost(T^{*'}) +w_z$ ， $cost(T) = cost(T')+w_z$ ，这些性质共同得到 $cost(T^{*'}) < cost(T')$ 这与假设相矛盾。

综合以上的两条性质就可以说明这个贪心策略的正确性了。