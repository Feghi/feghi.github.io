---
layout: case-study
title: 봉투 필기 영역 OCR 실험
description: 스캔한 봉투에서 글자 영역을 찾고 OCR 결과와 신뢰도를 시각화한 초기 컴퓨터 비전 프로토타입.
kind: Computer vision experiment
status: Prototype
modified: 2020-08-11 09:52:40 +0900
role: 영상 처리 · OCR 실험
technologies: [Python, OpenCV, Tesseract, Pillow]
parent_url: /projects/
parent_label: Projects
source_url: https://github.com/Feghi/OpenCV_for_envelope
source_label: GitHub repository
flow: [봉투 이미지 입력, 회색조·임시 이미지 변환, Tesseract OCR, 신뢰도 기반 영역 표시]
permalink: /projects/envelope-ocr/
---
## 목적

우편 봉투 이미지에서 필기된 글자 영역을 찾아 후속 주소 인식에 사용할 수 있는지 확인한 초기 실험이다. 완성된 필기 주소 인식기가 아니라 OpenCV와 Tesseract를 연결해 OCR 처리 흐름과 검출 결과를 눈으로 검토하는 프로토타입이다.

## 구현

Pillow와 OpenCV로 이미지를 불러와 회색조로 변환하고 임시 PNG를 만든 뒤 Tesseract에 전달한다. 문자열 인식 결과와 함께 `image_to_data`가 반환하는 위치·신뢰도 정보를 읽고, 일정 신뢰도 이상의 단어에 사각형을 그려 결과 이미지를 저장한다. 이 과정을 통해 OCR이 어느 부분을 문자로 판단했는지 원본 위에서 확인할 수 있다.

## 한계

별도의 객체 검출 모델을 학습한 것은 아니며, 한글 필기체에 특화된 언어 설정이나 정확도 평가도 저장소에 남아 있지 않다. 개인정보가 포함될 수 있는 실제 봉투 샘플은 포트폴리오에 싣지 않는다. 실용 단계로 확장하려면 주소·성명 영역 분리, 기울기와 조명 보정, 개인정보 마스킹, 문자 오류율 기반 평가가 필요하다.

