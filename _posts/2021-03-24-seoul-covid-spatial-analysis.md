---
layout: case-study
date: 2021-03-24 17:44:20 +0900
type: research
category: research
tags: [공간 분석, GIS, 이동성, 코로나19]
title: 서울 코로나 이동 경로의 공간 분석
description: 건물 폴리곤의 중심점과 공개 이동 경로 데이터를 연결해 감염 동선의 공간 표현을 탐색한 개인 실험.
kind: Independent experiment
status: Unpublished
modified: 2021-03-24 17:44:20 +0900
role: 데이터 처리 · 공간 분석 · 시각화
technologies: [Python, GeoPandas, Pandas, Folium, GIS]
parent_url: /research/
parent_label: Research
source_url: https://github.com/Feghi/Polygon-Centroid
source_label: Public geometry experiment
flow: [이동·행정경계 데이터, 폴리곤 정비, 중심점·경로 변환, 지도 기반 패턴 탐색]
visual:
  title: 공간 표현 단위별 정보량 예시
  unit: conceptual detail
  caption: 실제 감염자 자료가 아닌 설명용 지수입니다. 점·경로·집계구·자치구로 갈수록 표현의 상세도와 노출 위험이 함께 달라짐을 나타냅니다.
  items:
    - { label: 개별 지점, value: 92, display: 높음 }
    - { label: 이동 경로, value: 78, display: 높음 }
    - { label: 격자 집계, value: 48, display: 중간 }
    - { label: 자치구 집계, value: 24, display: 낮음 }
permalink: /research/seoul-covid-spatial-analysis/
---
## 두 실험을 하나의 질문으로

이 기록은 `Polygon-Centroid`와 `Covid-Seoul-spot-point`를 하나의 공간 분석 실험으로 묶어 정리했다. 전자는 서울 건물 공간정보의 폴리곤을 읽고 경계·합집합·중심점을 계산하는 기초 실험이고, 후자는 공개된 코로나19 이동 경로와 서울 행정경계 데이터를 지도에 표현한다. 두 저장소가 하나의 완성된 파이프라인으로 연결된 것은 아니지만, 복잡한 영역과 이동 기록을 분석 가능한 점·경로 단위로 바꾼다는 공통 질문을 가진다.

## 구현과 해석

GeoPandas로 Shapefile의 geometry를 읽어 폴리곤 경계를 확인하고 centroid를 계산했다. 코로나 이동 경로 실험에서는 시점과 좌표를 정리하고 서울 자치구 GeoJSON과 결합해 지도 위의 이동 패턴을 탐색했다. 개인의 실제 동선을 재노출하는 것이 목적이 아니므로 이 페이지에는 원본 위치나 환자 단위 자료를 싣지 않는다.

중심점은 폴리곤을 대표하기 쉬운 표현이지만 오목한 도형에서는 점이 영역 밖에 생길 수 있고, 위·경도 좌표계에서 바로 계산하면 거리·면적 해석이 왜곡될 수 있다. 실제 분석에서는 적절한 투영좌표계와 `representative_point` 같은 대안을 데이터 목적에 맞춰 선택해야 한다.

## 연구로 이어지지 못한 실험

이 작업은 개인 실험 단계에서 멈췄고 논문화하지 않았다. 다만 같은 시기의 프라이버시 연구는 이동 경로를 직접 공개하지 않으면서 분석 효용을 남기는 문제를 다뤘다. 2020년 한국정보과학회 발표 「벡터화 경로 데이터에 노이즈 추가를 통한 프라이버시 보호 방안: 코로나 바이러스를 중심으로」와 주제적으로 맞닿아 있지만, 이 저장소 자체를 그 논문의 구현이라고 보지는 않는다.
