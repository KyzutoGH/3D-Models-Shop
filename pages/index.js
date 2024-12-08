import Layout from '../components/components';
import Footer from '../components/footer';

const products = [
  {
    id: 1,
    name: 'Porsche',
    href: '#',
    price: '127000',
    imageSrc: '/img/car.jpg',
    imageAlt: 'kjfsfkgjk',
  },
  {
    id: 2,
    name: 'Helm Robot',
    href: '#',
    price: '190000',
    imageSrc: '/img/helm_2.png',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Storage Car Modern',
    href: '#',
    price: '47500',
    imageSrc: '/img/gudang.jpeg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Helm Robot Natural Colours',
    href: '#',
    price: '190000',
    imageSrc: '/img/helm.png',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 5,
    name: 'Shark',
    href: '#',
    price: '270000',
    imageSrc: '/img/hiu.png',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 6,
    name: 'Shark Teeth',
    href: '#',
    price: '240000',
    imageSrc: '/img/shark_meme.png',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id:7,
    name: 'Lego Person',
    href: '#',
    price: '300000',
    imageSrc: '/img/lego_person.png',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id:8,
    name: 'Lego Width Gestur',
    href: '#',
    price: '310000',
    imageSrc: '/img/lego_postur.png',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  }
  // More products...
];

const HomePage=() => {
  return (
    <>
    <Layout>
    <div className="bg-orange-300">
      <div className="mx-auto max-w2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 ">
        <div className='flex items-stretch justify-center h-12 mb-10'>
        <h2 className="not-sr-only font-semibold text-3xl text-slate-800">Products</h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products
            .filter(
              (product, index, self) =>
                index === self.findIndex((p) => p.id === product.id) // Menghapus duplikat
            )
            .map((product) => (
              <a key={product.id} href={product.href} className="group">
                <img
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  Rp {product.price},00
                </p>
              </a>
            ))}
        </div>
      </div>
    </div>
    </Layout>
    <Footer />
    </>
  );
};
export default HomePage;