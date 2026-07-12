/* ============================================================
   LOOMÉ — Ürün kataloğu ve site verileri
   Şimdilik tek ürün satılıyor: Yüzen Kupa.
   Fiyat, açıklama ve görselleri buradan düzenleyebilirsiniz.
   Yeni ürün eklemek için products listesine nesne ekleyin,
   görselini assets/img/products/ klasörüne koyun.
   ============================================================ */

window.LOOME = {

  config: {
    freeShippingThreshold: 500,
    shippingFee: 90,
    promoCodes: { LOOME10: 0.10, HOSGELDIN: 0.15 },
    currency: '₺',
  },

  collections: [
    {
      id: 'dekor',
      name: 'Dekor',
      tagline: 'Evinize karakter katan objeler',
      img: 'assets/img/products/yuzen-kupa.png',
    },
  ],

  products: [
    {
      id: 'yuzen-kupa',
      name: 'Yüzen Kupa',
      subtitle: 'Dökülen Kahve Dekoratif Objesi',
      cat: 'dekor',
      price: 549,
      oldPrice: 649,
      img: 'assets/img/products/yuzen-kupa.png',
      alt: 'assets/img/products/yuzen-kupa-detay.png',
      badge: 'Lansmana Özel',
      rating: 4.9,
      reviews: 27,
      featured: true,
      desc: 'Bir anın içinde donmuş gibi: Yüzen Kupa, havada asılı duran kupasından dökülen kahvesiyle fizik kurallarına meydan okur. Sıçramanın içinde gizlenen destek sayesinde kupa gerçekten havada durur; çalışma masanıza, kitaplığınıza veya kahve köşenize koleksiyonluk bir karakter katar. Her parça tek tek elde rötuşlanır.',
      details: [
        'Yükseklik yaklaşık 25 cm, taban çapı yaklaşık 15 cm',
        'Hafif ve dayanıklı gövde, mat el boyaması yüzey',
        'Sıçramanın içine gizlenmiş destek — kupa gerçekten havada asılı görünür',
        'Şık hediye kutusunda, darbe emici ambalajla gönderilir',
      ],
      care: 'Kuru veya hafif nemli, yumuşak bir bezle silerek temizleyin. Suya batırmayın, çözücü ve aşındırıcı temizleyicilerden uzak tutun. Doğrudan güneş ışığı altında uzun süre bırakmayın; renklerin canlılığı korunur.',
      gallery: [
        'assets/img/products/yuzen-kupa.png',
        'assets/img/products/yuzen-kupa-detay.png',
        'assets/img/products/yuzen-kupa-sahne.png',
      ],
    },
  ],

  testimonials: [
    {
      quote: 'Çalışma masama koyduğumdan beri odaya giren herkes önce ona bakıyor, sonra “Bu nasıl havada duruyor?” diye soruyor. Sohbet başlatıcı bir obje arıyorsanız tam olarak bu.',
      name: 'Elif K.',
      title: 'İstanbul',
    },
    {
      quote: 'Kahve tutkunu bir arkadaşıma hediye ettim; kutusundan çıkardığı andaki yüz ifadesine değdi. Paketleme de en az ürün kadar özenliydi.',
      name: 'Selin A.',
      title: 'İzmir',
    },
    {
      quote: 'Fotoğraflarda güzel görünüyordu ama elime alınca işçiliğine hayran kaldım. Boyaması çok temiz, dengesi kusursuz. Kahve köşemin yıldızı oldu.',
      name: 'Deniz Y.',
      title: 'Ankara',
    },
  ],
};
