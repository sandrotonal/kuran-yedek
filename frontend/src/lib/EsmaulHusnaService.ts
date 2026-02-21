
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

const TURKISH_DATA: Record<number, { trName: string; meaning: string; ar: string }> = {
    1: { ar: "الرَّحْمَنُ", trName: "Er-Rahmân", meaning: "Dünyada bütün mahlükata merhamet eden, şefkat gösteren, ihsan eden." },
    2: { ar: "الرَّحِيمُ", trName: "Er-Rahîm", meaning: "Ahirette sadece müminlere merhamet eden, onlara acıyan." },
    3: { ar: "الْمَلِكُ", trName: "El-Melik", meaning: "Mülkün, kâinatın sahibi, mülk ve saltanatı devamlı olan." },
    4: { ar: "الْقُدُّوسُ", trName: "El-Kuddûs", meaning: "Her türlü eksiklik ve ayıplardan münezzeh olan, bütün tasavvurların fevkinde olan saf ve temiz." },
    5: { ar: "السَّلاَمُ", trName: "Es-Selâm", meaning: "Her çeşit afet ve kederlerden emin olan, esenlik veren, tehlikelerden kurtaran." },
    6: { ar: "الْمُؤْمِنُ", trName: "El-Mü'min", meaning: "Güven veren, emin kılan, koruyan, iman nurunu veren." },
    7: { ar: "الْمُهَيْمِنُ", trName: "El-Müheymin", meaning: "Her şeyi görüp gözeten, her varlığın yaptıklarından haberdar olan." },
    8: { ar: "الْعَزِيزُ", trName: "El-Azîz", meaning: "İzzet sahibi, her şeye galip olan, karşı gelinemeyen." },
    9: { ar: "الْجَبَّارُ", trName: "El-Cebbâr", meaning: "Azamet ve kudret sahibi, dilediğini mutlak yapan, kırık kalpleri onaran." },
    10: { ar: "الْمُتَكَبِّرُ", trName: "El-Mütekebbir", meaning: "Büyüklükte eşi, benzeri olmayan, her şeyde ve her hadisede büyüklüğünü gösteren." },
    11: { ar: "الْخَالِقُ", trName: "El-Hâlık", meaning: "Yaratan, yoktan var eden, varlıkların geçireceği halleri takdir eden." },
    12: { ar: "الْبَارِئُ", trName: "El-Bâri", meaning: "Her şeyi kusursuz ve uyumlu yaratan." },
    13: { ar: "الْمُصَوِّرُ", trName: "El-Musavvir", meaning: "Varlıklara şekil veren, onları birbirinden farklı özellikte yaratan." },
    14: { ar: "الْغَفَّارُ", trName: "El-Gaffâr", meaning: "Günahları örten ve çok mağfiret eden, bağışlayan." },
    15: { ar: "الْقَهَّارُ", trName: "El-Kahhâr", meaning: "Her şeye, her istediğini yapacak surette galip ve hakim olan." },
    16: { ar: "الْوَهَّابُ", trName: "El-Vehhâb", meaning: "Karşılıksız hibeler veren, çok fazla ihsan eden." },
    17: { ar: "الرَّزَّاقُ", trName: "Er-Rezzâk", meaning: "Bütün mahlukatın rızkını veren ve ihtiyacını karşılayan." },
    18: { ar: "الْفَتَّاحُ", trName: "El-Fettâh", meaning: "Her türlü müşkülleri açan ve kolaylaştıran, darlıktan kurtaran, fetihler nasip eden." },
    19: { ar: "اَلْعَلِيْمُ", trName: "El-Alîm", meaning: "Gizli açık, geçmiş, gelecek, her şeyi en ince detaylarına kadar bilen." },
    20: { ar: "الْقَابِضُ", trName: "El-Kâbıd", meaning: "Dilediğine darlık veren, sıkan, daraltan, ruhları kabzeden." },
    21: { ar: "الْبَاسِطُ", trName: "El-Bâsıt", meaning: "Dilediğine bolluk veren, açan, genişleten, rızkı çoğaltan." },
    22: { ar: "الْخَافِضُ", trName: "El-Hâfıd", meaning: "Dereceleri alçaltan, kafir ve fasıkları zelil eden." },
    23: { ar: "الرَّافِعُ", trName: "Er-Râfi", meaning: "Şeref verip yükselten, müminleri aziz kılan." },
    24: { ar: "الْمُعِزُّ", trName: "El-Muiz", meaning: "Dilediğini aziz eden, izzet ve şeref veren." },
    25: { ar: "المُذِلُّ", trName: "El-Müzil", meaning: "Dilediğini zillete düşüren, hor ve hakir eden." },
    26: { ar: "السَّمِيعُ", trName: "Es-Semi", meaning: "Her şeyi en iyi işiten, duaları kabul eden." },
    27: { ar: "الْبَصِيرُ", trName: "El-Basîr", meaning: "Gizli açık, her şeyi en iyi gören." },
    28: { ar: "الْحَكَمُ", trName: "El-Hakem", meaning: "Mutlak hakim, hakkı batıldan ayıran, hikmet sahibi." },
    29: { ar: "الْعَدْلُ", trName: "El-Adl", meaning: "Mutlak adil, çok adaletli, asla zulmetmeyen." },
    30: { ar: "اللَّطِيفُ", trName: "El-Latîf", meaning: "Lütuf ve ihsan sahibi, en ince işlerin bütün inceliklerini bilen, bilinemeyen." },
    31: { ar: "الْخَبِيرُ", trName: "El-Habîr", meaning: "Her şeyden haberdar olan, gizli taraflarından haberi olan." },
    32: { ar: "الْحَلِيمُ", trName: "El-Halîm", meaning: "Yumuşak davranan, hilm sahibi, ceza vermede acele etmeyen." },
    33: { ar: "الْعَظِيمُ", trName: "El-Azîm", meaning: "Büyüklükte benzeri olmayan, pek yüce." },
    34: { ar: "الْغَفُورُ", trName: "El-Gafûr", meaning: "Affı, mağfireti bol, günahları örten." },
    35: { ar: "الشَّكُورُ", trName: "Eş-Şekûr", meaning: "Az amele, çok sevap veren, şükreden kullarını mükafatlandıran." },
    36: { ar: "الْعَلِيُّ", trName: "El-Aliyy", meaning: "Yüceler yücesi, çok yüce." },
    37: { ar: "الْكَبِيرُ", trName: "El-Kebîr", meaning: "Büyüklükte benzeri olmayan, pek büyük." },
    38: { ar: "الْحَفِيظُ", trName: "El-Hafîz", meaning: "Her şeyi koruyup gözeten, muhafaza eden." },
    39: { ar: "المُقيِت", trName: "El-Mukît", meaning: "Her yaratılmışın rızkını ve gıdasını veren, tayin eden." },
    40: { ar: "الْحسِيبُ", trName: "El-Hasîb", meaning: "Kulların hesabını en iyi gören, herkese yeten." },
    41: { ar: "الْجَلِيلُ", trName: "El-Celîl", meaning: "Celal ve azamet sahibi." },
    42: { ar: "الْكَرِيمُ", trName: "El-Kerîm", meaning: "Lütfü ve keremi çok bol olan, karşılıksız veren." },
    43: { ar: "الرَّقِيبُ", trName: "Er-Rakîb", meaning: "Her varlığı her an gözeten, kontrolü altında tutan." },
    44: { ar: "الْمُجِيبُ", trName: "El-Mücîb", meaning: "Duaları, istekleri kabul eden, cevap veren." },
    45: { ar: "الْوَاسِعُ", trName: "El-Vâsi", meaning: "Rahmet, kudret ve ilmi ile her şeyi ihata eden, geniş olan." },
    46: { ar: "الْحَكِيمُ", trName: "El-Hakîm", meaning: "Her işi hikmetli, her şeyi hikmetle yaratan." },
    47: { ar: "الْوَدُودُ", trName: "El-Vedûd", meaning: "Kullarını en çok seven, sevilmeye en layık olan." },
    48: { ar: "الْمَجِيدُ", trName: "El-Mecîd", meaning: "Şanı büyük ve yüksek olan." },
    49: { ar: "الْبَاعِثُ", trName: "El-Bâis", meaning: "Ölüleri dirilten, peygamberler gönderen." },
    50: { ar: "الشَّهِيدُ", trName: "Eş-Şehîd", meaning: "Her zaman ve her yerde hazır ve nazır olan, her şeye şahit olan." },
    51: { ar: "الْحَقُّ", trName: "El-Hakk", meaning: "Varlığı hiç değişmeden duran, var olan, hakkı ortaya çıkaran." },
    52: { ar: "الْوَكِيلُ", trName: "El-Vekîl", meaning: "Kendisine tevekkül edenlerin işlerini en iyi neticeye ulaştıran." },
    53: { ar: "الْقَوِيُّ", trName: "El-Kaviyy", meaning: "Kudreti en üstün ve hiç azalmaz, pek güçlü." },
    54: { ar: "الْمَتِينُ", trName: "El-Metîn", meaning: "Kuvvet ve kudreti pek güçlü, çok sağlam." },
    55: { ar: "الْوَلِيُّ", trName: "El-Veliyy", meaning: "İnananların dostu, onları seven ve yardım eden." },
    56: { ar: "الْحَمِيدُ", trName: "El-Hamîd", meaning: "Her türlü hamd ve senaya layık olan." },
    57: { ar: "الْمُحْصِي", trName: "El-Muhsî", meaning: "Yarattığı her şeyin sayısını bilen." },
    58: { ar: "الْمُبْدِئُ", trName: "El-Mübdi", meaning: "Mahlukatı maddesiz ve örneksiz olarak ilk baştan yaratan." },
    59: { ar: "الْمُعِيدُ", trName: "El-Muîd", meaning: "Yaratılmışları yok ettikten sonra tekrar yaratan." },
    60: { ar: "الْمُحْيِي", trName: "El-Muhyî", meaning: "İhya eden, dirilten, can veren." },
    61: { ar: "اَلْمُمِيتُ", trName: "El-Mümît", meaning: "Her canlıya ölümü tattıran, öldüren." },
    62: { ar: "الْحَيُّ", trName: "El-Hayy", meaning: "Ezeli ve ebedi hayat ile diri olan, her şeye hayat veren." },
    63: { ar: "الْقَيُّومُ", trName: "El-Kayyûm", meaning: "Varlıkları diri tutan, her şeyin varlığı kendisine bağlı olan." },
    64: { ar: "الْوَاجِدُ", trName: "El-Vâcid", meaning: "İstediğini, istediği vakit bulan, hiçbir şey kendisine gizli kalmayan." },
    65: { ar: "الْمَاجِدُ", trName: "El-Mâcid", meaning: "Kadri ve şanı büyük, kerem ve müsamahası bol." },
    66: { ar: "الْواحِدُ", trName: "El-Vâhid", meaning: "Tek olan, zatında, sıfatlarında ve işlerinde ortağı olmayan." },
    67: { ar: "اَلاَحَدُ", trName: "El-Ehad", meaning: "Bir olan, tek olan, eşi benzeri olmayan." },
    68: { ar: "الصَّمَدُ", trName: "Es-Samed", meaning: "Her şeyin kendisine muhtaç olduğu, kendisi hiçbir şeye muhtaç olmayan." },
    69: { ar: "الْقَادِرُ", trName: "El-Kâdir", meaning: "İstediğini, istediği gibi yapmaya gücü yeten." },
    70: { ar: "الْمُقْتَدِرُ", trName: "El-Muktedir", meaning: "Kuvvet ve kudret sahipleri üzerinde dilediği gibi tasarruf eden." },
    71: { ar: "الْمُقَدِّمُ", trName: "El-Mukaddim", meaning: "İstediğini öne alan, ileri geçiren." },
    72: { ar: "الْمُؤَخِّرُ", trName: "El-Muahhir", meaning: "İstediğini geriye bırakan, erteleyen." },
    73: { ar: "الأوَّلُ", trName: "El-Evvel", meaning: "Ezeli olan, varlığının başlangıcı olmayan." },
    74: { ar: "الآخِرُ", trName: "El-Âhir", meaning: "Ebedi olan, varlığının sonu olmayan." },
    75: { ar: "الظَّاهِرُ", trName: "Ez-Zâhir", meaning: "Varlığı açık, aşikâr olan, kesin delillerle bilinen." },
    76: { ar: "الْبَاطِنُ", trName: "El-Bâtın", meaning: "Akılların idrak edemeyeceği, yüceliği gizli olan." },
    77: { ar: "الْوَالِي", trName: "El-Vâlî", meaning: "Bütün kâinatı idare eden, onların işlerini yoluna koyan." },
    78: { ar: "الْمُتَعَالِي", trName: "El-Müteâlî", meaning: "Son derece yüce olan, şanı yüce." },
    79: { ar: "الْبَرُّ", trName: "El-Berr", meaning: "İyilik ve ihsanı bol, iyilik yapan." },
    80: { ar: "التَّوَابُ", trName: "Et-Tevvâb", meaning: "Tövbeleri kabul eden, günahları bağışlayan." },
    81: { ar: "الْمُنْتَقِمُ", trName: "El-Müntekim", meaning: "Zalimlerin cezasını veren, intikam alan." },
    82: { ar: "العَفُوُّ", trName: "El-Afüvv", meaning: "Affı çok olan, günahları silen." },
    83: { ar: "الرَّؤُوفُ", trName: "Er-Raûf", meaning: "Çok merhametli, pek şefkatli." },
    84: { ar: "مَالِكُ الْمُلْكِ", trName: "Mâlikü'l-Mülk", meaning: "Mülkün, her varlığın sahibi." },
    85: { ar: "ذُوالْجَلاَلِ وَالإكْرَامِ", trName: "Zül-Celâli ve'l-İkrâm", meaning: "Celal, büyüklük ve ikram sahibi." },
    86: { ar: "الْمُقْسِطُ", trName: "El-Muksit", meaning: "Bütün işleri birbirine uygun, denk yapan, adaletli." },
    87: { ar: "الْجĀمِعُ", trName: "El-Câmi", meaning: "İstediğini istediği zaman istediği yerde toplayan." },
    88: { ar: "الْغَنِيُّ", trName: "El-Ganiyy", meaning: "Çok zengin, her şeyden müstağni." },
    89: { ar: "الْمُغْنِي", trName: "El-Muğnî", meaning: "İstediğini zengin eden, ihtiyaçlarını gideren." },
    90: { ar: "اَلْمَانِعُ", trName: "El-Mâni", meaning: "Bir şeyin meydana gelmesine izin vermeyen, engelleyen." },
    91: { ar: "الضَّارَّ", trName: "Ed-Dârr", meaning: "Elem ve zarar verenleri yaratan." },
    92: { ar: "النَّافِعُ", trName: "En-Nâfi", meaning: "Fayda veren şeyleri yaratan." },
    93: { ar: "النُّورُ", trName: "En-Nûr", meaning: "Alemleri nurlandıran, dilediğine nur veren." },
    94: { ar: "الْهَادِي", trName: "El-Hâdî", meaning: "Hidayet veren, doğru yolu gösteren." },
    95: { ar: "الْبَدِيعُ", trName: "El-Bedî", meaning: "Eşi ve benzeri olmayan güzellikler yaratan." },
    96: { ar: "اَلْبَاقِي", trName: "El-Bâkî", meaning: "Varlığının sonu olmayan, ebedi olan." },
    97: { ar: "الْوَارِثُ", trName: "El-Vâris", meaning: "Her şeyin asıl sahibi olan." },
    98: { ar: "الرَّشِيدُ", trName: "Er-Reşîd", meaning: "İrşada muhtaç olmayan, doğru yolu gösteren." },
    99: { ar: "الصَّبُورُ", trName: "Es-Sabûr", meaning: "Çok sabırlı, ceza vermede acele etmeyen." }
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
            throw new Error('API return non-200 code');
        } catch (error) {
            console.warn("Error fetching Esmaül Hüsna, using local fallback:", error);
            // Fallback: If API fails, return the full Turkish list with Arabic text
            return Object.entries(TURKISH_DATA).map(([num, data]) => ({
                name: data.ar,
                transliteration: data.trName,
                number: parseInt(num),
                en: { meaning: data.meaning }
            }));
        }
    }
};
