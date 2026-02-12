
import axios from 'axios';

export interface AsmaAlHusna {
    name: string;
    transliteration: string;
    number: number;
    en: {
        meaning: string;
    };
}

interface AsmaResponse {
    code: number;
    status: string;
    data: AsmaAlHusna[];
}

const TURKISH_DATA: Record<number, { trName: string; meaning: string }> = {
    1: { trName: "Allah", meaning: "Eşi benzeri olmayan, bütün noksan sıfatlardan münezzeh tek ilah, her şeyin gerçek sahibi." },
    2: { trName: "Er-Rahmân", meaning: "Dünyada bütün mahlükata merhamet eden, şefkat gösteren, ihsan eden." },
    3: { trName: "Er-Rahîm", meaning: "Ahirette sadece müminlere merhamet eden, onlara acıyan." },
    4: { trName: "El-Melik", meaning: "Mülkün, kâinatın sahibi, mülk ve saltanatı devamlı olan." },
    5: { trName: "El-Kuddûs", meaning: "Her türlü eksiklik ve ayıplardan münezzeh olan, bütün tasavvurların fevkinde olan saf ve temiz." },
    6: { trName: "Es-Selâm", meaning: "Her çeşit afet ve kederlerden emin olan, esenlik veren, tehlikelerden kurtaran." },
    7: { trName: "El-Mü'min", meaning: "Güven veren, emin kılan, koruyan, iman nurunu veren." },
    8: { trName: "El-Müheymin", meaning: "Her şeyi görüp gözeten, her varlığın yaptıklarından haberdar olan." },
    9: { trName: "El-Azîz", meaning: "İzzet sahibi, her şeye galip olan, karşı gelinemeyen." },
    10: { trName: "El-Cebbâr", meaning: "Azamet ve kudret sahibi, dilediğini mutlak yapan, kırık kalpleri onaran." },
    11: { trName: "El-Mütekebbir", meaning: "Büyüklükte eşi, benzeri olmayan, her şeyde ve her hadisede büyüklüğünü gösteren." },
    12: { trName: "El-Hâlık", meaning: "Yaratan, yoktan var eden, varlıkların geçireceği halleri takdir eden." },
    13: { trName: "El-Bâri", meaning: "Her şeyi kusursuz ve uyumlu yaratan." },
    14: { trName: "El-Musavvir", meaning: "Varlıklara şekil veren, onları birbirinden farklı özellikte yaratan." },
    15: { trName: "El-Gaffâr", meaning: "Günahları örten ve çok mağfiret eden, bağışlayan." },
    16: { trName: "El-Kahhâr", meaning: "Her şeye, her istediğini yapacak surette galip ve hakim olan." },
    17: { trName: "El-Vehhâb", meaning: "Karşılıksız hibeler veren, çok fazla ihsan eden." },
    18: { trName: "Er-Rezzâk", meaning: "Bütün mahlukatın rızkını veren ve ihtiyacını karşılayan." },
    19: { trName: "El-Fettâh", meaning: "Her türlü müşkülleri açan ve kolaylaştıran, darlıktan kurtaran, fetihler nasip eden." },
    20: { trName: "El-Alîm", meaning: "Gizli açık, geçmiş, gelecek, her şeyi en ince detaylarına kadar bilen." },
    21: { trName: "El-Kâbıd", meaning: "Dilediğine darlık veren, sıkan, daraltan, ruhları kabzeden." },
    22: { trName: "El-Bâsıt", meaning: "Dilediğine bolluk veren, açan, genişleten, rızkı çoğaltan." },
    23: { trName: "El-Hâfıd", meaning: "Dereceleri alçaltan, kafir ve fasıkları zelil eden." },
    24: { trName: "Er-Râfi", meaning: "Şeref verip yükselten, müminleri aziz kılan." },
    25: { trName: "El-Muiz", meaning: "Dilediğini aziz eden, izzet ve şeref veren." },
    26: { trName: "El-Müzil", meaning: "Dilediğini zillete düşüren, hor ve hakir eden." },
    27: { trName: "Es-Semi", meaning: "Her şeyi en iyi işiten, duaları kabul eden." },
    28: { trName: "El-Basîr", meaning: "Gizli açık, her şeyi en iyi gören." },
    29: { trName: "El-Hakem", meaning: "Mutlak hakim, hakkı batıldan ayıran, hikmet sahibi." },
    30: { trName: "El-Adl", meaning: "Mutlak adil, çok adaletli, asla zulmetmeyen." },
    31: { trName: "El-Latîf", meaning: "Lütuf ve ihsan sahibi, en ince işlerin bütün inceliklerini bilen, bilinemeyen." },
    32: { trName: "El-Habîr", meaning: "Her şeyden haberdar olan, gizli taraflarından haberi olan." },
    33: { trName: "El-Halîm", meaning: "Yumuşak davranan, hilm sahibi, ceza vermede acele etmeyen." },
    34: { trName: "El-Azîm", meaning: "Büyüklükte benzeri olmayan, pek yüce." },
    35: { trName: "El-Gafûr", meaning: "Affı, mağfireti bol, günahları örten." },
    36: { trName: "Eş-Şekûr", meaning: "Az amele, çok sevap veren, şükreden kullarını mükafatlandıran." },
    37: { trName: "El-Aliyy", meaning: "Yüceler yücesi, çok yüce." },
    38: { trName: "El-Kebîr", meaning: "Büyüklükte benzeri olmayan, pek büyük." },
    39: { trName: "El-Hafîz", meaning: "Her şeyi koruyup gözeten, muhafaza eden." },
    40: { trName: "El-Mukît", meaning: "Her yaratılmışın rızkını ve gıdasını veren, tayin eden." },
    41: { trName: "El-Hasîb", meaning: "Kulların hesabını en iyi gören, herkese yeten." },
    42: { trName: "El-Celîl", meaning: "Celal ve azamet sahibi." },
    43: { trName: "El-Kerîm", meaning: "Lütfü ve keremi çok bol olan, karşılıksız veren." },
    44: { trName: "Er-Rakîb", meaning: "Her varlığı her an gözeten, kontrolü altında tutan." },
    45: { trName: "El-Mücîb", meaning: "Duaları, istekleri kabul eden, cevap veren." },
    46: { trName: "El-Vâsi", meaning: "Rahmet, kudret ve ilmi ile her şeyi ihata eden, geniş olan." },
    47: { trName: "El-Hakîm", meaning: "Her işi hikmetli, her şeyi hikmetle yaratan." },
    48: { trName: "El-Vedûd", meaning: "Kullarını en çok seven, sevilmeye en layık olan." },
    49: { trName: "El-Mecîd", meaning: "Şanı büyük ve yüksek olan." },
    50: { trName: "El-Bâis", meaning: "Ölüleri dirilten, peygamberler gönderen." },
    51: { trName: "Eş-Şehîd", meaning: "Her zaman ve her yerde hazır ve nazır olan, her şeye şahit olan." },
    52: { trName: "El-Hakk", meaning: "Varlığı hiç değişmeden duran, var olan, hakkı ortaya çıkaran." },
    53: { trName: "El-Vekîl", meaning: "Kendisine tevekkül edenlerin işlerini en iyi neticeye ulaştıran." },
    54: { trName: "El-Kaviyy", meaning: "Kudreti en üstün ve hiç azalmaz, pek güçlü." },
    55: { trName: "El-Metîn", meaning: "Kuvvet ve kudreti pek güçlü, çok sağlam." },
    56: { trName: "El-Veliyy", meaning: "İnananların dostu, onları seven ve yardım eden." },
    57: { trName: "El-Hamîd", meaning: "Her türlü hamd ve senaya layık olan." },
    58: { trName: "El-Muhsî", meaning: "Yarattığı her şeyin sayısını bilen." },
    59: { trName: "El-Mübdi", meaning: "Mahlukatı maddesiz ve örneksiz olarak ilk baştan yaratan." },
    60: { trName: "El-Muîd", meaning: "Yaratılmışları yok ettikten sonra tekrar yaratan." },
    61: { trName: "El-Muhyî", meaning: "İhya eden, dirilten, can veren." },
    62: { trName: "El-Mümît", meaning: "Her canlıya ölümü tattıran, öldüren." },
    63: { trName: "El-Hayy", meaning: "Ezeli ve ebedi hayat ile diri olan, her şeye hayat veren." },
    64: { trName: "El-Kayyûm", meaning: "Varlıkları diri tutan, her şeyin varlığı kendisine bağlı olan." },
    65: { trName: "El-Vâcid", meaning: "İstediğini, istediği vakit bulan, hiçbir şey kendisine gizli kalmayan." },
    66: { trName: "El-Mâcid", meaning: "Kadri ve şanı büyük, kerem ve müsamahası bol." },
    67: { trName: "El-Vâhid", meaning: "Tek olan, zatında, sıfatlarında ve işlerinde ortağı olmayan." },
    68: { trName: "Es-Samed", meaning: "Her şeyin kendisine muhtaç olduğu, kendisi hiçbir şeye muhtaç olmayan." },
    69: { trName: "El-Kâdir", meaning: "İstediğini, istediği gibi yapmaya gücü yeten." },
    70: { trName: "El-Muktedir", meaning: "Kuvvet ve kudret sahipleri üzerinde dilediği gibi tasarruf eden." },
    71: { trName: "El-Mukaddim", meaning: "İstediğini öne alan, ileri geçiren." },
    72: { trName: "El-Muahhir", meaning: "İstediğini geriye bırakan, erteleyen." },
    73: { trName: "El-Evvel", meaning: "Ezeli olan, varlığının başlangıcı olmayan." },
    74: { trName: "El-Âhir", meaning: "Ebedi olan, varlığının sonu olmayan." },
    75: { trName: "Ez-Zâhir", meaning: "Varlığı açık, aşikâr olan, kesin delillerle bilinen." },
    76: { trName: "El-Bâtın", meaning: "Akılların idrak edemeyeceği, yüceliği gizli olan." },
    77: { trName: "El-Vâlî", meaning: "Bütün kâinatı idare eden, onların işlerini yoluna koyan." },
    78: { trName: "El-Müteâlî", meaning: "Son derece yüce olan, şanı yüce." },
    79: { trName: "El-Berr", meaning: "İyilik ve ihsanı bol, iyilik yapan." },
    80: { trName: "Et-Tevvâb", meaning: "Tövbeleri kabul eden, günahları bağışlayan." },
    81: { trName: "El-Müntekim", meaning: "Zalimlerin cezasını veren, intikam alan." },
    82: { trName: "El-Afüvv", meaning: "Affı çok olan, günahları silen." },
    83: { trName: "Er-Raûf", meaning: "Çok merhametli, pek şefkatli." },
    84: { trName: "Mâlikü'l-Mülk", meaning: "Mülkün, her varlığın sahibi." },
    85: { trName: "Zül-Celâli ve'l-İkrâm", meaning: "Celal, büyüklük ve ikram sahibi." },
    86: { trName: "El-Muksit", meaning: "Bütün işleri birbirine uygun, denk yapan, adaletli." },
    87: { trName: "El-Câmi", meaning: "İstediğini istediği zaman istediği yerde toplayan." },
    88: { trName: "El-Ganiyy", meaning: "Çok zengin, her şeyden müstağni." },
    89: { trName: "El-Muğnî", meaning: "İstediğini zengin eden, ihtiyaçlarını gideren." },
    90: { trName: "El-Mâni", meaning: "Bir şeyin meydana gelmesine izin vermeyen, engelleyen." },
    91: { trName: "Ed-Dârr", meaning: "Elem ve zarar verenleri yaratan." },
    92: { trName: "En-Nâfi", meaning: "Fayda veren şeyleri yaratan." },
    93: { trName: "En-Nûr", meaning: "Alemleri nurlandıran, dilediğine nur veren." },
    94: { trName: "El-Hâdî", meaning: "Hidayet veren, doğru yolu gösteren." },
    95: { trName: "El-Bedî", meaning: "Eşi ve benzeri olmayan güzellikler yaratan." },
    96: { trName: "El-Bâkî", meaning: "Varlığının sonu olmayan, ebedi olan." },
    97: { trName: "El-Vâris", meaning: "Her şeyin asıl sahibi olan." },
    98: { trName: "Er-Reşîd", meaning: "İrşada muhtaç olmayan, doğru yolu gösteren." },
    99: { trName: "Es-Sabûr", meaning: "Çok sabırlı, ceza vermede acele etmeyen." }
};

export const EsmaulHusnaService = {
    async getAllNames(): Promise<AsmaAlHusna[]> {
        try {
            const response = await axios.get<AsmaResponse>('http://api.aladhan.com/v1/asmaAlHusna');
            if (response.data.code === 200) {
                // Merge API data with Turkish data
                return response.data.data.map(item => {
                    const trData = TURKISH_DATA[item.number];
                    return {
                        ...item,
                        transliteration: trData ? trData.trName : item.transliteration,
                        en: {
                            meaning: trData ? trData.meaning : item.en.meaning
                        }
                    };
                });
            }
            return [];
        } catch (error) {
            console.error("Error fetching Esmaül Hüsna:", error);
            // Fallback: If API fails, return just the Turkish list
            return Object.entries(TURKISH_DATA).map(([num, data]) => ({
                name: "...", // Arabic name missing in fallback, or we could add it to TURKISH_DATA if critical
                transliteration: data.trName,
                number: parseInt(num),
                en: { meaning: data.meaning }
            }));
        }
    }
};
