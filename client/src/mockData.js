// High quality demo data for offline / standalone preview & local development
export const DEMO_MOVIES = [
  {
    _id: 'mov-1',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    durationMins: 166,
    certificate: 'UA',
    score: 8.8,
    status: 'now_showing',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Florence Pugh'],
    releaseDate: '2024-03-01T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    youtubeId: 'Way9Dexny3w',
    formats: ['IMAX 3D', 'Dolby Atmos', '4DX', '2D'],
    theme: { from: '#e07a38', to: '#1b0d05', accent: '#ffae52' },
  },
  {
    _id: 'mov-2',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the profound moral, scientific and political consequences of mankind’s deadliest weapon.',
    genres: ['Biography', 'Drama', 'History'],
    language: 'English',
    durationMins: 180,
    certificate: 'A',
    score: 8.9,
    status: 'now_showing',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    releaseDate: '2023-07-21T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    youtubeId: 'uYPbbksJxIg',
    formats: ['IMAX 70mm', 'Dolby Atmos', 'Laser 4K'],
    theme: { from: '#b94719', to: '#170b06', accent: '#ff893b' },
  },
  {
    _id: 'mov-3',
    title: 'Interstellar: IMAX Re-Release',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    durationMins: 169,
    certificate: 'UA',
    score: 9.0,
    status: 'now_showing',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    releaseDate: '2014-11-07T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    youtubeId: 'zSWdZVtXT7E',
    formats: ['IMAX Laser', 'Dolby Cinema'],
    theme: { from: '#204369', to: '#060a12', accent: '#60afff' },
  },
  {
    _id: 'mov-4',
    title: 'Kalki 2898 AD',
    tagline: 'The end has begun. The avatar arrives.',
    description: 'Set in a post-apocalyptic world in the year 2898 AD, a modern avatar of Vishnu is believed to have descended to Earth to protect the world from evil forces in a high-octane sci-fi mythic spectacle.',
    genres: ['Sci-Fi', 'Action', 'Fantasy'],
    language: 'Hindi',
    durationMins: 181,
    certificate: 'UA',
    score: 8.2,
    status: 'now_showing',
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone', 'Disha Patani'],
    releaseDate: '2024-06-27T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=y1-w1BX2qc8',
    youtubeId: 'y1-w1BX2qc8',
    formats: ['3D', 'IMAX 3D', '4DX', '2D'],
    theme: { from: '#825a1e', to: '#150d03', accent: '#e8b86d' },
  },
  {
    _id: 'mov-5',
    title: 'Deadpool & Wolverine',
    tagline: 'Come together.',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his home world faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    language: 'English',
    durationMins: 128,
    certificate: 'A',
    score: 8.3,
    status: 'now_showing',
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Morena Baccarin'],
    releaseDate: '2024-07-26T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    youtubeId: '73_1biulkYk',
    formats: ['IMAX 3D', '4DX', '2D'],
    theme: { from: '#b51929', to: '#170407', accent: '#f5c518' },
  },
  {
    _id: 'mov-6',
    title: 'Jawan: Final Cut',
    tagline: 'Ready to strike.',
    description: 'A high-octane action thriller which outlines the emotional journey of a man who is set out to rectify the wrongs in the society. A tale of fatherhood, revenge and patriotism.',
    genres: ['Action', 'Thriller'],
    language: 'Hindi',
    durationMins: 169,
    certificate: 'UA',
    score: 8.1,
    status: 'now_showing',
    director: 'Atlee',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
    releaseDate: '2023-09-07T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=MWOlnZSnXpc',
    youtubeId: 'MWOlnZSnXpc',
    formats: ['Dolby Atmos', 'IMAX 2D', '4DX'],
    theme: { from: '#7b1928', to: '#130407', accent: '#e84558' },
  },
  {
    _id: 'mov-7',
    title: 'Spider-Man: Beyond the Spider-Verse',
    tagline: 'Every universe needs its hero.',
    description: 'Miles Morales catapults across the Multiverse, joining forces with Gwen Stacy and a new team of Spider-People to face off with a villain more powerful than anything they have ever encountered.',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    language: 'English',
    durationMins: 140,
    certificate: 'UA',
    score: 8.7,
    status: 'upcoming',
    director: 'Joaquim Dos Santos',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    releaseDate: '2025-06-20T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    youtubeId: 'cqGjhVJWtEg',
    formats: ['IMAX 3D', 'Dolby Cinema'],
    theme: { from: '#a12368', to: '#120521', accent: '#00e5ff' },
  },
  {
    _id: 'mov-8',
    title: 'Avatar: Fire and Ash',
    tagline: 'Return to Pandora.',
    description: 'Jake Sully and Neytiri encounter a aggressive and fire-oriented Na\'vi tribe called the Ash People, who inhabit the volcanic regions of Pandora.',
    genres: ['Sci-Fi', 'Adventure', 'Fantasy'],
    language: 'English',
    durationMins: 190,
    certificate: 'UA',
    score: 0,
    status: 'upcoming',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Oona Chaplin'],
    releaseDate: '2025-12-19T00:00:00.000Z',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    youtubeId: 'd9MyW72ELq0',
    formats: ['IMAX 3D HFR', 'Dolby 3D'],
    theme: { from: '#0f707f', to: '#05191c', accent: '#38e1ff' },
  },
];

