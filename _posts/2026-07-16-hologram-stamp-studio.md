---
layout: case-study
date: 2026-07-16 20:49:21 +0900
type: project
title: 우표 홀로그램 스튜디오
description: 관람객이 그린 이미지를 우표 프레임과 홀로그램 연출로 완성하고 QR로 가져가는 전시 체험 프로토타입.
kind: Exhibition prototype
status: Prototype
modified: 2026-07-16 20:49:21 +0900
role: 체험 설계 · 프런트엔드·생성 파이프라인 구현
technologies: [JavaScript, HTML, CSS, Node.js, ComfyUI, FLUX, BiRefNet]
parent_url: /projects/
parent_label: Projects
flow: [터치 드로잉·테마 선택, 생성 어댑터, 우표 프레임·홀로그램 연출, 세로 화면·QR 결과 전달]
permalink: /projects/hologram-stamp-studio/
---
## 전시장에서 끝까지 이어지는 60초

2026 대한민국 우표전시회를 염두에 둔 체험형 프로토타입이다. 관람객은 네 가지 테마 중 하나를 고르고 터치 화면에 그림을 그린다. 제한시간 안에 결과를 우표 프레임에 담고, 별도 세로 화면의 홀로그램 연출과 QR 다운로드까지 이어지도록 전체 동선을 설계했다.

## 가벼운 기본 실행, 교체 가능한 생성부

화면은 빌드 과정 없는 HTML·CSS·Vanilla JavaScript로 만들고 Node.js 기본 서버로 실행한다. 기본 모드는 생성 과정을 시뮬레이션해 GPU나 NAS가 없어도 전시 흐름을 시험할 수 있다. 생성부는 교체 가능한 모듈로 분리했으며, 실제 구성에서는 ComfyUI HTTP API로 입력 그림을 FLUX 계열 모델에 전달하고 BiRefNet으로 배경을 제거한 뒤 공식 우표 프레임과 합성한다.

최근 결과는 로컬에 제한된 개수만 보관해 스크린세이버에 활용한다. NAS 연결이 끊겨도 체험을 계속하고 업로드를 재시도하며, 만료되는 결과 이미지·영상은 QR로 전달하는 구조다. 다만 3D나 MP4 생성은 실제 완성 기능이 아니라 향후 다른 생성 API로 교체할 수 있도록 마련한 확장 지점이다.

## 현장 운영 관점

두 화면의 가로·세로 비율, 터치 입력, 입장·행동·포즈별 시간, 네트워크 장애를 하나의 사용자 여정으로 다룬 것이 핵심이다. 실제 관람객 이미지와 내부 NAS 주소, 관리자 인증정보는 공개하지 않는다.
