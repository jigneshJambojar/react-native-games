// Word lists organized by category and difficulty level
export const CATEGORIES = {
  Painters: {
    name: 'Painters',
    displayName: 'Painters',
    image: require('../../assets/cat/Painters.png'),
    difficulties: {
      easy: ['homer', 'kahlo', 'munch', 'picasso', 'raphael', 'renoir', 'rubens', 'titan', 'vermeer', 'warhol'],
      medium: ['blake', 'cassatt', 'cezanne', 'davinci', 'dali', 'degas', 'durer', 'eakins', 'hopper', 'klimt', 'leger', 'mondrian', 'rembrandt', 'velazquez', 'vermeer'],
      hard: ['botticelli', 'caravaggio', 'constable', 'delacroix', 'gauguin', 'holbein', 'manet', 'matisse', 'michelangelo', 'modigliani', 'pollock', 'poussin', 'raphael', 'rothko', 'tintoretto', 'titian', 'turner', 'vangogh']
    }
  },
  Bible: {
    name: 'Bible',
    displayName: 'Bible',
    image: require('../../assets/cat/Bible.png'),
    difficulties: {
      easy: ['adam', 'david', 'eve', 'jesus', 'john', 'luke', 'mark', 'mary', 'moses', 'paul'],
      medium: ['abraham', 'daniel', 'esther', 'genesis', 'isaiah', 'jacob', 'jonah', 'joseph', 'joshua', 'matthew', 'noah', 'peter', 'revelation', 'ruth', 'samuel'],
      hard: ['corinthians', 'deuteronomy', 'ecclesiastes', 'ephesians', 'ezekiel', 'galatians', 'habakkuk', 'jeremiah', 'leviticus', 'malachi', 'nehemiah', 'obadiah', 'philippians', 'thessalonians', 'zechariah']
    }
  },
  Internet: {
    name: 'Internet',
    displayName: 'Internet',
    image: require('../../assets/cat/Internet.png'),
    difficulties: {
      easy: ['blog', 'chat', 'email', 'link', 'post', 'search', 'tweet', 'video', 'virus', 'wifi'],
      medium: ['browser', 'cookie', 'domain', 'firewall', 'hashtag', 'html', 'network', 'password', 'podcast', 'router', 'server', 'spam', 'streaming', 'upload', 'website'],
      hard: ['bandwidth', 'broadband', 'cryptocurrency', 'cybersecurity', 'encryption', 'ethernet', 'javascript', 'malware', 'phishing', 'protocol', 'resolution', 'smartphone', 'software', 'streaming', 'wireless']
    }
  },
  CardGames: {
    name: 'CardGames',
    displayName: 'Cards',
    image: require('../../assets/cat/CardGames.png'),
    difficulties: {
      easy: ['bridge', 'gin', 'hearts', 'poker', 'rummy', 'snap', 'spit', 'uno', 'war', 'whist'],
      medium: ['baccarat', 'blackjack', 'canasta', 'cribbage', 'euchre', 'pinochle', 'rook', 'solitaire', 'spades', 'tarot'],
      hard: ['bezique', 'cassino', 'concentration', 'cutthroat', 'klondike', 'napoleon', 'patience', 'piquet', 'president', 'sheepshead']
    }
  },
  Asia: {
    name: 'Asia',
    displayName: 'Asia Map',
    image: require('../../assets/cat/Asia.png'),
    difficulties: {
      easy: ['china', 'india', 'iran', 'iraq', 'japan', 'korea', 'nepal', 'qatar', 'syria', 'yemen'],
      medium: ['armenia', 'bahrain', 'bhutan', 'brunei', 'cambodia', 'georgia', 'jordan', 'kuwait', 'laos', 'lebanon', 'malaysia', 'maldives', 'mongolia', 'myanmar', 'oman', 'pakistan', 'thailand', 'vietnam'],
      hard: ['afghanistan', 'azerbaijan', 'bangladesh', 'indonesia', 'kazakhstan', 'kyrgyzstan', 'philippines', 'singapore', 'srilanka', 'tajikistan', 'timor', 'turkmenistan', 'uzbekistan']
    }
  },
  Artists: {
    name: 'Artists',
    displayName: 'Artists',
    image: require('../../assets/cat/Artists.png'),
    difficulties: {
      easy: ['bach', 'bowie', 'drake', 'elvis', 'lennon', 'madonna', 'prince', 'queen', 'swift', 'tupac'],
      medium: ['adele', 'beatles', 'beyonce', 'bieber', 'clapton', 'cobain', 'dylan', 'eminem', 'hendrix', 'jackson', 'marley', 'mercury', 'presley', 'rihanna', 'sinatra'],
      hard: ['aretha', 'armstrong', 'cashmore', 'fitzgerald', 'gershwin', 'grateful', 'joplin', 'led', 'mitchell', 'nirvana', 'radiohead', 'springsteen', 'stones', 'velvet', 'wonder']
    }
  },
  Composers: {
    name: 'Composers',
    displayName: 'Composers',
    image: require('../../assets/cat/Composers.png'),
    difficulties: {
      easy: ['bach', 'bizet', 'brahms', 'chopin', 'handel', 'haydn', 'liszt', 'mozart', 'verdi', 'vivaldi'],
      medium: ['bartok', 'beethoven', 'berlioz', 'debussy', 'dvorak', 'elgar', 'grieg', 'mahler', 'puccini', 'ravel', 'rossini', 'schubert', 'schumann', 'strauss', 'wagner'],
      hard: ['bruckner', 'glazunov', 'hindemith', 'mendelssohn', 'messiaen', 'mussorgsky', 'prokofiev', 'rachmaninoff', 'respighi', 'scriabin', 'shostakovich', 'sibelius', 'stravinsky', 'tchaikovsky', 'vaughan']
    }
  },
  EuroCapitals: {
    name: 'EuroCapitals',
    displayName: 'Euro Geo',
    image: require('../../assets/cat/EuroCapitals.png'),
    difficulties: {
      easy: ['athens', 'berlin', 'bern', 'dublin', 'lisbon', 'london', 'madrid', 'paris', 'rome', 'vienna'],
      medium: ['amsterdam', 'belgrade', 'brussels', 'bucharest', 'budapest', 'copenhagen', 'helsinki', 'oslo', 'prague', 'sofia', 'stockholm', 'tallinn', 'vilnius', 'warsaw', 'zagreb'],
      hard: ['bratislava', 'chisinau', 'ljubljana', 'luxembourg', 'minsk', 'monaco', 'nicosia', 'podgorica', 'reykjavik', 'riga', 'sarajevo', 'skopje', 'tirana', 'vaduz', 'valletta']
    }
  },
  Occupations: {
    name: 'Occupations',
    displayName: 'Occupations',
    image: require('../../assets/cat/Occupations.png'),
    difficulties: {
      easy: ['baker', 'chef', 'clerk', 'cook', 'doctor', 'farmer', 'judge', 'lawyer', 'nurse', 'teacher'],
      medium: ['accountant', 'architect', 'artist', 'banker', 'barber', 'butcher', 'carpenter', 'dentist', 'engineer', 'gardener', 'mechanic', 'painter', 'plumber', 'scientist', 'surgeon'],
      hard: ['anesthetist', 'archaeologist', 'astronaut', 'biologist', 'chiropractor', 'conductor', 'electrician', 'geologist', 'journalist', 'librarian', 'optometrist', 'pharmacist', 'psychiatrist', 'technician', 'veterinarian']
    }
  },
  Whales: {
    name: 'Whales',
    displayName: 'Whales',
    image: require('../../assets/cat/Whales.png'),
    difficulties: {
      easy: ['beluga', 'blue', 'fin', 'gray', 'humpback', 'killer', 'pilot', 'right', 'sei', 'sperm'],
      medium: ['baleen', 'bottlenose', 'bowhead', 'bryde', 'false', 'minke', 'narwhal', 'orca', 'pygmy', 'southern'],
      hard: ['antarctic', 'arnoux', 'atlantic', 'beaked', 'blainville', 'bottlenose', 'cuvier', 'gervais', 'ginkgo', 'gray', 'hubbs', 'longman', 'mesoplodon', 'pacific', 'perrin', 'pygmy', 'shepherd', 'sowerby', 'spade', 'stejneger', 'strap', 'true']
    }
  }
};

export const DIFFICULTY_LABELS = {
  easy: '(Easy)',
  medium: '(Medium)',
  hard: '(Hard)'
};

export const GRID_SIZES = {
  easy: 10,
  medium: 12,
  hard: 15
};

export const getCategoryList = () => {
  return Object.keys(CATEGORIES).map(key => ({
    id: key,
    name: CATEGORIES[key].displayName,
    difficulties: Object.keys(CATEGORIES[key].difficulties),
    image: CATEGORIES[key].image
  }));
};

export const getWordsForCategory = (categoryId, difficulty) => {
  const category = CATEGORIES[categoryId];
  if (!category) return [];
  return category.difficulties[difficulty] || [];
};
