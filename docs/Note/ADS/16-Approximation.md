# 近似 {#近似}

- 目的：对于一些问题利用多项式时间找到近似的最优解
- 近似比(approximation ratio)：称一个算法的近似比为 $\rho(n) \iff$ $\forall n,$ C是最优解，$C^*$是近似解，则 $\max(\frac{C}{C^*},\frac{C^*}{C})\le \rho(n)$  $\iff$ 说这个算法是 $\rho(n)$-approximation algorithm
- 近似范式(approximation scheme)：一种特殊的近似算法，除了数据以外接受 $\varepsilon$ 这个参数，保证是 $(1+\varepsilon)$-approximation algorithm
  - PTAS(polynomial-time approximation scheme)：复杂度是对于 $n$ 的多项式，而对于 $\varepsilon$ 未必，例如 $O(n^{2/\varepsilon})$
  - FPTAS(full polynomial-time approximation scheme)：复杂度对 $\varepsilon$ 也是多项式，如 $O((1/\varepsilon)^2n^3)$

## 案例 {#案例}

### Bin Packing

- 问题：一维装箱任务，给定 $N$ 个长度为 $S_1,..,S_N$ 的物品，将其装到长度固定的箱子中，求最少的箱子数量
- 属于NPH问题

#### 在线算法 {#在线算法}

存在物品序列使得任意在线算法的相似比至少为5/3

##### **Next Fit**

- 思路：只看当前这一个，能装就装，装不了新开

- 若 $M$ 为理想装箱数量，则该算法最多使用 $2M-1$ 个箱子

  - 证明思路：即证若NF需要 2M 或 2M+1 个箱子，则理想情况至少需要 M+1 个箱子

  - 称每个箱子 $B_i$ 的空间利用率为 $0<S(B_i)\le 1$

    则有 $S(B_{2k-1})+S(B_{2k}) > 1$

    求和得到 $\sum_{i=1}^{2M} S(B_i) > M$ ，即理想情况也不止 $M$ 个箱子

??? code
    ```c
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
    ```



##### **First Fit**

- 思路：寻找前面所有箱子中第一个能放下的

- 若 $M$ 为理想装箱数量，则该算法使用不多于 $1.7M$ 个箱子（已有构造出来的使用 1.7M-1.7 箱子的序列

??? code 
    ```c
    void FirstFit ( )
    {   while ( read item ) {
            scan for the first bin that is large enough for item;
            if ( found )
      place item in that bin;
            else
      create a new bin for item;
        } /* end-while */
    }
    ```


##### **Best Fit**

- 思路：寻找前面所有箱子中最刚刚好放下的

- 若 $M$ 为理想装箱数量，则该算法使用不多于 $1.7M$ 个箱子

??? code
    ```c
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
    ```



#### 离线算法 {#离线算法}

- 思路：物品大小降序排列后再使用 FF 或 BF
- 该算法使用不多于 $(11M+6)/9$ 个箱子，这是确界（存在构造）

### 背包 {#背包}

- 分数背包是一个典型的贪心问题（按性价比排序）

- 分数背包到01背包：强行按性价比选整件

    - 近似比为2（记P为最大收益）

    - 证明：记 $p_{max}$ 是单个物品最大价值； $P_{frac}$ 是分数背包最优解； $P_{greedy}$ 是贪心01的解； $P_{opt}$ 是01的最优解

$$
\begin{aligned}
p_{\max} &\le P_{\text{opt}} \le P_{\text{frac}}, \\
p_{\max} &\le P_{\text{greedy}}, \\
P_{\text{opt}} &\le P_{\text{frac}} \le P_{\text{greedy}} + p_{\max}, \\
\Rightarrow P_{\text{opt}} / P_{\text{greedy}} &\le 1 + p_{\max} / P_{\text{greedy}} \le 2
\end{aligned}
$$


- DP算法的优化处理：在值域范围太大时

  - 将 $p_i$ 映射到更小的范围，通常除以一个常数 $K$

  - 但是要保证够高的精度，以保证：

    $(1+\varepsilon)P_{ans}\ge P$



### K-center Problem

- （2D）在平面中选择 K 个点，使得以这 $K$ 个点为圆心，r 为半径的圆能覆盖给出点集的所有点，且 r 最小化

#### 贪心1 {#贪心1}

- 首先选择所有点的中间值（取平均），然后持续添加点使得半径降低
- 对于如图所示情形非常辣鸡

![image-20241230153157709](/img/ads/ads-approx-Kcgreedy1.jpg)

#### 二分答案 {#二分答案}

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