---
layout: case-study
date: 2020-05-25 23:21:13 +0900
type: research
category: research
tags: [데이터 프라이버시, 궤적 데이터, k-익명성, 알고리즘]
title: 궤적 데이터 프라이버시 후속 실험
description: 표 데이터의 Mondrian 분할에서 출발해, 벡터화된 이동 경로의 최소 위반 시퀀스를 추가·삭제하는 익명화 실험으로 확장한 연구 기록.
kind: Research code
status: Conference follow-up
modified: 2020-05-25 23:21:13 +0900
role: 알고리즘 연구 · 실험 구현
technologies: [Python, k-anonymity, Mondrian, LFP-Tree, Trajectory Data]
parent_url: /research/
parent_label: Research
source_url: https://github.com/Feghi/k-anonymity_mondrian
source_label: GitHub repository
flow: [준식별자·경로 벡터, 분할·LFP-Tree 구성, 위반 시퀀스 탐색, 추가 또는 억제로 갱신]
visual:
  title: 익명화 단계별 위반 패턴 예시
  unit: synthetic MVS index
  caption: 실제 논문 결과가 아닌 가상 지수입니다. 위반 시퀀스를 찾고 추가·억제를 반복하는 실험 구조를 설명합니다.
  items:
    - { label: 원본 경로, value: 88, display: "88" }
    - { label: MVS 탐색, value: 66, display: "66" }
    - { label: 1차 갱신, value: 34, display: "34" }
    - { label: 재검사, value: 14, display: "14" }
permalink: /research/trajectory-privacy-experiments/
---
## 출발점: 다차원 k-익명성

첫 번째 노트북은 Adult 데이터를 대상으로 Mondrian 방식의 다차원 분할을 실험한다. 숫자형·범주형 속성의 범위를 비교해 분할 축을 고르고, 각 파티션이 최소 `k`개의 레코드를 포함하도록 나눈 다음 준식별자를 일반화한다. l-diversity와 t-closeness를 살펴보는 보조 코드도 있지만, 엄밀한 표준 구현이라기보다 개념을 비교하기 위한 학습·실험 코드에 가깝다.

## 후속 실험: 경로에 무엇을 더하고 뺄 것인가

후속 코드는 표의 한 행이 아니라 순서가 있는 이동 경로를 다룬다. 벡터화된 궤적에서 빈도가 임계값보다 낮아 익명성을 깨뜨리는 최소 위반 시퀀스(MVS)를 찾기 위해 LFP-Tree를 구성한다. `Expansion.py`는 위반 패턴을 완화하도록 경로 항목을 추가하고, `Suppression.py`는 문제 항목을 억제한다. 갱신 전후 트리의 크기와 수행시간, 지역·전역 변경량을 보고서로 남기도록 구현돼 있다.

이 저장소는 2020년 Information Sciences 논문 「Effective privacy preserving data publishing by vectorization」의 그대로인 구현이 아니라, 해당 연구 이후 진행한 후속 실험이다. 관련 결과는 컨퍼런스에서 발표했으며, 경로 벡터에 노이즈를 더해 프라이버시와 활용 가능성의 균형을 탐색하는 연구 계보에 속한다.

## 한계와 재현성

코드는 초기 연구 산출물이라 실행 환경과 입력 파일 규약에 대한 설명이 부족하고 일부 주석도 혼재한다. 공개용 기록에서는 알고리즘의 의도를 보존하되, 동일 결과를 보장하는 패키지 버전과 정량 평가표가 저장소에 완전하게 남아 있지는 않다는 점을 함께 밝힌다.
