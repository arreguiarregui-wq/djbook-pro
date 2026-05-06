'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const GENRES = [
  { id: 'all', label: 'Todos' },
  { id: 'house', label: 'House' },
  { id: 'afro', label: 'Afro House' },
  { id: 'techno', label: 'Techno' },
  { id: 'melodic', label: 'Melodic' },
  { id: 'deep', label: 'Deep House' },
  { id: 'dnb', label: 'D&B / Jungle' },
  { id: 'ambient', label: 'Ambient' },
  { id: 'trance', label: 'Trance' },
  { id: 'disco', label: 'Disco / Funk' },
]

const CHARTS = [
  { g: 'house', p: 'Beatport', n: 'Top 100 House', d: 'El chart de house más seguido del mundo.', t: ['House', 'Tech House'], url: 'https://www.beatport.com/genre/house/5/top-100', upd: 'Weekly' },
  { g: 'house', p: 'Traxsource', n: 'Top 100 House', d: 'Más underground que Beatport. Referencia para DJs profesionales.', t: ['House', 'Soulful'], url: 'https://www.traxsource.com/genre/2/house', upd: 'Daily' },
  { g: 'afro', p: 'Beatport', n: 'Top 100 Afro House', d: 'El chart definitivo de afro house.', t: ['Afro House', 'Tribal'], url: 'https://www.beatport.com/genre/afro-house/89/top-100', upd: 'Weekly' },
  { g: 'afro', p: 'Traxsource', n: 'Top 100 Afro House', d: 'Exclusivos que no encontrarás en Beatport.', t: ['Afro House', 'Afrobeats'], url: 'https://www.traxsource.com/genre/38/afro-house', upd: 'Daily' },
  { g: 'techno', p: 'Beatport', n: 'Top 100 Techno Peak Time', d: 'El techno más energético para el horario estelar.', t: ['Techno', 'Industrial'], url: 'https://www.beatport.com/genre/techno/6/top-100', upd: 'Weekly' },
  { g: 'techno', p: 'Beatport', n: 'Top 100 Techno Raw/Deep', d: 'Techno oscuro y experimental. La cara underground.', t: ['Techno', 'Raw', 'Dark'], url: 'https://www.beatport.com/genre/techno-raw-deep-hypnotic/92/top-100', upd: 'Weekly' },
  { g: 'melodic', p: 'Beatport', n: 'Top 100 Melodic House & Techno', d: 'El género en mayor auge en Europa ahora mismo.', t: ['Melodic Techno', 'Melodic House'], url: 'https://www.beatport.com/genre/melodic-house-techno/90/top-100', upd: 'Weekly' },
  { g: 'melodic', p: 'Traxsource', n: 'Top 100 Melodic House', d: 'Selección refinada de melodic house para DJs.', t: ['Melodic', 'Organic'], url: 'https://www.traxsource.com/genre/96/melodic-house-techno', upd: 'Daily' },
  { g: 'deep', p: 'Beatport', n: 'Top 100 Deep House', d: 'Deep house, garage y sonidos orgánicos.', t: ['Deep House', 'Garage'], url: 'https://www.beatport.com/genre/deep-house/12/top-100', upd: 'Weekly' },
  { g: 'deep', p: 'Traxsource', n: 'Top 100 Deep House', d: 'Deep house de raíz con influencias de Chicago.', t: ['Deep', 'Chicago'], url: 'https://www.traxsource.com/genre/13/deep-house', upd: 'Daily' },
  { g: 'dnb', p: 'Beatport', n: 'Top 100 Drum & Bass', d: 'Liquid, neurofunk y jungle. El chart completo.', t: ['D&B', 'Liquid', 'Jungle'], url: 'https://www.beatport.com/genre/drum-bass/1/top-100', upd: 'Weekly' },
  { g: 'dnb', p: 'Juno', n: 'Drum & Bass / Jungle', d: 'La mejor selección de D&B en vinilo y digital.', t: ['D&B', 'Jungle', 'Vinyl'], url: 'https://www.juno.co.uk/drum-bass/', upd: 'Ongoing' },
  { g: 'ambient', p: 'Beatport', n: 'Top 100 Electronica / Downtempo', d: 'Ambient, IDM y electrónica experimental.', t: ['Ambient', 'IDM'], url: 'https://www.beatport.com/genre/electronica/3/top-100', upd: 'Weekly' },
  { g: 'ambient', p: 'Bandcamp', n: 'Ambient destacados', d: 'Los mejores lanzamientos ambient en sellos independientes.', t: ['Ambient', 'Experimental'], url: 'https://bandcamp.com/tag/ambient', upd: 'Ongoing' },
  { g: 'trance', p: 'Beatport', n: 'Top 100 Trance', d: 'Progressive, psytrance y uplifting. Todo el espectro.', t: ['Trance', 'Progressive'], url: 'https://www.beatport.com/genre/trance/7/top-100', upd: 'Weekly' },
  { g: 'trance', p: 'Beatport', n: 'Top 100 Progressive House', d: 'Progressive house con raíces en el trance.', t: ['Progressive', 'Melodic'], url: 'https://www.beatport.com/genre/progressive-house/15/top-100', upd: 'Weekly' },
  { g: 'disco', p: 'Beatport', n: 'Top 100 Disco / Funk', d: 'Disco, funk y nu-disco. Ideal para warm-ups.', t: ['Disco', 'Funk', 'Nu-Disco'], url: 'https://www.beatport.com/genre/disco-funk/5/top-100', upd: 'Weekly' },
  { g: 'disco', p: 'Juno', n: 'Disco & Funk', d: 'La mayor selección de disco y funk en vinilo.', t: ['Disco', 'Vinyl'], url: 'https://www.juno.co.uk/disco/', upd: 'Ongoing' },
]

