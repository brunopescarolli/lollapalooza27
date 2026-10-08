// Dados mapeados 1-para-1 usando a grade de 2026 e o lineup de 2027
const STAGES = ["Palco Budweiser", "Palco Samsung Galaxy", "Palco Flying Fish", "Palco Perry's by Fiat"];

const SCHEDULE = {
  "sexta": {
    id: "sexta",
    nome: "Sexta, 19 Mar",
    theme: "#dfafe3", // Lilás inspirado na sexta-feira
    shows: [
      // Budweiser
      { id: "x_geese", artista: "Geese", palco: 0, inicio: "12:45", fim: "13:40" },
      { id: "x_lola", artista: "Lola Young", palco: 0, inicio: "14:45", fim: "15:45" },
      { id: "x_dominic", artista: "Dominic Fike", palco: 0, inicio: "16:55", fim: "17:55" },
      { id: "x_raye", artista: "Raye", palco: 0, inicio: "19:05", fim: "20:05" },
      { id: "x_travis", artista: "Travis Scott", palco: 0, inicio: "21:30", fim: "23:00" },
      // Samsung Galaxy
      { id: "x_malcolm", artista: "Malcolm Todd", palco: 1, inicio: "12:00", fim: "12:45" },
      { id: "x_adela", artista: "Adéla", palco: 1, inicio: "13:40", fim: "14:40" },
      { id: "x_fontaines", artista: "Fontaines D.C.", palco: 1, inicio: "15:50", fim: "16:50" },
      { id: "x_prodigy", artista: "The Prodigy", palco: 1, inicio: "18:00", fim: "19:00" },
      { id: "x_guetta", artista: "David Guetta", palco: 1, inicio: "20:10", fim: "21:25" },
      // Flying Fish
      { id: "x_julia", artista: "Julia Wolf", palco: 2, inicio: "12:45", fim: "13:40" },
      { id: "x_nacao", artista: "Nação Zumbi", palco: 2, inicio: "14:45", fim: "15:45" },
      { id: "x_leon", artista: "Leon Bridges", palco: 2, inicio: "16:55", fim: "17:55" },
      { id: "x_sombr", artista: "Sombr", palco: 2, inicio: "19:05", fim: "20:05" },
      { id: "x_criolo", artista: "Criolo, Amaro e Dino", palco: 2, inicio: "21:30", fim: "22:30" },
      // Perry's by Fiat
      { id: "x_mary", artista: "Mary Olivetti", palco: 3, inicio: "12:00", fim: "13:00" },
      { id: "x_fernanda", artista: "Fernanda Martins", palco: 3, inicio: "13:00", fim: "14:00" },
      { id: "x_acid", artista: "Acid Asian", palco: 3, inicio: "14:15", fim: "15:15" },
      { id: "x_carola", artista: "Carola & Curol", palco: 3, inicio: "15:30", fim: "16:30" },
      { id: "x_snow", artista: "Snow Strippers", palco: 3, inicio: "16:45", fim: "17:45" },
      { id: "x_boys", artista: "Boys Noize", palco: 3, inicio: "18:00", fim: "19:00" },
      { id: "x_sammy", artista: "Sammy Virji", palco: 3, inicio: "19:15", fim: "20:15" },
      { id: "x_marlon", artista: "Marlon Hoffstadt", palco: 3, inicio: "20:30", fim: "21:45" },
      { id: "x_mochakk", artista: "Mochakk", palco: 3, inicio: "22:15", fim: "23:30" }
    ]
  },
  "sabado": {
    id: "sabado",
    nome: "Sábado, 20 Mar",
    theme: "#38c1b5", // Verde/Teal do sábado
    shows: [
      // Budweiser
      { id: "s_bebe", artista: "Bebé", palco: 0, inicio: "12:45", fim: "13:40" },
      { id: "s_clarissa", artista: "Clarissa", palco: 0, inicio: "14:45", fim: "15:45" },
      { id: "s_cage", artista: "Cage the Elephant", palco: 0, inicio: "16:55", fim: "17:55" },
      { id: "s_neigh", artista: "The Neighbourhood", palco: 0, inicio: "19:05", fim: "20:05" },
      { id: "s_killers", artista: "The Killers", palco: 0, inicio: "21:30", fim: "23:00" },
      // Samsung Galaxy
      { id: "s_zepelim", artista: "Zepelim", palco: 1, inicio: "12:00", fim: "12:45" },
      { id: "s_pereira", artista: "Seu Pereira", palco: 1, inicio: "13:40", fim: "14:40" },
      { id: "s_rawayana", artista: "Rawayana", palco: 1, inicio: "15:50", fim: "16:50" },
      { id: "s_avalanches", artista: "The Avalanches", palco: 1, inicio: "18:00", fim: "19:00" },
      { id: "s_qotsa", artista: "Queens of the Stone Age", palco: 1, inicio: "20:10", fim: "21:25" },
      // Flying Fish
      { id: "s_amarante", artista: "Rodrigo Amarante", palco: 2, inicio: "12:45", fim: "13:40" },
      { id: "s_efecto", artista: "El Efecto", palco: 2, inicio: "14:45", fim: "15:45" },
      { id: "s_spitz", artista: "Die Spitz", palco: 2, inicio: "16:55", fim: "17:55" },
      { id: "s_harsher", artista: "Boy Harsher", palco: 2, inicio: "19:05", fim: "20:05" },
      { id: "s_slayyyter", artista: "Slayyyter", palco: 2, inicio: "21:30", fim: "22:30" },
      // Perry's by Fiat
      { id: "s_tamy", artista: "DJ Tamy", palco: 3, inicio: "12:00", fim: "12:45" },
      { id: "s_ramemes", artista: "DJ Ramemes", palco: 3, inicio: "13:00", fim: "13:45" },
      { id: "s_brime", artista: "Brime!!", palco: 3, inicio: "14:15", fim: "15:15" },
      { id: "s_weird", artista: "Weird Baile", palco: 3, inicio: "15:30", fim: "16:30" },
      { id: "s_luana", artista: "Luana Flores", palco: 3, inicio: "16:45", fim: "17:45" },
      { id: "s_nina", artista: "Ninajirachi", palco: 3, inicio: "18:00", fim: "19:00" },
      { id: "s_tomora", artista: "Tomora", palco: 3, inicio: "19:15", fim: "20:15" },
      { id: "s_clem", artista: "Clementaum", palco: 3, inicio: "20:30", fim: "21:30" },
      { id: "s_four", artista: "Four Tet", palco: 3, inicio: "22:00", fim: "23:30" }
    ]
  },
  "domingo": {
    id: "domingo",
    nome: "Domingo, 21 Mar",
    theme: "#e85d56", // Vermelho do domingo
    shows: [
      // Budweiser
      { id: "d_catica", artista: "Catiça", palco: 0, inicio: "12:45", fim: "13:40" },
      { id: "d_rakta", artista: "Rakta", palco: 0, inicio: "14:45", fim: "15:45" },
      { id: "d_mike", artista: "Mike D 5D", palco: 0, inicio: "16:55", fim: "17:55" },
      { id: "d_midnight", artista: "Midnight Gen.", palco: 0, inicio: "19:05", fim: "20:05" },
      { id: "d_charli", artista: "Charli XCX", palco: 0, inicio: "21:30", fim: "22:45" },
      // Samsung Galaxy
      { id: "d_joaquim", artista: "Joaquim", palco: 1, inicio: "12:00", fim: "12:45" },
      { id: "d_cica", artista: "Ciça Moreira", palco: 1, inicio: "13:40", fim: "14:40" },
      { id: "d_mind", artista: "Mind Enterprises", palco: 1, inicio: "15:50", fim: "16:50" },
      { id: "d_angine", artista: "Angine de Poitrine", palco: 1, inicio: "18:00", fim: "19:00" },
      { id: "d_violet", artista: "Violet Grohl", palco: 1, inicio: "20:10", fim: "21:25" },
      // Flying Fish
      { id: "d_deaf", artista: "Deafkids", palco: 2, inicio: "12:45", fim: "13:40" },
      { id: "d_real", artista: "Real No Ficcíon", palco: 2, inicio: "14:45", fim: "15:45" },
      { id: "d_santos", artista: "Santos Bravos", palco: 2, inicio: "16:55", fim: "17:55" },
      { id: "d_majis", artista: "Majis", palco: 2, inicio: "19:05", fim: "20:05" },
      { id: "d_carlita", artista: "Carlita", palco: 2, inicio: "21:30", fim: "22:30" },
      // Perry's by Fiat
      { id: "d_diniz", artista: "Marina Diniz", palco: 3, inicio: "12:00", fim: "12:45" },
      { id: "d_nubia", artista: "Núbia", palco: 3, inicio: "13:00", fim: "13:45" },
      { id: "d_paira", artista: "Paira", palco: 3, inicio: "14:00", fim: "14:45" },
      { id: "d_psilo", artista: "Psilosamples", palco: 3, inicio: "15:15", fim: "16:15" },
      { id: "d_kenya", artista: "Kenya20HZ", palco: 3, inicio: "16:30", fim: "17:30" },
      { id: "d_fezzo", artista: "Fezzo", palco: 3, inicio: "17:45", fim: "18:45" },
      { id: "d_grag", artista: "Grag Queen", palco: 3, inicio: "19:00", fim: "20:00" },
      { id: "d_make", artista: "Make U Sweat", palco: 3, inicio: "20:15", fim: "21:30" },
      { id: "d_cat", artista: "Cat Dealers", palco: 3, inicio: "21:45", fim: "23:15" }
    ]
  }
};