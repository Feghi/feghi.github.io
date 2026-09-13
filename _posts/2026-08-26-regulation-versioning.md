---
layout: case-study
date: 2026-08-26 16:32:11 +0900
type: project
title: 규정 개정 이력 관리 시스템
description: HWP 규정을 구조화해 버전·시점별 조회, 변경 비교와 검토·승인 이력을 관리하는 온프레미스 시스템.
kind: Internal platform
status: Private deployment
modified: 2026-08-26 16:32:11 +0900
role: 시스템 설계 · 풀스택 구현
technologies: [Java, Spring Boot, React, TypeScript, Python, PostgreSQL]
parent_url: /projects/
parent_label: Projects
flow: [HWP 원문·텍스트 추출, 구조 후보와 해시 생성, 개정 전후 검토·승인, 시점별 열람·문서 출력]
visual:
  title: 규정 개정 상태의 진행 예시
  unit: synthetic completion
  caption: 실제 사내 규정 건수나 처리율이 아닌 상태 전이 설명용 지수입니다. 자동 추출 뒤 사람의 검토와 승인을 거치는 구조를 나타냅니다.
  items:
    - { label: 원문 등록, value: 96, display: source }
    - { label: 구조 후보, value: 78, display: parsed }
    - { label: 검토 완료, value: 56, display: reviewed }
    - { label: 승인·공개, value: 38, display: approved }
permalink: /projects/regulation-versioning/
---
## 문서를 파일이 아닌 이력으로 다루기

사내 규정은 최신 파일 하나만 보관해서는 특정 시점에 어떤 조항이 유효했는지 설명하기 어렵다. 이 시스템은 HWP 원문을 구조화하고 버전, 권한, 감사 이력을 함께 관리해 개정 전후를 검토하고 승인된 규정을 시점별로 조회하도록 설계했다.

## 보수적인 가져오기와 사람의 검토

Python 가져오기 도구가 HWP 파일 목록을 만들고 텍스트를 추출한 뒤 문서 구조 후보를 생성한다. 원문과 추출 텍스트는 SHA-256으로 연결해 추적성을 남긴다. 자동 분석 결과를 즉시 공개하지 않고, 변경된 버전만 비교 화면에서 사람이 확인·수정·승인한 뒤 서비스에 반영한다. 개정 전후 비교표와 규정집을 PDF로 출력하는 흐름도 포함한다.

서비스 API는 Java 21과 Spring Boot, 관리·열람 화면은 React와 TypeScript로 구성했다. 버전과 권한, 감사 기록을 도메인 수준에서 관리하고 온프레미스 컨테이너 환경에서 운영하도록 설계했다.

## 공개 기록의 경계

이 프로젝트는 비공개 회사 시스템의 기술 요약이다. 실제 규정 내용, 사용자·권한 정보, 내부 주소, 계정과 배포 설정은 공개하지 않는다. 자동 추출 정확도보다 원문을 잃지 않고 변경 후보를 사람이 검증할 수 있게 만든 상태 전이가 핵심이다.
