'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });

//データを組み替えるためのマップ（連想配列）
const prefectureDataMap = new Map();

//function(lineString){}と同じlineString=>は
rl.on('line', lineString => {
  //ここ以下がファイルを行単位で作業する内容はここに書く
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);//文字列になってるので数字に変更している
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    //2010または2015のみ処理する
    let value = null; //valueというオブジェクトに一旦入れておく。
    if (prefectureDataMap.has(prefecture)) {
      value = prefectureDataMap.get(prefecture)
    } else {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };//連想配列かつオブジェクトマップに初期値を入れる。すでに各県のキーがある場合はあるままの値で先に進む。
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    //都道府県をキーにしてデータを登録
    prefectureDataMap.set(prefecture, value);

  }
});
rl.on('close', () => {
  for (const [key, nakami] of prefectureDataMap) {
    nakami.change = nakami.popu15 / nakami.popu10;
  }//mapの中身を[]のなかの変数に入れるということ
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });//降順にするには2から1を引けばいい差がプラスなら上に来るというプログラム？？

const rankingStrings = rankingArray.map(([key, nakami]) => {
  return `${key}は、15〜19歳の人口が2010年の${nakami.popu10}人から2015年には${nakami.popu15}人になりました。変化率は${nakami.change}でした。`
});
console.log(rankingStrings);
});//closeは全ての処理が終わった後に行うことを書く