const DJS = [
  { n: 'Dixon', g: 'house', l: 'Deep House', ra: 'https://ra.co/dj/dixon/charts', bp: 'https://www.beatport.com/artist/dixon/13028', sc: 'https://soundcloud.com/dixon' },
  { n: 'Ame', g: 'house', l: 'House', ra: 'https://ra.co/dj/ame/charts', bp: 'https://www.beatport.com/artist/ame/13029', sc: 'https://soundcloud.com/ame-music' },
  { n: 'Kerri Chandler', g: 'house', l: 'Deep / Garage', ra: 'https://ra.co/dj/kerrichandler/charts', bp: 'https://www.beatport.com/artist/kerri-chandler/1971', sc: 'https://soundcloud.com/kerri-chandler' },
  { n: 'Peggy Gou', g: 'house', l: 'House / Italo', ra: 'https://ra.co/dj/peggygou/charts', bp: 'https://www.beatport.com/artist/peggy-gou/516008', sc: 'https://soundcloud.com/peggygou' },
  { n: 'Tama Sumo', g: 'house', l: 'House / Disco', ra: 'https://ra.co/dj/tamasumo/charts', bp: 'https://www.beatport.com/artist/tama-sumo/13085', sc: 'https://soundcloud.com/tama-sumo' },
  { n: 'Hunee', g: 'house', l: 'House Ecletico', ra: 'https://ra.co/dj/hunee/charts', bp: 'https://www.beatport.com/artist/hunee/276001', sc: 'https://soundcloud.com/hunee' },
  { n: 'Frankie Knuckles', g: 'house', l: 'House Chicago', ra: 'https://ra.co/dj/frankieknuckles', bp: 'https://www.beatport.com/artist/frankie-knuckles/1635', sc: 'https://soundcloud.com/frankie-knuckles-official' },
  { n: 'Joris Voorn', g: 'house', l: 'House / Techno', ra: 'https://ra.co/dj/jorisvoorn/charts', bp: 'https://www.beatport.com/artist/joris-voorn/13042', sc: 'https://soundcloud.com/jorisvoorn' },
  { n: 'Jamie Jones', g: 'house', l: 'Tech House', ra: 'https://ra.co/dj/jamiejones/charts', bp: 'https://www.beatport.com/artist/jamie-jones/52148', sc: 'https://soundcloud.com/jamie-jones' },
  { n: 'Larry Heard', g: 'house', l: 'Deep House Chicago', ra: 'https://ra.co/dj/larryheard', bp: 'https://www.beatport.com/artist/larry-heard/3674', sc: 'https://soundcloud.com/larry-heard' },
  { n: 'Black Coffee', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/blackcoffee/charts', bp: 'https://www.beatport.com/artist/black-coffee/276278', sc: 'https://soundcloud.com/realblackcoffee' },
  { n: 'Bedouin', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/bedouin/charts', bp: 'https://www.beatport.com/artist/bedouin/463973', sc: 'https://soundcloud.com/bedouin' },
  { n: 'Themba', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/themba/charts', bp: 'https://www.beatport.com/artist/themba/631824', sc: 'https://soundcloud.com/thembadj' },
  { n: 'Da Capo', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/dacapo', bp: 'https://www.beatport.com/artist/da-capo/352642', sc: 'https://soundcloud.com/dacapo-music' },
  { n: 'Enoo Napa', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/enoonapa', bp: 'https://www.beatport.com/artist/enoo-napa/463974', sc: 'https://soundcloud.com/enoo-napa' },
  { n: 'Culoe De Song', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/culoedesong', bp: 'https://www.beatport.com/artist/culoe-de-song/352643', sc: 'https://soundcloud.com/culoe-de-song' },
  { n: 'Hyenah', g: 'afro', l: 'Afro / Organic', ra: 'https://ra.co/dj/hyenah', bp: 'https://www.beatport.com/artist/hyenah/516009', sc: 'https://soundcloud.com/hyenah' },
  { n: 'Damian Lazarus', g: 'afro', l: 'Organic / Afro', ra: 'https://ra.co/dj/damianlazarus/charts', bp: 'https://www.beatport.com/artist/damian-lazarus/13086', sc: 'https://soundcloud.com/damianlazarus' },
  { n: 'Atmos Blaq', g: 'afro', l: 'Afro Deep House', ra: 'https://ra.co/dj/atmosblaq', bp: 'https://www.beatport.com/artist/atmos-blaq/631825', sc: 'https://soundcloud.com/atmos-blaq' },
  { n: 'Manoo', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/manoo', bp: 'https://www.beatport.com/artist/manoo/352644', sc: 'https://soundcloud.com/manoo' },
  { n: 'Ben Klock', g: 'techno', l: 'Techno', ra: 'https://ra.co/dj/benklock/charts', bp: 'https://www.beatport.com/artist/ben-klock/13076', sc: 'https://soundcloud.com/ben-klock' },
  { n: 'Richie Hawtin', g: 'techno', l: 'Minimal Techno', ra: 'https://ra.co/dj/richiehawtin/charts', bp: 'https://www.beatport.com/artist/richie-hawtin/13031', sc: 'https://soundcloud.com/richiehawtin' },
  { n: 'Marcel Dettmann', g: 'techno', l: 'Techno Berlin', ra: 'https://ra.co/dj/marceldettmann/charts', bp: 'https://www.beatport.com/artist/marcel-dettmann/13077', sc: 'https://soundcloud.com/marcel-dettmann' },
  { n: 'Len Faki', g: 'techno', l: 'Techno', ra: 'https://ra.co/dj/lenfaki/charts', bp: 'https://www.beatport.com/artist/len-faki/13078', sc: 'https://soundcloud.com/len-faki' },
  { n: 'DVS1', g: 'techno', l: 'Techno Oscuro', ra: 'https://ra.co/dj/dvs1/charts', bp: 'https://www.beatport.com/artist/dvs1/203019', sc: 'https://soundcloud.com/dvs1' },
  { n: 'Surgeon', g: 'techno', l: 'Techno UK', ra: 'https://ra.co/dj/surgeon/charts', bp: 'https://www.beatport.com/artist/surgeon/13079', sc: 'https://soundcloud.com/surgeon' },
  { n: 'Amelie Lens', g: 'techno', l: 'Techno Peak Time', ra: 'https://ra.co/dj/amelielens/charts', bp: 'https://www.beatport.com/artist/amelie-lens/516010', sc: 'https://soundcloud.com/amelielens' },
  { n: 'Charlotte de Witte', g: 'techno', l: 'Techno', ra: 'https://ra.co/dj/charlottedewitte/charts', bp: 'https://www.beatport.com/artist/charlotte-de-witte/516011', sc: 'https://soundcloud.com/charlottedewitte' },
  { n: 'Paula Temple', g: 'techno', l: 'Industrial Techno', ra: 'https://ra.co/dj/paulatemple/charts', bp: 'https://www.beatport.com/artist/paula-temple/352645', sc: 'https://soundcloud.com/paulatemple' },
  { n: 'Planetary Assault Systems', g: 'techno', l: 'Techno Detroit', ra: 'https://ra.co/dj/planetaryassaultsystems/charts', bp: 'https://www.beatport.com/artist/planetary-assault-systems/13080', sc: 'https://soundcloud.com/planetary-assault-systems' },
  { n: 'Tale Of Us', g: 'melodic', l: 'Melodic Techno', ra: 'https://ra.co/dj/taleofus/charts', bp: 'https://www.beatport.com/artist/tale-of-us/203018', sc: 'https://soundcloud.com/taleofus' },
  { n: 'Solomun', g: 'melodic', l: 'Melodic House', ra: 'https://ra.co/dj/solomun/charts', bp: 'https://www.beatport.com/artist/solomun/13027', sc: 'https://soundcloud.com/solomun' },
  { n: 'Innellea', g: 'melodic', l: 'Melodic Techno', ra: 'https://ra.co/dj/innellea/charts', bp: 'https://www.beatport.com/artist/innellea/463975', sc: 'https://soundcloud.com/innellea' },
  { n: 'Agents of Time', g: 'melodic', l: 'Melodic Techno', ra: 'https://ra.co/dj/agentsoftime/charts', bp: 'https://www.beatport.com/artist/agents-of-time/463976', sc: 'https://soundcloud.com/agentsoftime' },
  { n: 'Mind Against', g: 'melodic', l: 'Melodic / Dark', ra: 'https://ra.co/dj/mindagainst/charts', bp: 'https://www.beatport.com/artist/mind-against/203020', sc: 'https://soundcloud.com/mindagainst' },
  { n: 'Bicep', g: 'melodic', l: 'Melodic House', ra: 'https://ra.co/dj/bicep/charts', bp: 'https://www.beatport.com/artist/bicep/352646', sc: 'https://soundcloud.com/bicepmusic' },
  { n: 'Adriatique', g: 'melodic', l: 'Melodic House', ra: 'https://ra.co/dj/adriatique/charts', bp: 'https://www.beatport.com/artist/adriatique/203021', sc: 'https://soundcloud.com/adriatique' },
  { n: 'WhoMadeWho', g: 'melodic', l: 'Melodic / Live', ra: 'https://ra.co/dj/whomadewho/charts', bp: 'https://www.beatport.com/artist/whomadewho/13087', sc: 'https://soundcloud.com/whomadewho' },
  { n: 'Stephan Bodzin', g: 'melodic', l: 'Melodic Techno', ra: 'https://ra.co/dj/stephanbodzin/charts', bp: 'https://www.beatport.com/artist/stephan-bodzin/13088', sc: 'https://soundcloud.com/stephanbodzin' },
  { n: 'Gui Boratto', g: 'melodic', l: 'Melodic House', ra: 'https://ra.co/dj/guiboratto/charts', bp: 'https://www.beatport.com/artist/gui-boratto/13089', sc: 'https://soundcloud.com/guiboratto' },
  { n: 'Moodymann', g: 'deep', l: 'Deep House Detroit', ra: 'https://ra.co/dj/moodymann/charts', bp: 'https://www.beatport.com/artist/moodymann/3675', sc: 'https://soundcloud.com/moodymann' },
  { n: 'Theo Parrish', g: 'deep', l: 'Deep House', ra: 'https://ra.co/dj/theoparrish/charts', bp: 'https://www.beatport.com/artist/theo-parrish/3676', sc: 'https://soundcloud.com/theo-parrish' },
  { n: 'Floating Points', g: 'deep', l: 'Deep / Jazz', ra: 'https://ra.co/dj/floatingpoints/charts', bp: 'https://www.beatport.com/artist/floating-points/203022', sc: 'https://soundcloud.com/floating-points' },
  { n: 'Four Tet', g: 'deep', l: 'Deep / Electronic', ra: 'https://ra.co/dj/fourtet/charts', bp: 'https://www.beatport.com/artist/four-tet/13090', sc: 'https://soundcloud.com/four-tet' },
  { n: 'Job Jobse', g: 'deep', l: 'Deep House', ra: 'https://ra.co/dj/jobjobse/charts', bp: 'https://www.beatport.com/artist/job-jobse/352647', sc: 'https://soundcloud.com/jobjobse' },
  { n: 'Move D', g: 'deep', l: 'Deep House', ra: 'https://ra.co/dj/moved/charts', bp: 'https://www.beatport.com/artist/move-d/3677', sc: 'https://soundcloud.com/moved' },
  { n: 'Larry Heard', g: 'deep', l: 'Deep House Chicago', ra: 'https://ra.co/dj/larryheard', bp: 'https://www.beatport.com/artist/larry-heard/3674', sc: 'https://soundcloud.com/larry-heard' },
  { n: 'Vakula', g: 'deep', l: 'Deep / Ambient', ra: 'https://ra.co/dj/vakula/charts', bp: 'https://www.beatport.com/artist/vakula/203024', sc: 'https://soundcloud.com/vakula' },
  { n: 'Applebottom', g: 'deep', l: 'Deep House Berlin', ra: 'https://ra.co/dj/applebottom/charts', bp: 'https://www.beatport.com/artist/applebottom/352648', sc: 'https://soundcloud.com/applebottom' },
  { n: 'Caribou', g: 'deep', l: 'Deep / Psicodelico', ra: 'https://ra.co/dj/caribou/charts', bp: 'https://www.beatport.com/artist/caribou/203023', sc: 'https://soundcloud.com/caribou' },
  { n: 'Goldie', g: 'dnb', l: 'D&B Pionero', ra: 'https://ra.co/dj/goldie/charts', bp: 'https://www.beatport.com/artist/goldie/13091', sc: 'https://soundcloud.com/goldie' },
  { n: 'LTJ Bukem', g: 'dnb', l: 'Liquid D&B', ra: 'https://ra.co/dj/ltjbukem/charts', bp: 'https://www.beatport.com/artist/ltj-bukem/13092', sc: 'https://soundcloud.com/ltj-bukem' },
  { n: 'Andy C', g: 'dnb', l: 'D&B Clasico', ra: 'https://ra.co/dj/andyc/charts', bp: 'https://www.beatport.com/artist/andy-c/13093', sc: 'https://soundcloud.com/andy-c' },
  { n: 'Noisia', g: 'dnb', l: 'Neurofunk', ra: 'https://ra.co/dj/noisia/charts', bp: 'https://www.beatport.com/artist/noisia/13094', sc: 'https://soundcloud.com/noisia' },
  { n: 'Shy FX', g: 'dnb', l: 'Jungle / D&B', ra: 'https://ra.co/dj/shyfx/charts', bp: 'https://www.beatport.com/artist/shy-fx/13095', sc: 'https://soundcloud.com/shyfx' },
  { n: 'Calibre', g: 'dnb', l: 'Liquid / Soulful', ra: 'https://ra.co/dj/calibre/charts', bp: 'https://www.beatport.com/artist/calibre/13097', sc: 'https://soundcloud.com/calibre' },
  { n: 'Whiney', g: 'dnb', l: 'Liquid D&B', ra: 'https://ra.co/dj/whiney/charts', bp: 'https://www.beatport.com/artist/whiney/463977', sc: 'https://soundcloud.com/whiney' },
  { n: 'Alix Perez', g: 'dnb', l: 'D&B / Halftime', ra: 'https://ra.co/dj/alixperez/charts', bp: 'https://www.beatport.com/artist/alix-perez/203025', sc: 'https://soundcloud.com/alix-perez' },
  { n: 'Chase and Status', g: 'dnb', l: 'D&B / Crossover', ra: 'https://ra.co/dj/chaseandstatus/charts', bp: 'https://www.beatport.com/artist/chase-status/13096', sc: 'https://soundcloud.com/chaseandstatus' },
  { n: 'Break', g: 'dnb', l: 'Neurofunk / Tech', ra: 'https://ra.co/dj/break/charts', bp: 'https://www.beatport.com/artist/break/13098', sc: 'https://soundcloud.com/breakofficial' },
  { n: 'Aphex Twin', g: 'ambient', l: 'Ambient / IDM', ra: 'https://ra.co/dj/aphextwin', bp: 'https://www.beatport.com/artist/aphex-twin/6073', sc: 'https://soundcloud.com/aphextwin' },
  { n: 'Brian Eno', g: 'ambient', l: 'Ambient Pionero', ra: 'https://ra.co/dj/brianeno', bp: 'https://www.beatport.com/artist/brian-eno/3678', sc: 'https://soundcloud.com/brian-eno' },
  { n: 'Biosphere', g: 'ambient', l: 'Ambient Arctic', ra: 'https://ra.co/dj/biosphere', bp: 'https://www.beatport.com/artist/biosphere/13200', sc: 'https://soundcloud.com/biosphere' },
  { n: 'Jon Hopkins', g: 'ambient', l: 'Ambient / Electronic', ra: 'https://ra.co/dj/jonhopkins/charts', bp: 'https://www.beatport.com/artist/jon-hopkins/203026', sc: 'https://soundcloud.com/jonhopkins' },
  { n: 'Burial', g: 'ambient', l: 'Dubstep / Ambient', ra: 'https://ra.co/dj/burial', bp: 'https://www.beatport.com/artist/burial/13202', sc: 'https://soundcloud.com/burial' },
  { n: 'Bonobo', g: 'ambient', l: 'Downtempo / Jazz', ra: 'https://ra.co/dj/bonobo/charts', bp: 'https://www.beatport.com/artist/bonobo/13203', sc: 'https://soundcloud.com/bonobo' },
  { n: 'Nils Frahm', g: 'ambient', l: 'Ambient / Neo Classical', ra: 'https://ra.co/dj/nilsfrahm', bp: 'https://www.beatport.com/artist/nils-frahm/203027', sc: 'https://soundcloud.com/nilsfrahm' },
  { n: 'The Orb', g: 'ambient', l: 'Ambient House', ra: 'https://ra.co/dj/theorb', bp: 'https://www.beatport.com/artist/the-orb/3679', sc: 'https://soundcloud.com/theorb' },
  { n: 'Gas', g: 'ambient', l: 'Ambient Aleman', ra: 'https://ra.co/dj/gas', bp: 'https://www.beatport.com/artist/gas/13201', sc: 'https://soundcloud.com/gas-pop-ambient' },
  { n: 'Max Richter', g: 'ambient', l: 'Neo Classical / Ambient', ra: 'https://ra.co/dj/maxrichter', bp: 'https://www.beatport.com/artist/max-richter/203028', sc: 'https://soundcloud.com/max-richter' },
  { n: 'Above Beyond', g: 'trance', l: 'Trance / Progressive', ra: 'https://ra.co/dj/aboveandbeyond/charts', bp: 'https://www.beatport.com/artist/above-beyond/13030', sc: 'https://soundcloud.com/aboveandbeyond' },
  { n: 'Sasha', g: 'trance', l: 'Progressive House', ra: 'https://ra.co/dj/sasha/charts', bp: 'https://www.beatport.com/artist/sasha/13100', sc: 'https://soundcloud.com/djsasha' },
  { n: 'John Digweed', g: 'trance', l: 'Progressive House', ra: 'https://ra.co/dj/johndigweed/charts', bp: 'https://www.beatport.com/artist/john-digweed/13101', sc: 'https://soundcloud.com/johndigweed' },
  { n: 'Armin van Buuren', g: 'trance', l: 'Uplifting Trance', ra: 'https://ra.co/dj/arminvanbuuren/charts', bp: 'https://www.beatport.com/artist/armin-van-buuren/13102', sc: 'https://soundcloud.com/arminvanbuuren' },
  { n: 'Paul van Dyk', g: 'trance', l: 'Trance Berlin', ra: 'https://ra.co/dj/paulvandyk/charts', bp: 'https://www.beatport.com/artist/paul-van-dyk/13103', sc: 'https://soundcloud.com/paulvandyk' },
  { n: 'Tiesto', g: 'trance', l: 'Trance Clasico', ra: 'https://ra.co/dj/tiesto/charts', bp: 'https://www.beatport.com/artist/tiesto/13104', sc: 'https://soundcloud.com/tiesto' },
  { n: 'Ferry Corsten', g: 'trance', l: 'Trance / Tech', ra: 'https://ra.co/dj/ferrycorsten/charts', bp: 'https://www.beatport.com/artist/ferry-corsten/13105', sc: 'https://soundcloud.com/ferrycorsten' },
  { n: 'Infected Mushroom', g: 'trance', l: 'Psytrance', ra: 'https://ra.co/dj/infectedmushroom', bp: 'https://www.beatport.com/artist/infected-mushroom/13106', sc: 'https://soundcloud.com/infected-mushroom' },
  { n: 'Cosmic Gate', g: 'trance', l: 'Trance / Progressive', ra: 'https://ra.co/dj/cosmicgate/charts', bp: 'https://www.beatport.com/artist/cosmic-gate/13107', sc: 'https://soundcloud.com/cosmic-gate' },
  { n: 'Nic Fanciulli', g: 'trance', l: 'Progressive / Tech', ra: 'https://ra.co/dj/nicfanciulli/charts', bp: 'https://www.beatport.com/artist/nic-fanciulli/13108', sc: 'https://soundcloud.com/nicfanciulli' },
  { n: 'Hunee', g: 'disco', l: 'Disco / House', ra: 'https://ra.co/dj/hunee/charts', bp: 'https://www.beatport.com/artist/hunee/276001', sc: 'https://soundcloud.com/hunee' },
  { n: 'Horse Meat Disco', g: 'disco', l: 'Disco / Funk', ra: 'https://ra.co/dj/horsemeatdisco/charts', bp: 'https://www.beatport.com/artist/horse-meat-disco/13109', sc: 'https://soundcloud.com/horsemeatdisco' },
  { n: 'Antal', g: 'disco', l: 'Disco / Soul', ra: 'https://ra.co/dj/antal/charts', bp: 'https://www.beatport.com/artist/antal/203029', sc: 'https://soundcloud.com/antal' },
  { n: 'Dimitri from Paris', g: 'disco', l: 'Disco / Nu-Disco', ra: 'https://ra.co/dj/dimitrifromparis/charts', bp: 'https://www.beatport.com/artist/dimitri-from-paris/13110', sc: 'https://soundcloud.com/dimitri-from-paris' },
  { n: 'Soulwax', g: 'disco', l: 'Disco / Electro', ra: 'https://ra.co/dj/soulwax/charts', bp: 'https://www.beatport.com/artist/soulwax/13111', sc: 'https://soundcloud.com/soulwax' },
  { n: 'Todd Terry', g: 'disco', l: 'House / Garage', ra: 'https://ra.co/dj/toddterry/charts', bp: 'https://www.beatport.com/artist/todd-terry/3680', sc: 'https://soundcloud.com/todd-terry' },
  { n: 'Louie Vega', g: 'disco', l: 'Soulful / Garage', ra: 'https://ra.co/dj/louievega/charts', bp: 'https://www.beatport.com/artist/louie-vega/3681', sc: 'https://soundcloud.com/louievega' },
  { n: 'Masters at Work', g: 'disco', l: 'House / Garage', ra: 'https://ra.co/dj/masteratwork', bp: 'https://www.beatport.com/artist/masters-at-work/3682', sc: 'https://soundcloud.com/masters-at-work' },
  { n: 'Francois K', g: 'disco', l: 'Disco / Deep', ra: 'https://ra.co/dj/francoisk/charts', bp: 'https://www.beatport.com/artist/francois-k/3683', sc: 'https://soundcloud.com/francois-k' },
  { n: 'Hercules and Love Affair', g: 'disco', l: 'Disco / House', ra: 'https://ra.co/dj/herculesandloveaffair/charts', bp: 'https://www.beatport.com/artist/hercules-and-love-affair/13112', sc: 'https://soundcloud.com/herculesandloveaffair' },
]

const QUICK_PROMPTS = [
  'Top 10 tracks de afro house que todo DJ debería conocer',
  'Mejores tracks de melodic techno para set nocturno en Berlín',
  'Underground drum and bass labels active in 2025',
  'Ambient DJs that inspire the best club DJs',
  'Difference between progressive trance and commercial trance',
  'Qué sonidos de house están dominando en Europa ahora',
]

export default function InspirationPage() {
  const [activeTab, setActiveTab] = useState<'charts' | 'djs' | 'ia'>('charts')
  const [chartFilter, setChartFilter] = useState('all')
  const [djFilter, setDjFilter] = useState('all')
  const [aiQuery, setAiQuery] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const filteredCharts = chartFilter === 'all' ? CHARTS : CHARTS.filter(c => c.g === chartFilter)
  const filteredDJs = djFilter === 'all' ? DJS : DJS.filter(d => d.g === djFilter)

  async function askAI(query?: string) {
    const q = query || aiQuery
    if (!q.trim()) return
    if (query) setAiQuery(query)
    setActiveTab('ia')
    setAiLoading(true)
    setAiResult('')
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', data: { message: q }, history: [] }),
      })
      const d = await r.json()
      setAiResult(d.result || 'Error')
    } catch {
      setAiResult('Error de conexión.')
    } finally {
      setAiLoading(false)
    }
  }

  const filterBtnClass = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-full border transition-all ${
      active ? 'bg-[#EEEDFE] border-[#AFA9EC] text-[#534AB7]' : 'border-white/[0.08] text-muted hover:bg-surface2'
    }`

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Inspiración musical</h1>
        <p className="page-sub">Real-time charts, reference DJs and AI search — 9 genres</p>

        <div className="flex gap-1 border-b border-white/[0.08] mb-5">
          {[{ id: 'charts', label: 'Charts' }, { id: 'djs', label: 'Reference DJs' }, { id: 'ia', label: 'Discover with AI' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm px-4 py-2.5 border-b-2 transition-colors ${activeTab === tab.id ? 'border-accent2 text-white font-medium' : 'border-transparent text-muted hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'charts' && (
          <div>
            <div className="flex gap-2 flex-wrap mb-4">
              {GENRES.map(g => <button key={g.id} onClick={() => setChartFilter(g.id)} className={filterBtnClass(chartFilter === g.id)}>{g.label}</button>)}
            </div>
            <div className="space-y-3">
              {filteredCharts.map((c, i) => (
                <div key={i} className="card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EEEDFE] flex items-center justify-center text-xs font-medium text-[#534AB7] flex-shrink-0">
                    {c.p.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      {c.n}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{c.upd}</span>
                    </div>
                    <div className="text-xs text-muted mt-0.5 mb-1">{c.p} — {c.d}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {c.t.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-surface2 text-muted border border-white/[0.08]">{tag}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.08] text-white hover:bg-surface2 transition-colors text-center">
                      View chart →
                    </a>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-[#EEEDFE] border border-[#AFA9EC] text-[#534AB7]" onClick={() => askAI(`Analiza las tendencias actuales de ${c.t[0]} en ${c.p}. Que sonidos dominan ahora mismo?`)}>
                      IA ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'djs' && (
          <div>
            <div className="flex gap-2 flex-wrap mb-4">
              {GENRES.map(g => <button key={g.id} onClick={() => setDjFilter(g.id)} className={filterBtnClass(djFilter === g.id)}>{g.label}</button>)}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {filteredDJs.map((dj, i) => (
                <div key={i} className="card">
                  <div className="w-10 h-10 rounded-full bg-[#EEEDFE] flex items-center justify-center text-xs font-medium text-[#534AB7] mb-3">
                    {dj.n.slice(0, 2)}
                  </div>
                  <div className="text-sm font-medium text-white mb-0.5">{dj.n}</div>
                  <div className="text-xs text-muted mb-3">{dj.l}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    <a href={dj.ra} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] text-muted hover:bg-surface2">RA Charts</a>
                    <a href={dj.bp} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] text-muted hover:bg-surface2">Beatport</a>
                    <a href={dj.sc} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] text-muted hover:bg-surface2">SoundCloud</a>
                    <button className="text-[10px] px-2 py-1 rounded-lg bg-[#EEEDFE] border border-[#AFA9EC] text-[#534AB7]" onClick={() => askAI(`Que puedo aprender del estilo de ${dj.n} para mejorar como DJ de ${dj.l}?`)}>
                      IA ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ia' && (
          <div>
            <div className="card mb-4">
              <div className="text-sm font-medium text-white mb-3">Ask about music</div>
              <div className="flex gap-3">
                <input className="form-input flex-1" placeholder="What afro house tracks are hot in Berlin right now?" value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} />
                <button className="btn-primary" onClick={() => askAI()} disabled={aiLoading || !aiQuery.trim()}>
                  {aiLoading ? '...' : 'Search'}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-muted hover:bg-surface2 transition-colors" onClick={() => askAI(p)}>
                    {p.slice(0, 38)}...
                  </button>
                ))}
              </div>
            </div>
            {aiLoading && (
              <div className="flex items-center gap-2 p-4 bg-surface2 rounded-xl text-sm text-muted">
                <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent2 animate-bounce" style={{animationDelay:`${i*0.2}s`}}/>)}</div>
                Searching with AI...
              </div>
            )}
            {aiResult && !aiLoading && (
              <div className="card">
                <div className="text-sm text-white whitespace-pre-wrap leading-relaxed">{aiResult}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
