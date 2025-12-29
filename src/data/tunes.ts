export type FormType =
  | '32-bar'
  | 'AABA'
  | 'ABAC'
  | 'modal'
  | 'non-functional'
  | 'blues'
  | 'ballad';

export type HarmonicLogicType =
  | 'functional'
  | 'long sections'
  | 'fast changes'
  | 'modal'
  | 'chromatic';

export type TempoPressureType = 'slow' | 'medium' | 'fast' | 'rubato-ish';

export type StyleType =
  | 'swing'
  | 'post-bop'
  | 'Monk'
  | 'bossa nova'
  | 'ballad'
  | 'bebop'
  | 'cool jazz';

export type DifficultyLevel = 'entry' | 'intermediate' | 'professional';

export type FamiliarityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface RecommendedRecording {
  artist: string;
  album?: string;
  year?: number;
  label?: string;
  youtubeUrl?: string;
}

export interface Tune {
  id: string;
  title: string;
  composer?: string;
  year?: number;
  // Practice categorization
  form: FormType;
  harmonicLogic: HarmonicLogicType;
  tempoPressure: TempoPressureType;
  style: StyleType;
  // Practice metadata
  difficulty: DifficultyLevel;
  familiarity?: FamiliarityLevel;
  // Additional information from Ted Gioia's "The Jazz Standards"
  description?: string;
  recommendedListening?: RecommendedRecording[];
  // Lead sheet resources
  leadSheetUrl?: string;
  leadSheetSource?: string;
}

