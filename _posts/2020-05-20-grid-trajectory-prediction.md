---
layout: case-study
date: 2020-05-20 21:14:19 +0900
type: research
category: research
tags: [궤적 데이터, 시계열 예측, LSTM, 이동성]
title: LSTM 기반 이동 그리드 예측
description: 기존 이동 경로를 격자 시퀀스로 바꾸고 다음 이동 방향·그리드를 예측하려 한 독립 후속 실험.
kind: Independent experiment
status: Unpublished
modified: 2020-05-20 21:14:19 +0900
role: 데이터 변환 · 모델 설계 · 실험
technologies: [Python, Keras, LSTM, Sequence Modeling, Grid Data]
parent_url: /research/
parent_label: Research
source_url: https://github.com/Feghi/trajectory-prediction-using-lstm
source_label: GitHub repository
flow: [좌표를 격자로 변환, 경로를 시퀀스로 인코딩, LSTM으로 패턴 학습, 다음 8방향 분류]
visual:
  title: 다음 이동 방향의 확률 분포 예시
  unit: synthetic probability index
  caption: 실제 모델 출력이 아닌 가상 분포입니다. 한 경로에서 8방향 후보를 분류하는 문제 구성을 보여줍니다.
  items:
    - { label: 북동, value: 72, display: "0.72" }
    - { label: 동, value: 48, display: "0.48" }
    - { label: 남동, value: 31, display: "0.31" }
    - { label: 북, value: 18, display: "0.18" }
permalink: /research/grid-trajectory-prediction/
---
## 경로를 문장처럼 학습하기

프라이버시 연구에서 다뤘던 궤적 데이터와 별개로, 과거 경로 자체를 학습해 다음 이동 그리드를 예측할 수 있는지 살펴본 독립 실험이다. 논문화까지 진행하지는 못했지만, 좌표를 그대로 회귀하는 대신 공간을 격자로 나누고 이동을 이산적인 시퀀스로 표현했다.

`Make_Grid_Path.py`는 좌표가 어느 격자에 속하는지 판별해 경로를 격자 열로 바꾼다. 최종 노트북은 경로 문자열의 마지막 방향을 레이블로 분리하고, 앞선 이동열을 토큰화·패딩한다. Embedding 층과 64유닛 LSTM, 256유닛 완전연결층을 거쳐 8개 방향을 softmax로 분류하며, 검증 손실 기반 Early Stopping을 사용한다.

## 남은 과제

텍스트용 Tokenizer를 격자 시퀀스에 적용한 빠른 프로토타입이라 공간적으로 인접한 격자의 관계가 임베딩에 명시적으로 들어가지는 않는다. 데이터 분할도 한 이동 주체의 인접 경로가 학습·평가에 함께 섞이지 않도록 시간 또는 개체 단위로 다시 설계할 필요가 있다. 다음 단계라면 다중 스텝 예측, top-k 경로 후보, 거리 기반 오차를 함께 평가하는 편이 적절하다.

이 페이지는 완성된 예측 서비스나 발표 논문으로 포장하지 않고, 기존 궤적 연구에서 나온 다음 질문을 실제 코드로 시험한 개인 연구 기록으로 남긴다.
