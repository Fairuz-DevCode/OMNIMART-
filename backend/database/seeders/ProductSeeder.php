<?php

namespace Database\Seeders;

use App\Features\Product\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds with accurate, verified, and high-resolution Unsplash product images.
     */
    public function run(): void
    {
        $products = [
            [
                'id' => 1,
                'name' => 'Paus Biru - Kursi Lipat Camping Portable Outdoor',
                'category' => 'Outdoor',
                'price' => 89000,
                'old_price' => 240000,
                'rating' => 4.9,
                'reviews_count' => 1250,
                'image_url' => 'https://images.unsplash.com/photo-1596162954151-cdcb4c0f70a8?q=80&w=800&auto=format&fit=crop',
                'badge' => '150KG KAPASITAS BEBAN',
                'description' => 'Kursi lipat camping portable super kokoh beban max 150kg dengan rangka baja tebal dan kain oxford berkualitas tinggi, mudah dilipat untuk bersantai di alam terbuka.',
                'is_popular' => true,
            ],
            [
                'id' => 2,
                'name' => 'Smart Watch AMOLED Screen Water Resistant',
                'category' => 'Electronics',
                'price' => 149000,
                'old_price' => 350000,
                'rating' => 4.8,
                'reviews_count' => 840,
                'image_url' => 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
                'badge' => 'SUPER BRAND DAY',
                'description' => 'Jam tangan pintar layar sentuh HD AMOLED jernih, tahan air, dilengkapi sensor detak jantung 24/7 dan pelacak aktivitas olahraga lengkap.',
                'is_popular' => true,
            ],
            [
                'id' => 3,
                'name' => 'Headphone Wireless Active Noise Cancelling',
                'category' => 'Electronics',
                'price' => 299000,
                'old_price' => 599000,
                'rating' => 4.9,
                'reviews_count' => 2310,
                'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
                'badge' => 'MALL ORI',
                'description' => 'Headphone nirkabel Bluetooth premium dengan isolasi suara aktif (ANC), bass mendalam, bantalan telinga lembut, dan daya tahan baterai hingga 30 jam.',
                'is_popular' => true,
            ],
            [
                'id' => 4,
                'name' => 'Tenda Camping Dome Waterproof 4 Orang',
                'category' => 'Outdoor',
                'price' => 215000,
                'old_price' => 450000,
                'rating' => 4.7,
                'reviews_count' => 410,
                'image_url' => 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop',
                'badge' => 'BESTSELLER',
                'description' => 'Tenda dome camping otomatis anti air berlapis ganda kapasitas 4 orang, ventilasi sejuk, dan pasang instan hanya dalam 3 menit.',
                'is_popular' => false,
            ],
            [
                'id' => 5,
                'name' => 'Jaket Waterproof Windbreaker Tactical Outdoor',
                'category' => 'Fashion',
                'price' => 175000,
                'old_price' => 320000,
                'rating' => 4.8,
                'reviews_count' => 620,
                'image_url' => 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
                'badge' => 'DISKON 45%',
                'description' => 'Jaket gunung outdoor windproof dan tahan air hujan gerimis, desain maskulin tactical, tudung kepala dapat disesuaikan, dan sirkulasi udara optimal.',
                'is_popular' => false,
            ],
            [
                'id' => 6,
                'name' => 'Sepatu Running Lightweight Breathable',
                'category' => 'Fashion',
                'price' => 249000,
                'old_price' => 499000,
                'rating' => 4.9,
                'reviews_count' => 950,
                'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
                'badge' => 'HOT ITEM',
                'description' => 'Sepatu lari sol karet fleksibel peredam kejut dengan rajutan upper breathable agar kaki tetap sejuk saat berolahraga dan bepergian harian.',
                'is_popular' => true,
            ],
            [
                'id' => 7,
                'name' => 'Backpack Tactical Outdoor 45L Waterproof',
                'category' => 'Outdoor',
                'price' => 185000,
                'old_price' => 370000,
                'rating' => 4.8,
                'reviews_count' => 530,
                'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
                'badge' => 'KAPASITAS BESAR',
                'description' => 'Tas ransel carrier gunung 45 liter multifungsi dengan sistem bantalan punggung ergonomis, tali dada pengunci, dan bahan cordura tahan gesekan.',
                'is_popular' => true,
            ],
            [
                'id' => 8,
                'name' => 'Kamera Instan Polaroid Vintage Retro',
                'category' => 'Electronics',
                'price' => 899000,
                'old_price' => 1250000,
                'rating' => 4.9,
                'reviews_count' => 720,
                'image_url' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop',
                'badge' => 'GARANSI RESMI',
                'description' => 'Kamera polaroid analog cetak instan warna retro klasik dengan flash otomatis dan lensa fokus presisi untuk kenangan foto tak terlupakan.',
                'is_popular' => true,
            ],
            [
                'id' => 9,
                'name' => 'Kacamata Hitam Polarized UV400 Protection',
                'category' => 'Fashion',
                'price' => 79000,
                'old_price' => 180000,
                'rating' => 4.7,
                'reviews_count' => 1100,
                'image_url' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
                'badge' => 'ANTI SILAU',
                'description' => 'Kacamata hitam anti silau dengan lensa polarized UV400 pelindung mata dari terik matahari pantai dan kenyamanan berkendara siang hari.',
                'is_popular' => false,
            ],
            [
                'id' => 10,
                'name' => 'Botol Minum Termos Stainless Steel 1000ml',
                'category' => 'Outdoor',
                'price' => 95000,
                'old_price' => 190000,
                'rating' => 4.9,
                'reviews_count' => 1430,
                'image_url' => 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
                'badge' => 'TAHAN 24 JAM',
                'description' => 'Tumbler termos travel stainless steel food grade 304 berdinding ganda, menjaga suhu dingin es hingga 24 jam dan air panas hingga 12 jam.',
                'is_popular' => true,
            ],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate(
                ['id' => $data['id']],
                $data
            );
        }
    }
}
