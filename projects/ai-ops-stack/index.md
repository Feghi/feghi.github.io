---
layout: case-study
title: AI Ops Stack
description: 여러 코딩 에이전트와 개인 연구 도구가 같은 장기 기억을 공유하도록 구성한 로컬 우선 운영 스택.
kind: Personal infrastructure
status: Active
modified: 2026-08-21 13:31:48 +0900
role: 아키텍처 설계 · 구현 · 운영
technologies: [Python, MCP, SQLite, Markdown, systemd]
parent_url: /projects/
parent_label: Projects
source_url: https://github.com/Feghi/AI-ops-stack
source_label: GitHub repository
flow: [에이전트 작업·대화, 공용 기억 저장소, 검색·MCP 연결, 사람이 다듬는 지식 문서]
permalink: /projects/ai-ops-stack/
---
## 세션이 끝나도 남는 기억

코딩 에이전트를 여러 환경에서 사용하면 대화와 결정이 도구마다 흩어진다. AI Ops Stack은 그 사이에 로컬 장기 기억 계층을 두어 개인, 연구, 프로젝트별 사실과 결정을 다시 찾을 수 있게 만든 개인 인프라다. 자동으로 쌓이는 기억과 사람이 검토해 남기는 지식 문서를 분리한 것이 설계의 중심이다.

## 구성

Mnemosyne가 SQLite 기반의 공유 기억을 관리하고, Codex와 Claude Code는 MCP를 통해 같은 저장소에 읽고 쓴다. Hermes는 대화형 비서와 리서치 진입점, `herdr`는 여러 코딩 작업을 pane 단위로 실행하는 도구다. 검토할 가치가 있는 내용은 Markdown 위키로 승격해 장기간 읽을 수 있는 형태로 정리한다.

설정 예시와 설치·점검 스크립트는 실행 파일 존재 여부, 기억 쓰기와 다시 읽기, MCP 등록 상태, 사용자 서비스 동작을 확인한다. 실제 환경 파일, 데이터베이스, 로그와 사용자별 비밀정보는 저장소에서 제외하는 구조다.

## 운영 원칙

세션 기록은 임시 맥락, 공유 메모리는 여러 도구가 재사용하는 사실, 위키는 사람이 편집한 원칙과 결론으로 취급한다. 이 구분이 없으면 잘못된 추론이 장기 기억으로 굳을 수 있다. 따라서 자동 수집량보다 출처와 갱신 시점을 확인하고, 중요한 정보는 사람이 승격·정정할 수 있게 하는 데 초점을 뒀다.

