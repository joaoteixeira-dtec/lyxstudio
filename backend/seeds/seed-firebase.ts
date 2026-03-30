import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function seed() {
  console.log('🌱 Seeding Firebase...');

  // Settings (single document)
  await db.collection('settings').doc('main').set({
    name: 'Vanguard — Alojamento em Cabanas de Tavira',
    tagline: 'Dormir com a história, acordar com a natureza.',
    address: 'Beco Vasco da Gama, nº 1, 8800-595 Cabanas de Tavira',
    price_per_night: '350',
    price_note: 'A confirmar — preço indicativo para T4 completo',
    typology: 'T4 — 4 quartos (duplos e simples), todos com casa de banho privativa',
    typology_note: 'Distribuição exata de quartos duplos/simples a confirmar',
    email: 'info@vanguard-cabanas.pt',
    phone: '+351 000 000 000',
    coordinates_lat: '37.1275',
    coordinates_lng: '-7.5983',
  });
  console.log('  ✅ Settings criadas');

  // Admin user
  const hash = await bcrypt.hash('admin123', 12);
  const adminsSnap = await db.collection('admins').where('email', '==', 'admin@vanguard.pt').get();
  if (adminsSnap.empty) {
    await db.collection('admins').add({
      email: 'admin@vanguard.pt',
      password_hash: hash,
      created_at: new Date().toISOString(),
    });
    console.log('  ✅ Admin criado (admin@vanguard.pt / admin123)');
  } else {
    console.log('  ⏭️  Admin já existe, saltando...');
  }

  console.log('🎉 Seed concluído!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
