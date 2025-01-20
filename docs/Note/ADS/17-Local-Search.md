# Local Search

## Framework

正如这类算法的名字，设计它需要以下两个要素：

- Local: 确定 neighbor的范围，找到 local 的最优解
- Search: 从一个可行解开始，在邻域中搜索更优解，直到无法优化

## Neighbor Relation

- 称 S' 是 S 的邻居 $\iff$ S'可以通过对 S 进行微小修改得到 $\iff$ S~S'
- N(S) : {S':S~S'}

## Search

首先是最基础的梯度下降，不断选择当前状态的邻居，若能获得最优解就接受新状态。

??? code
    ```c
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
    ```

### 优化：大都市算法(metropolis algorithm)

- idea ：基于梯度下降，一定概率接受非更优解

??? code
    ```cpp
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
    ```

其中 $p=e^{-\Delta cost/(kT)}$ ， k 是一个系数，T是固定的“温度”

### 优化：模拟退火(Simulated Annealing)

- idea : 在metropolis基础上，T逐渐下降

所谓退火就是锻造过程中温度下降的过程，随着温度下降原子排列趋于稳定。

### 其他优化 {#其他优化}

以 $m$ 维向量为例，一般的微小扰动都只改变其中的 1 维，邻域大小不足，可能不利于寻找更优解。

因此可以引入 k-flip 以增加搜索的邻域，即单次扰动其中 $k$ 个维度.

- $O(n^k)$ 寻找邻居

- K-L算法：计算一批节点的增益，选其中一批统一更新

## 实例 {#实例}

### Vertex Cover Problem

>Given an undirected graph G = (V, E).  Find a minimum subset S of  V such that for each edge (u, v) in E, either u or v  is in S.

- cost(S) = |S|
- 起始 S = V，扰动：删去某个点
- 使用梯度下降极其容易陷入局部最优解，例如菊花图删去中心，所以需要模拟退火或者大都市算法。

### Hopfield Neural Networks

!!! note "问题内容"
    对于G=(V,E)，边带权，为每个点分配状态($s_v=\pm 1$) ,使得：

    - 若 $w_e \ge 0$，u,v 不同状态
    - 若 $w_e < 0$ ， u,v 同状态

    $|w_e|$ 表示需求强烈程度

    也即：$\sum s_us_vw_e$ 的最小值求解

#### 求解 {#求解}

!!! definition "定义"
    - 称一条边是好的当且仅当 $s_us_vw_e <0$ 

    - 称一个局面是好的当且仅当 $\sum s_us_vw_e\le 0$ 

    - 称一个局面是稳定的当且仅当所有节点的要求被满足，即每个节点的邻接边中好边的边权绝对值总和小于坏边边权总和

求解流程每次选择一个没有被满足的点，翻转其状态。

那么对于这样的解法，我们自然会产生两个问题：这个算法的正确性如何证明，以及这个翻转的过程会不会无法终止。

首先来讨论正确性：

- 定义整个图的能量 $E=-\frac{1}{2}\sum_i\sum_jw_{ij}s_is_j$

- 对不满足的点 $i$ 进行翻转，能量改变量为$\Delta E=-v_i\sum_{i\neq j}w_{ij}v_j $ ，希望 E 变小即希望 $v_i\sum_{i\neq j}w_{ij}v_j \ge 0$ ，即其邻接边中好边的边权绝对值总和小于坏边边权总和

#### 复杂度 {#复杂度}

- 势能函数 $\Phi(S) =\sum_{\text{e is good}} |w_e|$
- 则每次翻转 $\Phi$ 都会增加，最坏情况每次增加1，这能够很好地回答我们的第二个问题。
- 复杂度是 $O(W)$ 的（其中W是最大权重），因而对于节点数不是多项式的复杂度（可以类比01背包的 dp 解法不是多项式复杂度）。

### 最大割问题 {#最大割}

!!! note "问题描述"
    将节点分为AB两个集合，所有链接A中点和B中点的边称为割，目标是最大化割的权重

#### 求解 {#求解}

类似hopfield的状态翻转，考虑更改某个节点的归属，收益为 $gain(u)=W(新增的割边)-W(减少的割边)$ ,挑选 $gain > 0$ 的节点翻转。

可以证明的近似比： 2 ，即$W_{local}\ge 0.5 W_{global}$

!!! note "证明"
    $(A, B)$ 是局部最优 $\Rightarrow$ $\forall u \in A$,$\sum_{v\in A} w_{uv}\leq\sum_{v\in B}w_{uv}$ 

    则

    $$
    \begin{aligned}
    2\sum_{u,v \in A}w_{uv}=\sum_{u\in A} \sum_{v\in A}w_{uv}\leq\sum_{u\in A} \sum_{v\in B}w_{uv}=w(A,B)\\
    2 \sum_{u,v \in A} w_{uv} \leq w(A, B)
    \end{aligned}
    $$

    ​	同理$ 2 \sum_{u,v \in B} w_{uv} \leq w(A, B)$ ，则合起来得到 $\sum_{u,v \in A} w_{uv}+\sum_{u,v \in B} w_{uv} \leq w(A, B)$

    ​	若 $(A^*, B^*)$是全局最优，带入上面的结论，有 $w(A^*, B^*) \leq w(A, B) + w(A, B) = 2w(A, B)$

    ​	即 $w(A, B) \geq \frac{1}{2} w(A^*, B^*)$

- 学者结果：除非 P=NP，否则 近似比不小于 17/16

#### 复杂度 {#复杂度}

同 hopfield ，不是多项式时间复杂度。

但是如果限制为 **仅在有足够大的优化时才继续运行** 则可以做到。

!!! note "Big-improvement-flip"
    若只更新翻转后收益增加大于 $\frac{2\varepsilon}{|V|}w(A,B)$ 的点

    那么在近似比方面，求得的答案满足 $(2+\varepsilon)w(A,B)\ge w(A^*,B^*)$ ，
    
    且至多翻转 $O(n/\varepsilon \log{W})$ 次
