---
title: Note-GNN.md
published: 2024-11-03
description: '记录速通CS224W中的概念、名词等，因为时间实在不够所以看上去奇奇怪怪的，强烈不推荐看'
image: ''
tags: [GNN]
category: 'notebook'
draft: false
lang: 'zh-CN'
---

- [Lec1](#lec1)
- [Lec2](#lec2)
- [Lec3](#lec3)
- [Lec4](#lec4)
- [Lec5](#lec5)
- [Lec6](#lec6)
- [Lec7](#lec7)
- [Lec8](#lec8)

# 0 参考资料

1. 速成的PPT来自[这里](https://web.stanford.edu/class/cs224w/)。

# 1 Introduction<a id="lec1"></a>

## 1.1 Choice of Graph Representation

**Heterogeneous Graphs **

G = (V,E,R,T)

- V：点集，其中每个元素形如 $v_i$
- E：边集，其中的每个元素形如 $(v_i,r,v_j)$
- T：节点类型
- R：relation type的集合

注意到节点和边各有其属性

**建图方式**

不同的建图方式（点的选取，边的选取，边的连接方法....）取决于研究对象，例如

无向图与有向图

1. 无向图可以用于求解权重、属性（Property）等
2. 有向图可以用于分类、属性（Attribute）

~~并不理解为什么两个用词有差距~~

**Bipartite graph二分图**

两个不相交节点集合UV和它们之间的联系

## 1.2 Applications of Graph ML

**不同的任务**：节点级别，边级别，子图（community/subgraph）级别，图级别

- 节点级别

  - 例如：节点分类

  - 关键在于描述节点的结构和位置

    - 例如：度数、重要程度、位置、周边子结构等

    - Graphlets：一系列连通的非同构的子图，以下是一个例子

      ![graphlets](/img/GNN/Lec1-Graphlets-1.jpg)

      上图中的abcd对应于三张图中定位不同的节点（类似于同分异构中的非等效碳原子？），那三张图即为Graphlets（的一部分）

      为描述节点 u 的特征定义 Graphlet Degree Vector(GDV)，其中Graphlet Degree为包含节点的那种Graphlet的数量，有位置异构的要分别算，而GDV为Graphlet Degree组成的向量。例如上方那张图的节点 u 的 Graphlet Degree 和 GDV 如下。

      ![GDV](/img/GNN/Lec1-GDV.jpg)

      > graphlets 看不懂，先瞎写几句

  - 示例：AlphaFold预测蛋白质空间结构（预测节点坐标）

- 边级别
  - 基于现有边预测新的边‘
  - 例如：视频推荐、你可能认识，药物副作用预测等
- 图级别
  - 例如：预测路线用时、物理仿真

## 1.3 Summary

![Summary](/img/GNN/Lec1-Summary.jpg)

# 2 Node Embedding<a id="lec2"></a>

~~Graph Representation Learning又是啥。。。~~

- Graph Representation Learning
  - 目标是建立高效的图信息提取方式
- Embedding目标：将图中节点映射到低维嵌入空间(embedding space) 并保留其在原始图总的相似性等信息

## 2.1 Encoder & Decoder

- Setup : G={V,E}，不包含额外信息， A是保存E信息的邻接矩阵
- Encoder：从节点映射到嵌入空间， $ENC(v) = z_v$
- 定义 similarity 函数用于衡量原始图中节点相似性
- Decoder将节点向量映射到相似性分数
- 优化 Encoder 的参数，目标是保留相似性信息，即 $similarity(u,v) \approx z_v^Tz_u$ ，其中 $z_v$ 和 $z_u$ 由 u 和 v encode得到。

**Shallow Encoding**

> Encoder is just an embedding-lookup 

即 $ENC(v) = z_v = Z \dotproduct v$

- $Z \in \mathbb{R}^{d\times |V|}$ ，每列都是一个 node embedding
- $v \in \mathbb{I}^{|V|}$ ，独热码，只在表示 $v$ 的节点那一位为1

​	相当于只是 专门针对每个点设计一个embedding的向量，调用即查表

![Framework](/img/GNN/Lec2-FrameworkSummary.jpg)

## 2.2 Random Walk for Node Embedding

- 用于Similarity Definition

- unsupervised/self-supervised
  - 仅依据图结构

- task independent

**Notation**

- $P(v|z_u)$ 为从 u 出发经过 v 的概率
- Softmax : $S(z)[i] = \dfrac{e^{z[i]}}{\sum_{j = 1}^Ke^{z[j]}}$ 
- Sigmoid : $\sigma(x)=\frac{1}{1+e^{-x}}$

给定一张图一个起点，每次随机选择当前点的一个相邻节点并移动到其上，形成的路径叫随机游走
$$
z_u^Tz_v \approx probability\ that\ u\ and\ v\ co-occur\ on\ a\ random\ walk\ over\ the\ graph
$$
**操作与优化**

1. 从每个 u 开始依据随机游走策略 R 跑固定长度的短随机游走
2. 对每个 u 统计 $N_R(u)$ 这个可重集合（路径途经点全体）
3. 依照极大似然估计（就是下面这个公式）优化embedding

$$
arg\ max\sum_{u\in V} \log P(N_R(u)|Z_u)
$$

​	即
$$
arg\ min ℒ=\sum_{u\in V}\sum_{v\in N_R(u)} -\log(P(v|z_u))
$$
​	其中
$$
P(v|z_u) = \dfrac{exp(z_u^Tz_v)}{\sum_{n\in V}exp(z_u^Tz_n)}
$$

- Negative Sampling

​		选择一些随机的negative samples 用于顶替softmax中归一化的职能

- 优化方式：随机梯度下降(Stochastic Gradient Descent)
  - $z_u \leftarrow z_u -\eta\frac{\partial\ ℒ}{\partial z_u}$
  - 随机：每次随机选择一个样本 u 计算梯度下降而不是所有

**node2vec**

![image-20241103190956322](/img/GNN/Lec2-node2vec.jpg)

- [ ] node2vec的具体实现

## 2.3 Embedding Entire Graphs

- **approach 1**  将所有节点的 $z_v$ 求和/求平均
- **approach 2** 引入虚拟节点S，以正常embedding的  $z_S$ 为整张图的 embedding
- DiffPool 将整张图分层聚类再各自使用approach 1

## 2.4 Matrix Factorization

1. 如果相似度的定义是存在相连的边 

​		$z_v^Tz_u = A'_{u,v}$，那么 $z^Tz = A'$

​		如果能找到这样的分解 $z$ 使得 A与A'差异最小		化（A是邻接矩阵），那么较好的embedding		就完成了

​		目标函数以前是 L2 现在改为 softmax

> Inner product decoder with node similarity defined by edge connectivity is equivalent to matrix factorization of A.

2. Random Walk-based Similarity

   也可以视为求解某个特定矩阵的分解。

   例如，DeepWalk对应的矩阵：
   $$
   \log(vol(G)(\frac{1}{T}\sum_{r=1}^T(D^{-1}A)^r)D^{-1})-\log{b}
   $$
   

## Embedding的应用场景

- 集群探测
- 节点分类
- 关系预测
- 图分类（基于 $z_G$ ）

## 局限性

- 无法推广到非训练集，新加入节点就要全部重新计算
- 无法捕捉结构相似性

- 无法利用节点、边、图自带的的特征

# 3 Graph Neural Networks<a id="lec3"></a>

## 3.1 Deep Learning for Graphs

深度学习一般框架

![image-20241104005320314](/img/GNN/Lec3-BasicDL.jpg)

对于图G

- V点集，A邻接矩阵
- $X\in \mathbb{R}^{|V|\times m}$ 是表示节点特征的矩阵
  - 原始数据集节点没有属性是可以是全1/每个节点的独热编码
- 对于节点 v , N(v) 表示 v 的邻居集合

图的复杂性：可变的邻居情况导致没有固定的局部性/滑动窗口概念。要求不依赖输入顺序

**Permutation invariant**

> For any graph function f: $\mathbb{R}^{|V|\times |V|}\times \mathbb{R}^{|V|\times m} \rightarrow \mathbb{R}^d$ , f is permutation invariant if $f(A,X) = f(PAP^T, PX)$ for any permutation P

**Permutation Equivariance**

> For any node functionf: $\mathbb{R}^{|V|\times |V|}\times \mathbb{R}^{|V|\times m} \rightarrow \mathbb{R}^d$. 𝑓 is permutation equivariant if $Pf(A,X) = f(PAP^T,PX)$ for any permutation P. 

- 两种性质不可兼得

- GNN overview

  由多层的permutation invariant/equivariance functions 组成

  一般equivariance用于前面处理，invariant用于聚合输出结果

**Graph Convolutional Networks**

- 任意层的，第 $k$ 层embedding能聚合与节点距离为 $k$ 的节点全体的信息

- 如何聚合 (aggregation) ？

  - 取平均
    $$
    \begin{aligned}
    h_v^0 &= x_v\\
    h_v^{(k+1)} &= \sigma(W_k\sum_{u\in N(v)}\dfrac{h_u^{(k)}}{|N(v)|}+B_kh_v^{(k)})\\
    z_v &= h_v^{(K)}
    \end{aligned}
    $$
    单个节点取平均这一步是Permutation invariant的

    对整个图来说是Perrmutation equivariant的

**Model Parameters**

- $W_k$ : weight matrix for neighborhood aggregation
- $B_k$ :  weight matrix for transforming hidden vector of self

转换为矩阵形式
$$
H^{(k+1)} = \sigma (D^{-1}AH^{(k)}W_k^T+H^{(k)}B_k^T)
$$
其中

- A：邻接矩阵
- D：对角矩阵， $D_{v,v} = |N(v)|$
- H：$H^{(k)} = [h_1^{(k)},...,h_{|V|}^{(k)}]^T$

在无监督学习中，通过图结构定义相似节点的目标函数可以表示为： 
$ \min_\Theta \mathcal{L} = \sum_{u,v} \text{CE}(y_{uv}, \text{DEC}(z_u, z_v)) $

- **参数说明**：  

  - $y_{uv}$：节点 \(u\) 和 \(v\) 的相似度标签，表示节点间的真实关系。  

  - $\text{DEC}(z_u, z_v)$：节点嵌入相似度度量函数（如点积）。  

  - $\text{CE}$：交叉熵损失，用于衡量嵌入的相似性预测与实际相似度标签之间的误差。 这种无监督的损失函数允许模型在无标签的情况下，通过图结构学习嵌入表示。

    $CE(y,f(x))=-\sum_{i=1}^C(y_i\log f_{\Theta}(x)_i)$

在二分类任务中，交叉熵损失函数具体表示如下：$ \mathcal{L} = - \sum_{v \in V} \left( y_v \log(\sigma(z_v^\top \theta)) + (1 - y_v) \log(1 - \sigma(z_v^\top \theta)) \right) $

- **参数说明**：  

  - $y_v$：节点 \(v\) 的真实标签。  
  - $\sigma$：sigmoid 激活函数，应用于分类得分。  
  - $z_v$：节点 \(v\) 的嵌入向量。  
  - $\theta$：分类器的权重参数。

- 得到结果具有可迁移性

- [ ] 为什么

  

## 3.2 Basics of Deep Learning

- Cross Entropy 用于分类

引入的部分非线性函数

- ReLU(x) = max(x,0)
- Sigmoid $\sigma(x)=\frac{1}{1+e^{-x}}$

**MLP**

$ x^{(l+1)} = \sigma(W_lx^{(l)}+b^l)$

![image-20241104105404018](/img/GNN/Lec3-SummaryDL.jpg)
# General Perspective on GNN<a id="lec4"></a>
## 4.1 A Single Layer of a GNN 

- Message 节点本体的信息

​		$m_u^{(l)} = MSG^{(l)}(h_u^{(l-1)}),u\in\{ N(v)\cup v\}$

- Aggregation 聚合邻居的信息

​		$h_v^{(l)} = AGG^{(l)}(\{m_u^{(l)},u\in N(v)\},m_v^{(l)})$

- 上述两步骤都可以用非线性函数增强表现能力
  - Parametric ReLU : $PReLU(x_i) = \max{(x_i,0)}+a_i\min{(x_i,0)}$， 其中 $a_i$为可训练参数

**GNN 实现：GCN**

- $MSG^{(l)}(h_u^{(l-1)})= W^{(l)}\frac{h_u^{(l-1)}}{|N(v)|}$
- $h_v^{(l)} = \sigma (\sum_{u\in N(v)} MSG^{(l)}(h_u^{(l-1)}))$

**GNN 实现： GraphSAGE**

1. **邻居聚合**：   $$   h_{N(v)}^{(k)} = \text{Aggregate}^{(k)}\left( \{ h_u^{(k)}, \forall u \in N(v) \} \right)   $$   其中，$\text{Aggregate}^{(k)}$ 是第 $k$ 层的聚合函数，$\mathcal{N}(v)$ 表示节点 $v$ 的邻居集合。 

2. **自我聚合和更新**：   $$   h_v^{(k+1)} = \sigma \left( W^{(k)} \cdot \text{concat}(h_v^{(k)}, h_{\mathcal{N}(v)}^{(k)}) \right)   $$   其中：   
   - $W^{(k)}$ 是第 $k$ 层的权重矩阵。   
   -  $\sigma$ 是激活函数（如 ReLU）。   
   - $\text{concat}$ 表示将节点自身特征与聚合的邻居特征进行拼接。

- [ ] 公式细节阅读

**GNN实现：GAT**

1. **注意力系数计算**：   对于节点 $v$ 和其邻居节点 $u$，注意力系数为：   $$   e_{vu}^{(k)} = \text{LeakyReLU}\left( a^{(k)^\top} \cdot \left[ W^{(k)} h_v^{(k)} \, || \, W^{(k)} h_u^{(k)} \right] \right)   $$   其中：   
   - $a^{(k)}$ 是第 $k$ 层的注意力权重向量。   
   - $||$ 表示向量拼接操作。 
2. **计算标准化注意力系数**：   使用 softmax 归一化邻居节点的注意力系数：   $$   \alpha_{vu}^{(k)} = \frac{\exp(e_{vu}^{(k)})}{\sum_{j \in \mathcal{N}(v)} \exp(e_{vj}^{(k)})}   $$ 
3. **节点特征更新**：   通过加权求和更新节点特征：   $$   h_v^{(k+1)} = \sigma \left( \sum_{u \in \mathcal{N}(v)} \alpha_{vu}^{(k)} W^{(k)} h_u^{(k)} \right)   $$   其中 $W^{(k)}$ 是第 $k$ 层的权重矩阵，$\sigma$ 是激活函数。



**Graph Attenttion Networks & Attention Mechanism** 

引入注意力机制，目标是能够为每个节点的邻居指定任意的重要度

对于一个注意力系数的函数 $\alpha$（可以很简单也可以是神经网络等复杂玩意），基于节点的message计算注意力系数 $e_{vu}$并用 softmax 将其归一化，则 h 从直接加和变成了加权聚合。

- Multi-head attention:stabilize the learning process

​		多组 attention scores 进行聚合得到最终结果

- [ ] 完全没搞懂，为什么Storage efficient?

  某博客说：不依赖对全局图的预先访问



## 4.2 GNN Layers in Practice

**Batch Normalization**

- 使神经网络训练更稳定
- 输入N个节点的embedding $X\in\mathbb{R}^{N\times D}$，参数 $\gamma,\beta\in \mathbb{R}^D$，输出$Y\in\mathbb{R}^{N\times D}$
  - 计算N个embedding的均值和方差
  - 归一化
    - 减去均值 $\rightarrow$ 均值归零
    - 除以标准差（实操给方差加上一个非常小的 $\epsilon$ 防止除以0）以使方差归一
    - 缩放平移：$Y_{i,j} = \gamma_j \hat{X_{i,j}} + \beta_j$

**Dropout**

- 防止过拟合
- 用于MSG那一步，随机移除部分神经元以迫使模型不过度依赖某些神经元

## 4.3 Stacking Layers of a GNN

- 太多层会导致over-smoothing problem，无法发现节点的差异性

  >  The over-smoothing problem: all the node  embeddings converge to the same value

**Receptive Field**感受野 ：每一层的某个节点收集到的信息回归原图对应的范围。

则over-smoothing源于层数太多导致的节点Receptive Field重叠度太高，从而embedding相似

**应对1：更少的层数，更强的表现力**

- **Solution 1**  每层内部表现力增强，例如 aggregation 和 transformation 都变成神经网络而非一般函数

- **Solution 2** 在过程中加上 "do not pass message" 的其他模型的层例如MLP Layers

**应对2：增加skip connections**

更低的层或许效果更好，因而可以加上从较低层向较高层跳跃（不经过中间层）的通道，再把多个通道的结果以一定权重聚合起来

最终结果是浅层GNN与深层GNN的联合作用。例如如果每一层都能跳，那么就有从0层到N层的各种GNN联合产出。



## 4.4 Graph Manipulation in GNN

原始图有各种问题使得其能直接用于GNN，也有相应对策

![image-20241105012120048](/img/GNN/Lec4-GraphManipulation.jpg)

- 虚点虚边
  - 虚点：有利于增加稀疏图的信息传递效率
- Node Neighborhood Sampling
  - 面对稠密/很大的图随机选择节点的部分邻居用于信息传递而非全部

![image-20241105012552547](/img/GNN/Lec4-Summary.jpg)

# 5 GNN Training

![pipeline](/img/GNN/Lec5-GNNTrainingPipeline.jpg)

## 5.1 GNN Augmentation and Training

**Prediction heads**

针对不同的预测任务设置的专用输出层

- [ ] Hierarchical Pooling

## 5.2 Training Graph Neural Network

supervised & Unsupervised

“still have 'supervision' in unsupervised learning" => self-supervised

如何衡量GNN？

- Regression : RMSE，MAE
- Classification : accuracy

![image-20241105195025848](/img/GNN/Lec5-MetricsForBinaryClassification.jpg)

## 5.3 Setting-up GNN Prediction Tasks

**Dataset split** -> train validation test

fixed split（只拆分一次一直用） or random split

- Transductive : 全图训练，只是Label变化
- inductive ： 不同划分的数据集之间断开，用于要面向未知的情况

例如图分类就只适合inductive

**例子：Link prediction**

划分训练、验证和测试集

- 归纳性设置（Inductive setting）：
  - 在多个独立的子图上进行划分。每个数据集（训练、验证、测试）包含不同的图，不共享边。
  - 这种设置适用于跨图的泛化任务。
- 传导性设置（Transductive setting）：
  - 这是链接预测的默认设置，所有数据集共享一个图结构，只是边被划分为训练、验证和测试集。
  - 在传导性设置中，整个图的结构可以被所有数据集访问，但监督边在不同数据集中作为标签被隐藏，模型需根据已知边来预测未知边。

Transductive的具体流程

- **训练阶段**：仅使用训练集中的消息边来预测训练集中的监督边。
- **验证阶段**：使用训练消息边和训练监督边预测验证集的监督边。
- **测试阶段**：使用训练消息边、训练监督边和验证监督边来预测测试集的监督边。

# 6 How Expressive are GNN<a id="lec6"></a>

- **Computational Graph**

  - 由neighbor决定，如下图
  - ~~感觉跟receptive field迷之相似呢~~

  ![image-20241105230950706](/img/GNN/Lec6-exampleCG.jpg)

- 依据computational graph（通常是有根子树）的不同映射到到不同的embedding且是单射

> Key observation: Subtrees of the same depth can be recursively characterized from the leaf nodes to the root nodes.

（没懂）

- 若aggregation能保留neighbor信息则能做到区分不同子树，即在聚合时使用“injective neighbor aggregation function”

## 6.1 Design the most powerful GNN

- 使用injective aggregation function
- 样例
  - Pooling:一种将邻居节点聚合汇总的操作
  - GCN： element-wise mean pooling
    - 缺点：保持相同比例就无法识别
  - GraphSAGE : element-wise max pooling
    - 缺点：节点种类集合相同就无法识别

$\Rightarrow$ 构造multiset的单射

$ \Phi(\sum f(x))$ ，其中 $f$ 是从元素到一个one-hot encoding的单射

- 使用MLP实现

$\Rightarrow$ GIN(Graph Isomorphism Network)

- [ ] WL graph kernel

GIN>GCN & GraphSAGE,GIN 与WL类似，所以WL限制了expresive power

# 7 Breaking the limits of the WL graph kernel<a id="lec7"></a>

![image-20241106011905836](C:\Users\JA2012\AppData\Roaming\Typora\typora-user-images\image-20241106011905836.png)

![image-20241106011918055](C:\Users\JA2012\AppData\Roaming\Typora\typora-user-images\image-20241106011918055.png)

> Theorem: If two graphs have adjacency matrices with  different eigenvalues, there exists a GNN with closed loop initial node features that can always tell them  apart.

- structural initial node features能够让GIN超越WL-kernel
  - 例如：预处理原图信息作为节点特征
  - 例如：使用邻接矩阵的对角线作为节点特征（反应环的数量）

![image-20241106012529584](C:\Users\JA2012\AppData\Roaming\Typora\typora-user-images\image-20241106012529584.png)

Q：只使用GNN？

- 使用随机的一组向量作为节点ID

- 对于每个分量用GNN求解在求和

- [ ] 如何用这个结果得到环路数量？

  

位置敏感

- 随机设置一批anchor node set,则节点到每个anchor的距离可以表征

# 8 graph transformer

- **token** 

  > Transformers map 1D sequences of vectors to 1D sequences of vector known as tokens.

- [ ] Task : 找一份GCN的代码，把它变成GAT
