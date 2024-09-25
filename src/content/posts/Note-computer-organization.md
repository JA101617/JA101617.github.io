---
title: 计组笔记
published: 2024-09-24
description: '计算机组成课堂笔记'
image: ''
tags: [computer-organization,hardware]
category: 'notebook'
draft: false 
lang: 'zh-CN'
---

~~目前没有老师PPT所以还没施工~~

~~看起来老师不准备发PPT了所以对着智云启动了~~

## 目录

- Chapter1: Computer Abstraction and Technology
- **Chapter2: Instructions: Language of the Computer**
- **Chapter3: Arithmetic for Computers**
- **Chapter4: The Processor: Datapath and Control**
- **Chapter5: Large and Fast: Exploiting Memory Hierarchy**
- Chapter 6: Parallel processor from client to Cloud (选讲，非考试内容)
- Appendix: Storage, Networks, and Other Peripherals (了解概念)

## Chapter 1

- $Performance = \dfrac{1}{Execution Time}$
  - 算法：影响IC，可能影响CPI
  - 编程语言：影响IC和CPI
  - 编译器：影响IC和CPI
  - ISA：影响IC，CPI和$T_c$

- **Execution Time**
  - Elapsed time: Total response time,determines system performance
    - Processing , IO, OS overhead, idle time...
  - CPU time: Time spent processing a given job
    - different programs are affected differently by CPU & system performance
    - Comprises user CPU time & system CPU time
    - $CPU\ \ Time = \frac{CPU\ \ Clock\ \ Cycles}{Clock\ \ Rate} = CPU\ \ Clock\ \ Cycles \times Clock\ \ Cycle\ \ Time $
      - 提速：Clock Cycles和Clock Rate的trade off

$$
\begin{aligned}
CPU\ \ Time =& \frac{CPU\ \ Clock\ \ Cycles}{Clock\ \ Rate}\\
=& CPU\ \ Clock\ \ Cycles \times Clock\ \ Cycle\ \ Time\\
=&Instruction\ \ Count \times CPI\times Clock\ \ Cycle\ \ Time\\
=&\dfrac{Instruction\ \ Count \times CPI}{Clock\ \ Rate}\\
=& \dfrac{Instructions}{Program} \times \dfrac{Clock\ \ cycles}{Instructions}\times\dfrac{Seconds}{Clock cycle}
\end{aligned}
$$

- 平均CPI由CPU硬件、指令类型等决定

$$
Average CPI = \sum(CPI_i\times \dfrac{Instruction\ \ Count_i}{Instruction\ \ Count})
$$

- Instruction Count由程序、指令集（ISA）和编译器决定

- CMOS IC technology中

$$
Power = Capacitive\ \ load\times Voltage^2\times Frequency
$$

- Pitfall

  - **Amdahl's Law**

  $$
  T_{imporved} = \dfrac{T_affected}{improvement\ \ factor}+T_{unaffected}
  $$
  
  - MIPS

  $$
  \begin{aligned}
  MIPS =&\dfrac{IC}{Execution\ \ time \times 10^6}\\
  =& \dfrac{IC}{\dfrac{IC\times CPI}{Clock\ \ rate} \times 10^6}\\
  =&\dfrac{Clock\ \ rate}{CPI \times 10^6}
  \end{aligned}
  $$
  
  
  
  
  
  ![image-20240925113511973](/img/CO/EightIdea.jpg)



+ [ ] 作业1.2,1.5,1.6,1.7,1.13


## Chapter 3

**默认64bit为double word，一个word为32bit**

- 补码可以直接加减，不可直接相乘！如(1001)2平方不会得到49，但是如果补全成(11111001)2的平方可以
- 浮点数：Single precicion ~ Quadruple precision

### ALU

- 加减法溢出条件

  ![image-20240925114525853](/img/CO/overflowCondition.jpg)

![image-20240925115021116](/img/CO/ALUstruct.jpg)

注：上图的set传到less是为了执行slt操作

![image-20240925115107894](/img/CO/ALUFunctionTable&logo.jpg)

#### 超前进位加法器

##### 一位版本

$G_i = A_i \& B_i$(generate)

$P_i = A_i|B_i$ (propogation)

则$S_i = P_i \bigoplus C_i$, $C_{i+1}=G_i+P_iC_i$

##### 四位版本

##### 十六位版本

#### 乘法

- 符号问题：一般转成绝对值运算再回去

- 实操：龟速乘做法$\rightarrow$ “山不就我我来就山” 运算结果右移，被乘数不动

$\Rightarrow$ 乘数和结果右移同步，可以利用低位存储乘数

![image-20240925121430846](/img/CO/Multiplier_example.jpg)

- [了解] Booth's Algorithm

​		Idea: 1111010-> 10000000 + 10 -1000