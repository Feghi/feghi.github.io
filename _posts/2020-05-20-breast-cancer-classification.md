---
layout: case-study
date: 2020-05-20 21:17:54 +0900
type: research
title: 유방암 분류 모델 비교 실험
description: 임상 지표 기반 로지스틱 회귀와 인공신경망 비교연구에서 신경망 모델을 구현하고 학습 과정을 검토한 실험.
kind: Research code
status: Published
modified: 2020-05-20 21:17:54 +0900
role: 인공신경망 구현 · 모델 비교
technologies: [Python, Keras, Scikit-learn, Pandas, Neural Network]
parent_url: /research/
parent_label: Research
source_url: https://github.com/Feghi/cancer-prediction-using-deep-learning
source_label: GitHub repository
flow: [9개 설명변수 정리, 학습·평가 분할, 표준화·신경망 학습, 정확도·손실 추이 확인]
visual:
  title: 모델 평가 항목 예시
  unit: checklist coverage
  caption: 저장소의 성능 수치가 아닌 평가 설계 예시입니다. 현재 재현 실험에서 함께 확인해야 할 항목을 상대적으로 표현했습니다.
  items:
    - { label: 정확도, value: 82, display: accuracy }
    - { label: 재현율, value: 70, display: recall }
    - { label: ROC-AUC, value: 64, display: AUC }
    - { label: 교차검증, value: 46, display: CV }
permalink: /research/breast-cancer-classification/
---
## 연구 배경

2019년 데이타베이스연구에 발표한 「로지스틱 회귀분석과 인공신경망을 이용한 유방암 분류 모델 비교연구」의 인공신경망 구현 기록이다. 동일 데이터로 추정되는 9개 설명변수와 이진 분류값을 사용해, 전통적인 통계 모형과 신경망이 어떤 차이를 보이는지 비교하기 위한 실험이었다.

## 구현 내용

Pandas로 데이터를 읽고 설명변수와 `Classification` 레이블을 분리한 뒤 학습·평가 집합으로 나눈다. `StandardScaler`로 입력을 표준화하고, Keras Sequential 모델에 18개와 32개 은닉 유닛, ReLU 활성화, 50% Dropout을 배치했다. 마지막 층은 sigmoid와 binary cross-entropy를 사용하며 RMSprop으로 학습한다. 추가 학습 구간에서는 훈련·검증 정확도와 손실의 변화를 그려 과적합 여부를 살펴본다.

## 지금 다시 읽으며 확인한 한계

초기 노트북은 평가 데이터에도 `fit_transform`을 적용하고 무작위 시드를 고정하지 않았으며, 최종 성능을 독립 평가셋보다 훈련셋 중심으로 출력한다. 현재 기준의 재현 실험이라면 학습셋에만 scaler를 적합하고 교차검증, 클래스별 precision·recall, ROC-AUC와 신뢰구간을 함께 보고해야 한다.

<p class="case-note">이 코드는 학술 비교 실험이며 의료기기나 임상 진단 도구가 아니다. 저장소의 결과만으로 개인의 질환을 판단할 수 없다.</p>
