# Chapter 1

!!! note "涉及的名词及缩写"
    - Performance , 讨论一个程序的表现，在处理相同问题时， $\text{Performance} = \dfrac{1}{\text{Execution Time}}$ ，即运行时间越长，程序越慢，表现也越差。
    - Execution Time : Total response time,determines system performance
    - CPU time: Time spent processing a given job, different programs are affected differently by CPU & system performance
    - Instruction Count: 一个程序总的指令条数，记为 IC
    - CPU Clock Cycles: 运行程序的整个过程经过了 CPU 的多少个时钟周期
    - Clock Cycle Time: CPU 时钟周期，记为 $T_C$
    - Clock Rate: CPU 时钟频率，类比于正常的 $f$ ，因此有 $\text{Clock Rate}=1/T_C$
    - Clock per Instruction: 单条指令需要多少时钟周期来完成，记为 CPI 

## CPU Time

以下是一些等价变形

$$
\begin{aligned}
\text{CPU Time} =& \frac{\text{CPU Clock Cycles}}{\text{Clock Rate}}\\
=& \text{CPU Clock Cycles} \times T_C\\
=& IC \times CPI \times T_C\\
=&\dfrac{IC \times CPI}{\text{Clock Rate}}\\
=& \dfrac{Instructions}{Program} \times \dfrac{\text{Clock cycles}}{Instructions}\times\dfrac{Seconds}{\text{Clock cycle}}
\end{aligned}
$$

从公式中可以看出，如果能减小 $T_C$, $CPI$ 和 $IC$ ，就能获得更高的效率。

但是从通俗的角度，随着 $T_C$ 的缩短，如果不能做到特别变革性的突破， $CPI$ 就会增加，因此需要在两者之间权衡。

程序，从算法设计出发，利用编程语言实现，再通过编译器转为机器语言的指令。这个过程中每一环的变动都会影响 CPU Time ，具体来说：

- 算法：影响 IC ，可能影响 CPI
- 编程语言：影响 IC 和 CPI
- 编译器：影响 IC 和 CPI
- ISA：影响 IC ， CPI 和 $T_C$

- 平均CPI由CPU硬件、指令类型等决定

## Average CPI

$$
\text{Average CPI} = \sum(CPI_i\times \dfrac{IC_i}{IC})
$$

- Instruction Count由程序、指令集（ISA）和编译器决定

## Amdahl's Law

$$
T_\text{imporved} = \dfrac{T_\text{affected}}{\text{improvement factor}}+T_\text{unaffected}
$$

因此如果只优化一部分，优化后的时间消耗是有下限的。

例如总时长15s，其中10s用于逻辑运算。那么单是对逻辑运算如何加速也无法让效率乘以3 。

## MIPS

这不是那个 MIPS 指令集，而是 million instructions per second ，一种评判指标。

正如其名字所说，这个指标衡量的就是每秒钟执行的指令数，以百万为单位，因此用公式写出来如下。

$$
\begin{aligned}
MIPS =&\dfrac{IC}{\text{Execution time} \times 10^6}\\
=& \dfrac{IC}{\dfrac{IC\times CPI}{\text{Clock rate}} \times 10^6}\\
=&\dfrac{\text{Clock rate}}{CPI \times 10^6}
\end{aligned}
$$

## 杂项

- CMOS IC technology中

$$
\text{Power} = \text{Capacitive load}\times \text{Voltage}^2\times \text{Frequency}
$$




  
!!! note "Eight Great Ideas"
    Design for Moore's Law

    Use Abstraction to Simplify Design

    Make the Common Case Fast

    Performance via Parallelism

    Performance via Pipelining

    Performance via Prediction

    Hierarchy of Memories

    Dependability via Redundancy

这八个 idea 将贯穿这一课程始终，相信学完后再回来看这些的人也会与我有同样的感受。  