// radius in km, density in g/cm^3, mass in 10^24kg
let moon_data = [
    {
        name: 'Mercury',
        radius: 2439,
        color: 'gray',
        density: 5.4,
        mass: .33,
        enabled: true
    },
    {
        name: 'Venus',
        radius: 6051,
        color: 'lightyellow',
        density: 5.2,
        mass: 4.87,
        enabled: true
    },
    {
        name: 'Earth',
        radius: 6378,
        color: '#42d7f5',
        density: 5.5,
        mass: 5.97,
        enabled: true
    },
    {
        name: 'Luna',
        radius: 1737.1,
        color: 'lightgray',
        density: 3.34,
        mass: .0734767,
        enabled: true
    },
    {
        name: 'Mars',
        radius: 3389,
        color: '#ff5050',
        density: 3.9,
        mass: .639,
        enabled: true
    },
    {
        name: 'Phobos',
        radius: 11.1,
        color: '#ffdbdb',
        density: 1.88,
        mass: .0000000108,
        enabled: true
    },
    {
        name: 'Deimos',
        radius: 6.3,
        color: '#f7f7eb',
        density: 1.47,
        mass: .000000002,
        enabled: true
    },
    {
        name: 'Ceres',
        radius: 473,
        color: 'gray',
        density: 2.08,
        mass: .0008958,
        enabled: true
    },
    {
        name: 'Jupiter',
        radius: 69911,
        color: 'orange',
        density: 1.3,
        mass: 1898,
        enabled: true
    },
    {
        name: 'Io',
        radius: 1821.6,
        color: 'gold',
        density: 3.53,
        mass: .089319,
        enabled: true
    },
    {
        name: 'Europa',
        radius: 1560.8,
        color: '#ebebeb',
        density: 3.01,
        mass: .048,
        enabled: true
    },
    {
        name: 'Ganymede',
        radius: 2634.1,
        color: '#d9d3bd',
        density: 1.94,
        mass: .14819,
        enabled: true
    },
    {
        name: 'Callisto',
        radius: 2410.3,
        color: '#55cf8c',
        density: 1.83,
        mass: .10759,
        enabled: true
    },
    {
        name: 'Saturn',
        radius: 58232,
        color: 'gold',
        density: .7,
        mass: 568,
        enabled: true
    },
    {
        name: 'Mimas',
        radius: 396 / 2,
        color: 'lightgray',
        density: 1.15,
        mass: .00004,
        enabled: true
    },
    {
        name: 'Enceladus',
        radius: 504 / 2,
        color: '#ededed',
        density: .7,
        mass: .00011,
        enabled: true
    },
    {
        name: 'Tethys',
        radius: 1062 / 2,
        color: 'white',
        density: 1.61,
        mass: .00062,
        enabled: true
    },
    {
        name: 'Dione',
        radius: 1123 / 2,
        color: 'white',
        density: 1.48,
        mass: .0011,
        enabled: true
    },
    {
        name: 'Rhea',
        radius: 1527 / 2,
        color: 'white',
        density: 1.24,
        mass: .0023,
        enabled: true
    },
    {
        name: 'Titan',
        radius: 5149 / 2,
        color: '#138537',
        density: 1.88,
        mass: .135,
        enabled: true
    },
    {
        name: 'Iapetus',
        radius: 1470 / 2,
        color: 'beige',
        density: 1.09,
        mass: .0018,
        enabled: true
    },
    {
        name: 'Uranus',
        radius: 25361,
        color: 'lightblue',
        density: 1.3,
        mass: 86.8,
        enabled: true
    },
    {
        name: 'Miranda',
        radius: 235.8,
        color: 'lightgray',
        density: 1.2,
        mass: .0000659,
        enabled: true
    },
    {
        name: 'Ariel',
        radius: 578.9,
        color: 'gray',
        density: 1.59,
        mass: .0011578,
        enabled: true
    },
    {
        name: 'Umbriel',
        radius: 584.7,
        color: 'gray',
        density: 1.39,
        mass: .0011694,
        enabled: true
    },
    {
        name: 'Titania',
        radius: 788.4,
        color: '#c7c7c7',
        density: 1.71,
        mass: .0015768,
        enabled: true
    },
    {
        name: 'Oberon',
        radius: 761.4,
        color: '#bababa',
        density: 1.63,
        mass: .0015228,
        enabled: true
    },
    {
        name: 'Neptune',
        radius: 24621,
        color: '#117ccf',
        density: 1.6,
        mass: 102,
        enabled: true
    },
    {
        name: 'Triton',
        radius: 2705.2 / 2,
        color: 'beige',
        density: 2.06,
        mass: .021408,
        enabled: true
    },
    {
        name: 'Pluto',
        radius: 1184,
        color: '#b0652c',
        density: 1.88,
        mass: .0146,
        enabled: true
    },
    {
        name: 'Charon',
        radius: 606,
        color: 'white',
        density: 1.702,
        mass: .001586,
        enabled: true
    }
]