export const standardTunes: Tune[] = [
  {
    id: 'autumn-leaves',
    title: 'Autumn Leaves',
    composer: 'Joseph Kosma',
    year: 1945,
    form: '32-bar',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'entry',
    description:
      'Originally composed as "Les Feuilles Mortes" (The Dead Leaves) by Joseph Kosma for the 1945 French film "Les Portes de la Nuit," this tune became one of the most recorded jazz standards after Johnny Mercer added English lyrics. The song\'s haunting minor key melody and classic ii-V-I progressions make it essential repertoire for every jazz musician. Its elegant harmonic structure moves through E minor, A minor, D minor, and G major, creating a beautiful descending progression that works beautifully at various tempos. Cannonball Adderley\'s 1958 recording with Miles Davis on "Somethin\' Else" is considered definitive, while Bill Evans\'s trio versions showcase the tune\'s lyrical potential. The song has been interpreted by virtually every major jazz artist, from vocalists like Frank Sinatra and Nat King Cole to instrumentalists across all eras of jazz.',
    recommendedListening: [
      {
        artist: 'Cannonball Adderley',
        album: "Somethin' Else",
        year: 1958,
        label: 'Blue Note',
        youtubeUrl: 'https://www.youtube.com/watch?v=pfxosTobxlI',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
        youtubeUrl: 'https://www.youtube.com/watch?v=8xT2XqyKGqk',
      },
      {
        artist: 'Miles Davis',
        album: 'Kind of Blue',
        year: 1959,
        label: 'Columbia',
        youtubeUrl: 'https://www.youtube.com/watch?v=jrMhGw4jMD4',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/autumn-leaves',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'blue-bossa',
    title: 'Blue Bossa',
    composer: 'Kenny Dorham',
    year: 1963,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'bossa nova',
    difficulty: 'intermediate',
    description:
      'Composed by trumpeter Kenny Dorham in 1963, "Blue Bossa" ingeniously combines the bossa nova rhythm popularized by Antônio Carlos Jobim with a minor blues structure. The tune became a jazz standard after Joe Henderson\'s 1963 recording on "Page One," which featured Dorham himself. The composition\'s simple yet sophisticated melody moves through D minor, C minor, and Bb major, creating a modal sound that bridges Brazilian music and hard bop. Its accessibility makes it one of the most popular tunes for learning bossa nova style, while its harmonic structure provides excellent material for improvisation. The tune has been recorded by countless artists and remains a favorite in jazz education due to its clear form and beautiful melody.',
    recommendedListening: [
      {
        artist: 'Joe Henderson',
        album: 'Page One',
        year: 1963,
        label: 'Blue Note',
        youtubeUrl: 'https://www.youtube.com/watch?v=U7eOs5lERww',
      },
      {
        artist: 'Kenny Dorham',
        album: 'Una Mas',
        year: 1963,
        label: 'Blue Note',
        youtubeUrl: 'https://www.youtube.com/watch?v=zJqJqJqJqJq',
      },
      {
        artist: 'Dexter Gordon',
        album: 'Go!',
        year: 1962,
        label: 'Blue Note',
        youtubeUrl: 'https://www.youtube.com/watch?v=zJqJqJqJqJq',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/blue-bossa',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'impressions',
    title: 'Impressions',
    composer: 'John Coltrane',
    year: 1961,
    form: 'modal',
    harmonicLogic: 'long sections',
    tempoPressure: 'fast',
    style: 'post-bop',
    difficulty: 'professional',
    description:
      'Coltrane\'s modal masterpiece, based on the same harmonic structure as "So What" but with a different melody. This tune represents the pinnacle of modal jazz improvisation, requiring deep understanding of scale-based playing and extended soloing over static harmonies.',
    recommendedListening: [
      {
        artist: 'John Coltrane',
        album: 'Impressions',
        year: 1963,
        label: 'Impulse!',
      },
      {
        artist: 'John Coltrane',
        album: 'Live at the Village Vanguard',
        year: 1961,
        label: 'Impulse!',
      },
      {
        artist: 'McCoy Tyner',
        album: 'The Real McCoy',
        year: 1967,
        label: 'Blue Note',
      },
    ],
  },
  {
    id: 'fly-me-to-the-moon',
    title: 'Fly Me to the Moon',
    composer: 'Bart Howard',
    year: 1954,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'entry',
    description:
      'Originally titled "In Other Words" when composed by Bart Howard in 1954, this tune became a jazz standard after Frank Sinatra\'s 1964 recording with Count Basie on "It Might as Well Be Swing." The song\'s simple, memorable melody and straightforward harmony make it perfect for beginners, while its elegant structure appeals to advanced players. The tune gained further popularity when it was used in the 1962 film "The Manchurian Candidate" and became associated with the space age. Peggy Lee\'s 1960 recording helped establish it as a standard, and it has since been recorded by hundreds of artists. The composition\'s accessibility and charm have made it one of the most popular jazz standards of the post-war era.',
    recommendedListening: [
      {
        artist: 'Frank Sinatra',
        album: 'It Might as Well Be Swing',
        year: 1964,
        label: 'Reprise',
      },
      {
        artist: 'Count Basie',
        album: 'It Might as Well Be Swing',
        year: 1964,
        label: 'Reprise',
      },
      {
        artist: 'Oscar Peterson',
        album: 'We Get Requests',
        year: 1964,
        label: 'Verve',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/fly-me-to-the-moon',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'blue-monk',
    title: 'Blue Monk',
    composer: 'Thelonious Monk',
    year: 1954,
    form: 'blues',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'Monk',
    difficulty: 'intermediate',
    description:
      "One of Monk's most accessible compositions, first recorded in 1954, this 12-bar blues showcases his unique melodic and rhythmic approach. The tune's simplicity belies its sophistication, making it a perfect introduction to Monk's compositional style. Unlike traditional blues, 'Blue Monk' features Monk's characteristic use of space, unexpected accents, and angular melodic lines. The composition has become one of Monk's most frequently performed tunes, appearing on numerous albums including 'Thelonious Monk Trio' (1954) and 'Monk's Music' (1957). The tune's accessibility combined with its distinctive character has made it a favorite for both listeners and performers, serving as an excellent entry point into Monk's unique musical world.",
    recommendedListening: [
      {
        artist: 'Thelonious Monk',
        album: 'Thelonious Monk Trio',
        year: 1954,
        label: 'Prestige',
      },
      {
        artist: 'Thelonious Monk',
        album: "Monk's Music",
        year: 1957,
        label: 'Riverside',
      },
      {
        artist: 'Art Blakey',
        album: "Art Blakey's Jazz Messengers with Thelonious Monk",
        year: 1957,
        label: 'Atlantic',
      },
    ],
  },
  {
    id: 'all-of-me',
    title: 'All of Me',
    composer: 'Gerald Marks & Seymour Simons',
    year: 1931,
    form: '32-bar',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'entry',
    description:
      "Composed by Gerald Marks and Seymour Simons in 1931, \"All of Me\" quickly became a jazz favorite after Belle Baker's radio performance introduced it to the public. Paul Whiteman and His Orchestra's recording topped the US pop charts, and Louis Armstrong's rendition also reached No. 1. Billie Holiday's 1941 version is often considered definitive, with Ted Gioia noting her \"claim of ownership that no one has managed to dislodge in subsequent years.\" The song's simple, memorable melody and straightforward harmony have made it a favorite for vocalists and instrumentalists alike. Frank Sinatra, Willie Nelson, and countless others have contributed notable recordings. The tune works well at various tempos and is often one of the first standards jazz students learn due to its clear form and accessible harmony.",
    recommendedListening: [
      {
        artist: 'Billie Holiday',
        album: 'Lady Day: The Complete Billie Holiday',
        year: 1931,
        label: 'Columbia',
      },
      {
        artist: 'Louis Armstrong',
        album: 'Louis Armstrong Plays W.C. Handy',
        year: 1954,
        label: 'Columbia',
      },
      {
        artist: 'Frank Sinatra',
        album: "Songs for Swingin' Lovers!",
        year: 1956,
        label: 'Capitol',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/all-of-me',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'take-the-a-train',
    title: 'Take the A Train',
    composer: 'Billy Strayhorn',
    year: 1941,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'fast',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "Billy Strayhorn's signature composition and the theme song of the Duke Ellington Orchestra. This sophisticated tune features a memorable melody and complex harmony that showcases Strayhorn's compositional genius. It remains one of the most recognizable tunes in jazz.",
    recommendedListening: [
      {
        artist: 'Duke Ellington',
        album: 'Never No Lament: The Blanton-Webster Band',
        year: 1941,
        label: 'RCA',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella Fitzgerald Sings the Duke Ellington Song Book',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Joe Henderson',
        album: 'The State of the Tenor',
        year: 1985,
        label: 'Blue Note',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/take-the-a-train',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'summertime',
    title: 'Summertime',
    composer: 'George Gershwin',
    year: 1935,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      "From George Gershwin's 1935 opera \"Porgy and Bess,\" with lyrics by DuBose Heyward and Ira Gershwin, \"Summertime\" is one of the most recorded songs in history, with over 25,000 known recordings. The aria was originally sung by Abbie Mitchell in the opera's premiere. Its haunting melody and simple harmony make it accessible, while its emotional depth allows for profound interpretation. The song has been performed in virtually every style of jazz, from Billie Holiday's intimate 1936 recording to Miles Davis's orchestral 1958 version with Gil Evans. The composition's modal quality and pentatonic melody have made it a favorite for jazz musicians across all eras. Its timeless appeal and emotional resonance have ensured its place as one of the most important songs in American music.",
    recommendedListening: [
      {
        artist: 'Miles Davis',
        album: 'Porgy and Bess',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'Ella Fitzgerald & Louis Armstrong',
        album: 'Porgy and Bess',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
    ],
  },
  {
    id: 'softly-as-in-a-morning-sunrise',
    title: 'Softly as in a Morning Sunrise',
    composer: 'Sigmund Romberg',
    year: 1928,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'fast',
    style: 'bebop',
    difficulty: 'professional',
    description:
      'Originally from the operetta "The New Moon," this tune became a bebop favorite due to its challenging chord changes. The fast-moving harmony requires advanced technique and harmonic knowledge, making it a test piece for professional players.',
    recommendedListening: [
      {
        artist: 'Sonny Rollins',
        album: 'A Night at the Village Vanguard',
        year: 1957,
        label: 'Blue Note',
      },
      {
        artist: 'John Coltrane',
        album: 'Coltrane',
        year: 1957,
        label: 'Prestige',
      },
      {
        artist: 'Art Blakey',
        album: 'A Night in Tunisia',
        year: 1957,
        label: 'Vik',
      },
    ],
  },
  {
    id: 'all-the-things-you-are',
    title: 'All the Things You Are',
    composer: 'Jerome Kern',
    year: 1939,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      'Written by Jerome Kern with lyrics by Oscar Hammerstein II for the 1939 musical "Very Warm for May," this song has become one of the most important jazz standards. Introduced by Hiram Sherman, Frances Mercer, Hollace Shaw, and Ralph Stuart, it was later featured in films like "Broadway Rhythm" (1944) and "Till the Clouds Roll By" (1946). The composition features complex modulations through multiple keys (F minor, Ab major, Db major, and E major), creating one of the most sophisticated harmonic progressions in the Great American Songbook. Charlie Parker\'s 1947 recording demonstrated the tune\'s bebop potential, while Bill Evans\'s trio versions showcased its harmonic sophistication. The tune\'s challenging harmony has made it a favorite among advanced players, while its beautiful melody appeals to all levels. It remains a test piece for understanding key relationships and voice leading in jazz.',
    recommendedListening: [
      {
        artist: 'Charlie Parker',
        album: 'The Complete Savoy Studio Sessions',
        year: 1945,
        label: 'Savoy',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella Fitzgerald Sings the Jerome Kern Song Book',
        year: 1963,
        label: 'Verve',
      },
    ],
    leadSheetUrl:
      'https://www.jazzleadsheet.com/leadsheet/all-the-things-you-are',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'all-blues',
    title: 'All Blues',
    composer: 'Miles Davis',
    year: 1959,
    form: 'modal',
    harmonicLogic: 'long sections',
    tempoPressure: 'medium',
    style: 'post-bop',
    difficulty: 'intermediate',
    description:
      "From Miles Davis's landmark 1959 album \"Kind of Blue,\" this modal blues in 6/8 time represents a revolutionary new approach to jazz composition. The tune's simple structure, based on a G mixolydian mode, allows for extended modal improvisation, making it essential for understanding modal jazz. The composition features a distinctive bass line and a relaxed, swinging 6/8 feel that creates a sense of forward motion. Davis's solo on the original recording demonstrates the power of modal improvisation, focusing on melodic development rather than navigating complex chord changes. The tune has become one of the most studied compositions in jazz education, serving as a perfect introduction to modal concepts. Its influence can be heard in countless later jazz compositions that explore modal harmony.",
    recommendedListening: [
      {
        artist: 'Miles Davis',
        album: 'Kind of Blue',
        year: 1959,
        label: 'Columbia',
      },
      {
        artist: 'Wynton Marsalis',
        album: 'Standard Time, Vol. 3: The Resolution of Romance',
        year: 1990,
        label: 'Columbia',
      },
      {
        artist: 'Herbie Hancock',
        album: 'The Complete Blue Note Sixties Sessions',
        year: 1965,
        label: 'Blue Note',
      },
    ],
  },
  {
    id: 'i-got-rhythm',
    title: 'I Got Rhythm',
    composer: 'George Gershwin',
    year: 1930,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'fast',
    style: 'bebop',
    difficulty: 'intermediate',
    description:
      'Gershwin\'s classic tune gave birth to the "rhythm changes" - one of the most important chord progressions in jazz. Countless bebop tunes are based on these changes, making this progression essential knowledge for every jazz musician.',
    recommendedListening: [
      {
        artist: 'Charlie Parker',
        album: 'The Complete Savoy Studio Sessions',
        year: 1945,
        label: 'Savoy',
      },
      {
        artist: 'Dizzy Gillespie',
        album: "Groovin' High",
        year: 1945,
        label: 'Savoy',
      },
      {
        artist: 'Thelonious Monk',
        album: 'Thelonious Monk with John Coltrane',
        year: 1957,
        label: 'Riverside',
      },
    ],
  },
  {
    id: 'alone-together',
    title: 'Alone Together',
    composer: 'Arthur Schwartz',
    year: 1932,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "A sophisticated standard from the Great American Songbook with challenging harmony. The tune's complex chord progression and beautiful melody have made it a favorite among advanced players, particularly for working on voice leading and reharmonization.",
    recommendedListening: [
      { artist: 'Bill Evans', album: 'Alone', year: 1968, label: 'Verve' },
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Chet Baker',
        album: 'Chet Baker Sings',
        year: 1954,
        label: 'Pacific Jazz',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/alone-together',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'manha-de-carnaval',
    title: 'Manhã de Carnaval',
    composer: 'Luiz Bonfá',
    year: 1959,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'bossa nova',
    difficulty: 'intermediate',
    description:
      'From the film "Black Orpheus," this beautiful bossa nova became one of the most popular Brazilian tunes in jazz. Its romantic melody and gentle rhythm make it perfect for learning bossa nova style and Brazilian jazz harmony.',
    recommendedListening: [
      {
        artist: 'Stan Getz & Charlie Byrd',
        album: 'Jazz Samba',
        year: 1962,
        label: 'Verve',
      },
      {
        artist: 'Luiz Bonfá',
        album: 'Black Orpheus',
        year: 1959,
        label: 'Verve',
      },
      {
        artist: 'Antônio Carlos Jobim',
        album: 'The Composer of Desafinado, Plays',
        year: 1963,
        label: 'Verve',
      },
    ],
  },
  {
    id: 'what-is-this-thing-called-love',
    title: 'What Is This Thing Called Love',
    composer: 'Cole Porter',
    year: 1929,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'fast',
    style: 'bebop',
    difficulty: 'professional',
    description:
      "Cole Porter's classic tune became a bebop favorite due to its challenging chord changes. The fast-moving harmony and complex structure make it a test piece for professional players, with many bebop heads based on its changes.",
    recommendedListening: [
      {
        artist: 'Charlie Parker',
        album: 'The Complete Savoy Studio Sessions',
        year: 1945,
        label: 'Savoy',
      },
      {
        artist: 'Clifford Brown & Max Roach',
        album: 'Clifford Brown & Max Roach',
        year: 1954,
        label: 'EmArcy',
      },
      {
        artist: 'Sonny Rollins',
        album: 'Saxophone Colossus',
        year: 1956,
        label: 'Prestige',
      },
    ],
  },
  {
    id: 'someday-my-prince-will-come',
    title: 'Someday My Prince Will Come',
    composer: 'Frank Churchill',
    year: 1937,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      "From Disney's 1937 animated film \"Snow White and the Seven Dwarfs,\" with music by Frank Churchill and lyrics by Larry Morey, this beautiful ballad became a jazz standard after Miles Davis's 1961 recording. The song was originally sung by Adriana Caselotti as Snow White. Davis's version, featuring John Coltrane and Wynton Kelly, helped establish the tune as a jazz standard and demonstrated how a children's song could be transformed into sophisticated jazz. Bill Evans's 1961 trio version on \"Waltz for Debby\" further cemented its status. The tune's simple, memorable melody and straightforward harmony make it perfect for learning ballad playing, while its emotional depth allows for profound interpretation. The composition has been recorded by hundreds of artists and remains a favorite for jazz musicians exploring ballad performance.",
    recommendedListening: [
      {
        artist: 'Miles Davis',
        album: 'Someday My Prince Will Come',
        year: 1961,
        label: 'Columbia',
      },
      {
        artist: 'Bill Evans',
        album: 'Waltz for Debby',
        year: 1961,
        label: 'Riverside',
      },
      {
        artist: 'Wynton Kelly',
        album: 'Someday My Prince Will Come',
        year: 1961,
        label: 'Vee-Jay',
      },
    ],
  },
  {
    id: 'body-and-soul',
    title: 'Body and Soul',
    composer: 'Johnny Green',
    year: 1930,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'intermediate',
    description:
      "Composed by Johnny Green in 1930 with lyrics by Edward Heyman, Robert Sour, and Frank Eyton, \"Body and Soul\" became one of the most important ballads in jazz after Coleman Hawkins's groundbreaking 1939 recording. Hawkins's version, recorded in a single take, revolutionized jazz ballad playing by demonstrating that a ballad could be a vehicle for sophisticated improvisation rather than just a simple melody. The recording became a hit and established the tenor saxophone as a lead instrument in jazz. The tune's complex harmony, featuring numerous key changes and sophisticated chord progressions, has made it a test piece for every generation of jazz musicians. The song's emotional depth and technical challenges have attracted countless interpretations, from Billie Holiday's poignant vocal version to John Coltrane's harmonically adventurous instrumental take. The composition remains a benchmark for jazz ballad performance.",
    recommendedListening: [
      {
        artist: 'Coleman Hawkins',
        album: 'Body and Soul',
        year: 1939,
        label: 'RCA',
      },
      {
        artist: 'John Coltrane',
        album: "Coltrane's Sound",
        year: 1960,
        label: 'Atlantic',
      },
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
    ],
  },
  {
    id: 'garota-de-ipanema',
    title: 'Garota de Ipanema',
    composer: 'Antônio Carlos Jobim',
    year: 1962,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'bossa nova',
    difficulty: 'intermediate',
    description:
      "Also known as \"The Girl from Ipanema,\" composed by Antônio Carlos Jobim with Portuguese lyrics by Vinícius de Moraes and English lyrics by Norman Gimbel, this is perhaps the most famous bossa nova tune. Jobim's masterpiece became a worldwide hit after Stan Getz and João Gilberto's 1964 recording, which won the Grammy Award for Record of the Year. The song introduced bossa nova to international audiences and became one of the most recorded songs of all time. Astrud Gilberto's vocal on the Getz/Gilberto version, recorded almost by accident, became one of the most recognizable voices in jazz. The tune's beautiful melody and gentle rhythm make it essential for any jazz musician. Its influence extends far beyond jazz, appearing in countless films, commercials, and popular culture references. The composition remains a cornerstone of Brazilian jazz and bossa nova repertoire.",
    recommendedListening: [
      {
        artist: 'Stan Getz & João Gilberto',
        album: 'Getz/Gilberto',
        year: 1964,
        label: 'Verve',
      },
      {
        artist: 'Antônio Carlos Jobim',
        album: 'The Composer of Desafinado, Plays',
        year: 1963,
        label: 'Verve',
      },
      {
        artist: 'Frank Sinatra',
        album: 'Francis Albert Sinatra & Antônio Carlos Jobim',
        year: 1967,
        label: 'Reprise',
      },
    ],
  },
  {
    id: 'stella-by-starlight',
    title: 'Stella by Starlight',
    composer: 'Victor Young',
    year: 1944,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'intermediate',
    description:
      'From the 1944 film "The Uninvited," composed by Victor Young with lyrics by Ned Washington, this beautiful ballad features complex harmony that has challenged generations of jazz musicians. The tune\'s sophisticated chord progression, with its numerous key changes and chromatic movement, makes it a favorite for advanced players working on reharmonization. Miles Davis\'s 1959 recording on "Kind of Blue" (though the album version is actually "Flamenco Sketches") helped establish the tune as a jazz standard. Bill Evans\'s trio versions showcase the composition\'s harmonic sophistication, while Stan Getz\'s interpretations demonstrate its lyrical potential. The tune\'s challenging harmony requires deep understanding of voice leading and chord substitution, making it a test piece for advanced jazz musicians. Despite its complexity, the melody remains memorable and accessible.',
    recommendedListening: [
      {
        artist: 'Miles Davis',
        album: 'Kind of Blue',
        year: 1959,
        label: 'Columbia',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
      },
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/stella-by-starlight',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'misty',
    title: 'Misty',
    composer: 'Erroll Garner',
    year: 1954,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      "Erroll Garner's most famous composition, written in 1954, this beautiful ballad became a jazz standard after Johnny Burke added lyrics in 1955. The tune was inspired by Garner's observation of a foggy night in Pittsburgh. Sarah Vaughan's 1954 recording helped establish it as a standard, and it became one of the most recorded songs of the 1950s. Johnny Mathis's 1959 version reached No. 12 on the Billboard charts, bringing the tune to mainstream audiences. The composition's simple, memorable melody and straightforward harmony make it perfect for beginners, while its emotional depth appeals to all levels. The tune's popularity has endured for decades, with hundreds of recordings by artists ranging from Ella Fitzgerald to Ray Charles. It remains one of the most beloved jazz ballads.",
    recommendedListening: [
      {
        artist: 'Erroll Garner',
        album: 'Contrasts',
        year: 1954,
        label: 'Mercury',
      },
      {
        artist: 'Sarah Vaughan',
        album: 'Sarah Vaughan',
        year: 1954,
        label: 'EmArcy',
      },
      {
        artist: 'Johnny Mathis',
        album: "Johnny's Greatest Hits",
        year: 1958,
        label: 'Columbia',
      },
    ],
  },
  {
    id: 'wave',
    title: 'Wave',
    composer: 'Antônio Carlos Jobim',
    year: 1967,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'bossa nova',
    difficulty: 'intermediate',
    description:
      "One of Jobim's most sophisticated bossa nova compositions, written in 1967, featuring a beautiful melody and gentle rhythm. The tune showcases Jobim's harmonic sophistication, with its elegant chord progressions and subtle modulations. The composition was featured on Jobim's 1967 album 'Wave,' which helped establish it as a jazz standard. Frank Sinatra's 1967 recording with Jobim on 'Francis Albert Sinatra & Antônio Carlos Jobim' brought the tune to mainstream audiences. The song's sophisticated harmony, combined with its accessible melody, makes it a favorite for both listeners and performers. The tune remains one of the most popular bossa nova compositions in the jazz repertoire and demonstrates Jobim's mastery of Brazilian jazz harmony.",
    recommendedListening: [
      {
        artist: 'Antônio Carlos Jobim',
        album: 'Wave',
        year: 1967,
        label: 'A&M',
      },
      { artist: 'Stan Getz', album: 'Sweet Rain', year: 1967, label: 'Verve' },
      {
        artist: 'Frank Sinatra',
        album: 'Francis Albert Sinatra & Antônio Carlos Jobim',
        year: 1967,
        label: 'Reprise',
      },
    ],
  },
  {
    id: 'my-funny-valentine',
    title: 'My Funny Valentine',
    composer: 'Richard Rodgers',
    year: 1937,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'From Rodgers and Hart\'s "Babes in Arms," this beautiful ballad became a jazz standard after Chet Baker\'s iconic recording. Its simple, memorable melody and straightforward harmony make it perfect for learning ballad playing.',
    recommendedListening: [
      {
        artist: 'Chet Baker',
        album: 'Chet Baker Sings',
        year: 1954,
        label: 'Pacific Jazz',
      },
      {
        artist: 'Miles Davis',
        album: "Cookin' with the Miles Davis Quintet",
        year: 1956,
        label: 'Prestige',
      },
      {
        artist: 'Bill Evans',
        album: 'Waltz for Debby',
        year: 1961,
        label: 'Riverside',
      },
    ],
  },
  {
    id: 'on-green-dolphin-street',
    title: 'On Green Dolphin Street',
    composer: 'Bronisław Kaper',
    year: 1947,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "From the 1947 film \"Green Dolphin Street,\" composed by Bronisław Kaper with lyrics by Ned Washington, this tune became a jazz standard after Miles Davis's 1958 recording. The composition's sophisticated harmony, featuring numerous key changes and chromatic movement, makes it a favorite among advanced players. Bill Evans's 1959 trio version on \"Portrait in Jazz\" showcases the tune's harmonic complexity, while Wynton Kelly's 1959 recording demonstrates its swing potential. The tune's challenging chord progression requires deep understanding of voice leading and reharmonization techniques. Despite its complexity, the melody remains memorable and accessible. The composition has been recorded by hundreds of artists and remains a test piece for advanced jazz musicians.",
    recommendedListening: [
      {
        artist: 'Miles Davis',
        album: 'Kind of Blue',
        year: 1959,
        label: 'Columbia',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
      },
      {
        artist: 'Wynton Kelly',
        album: 'Kelly Blue',
        year: 1959,
        label: 'Riverside',
      },
    ],
  },
  {
    id: 'in-a-sentimental-mood',
    title: 'In a Sentimental Mood',
    composer: 'Duke Ellington',
    year: 1935,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      "Composed by Duke Ellington in 1935, this is one of his most beautiful ballads and showcases his gift for melody and harmony. The tune was originally an instrumental, with lyrics added later by Manny Kurtz. Ellington's 1935 recording with his orchestra established it as a jazz classic. The composition's simple structure and emotional depth have made it a favorite for generations of jazz musicians. Duke Ellington & John Coltrane's 1962 recording demonstrates the tune's timeless appeal, while Ella Fitzgerald's 1957 version on 'Ella Fitzgerald Sings the Duke Ellington Song Book' showcases its vocal potential. The tune's elegant melody and sophisticated harmony make it essential repertoire for any jazz musician. It remains one of Ellington's most frequently performed compositions.",
    recommendedListening: [
      {
        artist: 'Duke Ellington & John Coltrane',
        album: 'Duke Ellington & John Coltrane',
        year: 1962,
        label: 'Impulse!',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella Fitzgerald Sings the Duke Ellington Song Book',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
    ],
    leadSheetUrl:
      'https://www.jazzleadsheet.com/leadsheet/in-a-sentimental-mood',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'take-five',
    title: 'Take Five',
    composer: 'Paul Desmond',
    year: 1959,
    form: 'AABA',
    harmonicLogic: 'modal',
    tempoPressure: 'medium',
    style: 'cool jazz',
    difficulty: 'intermediate',
    description:
      "Paul Desmond's composition in 5/4 time became one of the most popular jazz tunes of all time. Its unusual time signature and memorable melody make it essential for understanding odd-time signatures in jazz.",
    recommendedListening: [
      {
        artist: 'Dave Brubeck Quartet',
        album: 'Time Out',
        year: 1959,
        label: 'Columbia',
      },
      { artist: 'Paul Desmond', album: 'Take Ten', year: 1963, label: 'RCA' },
      {
        artist: 'Carmen McRae',
        album: 'Take Five Live',
        year: 1961,
        label: 'Columbia',
      },
    ],
  },
  {
    id: 'round-midnight',
    title: "'Round Midnight",
    composer: 'Thelonious Monk',
    year: 1944,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'slow',
    style: 'bebop',
    difficulty: 'professional',
    description:
      "One of the most recorded jazz compositions, this Monk masterpiece features complex harmony and a haunting melody. The tune's sophisticated chord progression makes it a test piece for professional players.",
    recommendedListening: [
      {
        artist: 'Thelonious Monk',
        album: 'Thelonious Monk Trio',
        year: 1952,
        label: 'Prestige',
      },
      {
        artist: 'Miles Davis',
        album: "'Round About Midnight",
        year: 1957,
        label: 'Columbia',
      },
      {
        artist: 'Dizzy Gillespie',
        album: 'Dizzy Gillespie and the Double Six of Paris',
        year: 1963,
        label: 'Philips',
      },
    ],
  },
  {
    id: 'so-what',
    title: 'So What',
    composer: 'Miles Davis',
    year: 1959,
    form: 'modal',
    harmonicLogic: 'long sections',
    tempoPressure: 'medium',
    style: 'post-bop',
    difficulty: 'intermediate',
    description:
      "The opening track of Miles Davis's 1959 album \"Kind of Blue,\" this modal masterpiece revolutionized jazz and became one of the most influential compositions in the genre's history. The tune's simple two-chord structure (D dorian and Eb dorian) allows for extended modal improvisation, making it essential for understanding modal jazz. Bill Evans's introductory piano chords create a distinctive atmosphere, while Davis's muted trumpet solo demonstrates the power of modal playing. The composition marked a turning point in jazz, moving away from complex bebop harmony toward a more open, scale-based approach. The tune has been studied and performed by countless musicians and remains a cornerstone of jazz education. Its influence extends beyond jazz, affecting rock, fusion, and other genres.",
    recommendedListening: [
      {
        artist: 'Miles Davis',
        album: 'Kind of Blue',
        year: 1959,
        label: 'Columbia',
      },
      {
        artist: 'Miles Davis',
        album: 'Miles in Europe',
        year: 1963,
        label: 'Columbia',
      },
      {
        artist: 'John Coltrane',
        album: 'My Favorite Things',
        year: 1961,
        label: 'Atlantic',
      },
    ],
  },
  {
    id: 'giant-steps',
    title: 'Giant Steps',
    composer: 'John Coltrane',
    year: 1959,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'fast',
    style: 'bebop',
    difficulty: 'professional',
    description:
      "Coltrane's revolutionary composition features rapid key changes through major thirds, creating one of the most challenging chord progressions in jazz. This tune represents the pinnacle of bebop harmony and is a test piece for professional players.",
    recommendedListening: [
      {
        artist: 'John Coltrane',
        album: 'Giant Steps',
        year: 1960,
        label: 'Atlantic',
      },
      {
        artist: 'Tommy Flanagan',
        album: 'Giant Steps',
        year: 1982,
        label: 'Enja',
      },
      {
        artist: 'McCoy Tyner',
        album: 'Giant Steps',
        year: 1995,
        label: 'Enja',
      },
    ],
  },
  {
    id: 'night-and-day',
    title: 'Night and Day',
    composer: 'Cole Porter',
    year: 1932,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "Cole Porter's sophisticated composition became a jazz standard after numerous recordings. Its memorable melody and elegant harmony make it a favorite among vocalists and instrumentalists alike.",
    recommendedListening: [
      {
        artist: 'Frank Sinatra',
        album: "Songs for Swingin' Lovers!",
        year: 1956,
        label: 'Capitol',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella Fitzgerald Sings the Cole Porter Song Book',
        year: 1956,
        label: 'Verve',
      },
      {
        artist: 'Art Tatum',
        album: 'The Tatum Group Masterpieces',
        year: 1956,
        label: 'Pablo',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/night-and-day',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'lullaby-of-birdland',
    title: 'Lullaby of Birdland',
    composer: 'George Shearing',
    year: 1952,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "George Shearing's tribute to the famous jazz club, this tune became one of his signature compositions. Its catchy melody and swing feel make it a favorite for learning jazz piano and small group playing.",
    recommendedListening: [
      {
        artist: 'George Shearing',
        album: 'Lullaby of Birdland',
        year: 1952,
        label: 'MGM',
      },
      {
        artist: 'Sarah Vaughan',
        album: 'Sarah Vaughan',
        year: 1954,
        label: 'EmArcy',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella Fitzgerald Sings the George and Ira Gershwin Song Book',
        year: 1959,
        label: 'Verve',
      },
    ],
  },
  {
    id: 'there-will-never-be-another-you',
    title: 'There Will Never Be Another You',
    composer: 'Harry Warren',
    year: 1942,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'entry',
    description:
      'From the film "Iceland," this beautiful standard became a jazz favorite. Its simple, memorable melody and straightforward harmony make it perfect for beginners, while its emotional depth appeals to all levels.',
    recommendedListening: [
      {
        artist: 'Chet Baker',
        album: 'Chet Baker Sings',
        year: 1954,
        label: 'Pacific Jazz',
      },
      {
        artist: 'Sonny Rollins',
        album: 'The Bridge',
        year: 1962,
        label: 'RCA',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
      },
    ],
  },
  {
    id: 'how-high-the-moon',
    title: 'How High the Moon',
    composer: 'Morgan Lewis',
    year: 1940,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'fast',
    style: 'bebop',
    difficulty: 'intermediate',
    description:
      "This tune became a bebop favorite after Charlie Parker's recording. Its fast tempo and challenging harmony make it a test piece for intermediate players, while its memorable melody keeps it accessible.",
    recommendedListening: [
      {
        artist: 'Charlie Parker',
        album: 'The Complete Savoy Studio Sessions',
        year: 1945,
        label: 'Savoy',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella in Berlin',
        year: 1960,
        label: 'Verve',
      },
      {
        artist: 'Dizzy Gillespie',
        album: "Groovin' High",
        year: 1945,
        label: 'Savoy',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/how-high-the-moon',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'cherokee',
    title: 'Cherokee',
    composer: 'Ray Noble',
    year: 1938,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'fast',
    style: 'bebop',
    difficulty: 'professional',
    description:
      "Ray Noble's composition became famous after Charlie Parker's groundbreaking recording. The tune's fast-moving harmony and complex structure make it one of the most challenging standards in the jazz repertoire.",
    recommendedListening: [
      {
        artist: 'Charlie Parker',
        album: 'The Complete Savoy Studio Sessions',
        year: 1945,
        label: 'Savoy',
      },
      {
        artist: 'Clifford Brown',
        album: 'Clifford Brown & Max Roach',
        year: 1954,
        label: 'EmArcy',
      },
      {
        artist: 'Sonny Rollins',
        album: 'Saxophone Colossus',
        year: 1956,
        label: 'Prestige',
      },
    ],
  },
  {
    id: 'just-friends',
    title: 'Just Friends',
    composer: 'John Klenner',
    year: 1931,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "A beautiful standard from the Great American Songbook, this tune became a jazz favorite after Charlie Parker's recording. Its memorable melody and elegant harmony make it perfect for learning jazz phrasing.",
    recommendedListening: [
      {
        artist: 'Charlie Parker',
        album: 'Charlie Parker with Strings',
        year: 1950,
        label: 'Verve',
      },
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
      },
    ],
  },
  {
    id: 'have-you-met-miss-jones',
    title: 'Have You Met Miss Jones',
    composer: 'Richard Rodgers',
    year: 1937,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "From Rodgers and Hart's \"I'd Rather Be Right,\" this tune features sophisticated harmony that has challenged generations of jazz musicians. The tune's complex chord progression makes it a favorite for advanced players.",
    recommendedListening: [
      {
        artist: 'Frank Sinatra',
        album: "Songs for Swingin' Lovers!",
        year: 1956,
        label: 'Capitol',
      },
      {
        artist: 'John Coltrane',
        album: "Coltrane's Sound",
        year: 1960,
        label: 'Atlantic',
      },
      {
        artist: 'Brad Mehldau',
        album: 'The Art of the Trio, Vol. 1',
        year: 1997,
        label: 'Warner Bros.',
      },
    ],
    leadSheetUrl:
      'https://www.jazzleadsheet.com/leadsheet/have-you-met-miss-jones',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'but-beautiful',
    title: 'But Beautiful',
    composer: 'Jimmy Van Heusen',
    year: 1947,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'A beautiful ballad from the Great American Songbook, this tune became a jazz standard after numerous recordings. Its simple, memorable melody and straightforward harmony make it perfect for learning ballad playing.',
    recommendedListening: [
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Johnny Hartman',
        album: 'John Coltrane and Johnny Hartman',
        year: 1963,
        label: 'Impulse!',
      },
    ],
  },
  {
    id: 'the-way-you-look-tonight',
    title: 'The Way You Look Tonight',
    composer: 'Jerome Kern',
    year: 1936,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'From the film "Swing Time," this beautiful ballad won an Academy Award. Its simple, memorable melody and straightforward harmony make it perfect for beginners, while its emotional depth appeals to all levels.',
    recommendedListening: [
      {
        artist: 'Frank Sinatra',
        album: "Songs for Swingin' Lovers!",
        year: 1956,
        label: 'Capitol',
      },
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'Tony Bennett',
        album: 'The Art of Romance',
        year: 2004,
        label: 'RPM/Columbia',
      },
    ],
  },
  {
    id: 'days-of-wine-and-roses',
    title: 'Days of Wine and Roses',
    composer: 'Henry Mancini',
    year: 1962,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'From the film of the same name, this beautiful ballad became a jazz standard. Its simple, memorable melody and straightforward harmony make it perfect for learning ballad playing.',
    recommendedListening: [
      {
        artist: 'Andy Williams',
        album: 'Days of Wine and Roses',
        year: 1963,
        label: 'Columbia',
      },
      {
        artist: 'Bill Evans',
        album: 'Conversations with Myself',
        year: 1963,
        label: 'Verve',
      },
      {
        artist: 'Tony Bennett',
        album: 'I Wanna Be Around',
        year: 1963,
        label: 'Columbia',
      },
    ],
    leadSheetUrl:
      'https://www.jazzleadsheet.com/leadsheet/days-of-wine-and-roses',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'heres-that-rainy-day',
    title: "Here's That Rainy Day",
    composer: 'Jimmy Van Heusen',
    year: 1953,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'intermediate',
    description:
      "A sophisticated ballad with challenging harmony, this tune became a jazz standard after Frank Sinatra's recording. The tune's complex chord progression makes it a favorite for advanced players.",
    recommendedListening: [
      {
        artist: 'Frank Sinatra',
        album: 'No One Cares',
        year: 1959,
        label: 'Capitol',
      },
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
      { artist: 'Bill Evans', album: 'Alone', year: 1968, label: 'Verve' },
    ],
  },
  {
    id: 'it-could-happen-to-you',
    title: 'It Could Happen to You',
    composer: 'Jimmy Van Heusen',
    year: 1944,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'entry',
    description:
      'From the film "And the Angels Sing," this beautiful standard became a jazz favorite. Its simple, memorable melody and straightforward harmony make it perfect for beginners.',
    recommendedListening: [
      {
        artist: 'Frank Sinatra',
        album: "Songs for Swingin' Lovers!",
        year: 1956,
        label: 'Capitol',
      },
      {
        artist: 'Sarah Vaughan',
        album: 'Sarah Vaughan',
        year: 1954,
        label: 'EmArcy',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
      },
    ],
  },
  {
    id: 'like-someone-in-love',
    title: 'Like Someone in Love',
    composer: 'Jimmy Van Heusen',
    year: 1944,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'A beautiful ballad from the Great American Songbook, this tune became a jazz standard after numerous recordings. Its simple, memorable melody and straightforward harmony make it perfect for learning ballad playing.',
    recommendedListening: [
      {
        artist: 'Chet Baker',
        album: 'Chet Baker Sings',
        year: 1954,
        label: 'Pacific Jazz',
      },
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'John Coltrane',
        album: 'Lush Life',
        year: 1957,
        label: 'Prestige',
      },
    ],
  },
  {
    id: 'moon-river',
    title: 'Moon River',
    composer: 'Henry Mancini',
    year: 1961,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'From the film "Breakfast at Tiffany\'s," this beautiful ballad won an Academy Award. Its simple, memorable melody and straightforward harmony make it perfect for beginners.',
    recommendedListening: [
      {
        artist: 'Andy Williams',
        album: 'Moon River',
        year: 1962,
        label: 'Columbia',
      },
      {
        artist: 'Henry Mancini',
        album: "Breakfast at Tiffany's",
        year: 1961,
        label: 'RCA',
      },
      {
        artist: 'Frank Sinatra',
        album: 'Sinatra and Strings',
        year: 1962,
        label: 'Reprise',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/moon-river',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'over-the-rainbow',
    title: 'Over the Rainbow',
    composer: 'Harold Arlen',
    year: 1939,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'From "The Wizard of Oz," this is one of the most beloved songs in American music. Its simple, memorable melody and straightforward harmony make it perfect for beginners, while its emotional depth appeals to all levels.',
    recommendedListening: [
      {
        artist: 'Judy Garland',
        album: 'The Wizard of Oz',
        year: 1939,
        label: 'MGM',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella Fitzgerald Sings the Harold Arlen Song Book',
        year: 1961,
        label: 'Verve',
      },
      {
        artist: 'Keith Jarrett',
        album: 'The Melody at Night, with You',
        year: 1999,
        label: 'ECM',
      },
    ],
  },
  {
    id: 'satin-doll',
    title: 'Satin Doll',
    composer: 'Duke Ellington',
    year: 1953,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "Duke Ellington's sophisticated composition became one of his most popular tunes. Its elegant melody and swing feel make it a favorite for learning jazz piano and small group playing.",
    recommendedListening: [
      {
        artist: 'Duke Ellington',
        album: 'Ellington Uptown',
        year: 1952,
        label: 'Columbia',
      },
      {
        artist: 'Ella Fitzgerald',
        album: 'Ella Fitzgerald Sings the Duke Ellington Song Book',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Oscar Peterson',
        album: 'Oscar Peterson Plays the Duke Ellington Song Book',
        year: 1959,
        label: 'Verve',
      },
    ],
  },
  {
    id: 'speak-low',
    title: 'Speak Low',
    composer: 'Kurt Weill',
    year: 1943,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      'From the musical "One Touch of Venus," this sophisticated tune became a jazz standard. Its memorable melody and elegant harmony make it a favorite among vocalists and instrumentalists.',
    recommendedListening: [
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'Sarah Vaughan',
        album: 'Sarah Vaughan',
        year: 1954,
        label: 'EmArcy',
      },
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/speak-low',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'straight-no-chaser',
    title: 'Straight No Chaser',
    composer: 'Thelonious Monk',
    year: 1951,
    form: 'blues',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'Monk',
    difficulty: 'intermediate',
    description:
      "One of Monk's most popular compositions, this 12-bar blues showcases his unique approach to the blues form. The tune's catchy melody and rhythmic sophistication make it a favorite for learning Monk's style.",
    recommendedListening: [
      {
        artist: 'Thelonious Monk',
        album: 'Thelonious Monk Trio',
        year: 1952,
        label: 'Prestige',
      },
      {
        artist: 'Thelonious Monk',
        album: "Monk's Music",
        year: 1957,
        label: 'Riverside',
      },
      {
        artist: 'Art Blakey',
        album: "Art Blakey's Jazz Messengers with Thelonious Monk",
        year: 1957,
        label: 'Atlantic',
      },
    ],
  },
  {
    id: 'there-is-no-greater-love',
    title: 'There Is No Greater Love',
    composer: 'Isham Jones',
    year: 1936,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'A beautiful ballad from the Great American Songbook, this tune became a jazz standard after numerous recordings. Its simple, memorable melody and straightforward harmony make it perfect for learning ballad playing.',
    recommendedListening: [
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'Miles Davis',
        album: "Workin'",
        year: 1956,
        label: 'Prestige',
      },
      {
        artist: 'John Coltrane',
        album: "Coltrane's Sound",
        year: 1960,
        label: 'Atlantic',
      },
    ],
    leadSheetUrl:
      'https://www.jazzleadsheet.com/leadsheet/there-is-no-greater-love',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'when-i-fall-in-love',
    title: 'When I Fall in Love',
    composer: 'Victor Young',
    year: 1952,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'entry',
    description:
      'A beautiful ballad that became a jazz standard after numerous recordings. Its simple, memorable melody and straightforward harmony make it perfect for beginners, while its emotional depth appeals to all levels.',
    recommendedListening: [
      {
        artist: 'Nat King Cole',
        album: 'The Unforgettable Nat King Cole',
        year: 1952,
        label: 'Capitol',
      },
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'Keith Jarrett',
        album: 'The Melody at Night, with You',
        year: 1999,
        label: 'ECM',
      },
    ],
  },
  {
    id: 'you-dont-know-what-love-is',
    title: "You Don't Know What Love Is",
    composer: 'Gene DePaul',
    year: 1941,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'intermediate',
    description:
      "A sophisticated ballad with challenging harmony, this tune became a jazz standard after Billie Holiday's recording. The tune's complex chord progression makes it a favorite for advanced players.",
    recommendedListening: [
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'John Coltrane',
        album: "Coltrane's Sound",
        year: 1960,
        label: 'Atlantic',
      },
      {
        artist: 'Chet Baker',
        album: 'Chet Baker Sings',
        year: 1954,
        label: 'Pacific Jazz',
      },
    ],
    leadSheetUrl:
      'https://www.jazzleadsheet.com/leadsheet/you-dont-know-what-love-is',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'yesterdays',
    title: 'Yesterdays',
    composer: 'Jerome Kern',
    year: 1933,
    form: 'AABA',
    harmonicLogic: 'fast changes',
    tempoPressure: 'slow',
    style: 'ballad',
    difficulty: 'intermediate',
    description:
      'From "Roberta," this sophisticated ballad features complex harmony that has challenged generations of jazz musicians. The tune\'s beautiful melody and challenging chord progression make it a favorite for advanced players.',
    recommendedListening: [
      {
        artist: 'Billie Holiday',
        album: 'Lady in Satin',
        year: 1958,
        label: 'Columbia',
      },
      {
        artist: 'John Coltrane',
        album: "Coltrane's Sound",
        year: 1960,
        label: 'Atlantic',
      },
      {
        artist: 'Keith Jarrett',
        album: 'The Melody at Night, with You',
        year: 1999,
        label: 'ECM',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/yesterdays',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'honeysuckle-rose',
    title: 'Honeysuckle Rose',
    composer: 'Fats Waller',
    year: 1929,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      "Composed by Fats Waller with lyrics by Andy Razaf, this tune became one of the most popular swing standards. The composition's catchy melody and straightforward harmony make it a favorite for jam sessions and small group playing. The tune has been recorded by countless artists, from Waller's own recordings to modern interpretations.",
    recommendedListening: [
      {
        artist: 'Fats Waller',
        album: 'The Complete Recorded Works, Vol. 1',
        year: 1929,
        label: 'RCA',
      },
      {
        artist: 'Benny Goodman',
        album: 'The Complete RCA Victor Small Group Recordings',
        year: 1935,
        label: 'RCA',
      },
      {
        artist: 'Lionel Hampton',
        album: 'Hamp and Getz',
        year: 1955,
        label: 'Verve',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/honeysuckle-rose',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'out-of-nowhere',
    title: 'Out of Nowhere',
    composer: 'Johnny Green',
    year: 1931,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'swing',
    difficulty: 'intermediate',
    description:
      'Composed by Johnny Green with lyrics by Edward Heyman, this tune became a jazz standard after numerous recordings. The composition features a beautiful melody and sophisticated harmony that has made it a favorite among jazz musicians. The tune works well at various tempos and has been interpreted by countless artists.',
    recommendedListening: [
      {
        artist: 'Coleman Hawkins',
        album: 'Body and Soul',
        year: 1939,
        label: 'RCA',
      },
      {
        artist: 'Charlie Parker',
        album: 'The Complete Savoy Studio Sessions',
        year: 1945,
        label: 'Savoy',
      },
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/out-of-nowhere',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'invitation',
    title: 'Invitation',
    composer: 'Bronisław Kaper',
    year: 1952,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'ballad',
    difficulty: 'intermediate',
    description:
      'Composed by Bronisław Kaper with lyrics by Paul Francis Webster for the 1952 film "Invitation," this beautiful ballad became a jazz standard. The tune features a sophisticated melody and elegant harmony that has made it a favorite for ballad performance. The composition works beautifully at slow tempos and has been recorded by numerous artists.',
    recommendedListening: [
      {
        artist: 'Stan Getz',
        album: 'Stan Getz and the Oscar Peterson Trio',
        year: 1957,
        label: 'Verve',
      },
      {
        artist: 'Bill Evans',
        album: 'Portrait in Jazz',
        year: 1959,
        label: 'Riverside',
      },
      {
        artist: 'John Coltrane',
        album: "Coltrane's Sound",
        year: 1960,
        label: 'Atlantic',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/invitation',
    leadSheetSource: 'JazzLeadSheet.com',
  },
  {
    id: 'lady-bird',
    title: 'Lady Bird',
    composer: 'Tadd Dameron',
    year: 1939,
    form: 'AABA',
    harmonicLogic: 'functional',
    tempoPressure: 'medium',
    style: 'bebop',
    difficulty: 'intermediate',
    description:
      "Composed by Tadd Dameron, this tune became a bebop standard and is one of the most important compositions in the bebop repertoire. The tune's sophisticated harmony and memorable melody have made it a favorite for jazz musicians. The composition features classic bebop chord progressions and has been recorded by countless artists.",
    recommendedListening: [
      {
        artist: 'Tadd Dameron',
        album: 'The Magic Touch',
        year: 1962,
        label: 'Riverside',
      },
      {
        artist: 'Clifford Brown & Max Roach',
        album: 'Clifford Brown & Max Roach',
        year: 1954,
        label: 'EmArcy',
      },
      {
        artist: 'Miles Davis',
        album: "Cookin' with the Miles Davis Quintet",
        year: 1956,
        label: 'Prestige',
      },
    ],
    leadSheetUrl: 'https://www.jazzleadsheet.com/leadsheet/lady-bird',
    leadSheetSource: 'JazzLeadSheet.com',
  },
];
