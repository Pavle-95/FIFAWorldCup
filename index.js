'use strict';
let grupe = {0: 'A',1: 'B',2: 'C',3: 'D',4: 'E',5: 'F',6: 'G',7: 'H',}

const main = () => {
  // Promenjive
  let firstTwo = [];
  let eighthsFinals = [];
  let quarterFinals = [];
  let semiFinal = [];
  let final = [];

  const fs = require('fs');
  let rawdata = fs.readFileSync('teams.json');
  let timovi = JSON.parse(rawdata);

  // Igranje utakmica grupne faze i ispis
  timovi.forEach((element, idx) => {
    console.log(`
Grupa: ${grupe[idx]}:
  I kolo.
    ${gamePlay(element[0], element[1])}
    ${gamePlay(element[2], element[3])}
  
  II kolo.
    ${gamePlay(element[0], element[2])}
    ${gamePlay(element[1], element[3])}
  
  III kolo.
    ${gamePlay(element[0], element[3])}
    ${gamePlay(element[1], element[2])}
`
    )
  });

  // Sortiranje timova po grupama 
  for (let i = 0; i < timovi.length; i++) {
    timovi[i].sort((b, a) => {
      if (a.points == b.points) {
        return (a.givenGoals - a.concededGoals) - (b.givenGoals - b.concededGoals)
      }
      if ((a.points == b.points)&&(a.givenGoals - a.concededGoals) == (b.givenGoals - b.concededGoals)) {
        return a.givenGoals - b.givenGoals
      }
      else {
        return a.points - b.points;
      }
    })
  }

  // Ispis grupa
  display(timovi);

  // izvlacenje prva dva tima iz svih grupa
  timovi.forEach(element => {
    firstTwo.push(element.splice(0, 2));
  })

  // igranje Eliminaciona faza - 1/8 finala:
  console.log(`
Eliminaciona faza - 1/8 finala:
  `);
  eighthsFinals.push(game(firstTwo));
  
  // igranje Eliminaciona faza - 1/4 finala:
  console.log(`
Eliminaciona faza - 1/4 finala:
  `);
  quarterFinals.push(game(eighthsFinals));

  // igranje Eliminaciona faza - 1/2 finala:
  console.log(`
Eliminaciona faza - 1/2 finala:
  `);
  semiFinal.push(game(quarterFinals));

  // igranje Finalne utakmice:
  console.log(`
Veliko Finale:`
  );
  final.push(game(semiFinal));

  // Proglasenje pobednika
  console.log(`
  Pobednik FIFA WORLD CUP-a je:
    !!! ${final[0][0].name} !!!`);


// Funkcija za igranje eliminacionih utakmmica
  function eliminationGame(x,y){
    let teamA = Math.floor(Math.random() * 5);
    let teamB = Math.floor(Math.random() * 5);

    let winer;
  
    x.goals = teamA;
    y.goals = teamB;
  
    if(x.goals > y.goals){
      winer = x
    }
    if(x.goals < y.goals){
      winer = y
    }
    if (x.goals == y.goals) {
      winer = x
    }
    console.log(`   ${x.name} ${x.goals}:${y.goals} ${y.name}`);
    return winer
  }

// Funkcija za Mesanje timova po grupama i pozivanje funkicje eliminacionih utakmica
  function game(data) {
    let allTeams = [];
    let groupA = [];
    let groupB = [];
    let reversedGroupB = [];
    let winers = [];

    data.forEach((element) => {
      allTeams = allTeams.concat(element);
    })
    groupA = allTeams.filter((element, idx) => {
      return idx % 2 === 0;
    });
    groupB = allTeams.filter((element, idx) => {
      return idx % 2 === 1;
    });
    reversedGroupB = groupB.reverse();

    for (let i = 0; i < groupA.length; i++) {
      winers.push(eliminationGame(groupA[i], reversedGroupB[i]));
    }
    return winers;
  }

// Funkcija za igranje utakmica
  function gamePlay(x, y) {
    let teamA = Math.floor(Math.random() * 5);
    let teamB = Math.floor(Math.random() * 5);

    x.goals = teamA;
    y.goals = teamB;

    let winer;

    if (teamA > teamB) {
      winer = `${x.name} ${x.goals}:${y.goals} ${y.name}`;
      x.points += 3;
      x.numWins += 1;
      y.numLoses += 1;
    }
    if (teamA < teamB) {

      winer = `${y.name} ${y.goals}:${x.goals} ${x.name}`;
      y.points += 3;
      y.numWins += 1;
      x.numLoses += 1;
    }
    if (teamA == teamB) {
      winer = `${x.name} ${x.goals}:${y.goals} ${y.name} `
      x.points += 1;
      y.points += 1;
      x.numDraw += 1;
      y.numDraw += 1;
    }
    x.givenGoals += x.goals
    x.concededGoals += y.goals
    y.givenGoals += y.goals
    y.concededGoals += x.goals

    return winer;
  }

// Funkcija za ispis grupe
  function display(data) {
    for (let i = 0; i < data.length; i++) {
      console.log(`
Groupa: ${grupe[i]}
  1. ${data[i][0].name} (${data[i][0].place})     ${data[i][0].numWins}  ${data[i][0].numDraw}  ${data[i][0].numLoses}  ${data[i][0].givenGoals}:${data[i][0].concededGoals}  ${data[i][0].points}
  2. ${data[i][1].name} (${data[i][1].place})     ${data[i][1].numWins}  ${data[i][1].numDraw}  ${data[i][1].numLoses}  ${data[i][1].givenGoals}:${data[i][1].concededGoals}  ${data[i][1].points}
  3. ${data[i][2].name} (${data[i][2].place})     ${data[i][2].numWins}  ${data[i][2].numDraw}  ${data[i][2].numLoses}  ${data[i][2].givenGoals}:${data[i][2].concededGoals}  ${data[i][2].points}
  4. ${data[i][3].name} (${data[i][3].place})     ${data[i][3].numWins}  ${data[i][3].numDraw}  ${data[i][3].numLoses}  ${data[i][3].givenGoals}:${data[i][3].concededGoals}  ${data[i][3].points}
`
      );
    }
  }
}

main();