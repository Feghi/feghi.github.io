---
layout: case-study
date: 2026-02-26 00:02:57 +0900
type: project
title: Stamp Model Data Pipeline
description: 우표 이미지의 권리·품질·중복을 확인하고 생성모델 학습용 데이터셋으로 내보내는 수집 파이프라인.
kind: ML data pipeline
status: Scaffold
modified: 2026-02-26 00:02:57 +0900
role: 파이프라인 설계 · 구현
technologies: [Python, Computer Vision, OCR, pHash, Diffusers]
parent_url: /projects/
parent_label: Projects
source_url: https://github.com/Feghi/stemp_gen
source_label: GitHub repository
flow: [공개 아카이브 수집, 권리·품질 필터, 해시·OCR 메타데이터, LoRA 학습 형식 내보내기]
permalink: /projects/stamp-model-pipeline/
---
## 생성모델보다 먼저 필요한 것

우표 생성모델을 만들려면 이미지 수보다 출처와 이용조건, 중복, 해상도, 설명 품질이 먼저 정리돼야 한다. 이 프로젝트는 Smithsonian, Wikimedia, Europeana, Library of Congress 등의 공개 아카이브를 API로 수집하고 학습 가능한 데이터셋으로 정제하는 과정을 하나의 파이프라인으로 묶는다.

## 데이터 처리 흐름

수집기는 페이지네이션과 재시도를 지원하고, 각 기관의 권리 표기를 허용·제외 규칙으로 거른다. 이미지 SHA-256과 perceptual hash로 동일 파일과 시각적으로 유사한 이미지를 탐지하며 최소 해상도 등 품질 기준을 적용한다. 선택적으로 Tesseract OCR을 실행해 연도, 액면, 문자 힌트를 보강하고 출처 메타데이터와 함께 보존한다.

정제 결과는 일반 JSONL 또는 Diffusers의 image-folder 형식으로 내보낸다. FLUX·SDXL 계열의 LoRA 학습 스크립트를 호출할 수 있는 실행 래퍼도 있지만, 저장소 자체가 훈련된 우표 생성모델이나 상용 결과물을 제공하는 것은 아니다.

## 저작권과 재현성

자동 권리 필터는 법률 판단을 대신하지 않는다. 원본 기관의 라이선스와 관할을 최종 확인하고, 모델 학습·배포 목적에 맞는 데이터만 사용해야 한다. 이 페이지의 도식도 실제 우표 이미지를 복제하지 않고 파이프라인 구조만 설명한다.
