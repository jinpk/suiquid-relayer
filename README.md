# Suiquid

## How to connect socket.

you need to get apiKey first before connect socket.io

> **after register the player and connect the wallet, get the apiKey and walletAddress.**

```bash
# connect with:
{
  "auth":{
    "token": string # apiKey
  },
  "query":{
    "address": string # your wallet address
  }
}
```

## Client Events

broadcast from server

- `joined`: 게임에 플레이어 참여시

```javascript
// event name
joined
// args
1. gameId: string
2. playerId: string // it can be wallet address
```

- `ready`: 게임 준비

```javascript
// event name
ready
// args
1. gameId: string
/** ex, 5000 - 5초 뒤 게임 시작 s*/
2. afterStartMs: number // miliseconds
```

- `started`: 게임 시작

```javascript
// event name
started
// args
1. gameId: string
```

- `inited`: 게임 시작후 유저 랜덤 좌표 설정

```javascript
// event name
inited
// args
1. gameId: string
/** canvas내의 사용자의 초기 위치를 설정해 주세요.*/
2. x: number // top-down 기준 x
3. y: number // top-down 기준 y
4. mnemonic: string // player가 할당 받은 단어 1개
```

- `moved`: 게임 플레이어 이동

```javascript
// event name
moved
// args
1. gameId: string
2. playerId: string // 움직인 사용자 ID
/** 브라우저 별 canvas size가 다르다면 변환 필요합니다.*/
3. x: number // top-down 기준 x
4. y: number // top-down 기준 y
/** 사용자가 바라보는 방향 */
5. direction: 'TOP' | 'RIGHT' | 'BOTTOM' | 'LEFT'
```

- `catched`: 게임에서 플레이어가 잡혔을 경우

```javascript
// event name
catched
// args
1. gameId: string
2. fromPlayerId: string // 잡은 사용자
2. toPlayerId: string //  잡힌 사용자
```

- `mnemonic`: 플레이어를 잡았을 경우

a가 b를 잡을 시 b의 모든 니모닉이 a에게 전송됩니다.

```javascript
// event name
mnemonic
// args
1. gameId: string
2. mnemonic: string[] // 사용자에게 업데이트 해주세요.
```

- `finished`: 게임 종료

```javascript
// event name
finished
// args
1. gameId: string
2. winnerPlayerId: string // 게임 우승자 address
```

## Server Events

broadcast from client

- `move`: Player action

```javascript
// event name
move
// args
1. gameId: string
2. playerId: string
3. x: number
4. y: number
5. direction: 'TOP' | 'RIGHT' | 'BOTTOM' | 'LEFT'
6. catched: boolean // space-bar 클릭시
```
