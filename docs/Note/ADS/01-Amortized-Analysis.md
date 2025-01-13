# 均摊分析Amortized Analysis

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

### 作业

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

