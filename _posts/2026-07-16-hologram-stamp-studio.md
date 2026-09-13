---
layout: case-study
date: 2026-07-16 20:49:21 +0900
type: project
category: projects
tags: [생성형 AI, 인터랙티브 미디어, 전시, 우표]
title: 우표 홀로그램 스튜디오
description: 관람객이 그린 이미지를 우표 프레임과 홀로그램 연출로 완성하고 QR로 가져가는 전시 체험 프로토타입.
kind: Exhibition installation
status: Exhibited
modified: 2026-07-16 20:49:21 +0900
role: 체험 설계 · 프런트엔드·생성 파이프라인 구현
technologies: [JavaScript, HTML, CSS, Node.js, ComfyUI, FLUX, BiRefNet]
parent_url: /projects/
parent_label: Projects
flow: [터치 드로잉·테마 선택, 생성 어댑터, 우표 프레임·홀로그램 연출, 세로 화면·QR 결과 전달]
visual:
  title: 60초 체험의 시간 배분 예시
  unit: illustrative seconds
  caption: 실제 현장 측정이 아닌 가상 시간 배분입니다. 입장부터 그리기, 생성 연출, QR 전달까지 한 회차의 리듬을 보여줍니다.
  items:
    - { label: 입장·선택, value: 25, display: 10s }
    - { label: 터치 드로잉, value: 70, display: 28s }
    - { label: 생성·연출, value: 40, display: 16s }
    - { label: QR 전달, value: 15, display: 6s }
permalink: /projects/hologram-stamp-studio/
---
## 전시장에서 끝까지 이어진 60초

2026 대한민국 우표전시회 기간에 DDP 이간수문 전시장에 실제 설치·운영한 체험형 프로젝트다. 관람객은 네 가지 테마 중 하나를 고르고 터치 화면에 그림을 그린다. 제한시간 안에 결과를 우표 프레임에 담고, 별도 세로 화면의 홀로그램 연출과 QR 다운로드까지 이어지도록 전체 동선을 설계했다.

<figure class="case-gallery" aria-label="AI 홀로그램 우표 스튜디오 현장 설치 사진">
  <a href="{{ '/assets/images/projects/hologram-stamp-studio/installation-wide.jpg' | relative_url }}" aria-label="전체 설치 사진을 원본 크기로 보기">
    <img src="{{ '/assets/images/projects/hologram-stamp-studio/installation-wide.jpg' | relative_url }}" alt="DDP 이간수문 전시장에 설치된 터치스크린과 세로형 홀로그램 우표 디스플레이" loading="lazy">
  </a>
  <a href="{{ '/assets/images/projects/hologram-stamp-studio/installation-close.jpg' | relative_url }}" aria-label="근접 설치 사진을 원본 크기로 보기">
    <img src="{{ '/assets/images/projects/hologram-stamp-studio/installation-close.jpg' | relative_url }}" alt="AI 홀로그램 우표 스튜디오 세로형 디스플레이의 현장 설치 모습" loading="lazy">
  </a>
  <figcaption>2026 대한민국 우표전시회, DDP 이간수문 전시장. 왼쪽 터치스크린에서 그림을 만들고 세로형 디스플레이에서 홀로그램 우표 결과를 감상하도록 구성했다.</figcaption>
</figure>

## 가벼운 기본 실행, 교체 가능한 생성부

화면은 빌드 과정 없는 HTML·CSS·Vanilla JavaScript로 만들고 Node.js 기본 서버로 실행한다. 기본 모드는 생성 과정을 시뮬레이션해 GPU나 NAS가 없어도 전시 흐름을 시험할 수 있다. 생성부는 교체 가능한 모듈로 분리했으며, 실제 구성에서는 ComfyUI HTTP API로 입력 그림을 FLUX 계열 모델에 전달하고 BiRefNet으로 배경을 제거한 뒤 공식 우표 프레임과 합성한다.

최근 결과는 로컬에 제한된 개수만 보관해 스크린세이버에 활용한다. NAS 연결이 끊겨도 체험을 계속하고 업로드를 재시도하며, 만료되는 결과 이미지·영상은 QR로 전달하는 구조다. 다만 3D나 MP4 생성은 실제 완성 기능이 아니라 향후 다른 생성 API로 교체할 수 있도록 마련한 확장 지점이다.

## 현장 운영 관점

두 화면의 가로·세로 비율, 터치 입력, 입장·행동·포즈별 시간, 네트워크 장애를 하나의 사용자 여정으로 다룬 것이 핵심이다. DDP 현장에서는 터치 조작 화면과 세로형 결과 디스플레이를 나란히 배치해 입력과 감상의 역할을 분리했다. 실제 관람객 이미지와 내부 NAS 주소, 관리자 인증정보는 공개하지 않는다.
