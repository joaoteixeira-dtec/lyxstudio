import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const names = [
  'Ana Silva', 'João Ferreira', 'Maria Costa', 'Pedro Santos', 'Sofia Oliveira',
  'Ricardo Almeida', 'Inês Rodrigues', 'Miguel Pereira', 'Beatriz Martins', 'Tiago Sousa',
  'Carolina Gomes', 'André Lopes', 'Mariana Fernandes', 'Diogo Ribeiro', 'Leonor Carvalho',
  'Rui Monteiro', 'Catarina Dias', 'Filipe Mendes', 'Sara Nunes', 'Bruno Teixeira',
  'Marta Correia', 'Hugo Vieira', 'Daniela Pinto', 'Nuno Moreira', 'Raquel Cardoso',
  'Paulo Araújo', 'Cláudia Machado', 'Gonçalo Reis', 'Patrícia Alves', 'Luís Marques',
];

const statuses: Array<'pending' | 'confirmed' | 'cancelled'> = ['pending', 'confirmed', 'cancelled'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function seedBookings() {
  console.log('🌱 Seeding 30 test bookings (last 3 months)...');

  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const batch = db.batch();

  for (let i = 0; i < 30; i++) {
    const name = names[i];
    const email = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '.') + '@email.com';
    const phone = `9${randomInt(10000000, 99999999)}`;
    const guests = randomInt(1, 6);

    // Random check_in within the last 3 months
    const daysRange = Math.floor((now.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
    const daysOffset = randomInt(0, daysRange);
    const checkIn = new Date(threeMonthsAgo);
    checkIn.setDate(checkIn.getDate() + daysOffset);

    // Stay 1-3 days
    const stayDuration = randomInt(1, 3);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + stayDuration);

    // Created 1-7 days before check_in
    const createdAt = new Date(checkIn);
    createdAt.setDate(createdAt.getDate() - randomInt(1, 7));

    // Weight statuses: mostly confirmed, some pending (recent), some cancelled
    let status: string;
    if (checkIn < now) {
      // Past bookings: 70% confirmed, 20% cancelled, 10% pending
      const r = Math.random();
      status = r < 0.7 ? 'confirmed' : r < 0.9 ? 'cancelled' : 'pending';
    } else {
      // Future bookings: 50% pending, 40% confirmed, 10% cancelled
      const r = Math.random();
      status = r < 0.5 ? 'pending' : r < 0.9 ? 'confirmed' : 'cancelled';
    }

    const notes = i % 4 === 0 ? 'Sessão especial' : i % 3 === 0 ? 'Primeira visita' : '';

    const docRef = db.collection('bookings').doc();
    batch.set(docRef, {
      check_in: formatDate(checkIn),
      check_out: formatDate(checkOut),
      guests,
      name,
      email,
      phone,
      notes,
      status,
      created_at: createdAt.toISOString(),
    });

    console.log(`  ${String(i + 1).padStart(2, '0')}. ${name} | ${formatDate(checkIn)} → ${formatDate(checkOut)} | ${status}`);
  }

  await batch.commit();
  console.log('\n🎉 30 reservas de teste criadas!');
  process.exit(0);
}

seedBookings().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
