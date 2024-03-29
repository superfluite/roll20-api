# CoC combat helper

##### ver 0.1.0

- - -

Roll20 에서 CoC 7판 전투 시스템을 도와주는 api입니다.

## 명령어

### 전투 개시

```
!ch start 캐릭터이름1, 캐릭터이름2...
```

전투에 참가할 캐릭터들을 지정하여 전투를 개시합니다. 캐릭터들의 이름은 기본적으로 `,` 를 기준으로 나뉘며, 지정된 캐릭터들의 민첩 수치와 근접전(전투) 기능 수치를 비교하여 아래와 같이 각 캐릭터들의 순서를 아래와 같이 알려줍니다.

```
캐릭터이름1(민첩수치, 현재체력/최대체력) >> 캐릭터이름2(민첩수치, 현재체력/최대체력) >> ...
```

![전투개시 예시](https://user-images.githubusercontent.com/7193188/182089919-69bc45e8-aaad-486b-a1ef-9b3b1c0025de.PNG)

현재 차례인 캐릭터는 **볼드체로 표시**됩니다.

캐릭터 이름을 지정할 때, 지정한 이름이 포함된 캐릭터는 모두 참가가 됩니다. 예를 들면 잭 리만씨가 작은 쥐, 중간 쥐, 큰 쥐와 전투를 해야할 때, 아래와 같이 입력하면 됩니다.

```
!ch start 쥐, 잭
```

하지만 만약 NPC 중에 잭슨 크루거 씨가 있다면, 위와 같이 입력했을 때 무고한 잭슨씨가 갑자기 전장에 끌려와버릴 수 있습니다. 그렇다면 이렇게 입력하면 됩니다.

```
!ch start 쥐, 잭 리만
```

![전투개시 예시2](https://user-images.githubusercontent.com/7193188/182093056-618439b3-555e-43b1-a1e6-c249c82f6f3f.PNG)


이 명령어는 GM만 사용 가능합니다.

<p style="color: grey">
# FIXME 원래는 전투 기술 수치를 비교해야 하나, 어떤 전투 기술 수치를 사용하여 비교할지 정하도록 하는 것이 복잡하여 우선 근접전(전투) 기능 수치만을 사용합니다. 추후 캐릭터가 사용 가능한 무기 중 전투 기술 수치가 가장 높은 것을 기준으로 비교하도록 기능을 수정할 예정입니다.
</p>

### 턴 넘기기

```
!ch nt
```

자기 턴이 끝났을 때 다음 차례로 넘깁니다.

![턴넘기기 예시](https://user-images.githubusercontent.com/7193188/182090474-02e7603d-3afa-477f-b6c8-6acd1b134b7e.PNG)

이 명령어는 GM, 그리고 현재 턴인 캐릭터의 제어권을 가진 플레이어만 사용 가능합니다.

### 전투 종료

```
!ch end
```

전투가 끝났을 때 사용합니다.

![전투종료 예시](https://user-images.githubusercontent.com/7193188/182090850-8eda8887-6c99-4343-873f-d1aaa45ae474.PNG)

이 명령어는 GM만 사용 가능합니다.
