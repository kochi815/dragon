// cat_data.js
// アイテムのデータ
const ITEM_DATA = {
    "item001": { name: "いつものおやつ", type: "snack", description: "猫たちが大好きなカリカリ。いろんな猫が遊びに来る基本のアイテム。", attract_level: 1, price: 10 },
    "item002": { name: "ねこじゃらし", type: "toy", description: "子猫や遊び好きな猫がじゃれついてくる。見ていて飽きない。", attract_level: 1, price: 20 },
    "item003": { name: "高級マグロ缶", type: "snack", description: "グルメな猫が好む逸品。ちょっと珍しい猫が来るかも？", attract_level: 2, price: 50 },
    "item004": { name: "ふかふかベッド", type: "toy", description: "のんびり屋の猫が気持ちよさそうに眠りに来る。癒やしの光景。", attract_level: 2, price: 60 },
    "item005": { name: "毛糸玉", type: "toy", description: "転がして遊ぶのが大好き。活発な猫に特に人気。", attract_level: 3, price: 80 },
    "item006": { name: "こたつ", type: "toy", description: "特別な猫がやってくるらしい…？冬の庭の主役。満足すると…？", attract_level: 4, price: 100 },
    "item007": { name: "カラフルボール", type: "toy", description: "転がるボールを追いかけるのが大好き！遊び盛りの猫にぴったり。", attract_level: 2, price: 40 },
    "item008": { name: "爪とぎポール", type: "toy", description: "バリバリ爪をといでストレス発散！きちょうめんな猫に好まれる。", attract_level: 3, price: 90 },
    "item009": { name: "キャットタワー", type: "toy", description: "みんなが集まる豪華なタワー。高いところからお庭をながめるのが王者のしるし？", attract_level: 4, price: 150 },
    "item010": { name: "びっくり箱", type: "toy", description: "猫が隠れるのにちょうどいい箱。時々、中から何かが飛び出して猫を驚かせるらしい。", attract_level: 3, price: 70 },
    "item011": { name: "すみっこハウス", type: "toy", description: "すみっこが好きな猫たちが集まってくる、かわいいおうち。中を覗くとぎゅうぎゅうかも？", attract_level: 3, price: 90 },
    "item012": { name: "もこもこねずみ", type: "toy", description: "ふわふわの毛並みが猫心をくすぐる、かわいいねずみのおもちゃ。お姫様のお気に入り。", attract_level: 2, price: 30 },
    "item013": { name: "魔法のちゅーる", type: "snack", description: "どんな猫でもメロメロにしてしまう、魔法の液体おやつ。グルメな猫に大人気！", attract_level: 3, price: 60 },
    "item014": { name: "ぽかぽかストーブ", type: "toy", description: "さむがりな猫がじんわりと暖まりにやってくる。冬の間の人気スポット。", attract_level: 4, price: 85 },
    "item015": { name: "ゆらゆらハンモック", type: "toy", description: "ゆったり揺られながらお昼寝するのが大好き。のんびり屋さんが集まってくる極上の寝床。", attract_level: 4, price: 120 }
};

// 猫のデータ
const CAT_DATA = {
    "cat001": { name: "しろたまさん", rarity: 1, description: "のんびり屋さんで、ひなたぼっこが大好き。ミルクティーを飲むのが夢らしい。", needs: [] },
    "cat002": { name: "くろまめさん", rarity: 1, description: "ツンデレな性格だけど、本当は甘えん坊。狭いところに入り込むのが得意。", needs: [] },
    "cat003": { name: "くりーむさん", rarity: 2, description: "甘いものが大好きな食いしん坊。特にマカロンには目がないみたい。", needs: ["item003"] },
    "cat004": { name: "おむすびさん", rarity: 2, description: "わんぱくで元気いっぱい。白米が大好きで、お椀に入ってごはんを待っている。", needs: ["item001", "item003"] },
    "cat005": { name: "ごま塩さん", rarity: 3, description: "物静かな読書家。知的な雰囲気で、他の猫たちに勉強を教えているとかいないとか。", needs: ["item004"] },
    "cat006": { name: "しろまるさん", rarity: 2, description: "いつでもにこにこ、みんなの人気者。ひよことおしゃべりするのが日課。", needs: ["item002", "item007"] },
    "cat007": { name: "ちゃちゃまるさん", rarity: 3, description: "ひよこと大の仲良し。いつも一緒に行動していて、さみしがり屋な一面も。", needs: ["item007", "item008"] },
    "cat008": { name: "しましまさん", rarity: 3, description: "りょうりが得意な猫。じまんの魚料理をみんなにふるまいたいと思っている。", needs: ["item003", "item005"] },
    "cat009": { name: "ねこキング", rarity: 5, description: "お庭に住まうすべての猫の王。キャットタワーの頂上からみんなを見守っている。", needs: ["item009"] },
    "cat010": { name: "はじっこさん", rarity: 2, description: "部屋のすみっこがなぜか落ち着く、ちょっぴり恥ずかしがり屋さん。そーっと様子をうかがっている。", needs: ["item010", "item011"] },
    "cat011": { name: "ぱんどろぼうさん", rarity: 3, description: "おいしいパンの匂いに誘われてやってくる食いしん坊。大事なパンは誰にも渡さないらしい。", needs: ["item013", "item003"] },
    "cat012": { name: "ちょいワルさん", rarity: 4, description: "見た目はクールだけど、実はとっても優しい。流行りものに目がないおしゃれ番長。", needs: ["item014", "item015"] },
    "cat013": { name: "はかせさん", rarity: 4, description: "いつも静かな場所で本を読んでいる物知りな猫。難しいクイズのヒントを知っているとか…？", needs: ["item004", "item006"] },
    "cat014": { name: "ひめさま", rarity: 5, description: "甘いお菓子と可愛いものが大好きな、わがままだけど憎めないお姫様。", needs: ["item012", "item009"] },
    "cat015": { name: "ねこ大王", rarity: 5, description: "お庭に君臨する威厳あふれる大王様。気まぐれで、最高級のおもてなしにしか姿を見せない。", needs: ["item015", "item013"] }
};