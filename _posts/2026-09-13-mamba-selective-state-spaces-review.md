---
layout: post
title: "Mamba 논문 리뷰 — 선택적으로 기억하는 모델과 트랜스포머가 여전히 강한 이유"
date: 2026-09-13 12:00:00 +0900
type: research
category: research
tags: [논문 리뷰, Mamba, 상태 공간 모델, 트랜스포머, 언어 모델]
permalink: /paper_review/mamba-selective-state-spaces/
description: "SSM의 상태 갱신부터 selective scan까지 이해하고, Mamba-2·Mamba-3와 하이브리드 모델을 통해 attention의 현재 가치를 살펴본다."
excerpt: "SSM의 상태 갱신부터 selective scan까지 이해하고, Mamba-2·Mamba-3와 하이브리드 모델을 통해 attention의 현재 가치를 살펴본다."
image: /assets/images/paper-review/mamba/selective-ssm.png
---

## 출발점: 왜 모든 과거를 다시 읽어야 할까

긴 문서를 읽는 모델을 만든다고 생각해 보자. 문장이 들어올 때마다 이전 문장을 모두 펼쳐 놓고 비교할 수도 있고, 지금까지의 내용을 메모에 정리한 뒤 새 문장으로 메모를 갱신할 수도 있다. 전자는 과거의 세부 사항을 다시 확인하기 좋고, 후자는 읽은 분량이 늘어도 메모 공간을 일정하게 유지하기 좋다.

Mamba를 이해하는 출발점은 이 차이다. 핵심 질문은 **“작은 상태에 과거를 압축하면서도, 중요한 정보를 입력 내용에 따라 골라 남길 수 있는가?”**이다.

리뷰 대상은 Albert Gu와 Tri Dao의 [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752)다. 최초 공개는 2023년 12월 1일이며, 그림과 수식은 2024년 5월 31일 v2를 기준으로 확인했다. 현재 동향은 **2026년 9월 13일 확인한 공개 자료**를 기준으로 구분해 적었다.

