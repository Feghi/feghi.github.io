---
layout: case-study
title: 영향력 확산과 정보 과부하
description: 네트워크의 전파 범위를 키우면서 중복 정보 노출을 줄이기 위한 시드 선택 알고리즘의 연구·실험 기록.
kind: Dissertation research
status: Published
modified: 2020-05-20 21:32:02 +0900
role: 문제 정의 · 알고리즘 설계 · 실험
technologies: [R, igraph, Graph Algorithms, Bitwise Operations, Clustering]
parent_url: /research/
parent_label: Research
source_url: https://github.com/Feghi/InfluencePropagation-and-InformationOverload
source_label: GitHub repository
flow: [그래프·시드 수 입력, 후보 알고리즘 실행, 전파·중복량 계산, 합성·실세계 그래프 비교]
permalink: /research/influence-overload/
---
## 많이 퍼지는 것이 언제나 좋은가

영향력 최대화는 제한된 수의 시드 노드로 최대한 많은 노드에 정보를 전달하려는 문제다. 하지만 여러 시드에서 같은 정보가 반복해서 도달하면 전파량이 늘어도 사용자가 체감하는 효용은 낮아질 수 있다. 이 연구는 도달 범위와 중복 노출을 동시에 보면서 시드를 선택하는 문제를 다룬다.

## 실험 코드의 구조

R과 `igraph`로 무작위, 차수 기반, CELF, 지역 영향력, 클러스터 기반 방법을 같은 실험 틀에서 비교했다. `BITPRO.R`은 각 노드의 도달 가능 집합을 논리 행렬로 만든 뒤 XOR·OR 연산으로 새 시드가 추가하는 전파량을 계산한다. Affinity Propagation과 그래프 군집을 활용한 변형도 포함돼 있다. 합성 그래프뿐 아니라 Wiki-Vote와 Gnutella 네트워크에서 시드 수에 따른 전파량, 과부하의 하한·상한을 비교하도록 구성했다.

이 저장소는 박사학위 논문의 실험 계보이자 2024년 Data & Knowledge Engineering 논문 「A bitwise approach on influence overload problem」로 이어진 연구 코드다. 공개 저장소의 초기 함수명과 논문의 최종 B-square·C-square 표현이 완전히 일치하지는 않으므로, 최종 논문의 모든 알고리즘을 재현하는 배포 패키지라고 설명하지 않는다.

## 연구의 의미

전파 성공을 ‘도달한 사람 수’ 하나로만 평가하지 않고, 반복 도달이라는 비용을 함께 계산한 것이 핵심이다. 비트 연산은 도달 집합의 합집합과 차이를 간결하게 표현해 후보를 반복 평가하는 비용을 줄이는 수단으로 사용됐다. 자세한 정의와 이론적 경계, 최종 평가는 [출판 논문](https://doi.org/10.1016/j.datak.2023.102276)에서 확인할 수 있다.

