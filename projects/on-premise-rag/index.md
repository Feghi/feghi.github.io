---
layout: case-study
title: POSAI · 폐쇄망 RAG 지식검색
description: 외부 클라우드를 사용할 수 없는 환경에서 내부 문서를 검색하고 근거와 함께 답하는 온프레미스 챗봇.
kind: Internal AI service
status: Operating
modified: 2026-03-03 13:30:34 +0900
role: 기획 · 구현 · 운영
technologies: [Python, Ollama, LangChain, Chroma, Chainlit, RAG]
parent_url: /projects/
parent_label: Projects
flow: [PDF 문서 적재·분할, 임베딩·벡터 색인, 질의별 검색·생성, 출처 페이지와 답변 표시]
permalink: /projects/on-premise-rag/
---
## 제약에서 시작한 설계

POSAI는 외부 클라우드 연동이 불가능한 폐쇄망에서 사내 보고서와 문서를 검색하기 위해 만든 RAG 기반 지식검색 서비스다. 나는 요구사항 정리부터 검색·응답 파이프라인 구현과 실제 운영까지 담당했다. 원문이나 내부 주소, 계정, 운영 설정은 이 공개 기록에서 제외한다.

## 검색과 응답

문서를 페이지 단위로 읽고 재귀적으로 분할한 뒤 한국어 임베딩 모델과 Chroma 벡터 데이터베이스로 색인한다. 대화 화면에서는 질의가 규정·법령·문서검색 성격인지 판별해 검색 기반 체인을 사용하고, 관련 문맥을 찾지 못하면 모른다고 답하도록 한국어 프롬프트를 구성했다. 검색 답변에는 파일명과 페이지, 발췌문을 출처 카드로 함께 제공한다.

로컬 LLM은 Ollama로 서빙하고 LangChain의 RetrievalQA와 Chainlit UI를 연결했다. 코드에는 BGE-M3와 한국어 Sentence-BERT를 사용하는 서로 다른 실험 버전이 남아 있으므로, 실제 운영 시에는 색인을 만들 때와 조회할 때 동일한 임베딩 모델을 사용해야 한다.

## 운영에서 중요한 점

RAG는 문서를 찾았다는 이유만으로 답의 정확성을 보장하지 않는다. 문서 버전, 접근권한, 검색 누락과 인용 위치를 함께 관리해야 한다. 벡터DB 재구축 코드가 기존 색인을 교체하는 방식이므로 원본 보존과 롤백, 변경 전 검증도 운영 절차에 포함돼야 한다.

