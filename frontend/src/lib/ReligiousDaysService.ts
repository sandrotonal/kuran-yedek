export interface ReligiousDay {
    date: string; // YYYY-MM-DD
    name: string;
    description: string;
    longDescription?: string;
    hadith?: { text: string; source: string };
    worshipSuggestions?: string[];
    isHoliday?: boolean; // Bayram
    isKandil?: boolean;
    colorTheme?: 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';
}

// Data for 2024, 2025, 2026
// Source: Diyanet & Astronomical Calculations (Gregorian Approximation)
export const RELIGIOUS_DAYS: ReligiousDay[] = [
    // 2024
    {
        date: '2024-01-11',
        name: 'Regaip Kandili',
        description: 'Üç ayların başlangıcyını müjdeleyen gece.',
        longDescription: 'Regaip, kelime olarak "çokça rağbet edilen, kıymetli hediye" manasına gelir. Allah\'ın rahmetinin, mağfiretinin ve lütfunun bolca yağdığı bir gecedir. Bu gece, manevi bir uyanış ve arınma fırsatıdır.',
        hadith: { text: 'Şu beş gecede yapılan dua geri çevrilmez: Regaip Gecesi, Şabanın 15. gecesi, Cuma, Ramazan Bayramı ve Kurban Bayramı gecesi.', source: 'İbn Asakir' },
        worshipSuggestions: ['Kaza namazı kılmak', 'Kur\'an-ı Kerim okumak', 'Tevbe istiğfar etmek', 'Oruç tutmak (gündüzü)'],
        isKandil: true,
        colorTheme: 'cyan'
    },
    {
        date: '2024-02-06',
        name: 'Miraç Kandili',
        description: 'Peygamber Efendimizin (s.a.v) göğe yükseldiği gece.',
        longDescription: 'Miraç, Peygamber Efendimizin (s.a.v) Mescid-i Haram\'dan Mescid-i Aksa\'ya, oradan da semalara yükseldiği mucizevi yolculuktur. Namaz mümini miracıdır; bu gece namazın farz kılındığı gecedir.',
        hadith: { text: 'Namaz müminin miracıdır.', source: 'Hadis-i Şerif' },
        worshipSuggestions: ['Bolca namaz kılmak', 'Salavat getirmek', 'Sadaka vermek'],
        isKandil: true,
        colorTheme: 'violet'
    },
    {
        date: '2024-02-24',
        name: 'Berat Kandili',
        description: 'Günahlardan arınma ve bağışlanma gecesi.',
        longDescription: 'Berat, borçtan, hastalıktan, suç ve cezadan kurtulmak demektir. Bu gece, Allah\'ın affının sağanak sağanak yağdığı, kulların temize çıktığı mübarek bir gecedir.',
        hadith: { text: 'Şabanın 15. gecesi (Berat Gecesi) oldu mu, onu ibadetle geçirin. Gündüzünde de oruç tutun.', source: 'İbn Mace' },
        worshipSuggestions: ['Tevbe ve istiğfar', 'Geçmiş kaza namazları', 'Hayır hasenat'],
        isKandil: true,
        colorTheme: 'amber'
    },
    {
        date: '2024-03-11',
        name: 'Ramazan Başlangıcı',
        description: 'On bir ayın sultanı Ramazan ayının ilk günü.',
        longDescription: 'Başı rahmet, ortası mağfiret, sonu cehennemden kurtuluş olan Ramazan ayı; Kur\'an ayıdır, oruç ayıdır, sabır ve şükür ayıdır. Bin aydan hayırlı Kadir Gecesi\'ni içinde barındırır.',
        hadith: { text: 'Ramazan ayı girdiğinde cennet kapıları açılır, cehennem kapıları kapanır ve şeytanlar zincire vurulur.', source: 'Buhari' },
        worshipSuggestions: ['Farz orucu tutmak', 'Teravih namazı', 'Mukabele (Kur\'an hatmi)', 'Sadaka-i Fıtır vermek'],
        colorTheme: 'emerald'
    },
    {
        date: '2024-04-05',
        name: 'Kadir Gecesi',
        description: 'Kur\'an-ı Kerim\'in indirilmeye başlandığı bin aydan hayırlı gece.',
        longDescription: 'Kadir Gecesi, Yüce Allah\'ın insanlığa son mesajı olan Kur\'an\'ı indirmeye başladığı gecedir. Bu gece yapılan ibadet, bin ayda (yaklaşık 83 yıl) yapılan ibadetten daha hayırlıdır.',
        hadith: { text: 'Kim inanarak ve sevabını Allah\'tan bekleyerek Kadir Gecesi\'ni ihya ederse, geçmiş günahları affedilir.', source: 'Buhari' },
        worshipSuggestions: ['Bolca Kur\'an okumak', 'Kadir Gecesi duası: "Allahım sen affedicisin, affı seversin, beni affet."', 'Tesbih namazı'],
        isKandil: true,
        colorTheme: 'emerald'
    },
    {
        date: '2024-04-10',
        name: 'Ramazan Bayramı',
        description: 'Ramazan ayının sona erdiği bayram günü.',
        longDescription: 'Bir aylık oruç ibadetinin ardından gelen sevinç, şükür ve kardeşlik günleridir. Müminlerin birbirini ziyaret ettiği, küskünlerin barıştığı manevi bir ziyafettir.',
        hadith: { text: 'Arefe günü, Kurban Bayramı ve Teşrik günleri biz Müslümanların bayramıdır.', source: 'Ebu Davud' },
        worshipSuggestions: ['Bayram namazı', 'Sıla-i rahim (Akraba ziyareti)', 'Çocukları sevindirmek'],
        isHoliday: true,
        colorTheme: 'rose'
    },
    { date: '2024-06-15', name: 'Arefe Günü', description: 'Kurban Bayramı öncesi Arefe günü.', colorTheme: 'amber' },
    { date: '2024-06-16', name: 'Kurban Bayramı', description: 'Kurban ibadetinin yapıldığı mübarek bayram.', isHoliday: true, colorTheme: 'rose' },
    { date: '2024-07-07', name: 'Hicri Yılbaşı', description: 'Hicri 1446 yılının başlangıcı (1 Muharrem).', colorTheme: 'cyan' },
    { date: '2024-07-16', name: 'Aşure Günü', description: 'Muharrem ayının 10. günü, Aşure günü.', colorTheme: 'amber' },
    { date: '2024-09-14', name: 'Mevlid Kandili', description: 'Peygamber Efendimizin (s.a.v) dünyayı şereflendirdiği gece.', isKandil: true, colorTheme: 'violet' },

    // 2025
    {
        date: '2025-01-02',
        name: 'Regaip Kandili',
        description: 'Üç ayların başlangıcı müjdeleyen rahmet gecesi.',
        longDescription: 'Regaip Kandili, Recep ayının ilk Cuma gecesidir. Allah\'ın lütuflarının bol olduğu, duaların kabul edildiği mübarek bir zaman dilimidir.',
        hadith: { text: 'Allahü Teâlâ Recep ayında hasenatı kat kat eder.', source: 'Taberani' },
        worshipSuggestions: ['Kaza namazı', 'Oruç', 'Tevbe istiğfar'],
        isKandil: true, colorTheme: 'cyan'
    },
    {
        date: '2025-01-26',
        name: 'Miraç Kandili',
        description: 'Yükseliş ve huzura kabul gecesi.',
        longDescription: 'Namazın hediye edildiği, şirk koşmayanların affedileceğinin müjdelendiği büyük gece.',
        hadith: { text: 'Namaz dinin direğidir.', source: 'Hadis-i Şerif' },
        worshipSuggestions: ['Nafile namaz', 'Salavat'],
        isKandil: true, colorTheme: 'violet'
    },
    { date: '2025-02-13', name: 'Berat Kandili', description: 'Kurtuluş ve bağışlanma beratının verildiği gece.', isKandil: true, colorTheme: 'amber' },
    {
        date: '2025-03-01',
        name: 'Ramazan Başlangıcı',
        description: 'Rahmet ve bereket ayı Ramazan\'ın ilk günü.',
        longDescription: 'Ramazan, oruçla nefislerin terbiye edildiği, Kur\'an ile kalplerin şifalandığı aydır. Gündüzü oruçlu, gecesi ibadetli geçirilmelidir.',
        hadith: { text: 'Kim faziletine inanarak ve karşılığını Allah\'tan bekleyerek Ramazan orucunu tutarsa, geçmiş günahları bağışlanır.', source: 'Buhari' },
        worshipSuggestions: ['Oruç', 'Teravih', 'Mukabele'],
        colorTheme: 'emerald'
    },
    { date: '2025-03-26', name: 'Kadir Gecesi', description: 'Bin aydan hayırlı olan mübarek gece.', isKandil: true, colorTheme: 'emerald' },
    { date: '2025-03-30', name: 'Ramazan Bayramı', description: 'Sabır imtihanının sevinçle taçlandığı bayram.', isHoliday: true, colorTheme: 'rose' },
    { date: '2025-06-05', name: 'Arefe Günü', description: 'Duaların en çok kabul olduğu kıymetli gün.', colorTheme: 'amber' },
    { date: '2025-06-06', name: 'Kurban Bayramı', description: 'Teslimiyet ve yakınlaşma bayramı.', isHoliday: true, colorTheme: 'rose' },
    { date: '2025-06-26', name: 'Hicri Yılbaşı', description: 'Yeni bir manevi yılın başlangıcı.', colorTheme: 'cyan' },
    { date: '2025-07-05', name: 'Aşure Günü', description: 'Tarihi olayların yaşandığı ibretli gün.', colorTheme: 'amber' },
    { date: '2025-09-03', name: 'Mevlid Kandili', description: 'Alemlere rahmet Peygamberimizin doğumu.', isKandil: true, colorTheme: 'violet' },

    // 2026
    {
        date: '2026-01-15',
        name: 'Miraç Kandili',
        description: 'Göğe yükseliş mucizesinin sene-i devriyesi.',
        longDescription: 'İsra ve Miraç mucizesi, Resulullah\'ın (s.a.v.) Mescid-i Haram\'dan Mescid-i Aksa\'ya, oradan da Semalara ve Sidretü\'l-Münteha\'ya yükseltildiği gecedir. Bu gece Ümmet-i Muhammed\'e üç büyük hediye verilmiştir: Beş vakit namaz, Bakara Suresi\'nin son iki ayeti (Amenerrasulü) ve şirk koşmayanların affedileceği müjdesi. Bu müstesna gece, müminin kendi miracı olan namaza sarılması ve manevi olarak yücelmesi için büyük bir fırsattır.',
        hadith: { text: 'Namaz dinin direğidir, kim onu ikame ederse dinini ayakta tutmuş olur.', source: 'Hadis-i Şerif' },
        worshipSuggestions: ['Miraç gecesi hususi namazı (12 rekat nafile namaz)', 'Salavat-ı Şerife okumak', 'Amenerrasulü tilaveti', 'Tevbe ve istiğfar yenilemek'],
        isKandil: true, colorTheme: 'violet'
    },
    {
        date: '2026-02-02',
        name: 'Berat Kandili',
        description: 'Af ve mağfiret kapılarının açıldığı gece.',
        longDescription: 'Şaban ayının 15. gecesi olan Berat gecesi; kulların günahlarından arınması, borçlardan kurtulması ve ilahi affa mazhar olması anlamına gelir. Rivayetlere göre bu gece, bir yıllık rızıklar, eceller ve önemli olaylar meleklere teslim edilir. Allah Teala bu gece rahmet nazarıyla bakar ve bağışlanmak isteyenleri mağfiret eder.',
        hadith: { text: 'Allah, Şaban ayının yarısı gecesinde (Berat gecesi) dünya semasına tecelli eder ve Kelb kabilesinin koyunlarının kılları sayısından daha çok kimseyi bağışlar.', source: 'Tirmizi' },
        worshipSuggestions: ['100 rekatlık Berat Gecesi namazı veya bolca kaza namazı', 'Gündüzünü oruçlu geçirmek', 'Duhan Suresini okumak', 'Bolca dua ve istiğfar etmek'],
        isKandil: true, colorTheme: 'amber'
    },
    {
        date: '2026-02-19',
        name: 'Ramazan Başlangıcı',
        description: 'Gönüllerin sultanı Ramazan ayının gelişi.',
        longDescription: 'Ramazan ayı, Kur\'an-ı Kerim\'in indirilmeye başlandığı, bin aydan daha hayırlı Kadir Gecesi\'ni barındıran mübarek bir aydır. Oruç ibadetinin farz kılındığı bu ay, sabrın, merhametin ve yardımlaşmanın zirveye ulaştığı bir mekteptir.',
        hadith: { text: 'Ramazan ayı girdiğinde cennet kapıları açılır, cehennem kapıları kapanır ve şeytanlar zincire vurulur.', source: 'Buhari, Müslim' },
        worshipSuggestions: ['Sahura kalkıp niyet etmek', 'Mukabele ile Kur\'an hatmine başlamak', 'Teravih namazlarına riayet etmek', 'Fıtır sadakası niyetlerini şimdiden yapmak'],
        colorTheme: 'emerald'
    },
    {
        date: '2026-03-16',
        name: 'Kadir Gecesi',
        description: 'Kur\'an\'ın kalplere indiği gece.',
        longDescription: 'Kur\'an-ı Kerim\'in Levh-i Mahfuz\'dan dünya semasına toptan, oradan da Peygamber Efendimize (s.a.v.) peyderpey inmeye başladığı gecedir. \n"Kadir gecesi bin aydan daha hayırlıdır." (Kadir Suresi, 3). Bu gece, yeryüzüne Cebrail (a.s.) ve arşın melekleri iner, tanyeri ağarıncaya kadar esenlik ve selamet hakim olur.',
        hadith: { text: 'Kim inanarak ve sevabını Allah\'tan bekleyerek Kadir Gecesi\'ni ihya ederse, geçmiş günahları affedilir.', source: 'Buhari' },
        worshipSuggestions: ['Kadir Gecesi Duası okumak ("Allahümme inneke afüvvün...")', 'Kadir Suresi\'ni okumak', 'Tesbih namazı kılmak', 'Geceyi tamamen uyanık ve zikirle geçirmek'],
        isKandil: true, colorTheme: 'emerald'
    },
    {
        date: '2026-03-20',
        name: 'Ramazan Bayramı',
        description: 'Ümmetin sevinç ve kucaklaşma günü.',
        longDescription: 'Bütün bir ay boyunca nefis tezkiyesi yapan, oruç tutan Müslümanların sevinç günüdür. Allah\'ın ikramına şükrün bir ifadesidir. Darılanların barıştığı, büyüklerin ziyaret edildiği, sadaka fıtır ile fakirlerin sevindirildiği mukaddes vakitlerdir.',
        hadith: { text: 'Bayram günleri sizin için yeme, içme ve Allah\'ı zikretme günleridir.', source: 'Müslim' },
        worshipSuggestions: ['Sabah erken kalkıp gusletmek ve güzel kokular sürünmek', 'Bayram namazına gitmeden önce tatlı bir şeyler yemek', 'Akrabayı ziyaret (Sıla-i rahim)', 'Yetimleri ve kimsesizleri sevindirmek'],
        isHoliday: true, colorTheme: 'rose'
    },
    {
        date: '2026-05-26',
        name: 'Arefe Günü',
        description: 'Hacılarla birlikte dua etme zamanı.',
        longDescription: 'Zilhicce ayının 9. günü Arefe günüdür. Hac ibadetinin en önemli rüknü olan Arafat vakfesi bugün yapılır. Arefe gününde tutulan oruç, geçmiş ve gelecek bir yıllık günahlara keffaret sayılmıştır.',
        hadith: { text: 'Arefe günü tutulan orucun, geçmiş bir yıl ve gelecek bir yılın günahlarına keffaret olacağını Allah\'ın rahmetinden umarım.', source: 'Müslim' },
        worshipSuggestions: ['Bin İhlas Suresi okumak', 'Oruçlu geçirmek', 'Arafat\'taki hacılar gibi gözyaşıyla dua etmek', 'Teşrik tekbirlerine sabah namazı itibarıyla başlamak'],
        colorTheme: 'amber'
    },
    {
        date: '2026-05-27',
        name: 'Kurban Bayramı',
        description: 'Allah\'a yakınlaşmanın sembolü kurban bayramı.',
        longDescription: 'İbrahim (a.s.) ve İsmail (a.s.) şahsında sembolleşen teslimiyet ve sadakatin bayramıdır. "Kurban" kelimesi yakınlaşmak demektir. Kesilen kurbanın kanı yere düşmeden Allah katında kabul olunduğu müjdelenmiştir.',
        hadith: { text: 'Ademoğlu Kurban bayramı gününde Allah indinde kan akıtmaktan (kurban kesmekten) daha sevimli bir amel işlememiştir.', source: 'Tirmizi' },
        worshipSuggestions: ['Kurban kesmek ve payını yoksullarla paylaşmak', 'Teşrik tekbirlerini (4 gün boyunca) aksatmamak', 'Bayram namazı kılmak', 'Küskünlükleri bitirmek'],
        isHoliday: true, colorTheme: 'rose'
    },
    {
        date: '2026-06-16',
        name: 'Hicri Yılbaşı',
        description: '1 Muharrem, yeni İslami yıl.',
        longDescription: 'Hicret; Hz. Muhammed (s.a.v.) ve ashabının Mekke\'den Medine\'ye göç edişidir. Medeniyet inşasının, sabrın, fedakarlığın ve yeni bir başlangıcın habercisi olan Muharrem ayının birinci günüdür. Tarih boyunca bu takvim kullanılmıştır.',
        hadith: { text: 'Ramazan orucundan sonra en faziletli oruç, Allah\'ın ayı olan Muharrem ayında tutulan oruçtur.', source: 'Müslim' },
        worshipSuggestions: ['Geçen yılın muhasebesini yapmak', 'Yeni yıla dua ve tövbe ile başlamak', 'Muharrem ayının ilk gününü oruçlu geçirmek'],
        colorTheme: 'cyan'
    },
    {
        date: '2026-06-25',
        name: 'Aşure Günü',
        description: 'Muharrem\'in 10. günü, hüzün ve imtihanların hatırlandığı gün.',
        longDescription: 'Tarihte birçok Peygamberin büyük felaketlerden kurtulduğu, Nuh\'un (a.s.) gemisinin tufandan selametle çıktığı, ancak Kerbela\'da Hz. Hüseyin ve Ehl-i Beyt\'in mazlumca şehit edildiği derin bir hüzün ve imtihan günüdür.',
        hadith: { text: 'Aşure günü tutulan orucun, geçmiş bir yıllık günaha keffaret olacağını Allah\'ın rahmetinden umarım.', source: 'Müslim' },
        worshipSuggestions: ['Aşure gününde ve öncesi/sonrası günle birlikte oruç tutmak (9-10 veya 10-11. gün)', 'Eve erzak alarak bereket duası etmek', 'Sadaka vermek', 'Kerbela şehitleri için Yasin Suresi okumak'],
        colorTheme: 'amber'
    },
    {
        date: '2026-08-24',
        name: 'Mevlid Kandili',
        description: 'En Sevgili\'nin doğum günü.',
        longDescription: 'Rebiülevvel ayının 12. gecesidir. İnsanlığı cehalet ve şirkin karanlığından, İslam\'ın aydınlık nurlarına ulaştıran Hatem-ül Enbiya Hz. Muhammed Mustafa\'nın (s.a.v.) dünyaya gelişinin kutlandığı şerefli bir gecedir.',
        hadith: { text: 'Kim bana bir defa salavat getirirse, Allah ona on defa merhamet (salat) eder.', source: 'Müslim' },
        worshipSuggestions: ['Peygamber Efendimizin (s.a.v.) hayatını (Siyer) okumak', 'Çokça Salavat-ı Şerife (Salat-ı Tefriciye, Salat-ı Münciye) getirmek', 'Yoksulları yedirmek', 'Kur\'an-ı Kerim tilaveti'],
        isKandil: true, colorTheme: 'violet'
    },
    {
        date: '2026-12-10',
        name: 'Regaip Kandili',
        description: 'Manevi iklimin habercisi.',
        longDescription: 'Regaip; rağbet edilen hediye, şefkat, bağış, hibe anlamına gelir. Kur\'an ve Oruç ayları olan Üç Ayların (Recep, Şaban, Ramazan) başlangıcıdır. Allah\'ın sınırsız lütfunun habercisidir.',
        hadith: { text: 'Allahım! Recep ve Şaban aylarını bizim için mübarek kıl ve bizi Ramazan ayına kavuştur.', source: 'Müsned' },
        worshipSuggestions: ['Üç aylara hazırlık olarak kaza namazı', 'Recep ayına hürmeten oruç', 'İstiğfarı çoğaltmak'],
        isKandil: true, colorTheme: 'cyan'
    }
];

export const ReligiousDaysService = {
    getAllDays: () => {
        return RELIGIOUS_DAYS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },

    getUpcomingDays: (limit: number = 5): ReligiousDay[] => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return RELIGIOUS_DAYS
            .filter(day => new Date(day.date) >= today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, limit);
    },

    getTodayEvent: (): ReligiousDay | undefined => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        return RELIGIOUS_DAYS.find(day => day.date === todayStr);
    },

    getDaysUntil: (dateStr: string): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);

        const diffTime = target.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};
