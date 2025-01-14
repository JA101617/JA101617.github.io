# 均摊分析Amortized Analysis {#均摊分析}

对于部分复杂度的分析，其最好和最坏时间复杂度差距极大，如果使用最坏复杂度进行分析将不利于得到合理的分析结果

!!! example "例子"
	回忆上学期学过的并查集（有路径压缩优化的版本），最坏的情况下单次操作的效率可能达到 $O(n)$ ，即使加上按秩合并之类的优化也有可能 $O(\log{n})$。
	
	如果从一般的角度来看， $n$ 次合并的复杂度岂不是能达到 $O(n^2)$ ？显然是不可能的，因为每次路径压缩都会为后面的节点提供更小的树高
	
	通过考虑这种“造福后人”的情况，求得其均摊的复杂度都是 $O(\alpha(n))$ ，接近于常数的复杂度。（但是这个证明不在课程考虑范围内）

因此我们引入了 **均摊分析** 这种方法，通过设计势能函数将较高复杂度的单次操作的代价摊给低复杂度的操作。

---

## 均摊分析的三种方法 {#三种方法}


### Aggregate Analysis {#聚合分析}

这是一种较为朴素的思想，即通过一长串操作的用时估算平均用时。

具体来说，假设 $n$ 个操作总最差用时 $T(n)$， 则 amortized cost 为 $\dfrac{ T(n) } { n }$ 

### Accounting method {#记账法}

这种方法在我看来需要一定的巧思（但是话又说回来下面的方法也需要巧思）。

类比于往银行存钱取钱的过程，整个过程中（认为银行不给贷款的话）卡里的余额都不会变成负数。

假设每个操作的实际成本（耗时）是 $c_i$ ，而现在我们给每个操作设计一个成本 $\hat{c_i}$ 。

如果遇到某个操作的 $\hat{c_i} > c_i$ ，则多出来的这部分相当于存入银行，或者说应该叫 credit 。

而如果遇到某操作的 $\hat{c_i} < c_i$ ，则差额需要调用现有的 credit 来补上。

在设计这个 $\hat{c_i}$ 的时候，一个要点是需要保证 credit 始终非负。

在这样的前提下，我们可以用 $\hat{c_i}$ 作为这个操作的均摊复杂度，因为

$$
T_{amortized} = \dfrac{\sum \hat{c_i} }{n} \ge \dfrac{\sum c_i}{n}
$$

??? example "例子"
	一个经典的问题是对于一个初始大小有限的数组，如果存入元素满了就会扩容，使得容量变为原来的两倍，那么在这个数组中存入元素的复杂度如何分析。

	使用 accounting method ，可以为每次操作设定 $\hat{c_i} = 3$ 。
	
	对于正常的存入，由于其操作的代价是 1 ，就会为 credit 加 2 。

	而如果对一个满员的数组存入 ，首先需要增加一倍的数组容量。不妨假设初始数组容量为 1 ，这会使得分析简单许多。
	
	在初始容量为 1 的情况下，数组容量始终为 $2^n$ 。假设当前数组容量是 $2^k$ ，则上次扩容是在容量为 $2^{k-1}$ 的时候。这之间正常插入了 $2^{k-1}$ 个元素，也就是 credit 存入了 $2^k$ ，恰好足以支付扩容的开销。

	因此单次存入元素的开销就是 $O(1)$ 的。

### Potential method {#势能函数}

其实我认为这个方法与 accounting method 是异曲同工的。

具体来说，在这个方法中我们引入了一个 **势能函数 $\varPhi$** ，它是依据当前操作后的局面唯一确定的，那么可以认为这里的势能函数变化量顶替了前文 credit 的角色，即

$$
\hat{c_i}-c_i = credit_i = \Phi(op_i)-\Phi( op_{ i-1 } )
$$

那么在计算整串操作的复杂度 $\sum c_i$ 的时候，可以得到 

$$
\begin{aligned}
\sum_{ i=1 }^n  \hat{c_i} &= \sum_{i=1}^n (c_i+\Phi(op_i)-\Phi( op_{i-1} ) )\\
&= \Phi(op_n)-\Phi(op_0)+\sum_{i=1}^n c_i
\end{aligned}
$$

如果 $\varPhi(op_n)-\varPhi(op_0)$ 非负，且其复杂度不高于 $\sum\hat{c_i}$ ，那么可以用 $\hat{c_i}$ 估计这个操作的均摊复杂度

---

在对均摊复杂度有所了解后，我们就可以得出一个论断：

$$
\text{worst-case bound}\ge\text{amortized bound}\ge\text{average-case bound}
$$

### 作业 {#作业}

??? note "T1:概念"
    When doing amortized analysis, which one of the following statements is FALSE?
    
	A.Aggregate analysis shows that for all n, a sequence of n operations takes worst-case time T(n) in total.  Then the amortized cost per operation is therefore T(n)/n
	
	B.For potential method, a good potential function should always assume its maximum at the start of the sequence
	
	C.For accounting method, when an operation's amortized cost exceeds its actual cost, we save the difference as credit to pay for later operations whose amortized cost is less than their actual cost
	
	D.The difference between aggregate analysis and accounting method is that the later one assumes that the amortized costs of the operations may differ from each other
	
	??? note "Answer"
		B

??? note "T2：势能函数设计"
    ![01-1](/img/ads/AmortizedT2-5.jpg)
    

    ??? note "Answer"
        D
        
        ![01-2](https://zhoutimemachine.github.io/note/courses/imgs/ads/ads_hw_1.2.png)

