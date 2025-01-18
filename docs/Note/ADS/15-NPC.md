# NP Completeness

## Complexity

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

## 图灵机角度理解P与NP {#图灵机}

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

## 另一角度 {#另一角度}

### P(polynomial)

实例I可分为yes-instance和no-instance

判定问题的算法A(I)输出仅有yes or no

如果A对于任意实例I，输出yes iff I是 yes-instance，则称A解决了这个问题

若算法A存在多项式复杂度 $p(I)$ 使得对于任意的 I A都能在 $O(p(|I|))$ 终止（其中 $|I|$ 表示 $I$ 的规模），则称A是多项式时间的算法

**P** ： 所有拥有多项式时间的算法的判定问题的集合

### NP(non-deterministically polynomial)

$\Leftrightarrow$ 多项式时间可验证 

## NPC问题 {#NPC问题}

- 任意的NP问题都可以多项式时间规约(polynomially reduce)到NPH问题
- 而NPH中属于NP的部分为NPC问题，其关系如下图所示

![P、NP、NP-complete 和 NP-hard 问题集的欧拉图。](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/P_np_np-complete_np-hard.svg/2560px-P_np_np-complete_np-hard.svg.png)

<center>By <a href="//commons.wikimedia.org/wiki/User:Behnam" title="User:Behnam">Behnam Esfahbod</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=3532181">Link</a></center>

### 规约 {#规约}

>对于任意问题A的实例 $\alpha$ ，如果存在多项式时间（不妨假设其为 $O(N^{k_1})$ ）的算法 R 使得 $R(\alpha) = \beta$ ，且存在另一个多项式时间（假设为 $O(N^{k_2})$ ）的算法 D，$D(\beta)$ 的输出是问题 B 的一个解，且这个解答同样适用于问题 A ，则称问题 A 可以规约到 B，记作 $A\le_P B$

![image-20241230111740401](/img/ads/ads-NPC-reduce.jpg)

- 说人话就是可以在多项式时间内将问题 A 转化成 B

## 形式化语言描述 {#形式化语言描述}

### 抽象问题的定义 {#抽象问题}

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

### 编码与具体问题 {#编码与具体问题}

- 编码（Encoding）
  - $I$ 映射为二进制字符串集合 $\{0, 1\}^*$。
  - $Q$ 映射为具体问题 $Q(x) \in \{0, 1\}$，其中 $x \in \{0, 1\}^*$ 是编码后的问题实例。

#### 基本概念 {#基本概念}

（基于判定问题）

- 字母表 $\Sigma$：有限符号集合，例如 $\Sigma = \{0, 1\}$。
- 语言 $L$ 是由字母表 $\Sigma$ 构成的字符串集合。
  - $L \subseteq \Sigma^*$，其中 $\Sigma^*$ 是 $\Sigma$ 上所有可能字符串的集合。
  - $L = \{x\in\sum^*:Q(x)=1\}$
  - 空字符串记为 $\varepsilon$ ，空语言记为 $\emptyset$
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

### P&NP&NPC 

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

## 案例 {#案例}

### Halting Problem 停机问题 {#HP}

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

### Postpone Corresponding Problem(PCP) {#PCP}

大意是每张牌分上下两个标签，提问是否存在某个线性放置方式使得前一张牌的下标签与后一张牌的上标签一致

myc说略了

### Hamilton Cycle Problem(HCP) {#HCP}

> Hamiltonian cycle problem: Given a graph G=(V, E), is there a simple cycle that visits all vertices?

### Traveling Salesman Problem(TSP) {#TSP}

> Traveling salesman problem: Given a complete graph G=(V, E), with edge costs, and an integer K, is there a simple cycle that visits all vertices and has total cost $\le$ K?

### Circuit-SAT

第一个被证明是NPC的问题，又称 satisfiability problem

>Input a boolean expression and ask if it has an assignment to the variables that gives the expression a value of 1.

### Clique Problem

> Given an undirected graph G = (V, E) and an integer K, does G contain a complete subgraph (clique) of (at least) K vertices?
>
> CLIQUE = { <G, K> : G is a graph with a clique of size K }.

### Vertex Cover Problem

> Given an undirected graph G = (V, E) and an integer K, does G contain a subset V' $\subseteq$ V such that |V'| is (at most) K and every edge in G has a vertex in V' (vertex cover)?
>
> VERTEX-COVER = { <G, K> : G has a vertex cover of size K }.

### 哈密顿回路问题到旅行商问题 {#HCPtoTSP}

- 已知Hamilton Cycle Problem是NPC的，求证Traveling Salesman Problem也是NPC的

- 证明TSP是NP问题，并通过规约证明 $HCP\le_P TSP$ 即可

  - Q：为什么要先证明是NP的

    A：如果不说明它是NP的，它完全可能落入NPH问题中

  - NP：因为它可以多项式验证，显然

  - 规约方式：将HCP的输入图 G 转为完全图 $G'$ ，G中不存在的边的边权设为 $K+1$ ，那么如果 TSP 成立， HCP也成立

### Clique问题到节点覆盖问题 {#CliquetoVertexCover}

- 已知Clique问题是NPC，求证节点覆盖问题是NPC

  - NP：可以多项式验证
    - 检查 $|V'|\le K$，枚举图上每条边即可， $O(N^3)$ （其实我觉得用不着 $N^3$， 可能是什么奇怪的实现方式）

  - 规约 $CLIQUE\le_P VERTEX-COVER$
    - 对于团问题的图 G ，构造其补图 $G'$
    - 则整张图上除了大小为 $K$ 的团之外的点全部选中必然构成一个大小为 $|V|-K$ 的节点覆盖（注意这里是判定问题而非优化问题），二者成对偶关系