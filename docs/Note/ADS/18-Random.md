# 随机化算法 {#Random}

!!! note "基础知识：期望的线性性"
    - 对于离散变量X，我们有

    $$
    E(X) = \sum i*Pr(X=i)
    $$

## 案例 {#案例}

### 例1：The Hiring Problem

!!! note "问题描述"
    老板只想招一个员工，共有 $n$ 个面试者，每次只能面试一个人。
    
    如果决定招募一个人，则雇人的价格是 $C_h$  Hiring cost ，即使后面将 ta 辞退也不会变化。

    而进行一次面试的价格是 $C_i$ Interviewing cost 。
    
    符合常识的， $C_i << C_h$ ，这样也能表现出决策的重要性。

    在这个背景下，我们不讨论时间复杂度，而是讨论资金的消耗及招募到最高素质的面试者的概率。

#### 解法 {#解法}

- 策略为逐个面试，如果当前面试者的素质高于当前雇佣的人（或者没有雇佣人）就立即雇佣当前这个人。

- 最坏情况开销即素质递增，老板每个人都会雇佣一遍， $O(nC_h)$ 

对于更一般的情况，我们基于随机性提出 **Randomness assumption**

> any of first i candidates is equally likely to be best-qualified so far

那么第一个人必定被雇佣，第二个人被雇佣概率为 1/2，第三个人概率为 1/3，...，第 n 个人为 1/n

此时雇佣次数的期望利用期望的线性性，转化为每个人被雇佣期望的加和，则有

$$
E(X) = \sum_{i=1}^n \frac{1}{n}=\ln{n}+O(1)
$$

则平均的花销为 $O(\ln{n}C_h + nC_i)$

因此可以将面试者数列随机打乱再进行面试

??? code
    ```cpp
    for(i in [1,n])
        A[i].P = 1+rand()%(N^3)
    sort A[i] base on A[i].P
    ```

### 例1 在线ver {#例一在线版本}

在例一基础上，无法获取全部面试者名单，且只能雇佣一次，只能当场决定面试者去留。

#### 解法 {#解法}

- 策略为：对前 k 个人做调研，获取 max 不雇佣；对后 n-k 个人，雇佣遇到的第一个超过 max 的人，否则雇佣最后一个

下面我们将讨论通过这种策略雇佣到最佳员工的概率，以及 $k$ 选择为何值最优。

定义事件 $S$ 为雇佣到最佳， $S_i$ 为第 i 个面试者是最佳且被雇佣的

则 

$$
\begin{aligned}
Pr[S_i] &= Pr[\text{i is the best}]*Pr[\text{no one at k+1~i-1 are hired}] \\
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

取 $k=N/e$ 时， $Pr_{max}=1/e$

### 例二：快排 {#快排}

随机化选择 split，直到选到中间部分也即划分后左右元素都在 [1/4N,3/4N] 范围内的分割点（称为找到一个 central splitter），如果没找到就重新随机找。

那么期望寻找次数为

$$
E{X} = 1+\frac{1}{2}+\frac{1}{2^2}+\frac{1}{2^3}+..+\frac{1}{2^n}=2
$$

（提示，这里不是 $\sum i2^{-i}$ 的原因是其展开思路是期望线性性，但是用 $\sum i2^{-i}$ 同样能算）

另外还有个我不太理解的概念，列在下面

- **type j** : the subproblem S is of type j iff $N(\frac{3}{4})^{j+1}\le |S|\le N(\frac{3}{4})^j$
    - 性质： 至多有 $(\frac{4}{3})^{j+1}$ 个 type j 的子问题