계기는 [Yannic Kilcher의 논문 해설 영상](https://www.youtube.com/watch?v=9dSkvxS2EB0)과 [“왜 Mamba가 널리 퍼지지 않았을까?”라는 Reddit 토론](https://www.reddit.com/r/MachineLearning/comments/1hpg91o/d_why_mamba_did_not_catch_on/)이다. 영상의 제작자·설명란·챕터는 확인했지만, 자동 자막을 가져오지 못해 전체 발언을 검증하지는 못했다. 따라서 아래 글은 영상의 축어 요약이 아니라 원논문과 후속 연구를 대조한 독립적인 해설이다. 마지막의 의견은 AI와 함께 자료를 검토해 정리한 해석이며 직접 실험한 결과는 아니다.

## 1. 트랜스포머와 순환 모델: 기억을 보관하는 비용

일반적인 causal self-attention은 현재 위치의 query를 앞선 위치의 key와 비교하고, 그 가중치로 value를 모은다. 비유하면 질문을 받은 뒤 문서의 어느 부분을 참고할지 결정하는 방식이다. 단, KV cache는 원문 파일 자체가 아니라 모델이 계산한 토큰별 표현이다.

SSM은 이전 상태와 현재 입력으로 다음 상태를 만든다. 질의가 나중에 도착하더라도 그때 사용할 정보는 상태에 남아 있어야 한다. 메모의 장점과 압축의 부담이 함께 생긴다.

| 고정된 모델 크기에서 비교 | 일반적인 full attention | 순수 Mamba의 순환 실행 |
| --- | --- | --- |
| 과거 표현 | 토큰별 K·V를 보관 | 정해진 크기의 상태에 축적 |
| 길이 L의 입력 처리 | attention 연산량은 O(L²) | 시퀀스 연산량은 O(L) |
| 생성 시 시퀀스 메모리 | KV cache가 길이에 따라 증가 | 상태와 짧은 convolution cache의 크기가 일정 |
| 다음 토큰의 과거 참조 | 기존 K·V와 비교 | 이전 상태 갱신 |

여기서 O(L)은 **모델 폭·상태 크기·층 수 등을 고정했을 때 길이에 대한 증가율**이다. Mamba의 모든 메모리가 상수라는 뜻도, 전체 학습이 공짜라는 뜻도 아니다. 학습에는 활성값과 역전파 비용이 있고, attention을 섞은 하이브리드는 attention 층의 cache가 남는다.

또한 FlashAttention을 쓰면 attention 행렬 전체를 GPU 메모리에 저장하지 않을 수 있다. 따라서 “트랜스포머는 반드시 L×L 메모리를 할당한다”는 설명은 부정확하다. 정확한 attention의 이차적 계산량과 중간 결과의 메모리 저장량은 다른 문제다. [FlashAttention 논문](https://arxiv.org/abs/2205.14135)

## 2. SSM 수식은 ‘기억 갱신’으로 읽으면 된다

[The Annotated S4](https://srush.github.io/annotated-s4/)는 연속시간 시스템을 이산 시퀀스 모델로 바꾸는 과정을 코드와 함께 설명한다. 이를 읽을 때는 다음의 간단한 표기부터 잡으면 편하다. 아래에서 입력과 출력은 설명을 위해 한 채널로 생각하고, 상태 h는 여러 숫자로 이루어진 벡터다.

```text
연속시간:  dh/dt = A h + B x
           y     = C h

이산시간:  h_t = A_bar h_(t-1) + B_bar x_t
           y_t = C h_t
```

`A_bar`는 이전 기억을 어떻게 변환할지, `B_bar`는 새 입력을 기억에 어떻게 쓸지, `C`는 기억에서 무엇을 읽어 출력할지를 나타낸다. bar는 연속시간 계수를 이산화한 값이라는 뜻이다. 입력을 출력에 직접 더하는 skip 항은 여기서는 생략했다.

핵심은 **상태가 과거 전체를 대신한다**는 것이다. 우편 물량을 시간순으로 읽는다고 비유하면, 모든 관측을 따로 저장하는 대신 최근 추세나 주기와 관련된 정보를 여러 상태 값에 축적하는 셈이다. 이 비유는 이해를 위한 것이며, 실제 학습된 상태의 각 차원이 사람이 정한 통계량과 일치한다는 뜻은 아니다.

기존의 선형 시불변 SSM에서는 같은 계수를 모든 위치에 사용한다. 초기 상태를 0으로 놓고 식을 펼치면 과거 입력에 같은 규칙의 필터를 적용하는 convolution 형태가 된다. 그래서 같은 모델을 학습 시에는 병렬 convolution으로, 생성 시에는 순환식으로 계산할 수 있다. 이것이 S4를 읽을 때 중요한 연결이다. [The Annotated S4의 recurrent/convolution 설명](https://srush.github.io/annotated-s4/)

## 3. Mamba의 선택성: 어떤 입력인지에 따라 기억 방식을 바꾼다

문자열에서 중요도는 거리만으로 정해지지 않는다. 다음과 같은 가상의 입력을 생각해 보자.

```text
입력:  [기억: A] 잡음 잡음 [기억: B] 잡음 [기억: C]
요구:  표시된 항목만 순서대로 회상 → A B C
```

이 예시는 원논문의 selective copying 문제를 설명하기 위해 새로 만든 것이다. 필요한 항목 사이의 간격이 달라지면 고정된 위치 규칙만으로 해결하기 어렵다. Mamba는 현재 입력에서 `B_t`, `C_t`, `Δ_t`를 계산해 **쓰는 방식·읽는 방식·상태가 변하는 정도**를 바꾼다. 기본 연속시간 A 자체를 매 토큰마다 새로 생성하는 구조는 아니지만, Δ가 변하므로 이산화된 A_bar도 입력에 따라 달라진다. [Mamba §3.1–3.2](https://arxiv.org/pdf/2312.00752v2#page=5)

<figure>
  <a href="{{ '/assets/images/paper-review/mamba/selective-ssm.png' | relative_url }}"><img src="{{ '/assets/images/paper-review/mamba/selective-ssm.png' | relative_url }}" alt="현재 입력에서 B, C, 델타를 만들고 이전 상태를 갱신하는 selective SSM 구조" width="1010" height="390" loading="lazy" style="display:block;width:100%;height:auto;background:white;"></a>
  <figcaption>Gu &amp; Dao, Mamba v2, Figure 1. 파란 점선과 화살표가 입력에 따라 달라지는 선택 경로다. <a href="https://arxiv.org/pdf/2312.00752v2#page=3">원문 3쪽</a>에서 그림 영역만 발췌했다. CC BY 4.0.</figcaption>
</figure>

그림에서 주황색은 과거 상태가 다음 상태로 넘어가는 흐름이다. 초록색은 입력과 출력 경로, 파란색은 입력이 선택 계수에 영향을 주는 흐름이다. “선택적”이라는 말은 단어를 사람이 골라 삭제한다는 뜻이 아니라, 학습된 연산이 상태에 미치는 영향을 조절한다는 뜻이다.

Δ의 감각을 잡는 데는 논문 §3.5의 스칼라 특수 사례가 유용하다. 조건을 단순화하면 상태 갱신을 다음처럼 쓸 수 있다.

```text
h_t = (1 - g_t) × h_(t-1) + g_t × x_t
```

가령 이전 상태가 10이고 입력이 2라면, `g=0.1`일 때 새 상태는 9.2, `g=0.9`일 때는 2.8이다. 전자는 기존 기억을 더 유지하고 후자는 새 입력을 더 반영한다. 이 숫자는 설명용 계산이며 Mamba 실행 결과가 아니다. 실제 모델의 다차원 상태와 B·C 연산 전체를 이 하나의 gate로 대체할 수는 없다.

행렬과 이산화가 낯설다면 [Maarten Grootendorst의 시각적 가이드](https://www.maartengrootendorst.com/blog/mamba/)를 함께 읽는 것이 좋다. 연속·순환·convolution 표현을 같은 모델의 서로 다른 계산 방식으로 보여주기 때문에 수식의 역할을 연결하기 쉽다.

## 4. 순환식인데 어떻게 병렬 학습을 할까

입력에 따라 계수가 변하면 기존의 고정 convolution 경로를 그대로 쓸 수 없다. 그렇다고 순진한 for문으로 한 위치씩 계산하면 GPU를 충분히 활용하기 어렵다. Mamba의 두 번째 기여는 이를 **parallel scan과 메모리 이동 최적화**로 해결한 것이다. [Mamba §3.3](https://arxiv.org/pdf/2312.00752v2#page=6)

순환식을 `h_t = a_t h_(t-1) + b_t`라고 단순화하자. 두 단계를 합성하면 다음과 같다.

```text
첫 단계: h_1 = a_1 h_0 + b_1
둘째:    h_2 = a_2 h_1 + b_2
합성:    h_2 = (a_2 a_1) h_0 + (a_2 b_1 + b_2)
```

이런 변환의 합성에는 결합법칙이 있다. 따라서 구간별 변환을 병렬로 계산하고 합칠 수 있다. 순서를 마음대로 뒤집어도 된다는 교환법칙과는 다르다. 학습에서는 입력 시퀀스가 이미 있으므로 각 위치의 계수를 준비할 수 있지만, 생성에서는 다음 입력 토큰이 아직 정해지지 않아 같은 의미로 미래 토큰 전체를 병렬 생성할 수는 없다.

실제 속도에는 연산 횟수뿐 아니라 GPU의 큰 메모리와 빠른 내부 메모리 사이를 얼마나 오가는지가 중요하다. 원논문은 크게 확장된 중간 상태를 전부 외부 메모리에 쓰지 않도록 연산을 결합하고, 역전파 때 일부를 재계산한다. **좋은 점화식과 좋은 커널이 함께 있어야 빠르다.**

이 문제는 Mamba-2에서도 이어진다. [저자의 SSD 알고리즘 해설](https://tridao.me/blog/2024/mamba2-part3-algorithm/)은 시퀀스를 chunk로 나누고, chunk 내부 계산과 상태 전달을 분리해 대부분의 연산을 행렬곱으로 옮기는 이유를 설명한다. GPU tensor core에 맞는 계산 형태가 이론적 복잡도만큼 중요하다는 이야기다.

## 5. Mamba 블록을 한 번 따라가 보기

<figure>
  <a href="{{ '/assets/images/paper-review/mamba/mamba-block.png' | relative_url }}"><img src="{{ '/assets/images/paper-review/mamba/mamba-block.png' | relative_url }}" alt="H3와 gated MLP를 비교하고 convolution, SSM, gate를 결합한 Mamba 블록을 보여주는 그림" width="1010" height="370" loading="lazy" style="display:block;width:100%;height:auto;background:white;"></a>
  <figcaption>Gu &amp; Dao, Mamba v2, Figure 3. <a href="https://arxiv.org/pdf/2312.00752v2#page=8">원문 8쪽</a>의 구조도 발췌. CC BY 4.0.</figcaption>
</figure>

오른쪽 Mamba 블록을 아래에서 위로 읽으면 된다. 입력을 projection으로 확장해 두 갈래로 나눈다. 한쪽은 짧은 causal convolution과 활성함수, selective SSM을 통과한다. 다른 쪽은 gate가 된다. 두 결과를 곱하고 다시 출력 차원으로 보낸다. 전체 모델에서는 이런 블록을 정규화·잔차 연결과 함께 쌓는다. [Mamba §3.4](https://arxiv.org/pdf/2312.00752v2#page=7)

따라서 “attention이 없다”와 “선형층이나 비선형 변환이 없다”는 전혀 다르다. 원논문이 별도의 MLP 블록 없이 구성한다고 말하는 것은, projection과 gating까지 없앤다는 뜻이 아니다.

## 6. ‘5배 빠르다’는 그래프를 어떻게 읽을까

<figure>
  <a href="{{ '/assets/images/paper-review/mamba/efficiency.png' | relative_url }}"><img src="{{ '/assets/images/paper-review/mamba/efficiency.png' | relative_url }}" alt="A100에서 시퀀스 길이에 따른 커널 실행시간과 배치 크기에 따른 생성 처리량을 비교한 원논문 그래프" width="1010" height="232" loading="lazy" style="display:block;width:100%;height:auto;background:white;"></a>
  <figcaption>Gu &amp; Dao, Mamba v2, Figure 8. <a href="https://arxiv.org/pdf/2312.00752v2#page=15">원문 15쪽</a> 그래프 발췌. CC BY 4.0. 왼쪽은 커널 비교, 오른쪽은 A100 80GB·프롬프트 2,048 토큰 조건의 생성 처리량이다. 클릭하면 확대해 볼 수 있다.</figcaption>
</figure>

왼쪽은 길이가 늘 때 실행시간이 어떻게 증가하는지 보여준다. 오른쪽은 한 요청의 체감 응답시간이 아니라 배치를 포함한 초당 토큰 처리량이다. cache가 작으면 더 큰 배치를 처리할 여유가 생기므로 처리량에 유리할 수 있다.

이 그림을 “오늘의 모든 트랜스포머보다 언제나 5배 빠르다”로 옮기면 안 된다. 원논문의 모델 크기·장치·구현·입출력 조건에서 나온 결과다. 커널 속도가 모델 전체 학습 속도와 같지도 않다. 본 리뷰에서는 재실험하지 않았다.

실무 비교라면 프롬프트 처리 시간(prefill), 첫 토큰까지 걸린 시간, 토큰 생성 지연(decode), 동시 요청 수, 메모리, 정답률을 함께 기록해야 한다. 입력이 길고 출력이 짧은 문서 분류와, 긴 답변을 계속 생성하는 서비스는 같은 속도 순위를 보장하지 않는다.

## 7. 그래도 트랜스포머가 강한 이유

### 압축해서 기억하는 것과 정확히 되찾는 것은 다르다

가상의 우편 업무 예시로, 문서 앞부분에 `접수번호 ZX-4817 → 보관함 23`을 적고 수많은 다른 항목을 뒤에 붙인 뒤 마지막에 보관함 번호를 묻는다고 하자. 전체 추세를 파악하는 것과 이 연결을 정확히 회상하는 것은 다른 과제다.

[An Empirical Study of Mamba-based Language Models](https://arxiv.org/html/2406.07887v1)는 같은 데이터로 학습한 8B 모델들을 비교하고, 이름과 전화번호를 연결해 회상하는 Phonebook 과제를 사용했다. 해당 설정에서 순수 Mamba 계열은 긴 입력의 번호를 정확히 복사하는 데 어려움을 보였다. 언어 모델링 점수가 좋다는 사실만으로 임의의 긴 문서에서 정확한 조회까지 보장되지는 않는다.

하지만 이 결과를 “Mamba는 회상을 원리적으로 전혀 못 한다”로 확대하면 안 된다. [Revisiting associative recall in modern recurrent models](https://arxiv.org/abs/2508.19029)는 학습률, 폭과 깊이, 세부 구성에 따라 평가가 달라짐을 보여준다. 고정 상태의 제약과 특정 실험의 학습 실패는 구분해야 한다.

### 트랜스포머 쪽 구현도 계속 개선됐다

[FlashAttention](https://arxiv.org/abs/2205.14135)은 정확한 attention 계산의 메모리 이동을 줄였고, [PagedAttention](https://arxiv.org/abs/2309.06180)은 서빙 시 KV cache 관리의 낭비를 줄였다. 서로 다른 병목을 해결하는 기술이다. 이들은 attention의 모든 한계를 없애지는 않지만, 이미 구축된 모델을 더 효율적으로 운영하게 한다.

여기부터는 내 해석이다. 새 아키텍처를 채택할 때 팀은 FLOPs만 보지 않는다. 기존 체크포인트를 재사용할 수 있는지, 배포 엔진이 잘 지원하는지, 장애를 분석할 경험이 있는지도 본다. 작은 품질·속도 개선만으로 이 전환 비용을 상쇄하기 어려운 경우가 있다. 이것을 정량적으로 입증한 시장 점유율 조사로 주장하는 것은 아니다.

### ‘대세’와 ‘모든 최신 모델의 구조’는 같은 말이 아니다

공개 자료만으로 모든 비공개 최상위 모델의 내부 구조나 전체 서비스 점유율을 확정할 수 없다. 여기서 트랜스포머가 여전히 강하다는 말은, attention 기반 접근이 중요한 기준 모델이자 실용적 구성 요소로 남아 있다는 의미다.

정확한 원문 조회가 필요한 업무에서 attention의 장점은 분명한 설계 동기가 된다. 동시에 비용이 중요한 긴 생성에서는 상태 공간 층의 이점도 커질 수 있다. 어느 한쪽의 이름만으로 서비스 품질을 판정할 수는 없다.

## 8. 2024년 Reddit 질문을 2026년에 다시 읽기

[Reddit 토론](https://www.reddit.com/r/MachineLearning/comments/1hpg91o/d_why_mamba_did_not_catch_on/)은 2024년 12월의 문제의식을 담고 있다. 고정 상태의 한계, 벤치마크의 범위, 하이브리드 가능성을 둘러싼 의견이 보인다. 커뮤니티 경험담은 좋은 질문의 출발점이지만, 통제 실험이나 현재의 채택 현황을 대신하지 않는다.

후속 흐름을 보면 “Mamba가 사라졌다”는 결론은 성급하다.

| 시점 | 확인할 변화 | 해석할 때 주의할 점 |
| --- | --- | --- |
| 2023–2024 | Mamba-1: 입력 의존 선택성과 selective scan | 원논문 범위의 결과를 최신 모델 전체로 일반화하지 않기 |
| 2024 | Mamba-2: SSD로 SSM과 attention 계열의 연결을 활용 | 모든 softmax attention이 Mamba와 동일하다는 뜻은 아님 |
| 2026년 3월 | Mamba-3: 추론 효율과 상태 표현력 개선 | 더 나은 순수 SSM도 모든 조회 문제를 해결한 것은 아님 |
| 2026년 3월 | Nemotron 3 Super: Mamba–Transformer MoE 공개 | 순수 Mamba의 성과와 하이브리드 전체의 성과를 구별하기 |

[Mamba-2 논문](https://arxiv.org/abs/2405.21060)은 구조화된 행렬 관점으로 SSM과 attention 변형을 연결한다. 제목만 보고 기존 softmax Transformer와 완전히 같은 모델이라고 이해하기보다, 특정 구조의 공통점을 이용해 효율적인 알고리즘을 만든 것으로 읽는 것이 정확하다. [저자의 이론 해설](https://tridao.me/blog/2024/mamba2-part2-theory/)도 함께 볼 만하다.

[Mamba-3 저자 해설](https://tridao.me/blog/2026/mamba3-part1/)은 더 풍부한 상태 갱신과 추론 중심 설계를 설명하면서, 조회 과제에서는 attention의 장점이 남아 있다고 적는다. 저자들 역시 언어 모델에서 선형 층과 global attention의 결합을 유력한 방향으로 본다. 이것은 연구진의 전망이며 미래가 확정됐다는 뜻은 아니다.

실제 공개 사례인 [NVIDIA Nemotron 3 Super](https://research.nvidia.com/labs/nemotron/Nemotron-3-Super/)는 Mamba와 Transformer를 혼합한 MoE 모델이다. 이 사례는 Mamba가 실용 모델 구성에 채택됐다는 근거가 된다. 다만 서로 다른 학습 데이터·정밀도·MoE·서빙 조건이 섞인 모델 간 처리량 차이를 Mamba 층 하나의 인과 효과로 해석해서는 안 된다.

## 9. 내가 가져갈 결론: 원문 조회의 가치만큼 압축의 가치도 크다

내가 이 논문에서 가장 흥미롭게 읽은 부분은 **기억 방식과 하드웨어 실행 방식을 동시에 설계했다**는 점이다. 과거를 압축하면 비용을 줄일 수 있지만, 나중에 무엇을 물을지 모르는 상황에서 모든 세부 사항을 작은 상태에 보존하기는 어렵다. attention은 그 비용을 더 쓰면서 나중에 다시 참고할 경로를 제공한다.

따라서 트랜스포머가 남아 있는 이유를 단순히 “Mamba가 덜 똑똑해서”라고 정리하고 싶지는 않다. 내가 보는 핵심은 범용적인 조회 능력, 검증된 실행 환경, 그리고 품질과 비용을 함께 맞춰야 하는 서비스의 요구다. Mamba는 그 균형에서 비용을 줄일 수 있는 중요한 설계 선택지를 추가했다.

내 블로그의 [이동 그리드 예측 실험]({{ '/research/grid-trajectory-prediction/' | relative_url }})처럼 긴 경로에서 다음 이동을 예측한다면 Mamba 계열을 비교해 볼 동기가 있다. 반대로 [규정 문서 관리]({{ '/projects/regulation-versioning/' | relative_url }})처럼 조항 번호와 원문을 정확히 제시해야 한다면 모델의 기억만 믿기보다 검색과 출처 검증을 함께 설계해야 한다. 이 두 연결은 적용 아이디어이며, 해당 프로젝트에 Mamba를 적용하거나 성능을 측정했다는 의미는 아니다.

실험한다면 같은 데이터 분할·학습 예산에서 LSTM, Transformer, 순수 Mamba, 하이브리드를 비교하겠다. 다음 토큰이나 이동 예측 점수와 별도로, 길이를 늘린 뒤 드문 항목을 정확히 회상하는지 측정하고 싶다. 빠르게 읽는 모델과 필요한 것을 정확히 되찾는 모델 사이의 차이는 이때 가장 잘 드러날 것이다.

## 다시 볼 자료와 영상 구간

- [원논문 v2](https://arxiv.org/pdf/2312.00752v2): 선택성, scan, 구조도와 실험 조건의 기준 자료.
- [Yannic Kilcher 영상](https://www.youtube.com/watch?v=9dSkvxS2EB0): 공개 챕터 기준 [6:10 SSM](https://www.youtube.com/watch?v=9dSkvxS2EB0&t=370s), [12:30 선택성](https://www.youtube.com/watch?v=9dSkvxS2EB0&t=750s), [31:15 GPU 메모리](https://www.youtube.com/watch?v=9dSkvxS2EB0&t=1875s), [34:05 parallel scan](https://www.youtube.com/watch?v=9dSkvxS2EB0&t=2045s).
- [A Visual Guide to Mamba and State Space Models](https://www.maartengrootendorst.com/blog/mamba/): 여러 계산 표현을 그림으로 연결하는 해설.
- [The Annotated S4](https://srush.github.io/annotated-s4/): SSM에서 실제 코드로 넘어가기 위한 선행 자료.
- [Mamba-2 알고리즘 해설](https://tridao.me/blog/2024/mamba2-part3-algorithm/), [Mamba-3 해설](https://tridao.me/blog/2026/mamba3-part1/): 저자가 설명하는 후속 설계와 한계.
- [8B 모델 비교 연구](https://arxiv.org/abs/2406.07887), [associative recall 재검토](https://arxiv.org/abs/2508.19029): 회상 능력을 단순한 우열로 해석하지 않도록 돕는 실험 자료.
- [FlashAttention](https://arxiv.org/abs/2205.14135), [PagedAttention](https://arxiv.org/abs/2309.06180): attention의 계산·서빙 비용이 어떻게 개선됐는지 읽을 자료.
- [Reddit 토론](https://www.reddit.com/r/MachineLearning/comments/1hpg91o/d_why_mamba_did_not_catch_on/), [Nemotron 3 Super 공식 자료](https://research.nvidia.com/labs/nemotron/Nemotron-3-Super/): 과거의 문제의식과 현재의 공개 채택 사례를 구분해서 보기.

그림 3장은 Gu & Dao의 Mamba v2에 있는 Figure 1·3·8을 설명에 필요한 영역으로 잘라 사용했다. 원논문의 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)에 따라 저자·출처·변경 사항을 표시했다. 다른 리뷰의 그림은 재게시하지 않고 원문으로 연결했다.