export const DEMO_THEATRES = [
  {
    _id: 'th-1',
    name: 'PVR ICON: Phoenix Palladium',
    city: 'Mumbai',
    address: 'High Street Phoenix, Lower Parel',
    screens: ['IMAX Laser', 'Audi 2 (Dolby Atmos)', 'Gold Class'],
    facilities: ['Parking', 'Food Lounge', 'Wheelchair Access', 'M-Ticket'],
  },
  {
    _id: 'th-2',
    name: 'INOX Megaplex: Inorbit Mall',
    city: 'Mumbai',
    address: 'Link Road, Malad West',
    screens: ['ScreenX', 'INSIGNIA VIP', 'Audi 4'],
    facilities: ['Parking', 'Gourmet Food', 'Recliner', 'M-Ticket'],
  },
  {
    _id: 'th-3',
    name: 'PVR Director\'s Cut: Ambience Mall',
    city: 'Delhi-NCR',
    address: 'NH-8, Ambience Island, Gurugram',
    screens: ['Platinum Lounge', 'Audi 1 Atmos'],
    facilities: ['Valet Parking', 'Fine Dining', 'Luxury Butler', 'M-Ticket'],
  },
  {
    _id: 'th-4',
    name: 'PVR Superplex: Forum South',
    city: 'Bengaluru',
    address: 'Konanakunte Cross, Kanakapura Rd',
    screens: ['IMAX with Laser', '4DX', 'Audi 3'],
    facilities: ['Parking', 'Food Court', 'Wheelchair Access', 'M-Ticket'],
  },
  {
    _id: 'th-5',
    name: 'Prasad\'s Multiplex & IMAX',
    city: 'Hyderabad',
    address: 'NTR Gardens, Khairatabad',
    screens: ['Large Screen IMAX', 'Audi 2 Dolby Atmos'],
    facilities: ['Parking', 'Gaming Zone', 'M-Ticket'],
  },
  {
    _id: 'th-6',
    name: 'Cinepolis VIP: Seasons Mall',
    city: 'Pune',
    address: 'Magarpatta City, Hadapsar',
    screens: ['VIP Recliner 1', 'Audi 3 Atmos'],
    facilities: ['Parking', 'Recliner Seats', 'Gourmet Menu', 'M-Ticket'],
  },
];

export const DEMO_CITIES = ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Kolkata'];
export const DEMO_GENRES = ['Action', 'Sci-Fi', 'Adventure', 'Drama', 'Thriller', 'Comedy', 'Animation', 'Biography'];
export const DEMO_LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu'];

export function generateDemoShows(movieId, dateStr, city) {
  const movie = DEMO_MOVIES.find((m) => m._id === movieId) || DEMO_MOVIES[0];
  const targetTheatres = DEMO_THEATRES.filter((t) => !city || t.city.toLowerCase() === city.toLowerCase());
  const theatresToUse = targetTheatres.length ? targetTheatres : DEMO_THEATRES.slice(0, 3);

  const times = ['10:30', '13:45', '17:15', '20:30', '22:45'];
  const shows = [];

  theatresToUse.forEach((th, tIdx) => {
    times.forEach((time, idx) => {
      // Pick 3-4 shows per theatre
      if ((tIdx + idx) % 2 === 0) {
        const [hh, mm] = time.split(':');
        const showDate = dateStr ? new Date(dateStr) : new Date();
        showDate.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);

        const screenName = th.screens[idx % th.screens.length];
        const isImax = screenName.includes('IMAX');
        const isVip = screenName.includes('Gold') || screenName.includes('VIP') || screenName.includes('INSIGNIA');

        shows.push({
          _id: `show-${movie._id}-${th._id}-${idx}`,
          movie: movie._id,
          theatre: th,
          screenName,
          format: isImax ? 'IMAX 3D' : isVip ? 'VIP Recliner' : 'Dolby Atmos 2D',
          language: movie.language,
          startTime: showDate.toISOString(),
          pricing: {
            standard: isImax ? 380 : 220,
            premium: isImax ? 480 : 320,
            recliner: isImax ? 750 : 550,
          },
          status: idx === 3 ? 'filling_fast' : idx === 4 ? 'available' : 'available',
        });
      }
    });
  });

  return shows;
}

export function generateDemoSeats(showId) {
  const rows = [
    { row: 'A', tier: 'recliner', price: 650, count: 8 },
    { row: 'B', tier: 'recliner', price: 650, count: 8 },
    { row: 'C', tier: 'premium', price: 380, count: 12 },
    { row: 'D', tier: 'premium', price: 380, count: 12 },
    { row: 'E', tier: 'premium', price: 380, count: 12 },
    { row: 'F', tier: 'standard', price: 260, count: 14 },
    { row: 'G', tier: 'standard', price: 260, count: 14 },
    { row: 'H', tier: 'standard', price: 260, count: 14 },
  ];

  const seats = [];
  rows.forEach(({ row, tier, price, count }) => {
    for (let i = 1; i <= count; i++) {
      const isBooked = (row.charCodeAt(0) * 7 + i * 13) % 5 === 0;
      seats.push({
        _id: `seat-${showId}-${row}${i}`,
        show: showId,
        row,
        number: i,
        label: `${row}${i}`,
        tier,
        price,
        status: isBooked ? 'booked' : 'available',
        mine: false,
      });
    }
  });

  return seats;
}
