# Guranimefu

Myanimelistのランキングを、毎日自動で記録し、グラフ化します。

# v2について

2021年8月29日に運用開始したものを「APPV2」とする。

## APIのコンフィグ設定方法

Cloud functions for Firebaseなので、環境変数の設定がちょっとめんどくさいです。

### 1. AdminConfig.d.tsで型を作る

後で呼び出すために`string`で型を作っておきます。

```ts
{
  "XXX": {
    "yyy": string;
  };
}
```

### 2. configを登録

```sh
firebase functions:config:set XXX.YYY="ZZZ"
```

### 3. configをエミュレータに反映

**`.runtimeconfig.json`に値を書かないと、エミュレータが読んでくれません。**

コミットしていないのですが、いずれにせよ以下のコマンドで作成されます。

```sh
cd functions
firebase functions:config:get > .runtimeconfig.json
```

### おすすめの設定

`jikan.wait`は**絶対に`2500`以上にしてください。** これがJikan APIの制限を回避するためのインターバルです。

## Thank you

### Google Analytics

https://sunday-morning.app/posts/2020-12-09-nextjs-google-analytics

### Remove duplicate keys

https://stackoverflow.com/a/60716511/15161394


### Firestore syncing

https://medium.com/firebase-developers/how-to-import-production-data-from-cloud-firestore-to-the-local-emulator-e82ae1c6ed8
